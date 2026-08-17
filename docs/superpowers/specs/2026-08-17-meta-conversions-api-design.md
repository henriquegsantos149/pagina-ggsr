# Meta Conversions API — Pós GGSR

**Data:** 2026-08-17
**Branch:** `claude/meta-conversions-api-kl9skg`
**Status:** aprovado, pronto para plano de implementação

## Objetivo

Enviar eventos de conversão do site da Pós GGSR para o Meta também pelo
servidor (Conversions API), em paralelo ao pixel do browser, com
deduplicação por `event_id`.

O ganho concreto: hoje o pixel dispara sem nenhum dado de identificação do
usuário. O formulário da lista de espera coleta nome, e-mail e telefone
reais e não usa nada disso para match. A CAPI permite enviar esses dados
hasheados, elevando a qualidade de correspondência, e garante cobertura
quando o pixel do browser é bloqueado (adblock, ITP, iOS).

## Estado atual (levantado no código e no Events Manager)

Pixel em uso: `1373287802810243` — "Pixel Ambiental Pro", criado em
2019-06-15, compartilhado com todo o negócio Ambiental Pro
(business `110151456918012`). Cookie de primeira parte habilitado.
Conversions API Gateway: `NOT_ONBOARDED`.

Eventos disparados por este repositório:

| Evento | Onde | Condição |
|---|---|---|
| `PageView` | `lista-de-espera/index.html:26` | load da página |
| `lead_qualificado` | `LeadCaptureModal.tsx:86` | `formacao === 'sim'` |

O mesmo `lead_qualificado` também vai para o `dataLayer` do GTM
`GTM-MTZ9NFFN` (`LeadCaptureModal.tsx:83`).

Lacunas identificadas:

1. `index.html` (página principal de vendas) não tem pixel nem GTM. Zero
   eventos, incluindo o clique para o checkout.
2. Não existe evento `Lead` padrão. Quem preenche o formulário e responde
   "não" na formação não gera evento nenhum.
3. Nenhum `event_id`, `_fbp`, `_fbc` ou advanced matching em lugar algum.
4. `index.html:14` tem canonical `https://posggsr.anhanguera.com/`,
   conflitante com o resto do projeto. A URL real usada nos anúncios é
   `https://www.ambientalpro.com.br/posggsr/lista-de-espera`.

Já chegam eventos server-side neste pixel, mas apenas `InitiateCheckout` e
`Purchase`, disparados pela plataforma de checkout (Voomp). Nada vem deste
repositório.

## Decisões tomadas

| Decisão | Escolha | Motivo |
|---|---|---|
| Escopo de eventos | `Lead`, `lead_qualificado`, `ViewContent` | `InitiateCheckout` e `Purchase` já vêm do Voomp server-side; duplicar geraria conflito |
| Dataset | manter `1373287802810243` | preserva histórico, públicos e campanhas que já otimizam por `lead_qualificado` |
| Arquitetura | endpoint próprio na Vercel | zero infra nova, mesmo padrão do `api/subscribe.ts` já existente |
| Hashing | no servidor | dado cru só transita no HTTPS do próprio domínio; bundle do cliente fica limpo |
| Domínio canônico | `https://www.ambientalpro.com.br/posggsr/` | é o `base` do Vite, o rewrite do `vercel.json` e o destino dos anúncios |

Alternativas descartadas: **server-side GTM** (exige contêiner próprio com
custo recorrente, complexidade desproporcional para um evento de Lead) e
**piggyback no `api/subscribe.ts`** (mistura ActiveCampaign com Meta no
mesmo arquivo, não cobre `ViewContent`, e uma falha no Meta passaria a
poder derrubar o cadastro do lead no CRM).

## Arquitetura

```
Browser                                    Vercel                      Meta
  │
  ├─ event_id = crypto.randomUUID()
  ├─ fbq('track', 'Lead', params, {eventID: event_id})  ──────────────►  pixel
  └─ POST /posggsr/api/meta-capi ──────────► api/meta-capi.ts
        {event_name, event_id,                 ├─ lê cookies _fbp/_fbc
         event_source_url, nome,               ├─ IP: x-forwarded-for
         email, telefone, custom_data}         ├─ UA: user-agent
                                               ├─ SHA-256 em/ph/fn/ln
                                               └─ POST /{PIXEL_ID}/events ──►  CAPI
```

O Meta deduplica por `(event_name, event_id)`. O endpoint responde no mesmo
domínio graças ao rewrite `/posggsr/api/(.*)` → `/api/$1` já presente no
`vercel.json`, então os cookies `_fbp` e `_fbc` chegam ao servidor
automaticamente. O cliente também os envia no corpo como fallback, caso
esse rewrite mude no futuro.

## Componentes

### `api/meta-capi.ts` (novo)

Handler `default` no formato do `api/subscribe.ts`: `405` fora de POST,
`500` se faltar variável de ambiente.

**Allowlist de eventos.** Aceita exclusivamente `Lead`, `lead_qualificado`
e `ViewContent`. Sem essa restrição o endpoint é um relay aberto: qualquer
pessoa poderia injetar `Purchase` no pixel e envenenar a otimização das
campanhas. É o requisito de segurança central deste design.

**Normalização antes do hash** — exigência do Meta; sem ela o evento é
aceito com HTTP 200 e simplesmente não casa com ninguém:

- e-mail: `trim().toLowerCase()`
- telefone: apenas dígitos, prefixado com `55` (o formulário já limita a 11
  dígitos em `LeadCaptureModal.tsx:235`)
- nome e sobrenome: minúsculas, sem acentos, separados como em
  `api/subscribe.ts:32-33`

**Hash:** SHA-256 via `node:crypto`.

**`user_data` enviado:** `em`, `ph`, `fn`, `ln`, `fbp`, `fbc`,
`client_ip_address` (de `x-forwarded-for`), `client_user_agent`,
`external_id` (hash do e-mail — melhora o match e permite correlacionar com
o ActiveCampaign depois).

**`event_time`:** gerado no servidor. Relógio incorreto no cliente faz o
Meta rejeitar o evento.

**`action_source`:** `website`. **`event_source_url`:** vem do cliente
(`window.location.href`), não derivado do `referer`.

**Resiliência:** responde `204` ao browser mesmo quando o Meta falha —
erro de tracking não pode impactar o cadastro do lead.
`AbortController` com timeout de 3s.

**Logs:** apenas `event_name`, status HTTP e `fbtrace_id`. Nunca PII.

**Versão da Graph API:** constante única no topo do arquivo. O proxy de
rede do ambiente de desenvolvimento bloqueia `developers.facebook.com`,
então a versão vigente não pôde ser confirmada na documentação; usar
`v21.0`, que é estável e conhecida. O endpoint `/events` é um dos mais
estáveis da API — trocar a versão é alterar uma linha.

### `src/lib/meta.ts` (novo)

- `trackMeta(eventName, { customData, userData })` — gera o `event_id`,
  dispara o `fbq` com `{ eventID }` e faz o `fetch` para o endpoint com
  `keepalive: true`. Falha silenciosa via `.catch`, seguindo o padrão que
  já existe em `LeadCaptureModal.tsx:104`.
- `getFbCookies()` — lê `_fbp` e deriva `_fbc` do `fbclid` da URL quando o
  cookie ainda não existe.

A URL do endpoint usa `import.meta.env.BASE_URL + 'api/meta-capi'`, mesmo
padrão do `LeadCaptureModal.tsx:93`, para respeitar o subdiretório
`/posggsr/`.

### Alterações

| Arquivo | Mudança |
|---|---|
| `index.html` | adicionar pixel + GTM (hoje não tem nenhum dos dois); corrigir canonical para `https://www.ambientalpro.com.br/posggsr/` |
| `src/App.tsx` | `ViewContent` no mount, com `content_name: 'Pós GGSR'` e `content_category` distinguindo vendas × lista de espera |
| `src/components/LeadCaptureModal.tsx` | `Lead` em **todo** submit da lista de espera; `lead_qualificado` quando `formacao === 'sim'`; ambos via `trackMeta`, passando nome, e-mail e telefone |
| `lista-de-espera/index.html` | sem alteração de eventos — `PageView` fica como está, fora do escopo |
| `package.json` | adicionar vitest e script `test` |

O `dataLayer.push({ event: 'lead_qualificado' })` do GTM permanece
inalterado.

## Fluxo de dados do formulário

No submit da lista de espera, na ordem:

1. Validação de e-mail (já existe, `LeadCaptureModal.tsx:27-31`).
2. `trackMeta('Lead', ...)` com os dados do formulário — para todos os
   submits.
3. Se `formacao === 'sim'`: `trackMeta('lead_qualificado', ...)` e o
   `dataLayer.push` existente.
4. `fetch` para `api/subscribe` (ActiveCampaign), inalterado.
5. `setIsSubmitted(true)`.

Nenhuma dessas chamadas bloqueia as outras. O passo 4 e a experiência do
usuário são independentes de qualquer falha nos passos 2 e 3.

## Tratamento de erros

| Falha | Comportamento |
|---|---|
| Meta retorna erro | servidor loga sem PII, responde `204` ao browser |
| Meta não responde em 3s | `AbortController` aborta, mesmo tratamento |
| Endpoint indisponível | `.catch` silencioso no cliente; o pixel do browser já disparou |
| `event_name` fora da allowlist | `400`, evento descartado, log |
| Falta de env var | `500` com mensagem genérica, sem vazar nome de variável |

O pixel do browser e a CAPI são caminhos independentes: a falha de um não
afeta o outro, e a deduplicação por `event_id` garante que o sucesso de
ambos não conte o evento duas vezes.

## Testes

O repositório não tem test runner — o `package.json` não define script
`test`. Adicionar **vitest**.

A lógica de risco é pura e é exatamente onde um erro passa despercebido: o
Meta aceita o evento com HTTP 200 e ele simplesmente não casa com nenhum
usuário. Cobertura mínima:

- telefone `11999999999` → `5511999999999` → hash SHA-256 esperado
- e-mail com espaço e maiúsculas → hash canônico conhecido
- nome composto → separação correta de `fn` e `ln`
- `event_name` fora da allowlist → rejeitado com `400`
- payload montado não contém e-mail nem telefone em claro — guarda contra
  regressão de vazamento de PII
- `_fbc` derivado corretamente a partir de `fbclid`
- ausência de `_fbp` e de dados de usuário → payload ainda válido

Validação end-to-end: `META_TEST_EVENT_CODE` na aba Test Events do Events
Manager, confirmando recebimento e deduplicação antes de ir para produção.

## Variáveis de ambiente (Vercel)

```
META_PIXEL_ID          = 1373287802810243
META_CAPI_ACCESS_TOKEN = <gerar no Events Manager → Configurações>
META_TEST_EVENT_CODE   = <opcional, apenas durante a validação>
```

## Fora de escopo

**Consentimento / LGPD.** O site não tem banner de consentimento e não há
link para política de privacidade em nenhuma das duas páginas. Enviar
e-mail e telefone hasheados server-side é prática padrão de mercado e o
SHA-256 não é reversível na prática, mas continua sendo tratamento de dado
pessoal e exige base legal declarada. Recomendação: texto de consentimento
no formulário e link para a política de privacidade. Não será implementado
neste trabalho — fica registrado como pendência do responsável pelo site.

**Poluição do pixel compartilhado.** `ViewContent` em um pixel que atende
todo o negócio Ambiental Pro vai se misturar com o tráfego das outras
propriedades. Mitigado no código via `content_name` e `content_category`.
Recomendação complementar, a ser feita no Events Manager: criar uma
Conversão Personalizada filtrando URL que contenha `/posggsr/`.

**`Purchase` e `InitiateCheckout`.** Já enviados server-side pelo Voomp.
Não serão duplicados.

**Banner de consentimento, sGTM e migração de pixel.** Descartados acima.
