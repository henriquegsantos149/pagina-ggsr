# Meta Conversions API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enviar `Lead`, `lead_qualificado` e `ViewContent` para a Meta Conversions API a partir de um endpoint na Vercel, em paralelo ao pixel do browser, deduplicados por `event_id`.

**Architecture:** O browser gera um `event_id` (UUID), dispara o `fbq` com esse `eventID` e faz um POST para `/posggsr/api/meta-capi`. O endpoint lê os cookies `_fbp`/`_fbc`, o IP e o user-agent do próprio request, aplica SHA-256 sobre e-mail, telefone e nome, e repassa para o Graph API. A lógica pura (normalização, hashing, montagem de payload) vive em `api/_lib/capi.ts`, separada do handler HTTP, para poder ser testada sem rede.

**Tech Stack:** TypeScript, React 19, Vite 8, funções serverless da Vercel (Node 22), vitest 4.1.10.

**Spec:** `docs/superpowers/specs/2026-08-17-meta-conversions-api-design.md`

## Global Constraints

- Pixel/dataset: `1373287802810243`. Nunca hardcodar no código — sempre via `process.env.META_PIXEL_ID`.
- Eventos permitidos, exclusivamente: `Lead`, `lead_qualificado`, `ViewContent`.
- Graph API: `v21.0`, numa constante única exportada. A documentação do Meta não é acessível deste ambiente (o proxy de egress bloqueia `developers.facebook.com`), então a versão não foi confirmada contra a fonte; o endpoint `/events` é estável e trocar a versão é alterar uma linha.
- Endpoint do Meta: `https://graph.facebook.com/{versão}/{pixel_id}/events`.
- Timeout do request ao Meta: 3000 ms via `AbortController`.
- `action_source`: sempre `'website'`.
- `event_time`: gerado no servidor, em segundos (`Math.floor(Date.now() / 1000)`).
- `custom_data` sempre carrega `content_name: 'Pós GGSR'` e um `content_category` que separa as duas páginas (`'lista-de-espera'` ou `'pagina-de-vendas'`), porque o pixel é compartilhado com todo o negócio Ambiental Pro.
- Nenhum log pode conter PII. Logar apenas `event_name`, status HTTP e `fbtrace_id`.
- Falha de tracking nunca bloqueia a UX nem o cadastro no ActiveCampaign.
- Domínio canônico: `https://www.ambientalpro.com.br/posggsr/`.
- Env vars consumidas: `META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, `META_TEST_EVENT_CODE` (opcional).
- Restrições do tsconfig que o código precisa respeitar: `verbatimModuleSyntax` (use `import type` para tipos), `erasableSyntaxOnly` (sem `enum`, sem parameter properties), `noUnusedLocals` e `noUnusedParameters`. `strict` **não** está ligado.
- `@typescript-eslint/no-explicit-any` é **erro** nesta config. Nenhum arquivo novo pode usar `any`.

## Baseline conhecido (verificado antes deste plano)

Rode isto antes de começar, para não confundir problema pré-existente com regressão:

- `npm ci` — instala as dependências (o repo vem sem `node_modules`).
- `npm run build` — **passa**, mas emite um aviso `parse5 error code disallowed-content-in-noscript-in-head` apontando para `lista-de-espera/index.html:28`. A Task 7 corrige.
- `npm run lint` — **falha** com 8 erros pré-existentes:
  - `api/subscribe.ts` linhas 1 e 97: 3× `no-explicit-any` — permanecem, fora de escopo.
  - `src/App.tsx:26`: `react-hooks/set-state-in-effect` — a Task 6 resolve.
  - `src/components/LeadCaptureModal.tsx` linhas 82-86: 4× `no-explicit-any` — a Task 5 resolve.

Ao final do plano o lint deve ter **3 erros**, todos em `api/subscribe.ts`. Qualquer erro além desses é regressão.

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `api/_lib/capi.ts` (novo) | Lógica pura: allowlist, normalização, SHA-256, parse de cookies, extração de IP, montagem do payload. Sem I/O. O prefixo `_` faz a Vercel não tratar a pasta como rota. |
| `api/_lib/capi.test.ts` (novo) | Testes da lógica pura, incluindo a guarda contra vazamento de PII. |
| `api/meta-capi.ts` (novo) | Handler HTTP fino: valida método, env e allowlist; extrai dados do request; chama o Graph API; responde. |
| `api/meta-capi.test.ts` (novo) | Testes do handler com `fetch` e env stubbados. |
| `src/lib/meta.ts` (novo) | Lado browser: tipagem global de `window.fbq`/`window.dataLayer`, leitura de cookie, derivação de `_fbc`, e `trackMeta` (dispara pixel + CAPI com o mesmo `event_id`). |
| `src/lib/meta.test.ts` (novo) | Testes das funções puras de cookie/`_fbc`. |
| `vitest.config.ts` (novo) | Config do vitest, separada da `vite.config.ts` para não mexer no build. |
| `tsconfig.node.json` (mod) | Passa a incluir `api` e `vitest.config.ts` — hoje as funções serverless não têm type-check nenhum. |
| `package.json` (mod) | devDependency `vitest` e script `test`. |
| `src/components/LeadCaptureModal.tsx` (mod) | Dispara `Lead` em todo submit e `lead_qualificado` quando há formação, via `trackMeta`. |
| `src/App.tsx` (mod) | Dispara `ViewContent` no mount; deriva `isWaitingList` em render em vez de em efeito. |
| `index.html` (mod) | Ganha pixel + GTM (hoje não tem nenhum dos dois) e canonical corrigido. |
| `lista-de-espera/index.html` (mod) | Move o `<noscript><img>` do pixel do `<head>` para o `<body>`. |

As funções puras recebem cookie e query string como argumento em vez de ler `document`/`window` por conta própria. Isso é o que permite testar tudo em ambiente Node, sem jsdom.

---

### Task 1: Normalização e hashing + toolchain de teste

Primeira tarefa monta o vitest, porque é a primeira que precisa dele.

**Files:**
- Create: `api/_lib/capi.ts`
- Create: `api/_lib/capi.test.ts`
- Create: `vitest.config.ts`
- Modify: `package.json`
- Modify: `tsconfig.node.json:23` (a linha do `include`)

**Interfaces:**
- Consumes: nada.
- Produces: `GRAPH_API_VERSION: string`, `ALLOWED_EVENTS: readonly ['Lead','lead_qualificado','ViewContent']`, `type AllowedEvent`, `isAllowedEvent(value: unknown): value is AllowedEvent`, `sha256(value: string): string`, `normalizeEmail(value: unknown): string | undefined`, `normalizePhoneBR(value: unknown): string | undefined`, `normalizeName(value: unknown): string | undefined`, `splitName(value: unknown): { firstName?: string; lastName?: string }`.

- [ ] **Step 1: Instalar o vitest**

```bash
npm install -D vitest@4.1.10
```

- [ ] **Step 2: Criar `vitest.config.ts`**

Arquivo separado de propósito: o vitest dá precedência a `vitest.config.ts` sobre `vite.config.ts`, então o build de produção fica intocado.

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['api/**/*.test.ts', 'src/**/*.test.ts'],
  },
})
```

- [ ] **Step 3: Adicionar o script `test` ao `package.json`**

Dentro de `"scripts"`, depois de `"lint"`:

```json
    "test": "vitest run",
```

- [ ] **Step 4: Incluir `api` e a config do vitest no type-check**

Em `tsconfig.node.json`, troque a última linha do arquivo:

```json
  "include": ["vite.config.ts", "vitest.config.ts", "api"]
```

Isso passa a type-checar as funções serverless, que hoje não são verificadas por nada. Já foi confirmado que o `api/subscribe.ts` existente type-checka limpo, então isso não quebra o build.

- [ ] **Step 5: Escrever os testes que falham**

Crie `api/_lib/capi.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  ALLOWED_EVENTS,
  isAllowedEvent,
  normalizeEmail,
  normalizeName,
  normalizePhoneBR,
  sha256,
  splitName,
} from './capi'

describe('isAllowedEvent', () => {
  it('aceita os tres eventos do escopo', () => {
    for (const event of ALLOWED_EVENTS) {
      expect(isAllowedEvent(event)).toBe(true)
    }
  })

  it('rejeita Purchase — o endpoint nao pode ser um relay aberto', () => {
    expect(isAllowedEvent('Purchase')).toBe(false)
    expect(isAllowedEvent('InitiateCheckout')).toBe(false)
  })

  it('rejeita valores que nao sao string', () => {
    expect(isAllowedEvent(undefined)).toBe(false)
    expect(isAllowedEvent(42)).toBe(false)
  })
})

describe('sha256', () => {
  it('produz o hash hexadecimal conhecido', () => {
    expect(sha256('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    )
  })
})

describe('normalizeEmail', () => {
  it('remove espacos e baixa a caixa', () => {
    expect(normalizeEmail('  Maria@Example.COM ')).toBe('maria@example.com')
  })

  it('devolve undefined para vazio ou nao-string', () => {
    expect(normalizeEmail('   ')).toBeUndefined()
    expect(normalizeEmail(null)).toBeUndefined()
  })
})

describe('normalizePhoneBR', () => {
  it('prefixa 55 em celular de 11 digitos', () => {
    expect(normalizePhoneBR('11999999999')).toBe('5511999999999')
  })

  it('descarta mascara antes de normalizar', () => {
    expect(normalizePhoneBR('(11) 99999-9999')).toBe('5511999999999')
  })

  it('e idempotente para numero que ja tem o 55', () => {
    expect(normalizePhoneBR('5511999999999')).toBe('5511999999999')
  })

  it('trata DDD 55 como DDD, nao como codigo de pais', () => {
    expect(normalizePhoneBR('5591234567')).toBe('555591234567')
  })

  it('devolve undefined para numero curto demais', () => {
    expect(normalizePhoneBR('999')).toBeUndefined()
    expect(normalizePhoneBR('')).toBeUndefined()
  })
})

describe('normalizeName', () => {
  it('baixa a caixa e colapsa espacos', () => {
    expect(normalizeName('  Maria   DA Silva ')).toBe('maria da silva')
  })

  it('preserva acentos', () => {
    expect(normalizeName('José')).toBe('josé')
  })
})

describe('splitName', () => {
  it('separa primeiro nome do resto', () => {
    expect(splitName('Maria da Silva Santos')).toEqual({
      firstName: 'maria',
      lastName: 'da silva santos',
    })
  })

  it('deixa lastName undefined quando ha so um nome', () => {
    expect(splitName('Maria')).toEqual({ firstName: 'maria', lastName: undefined })
  })

  it('devolve objeto vazio para entrada invalida', () => {
    expect(splitName('   ')).toEqual({})
  })
})
```

Sobre o teste de acentos: o Meta documenta apenas caixa baixa e remoção de pontuação para `fn`/`ln`, e não manda remover acentos. Como a documentação não pôde ser verificada deste ambiente, o plano fica no mínimo documentado — só `trim` + caixa baixa. Remover acentos seria uma normalização a mais que, se o Meta não fizer o mesmo do lado dele, **reduz** o match em vez de aumentar. Isso corrige a menção a "sem acentos" da spec.

- [ ] **Step 6: Rodar os testes e confirmar que falham**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./capi"`, porque o módulo ainda não existe.

- [ ] **Step 7: Implementar `api/_lib/capi.ts`**

```ts
import { createHash } from 'node:crypto'

export const GRAPH_API_VERSION = 'v21.0'

export const ALLOWED_EVENTS = ['Lead', 'lead_qualificado', 'ViewContent'] as const

export type AllowedEvent = (typeof ALLOWED_EVENTS)[number]

export function isAllowedEvent(value: unknown): value is AllowedEvent {
  return typeof value === 'string' && (ALLOWED_EVENTS as readonly string[]).includes(value)
}

export function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex')
}

export function normalizeEmail(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim().toLowerCase()
  return normalized.length > 0 ? normalized : undefined
}

export function normalizePhoneBR(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const digits = value.replace(/\D/g, '')
  if (digits.length < 10) return undefined
  if (digits.length > 11 && digits.startsWith('55')) return digits
  return `55${digits}`
}

export function normalizeName(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim().toLowerCase().replace(/\s+/g, ' ')
  return normalized.length > 0 ? normalized : undefined
}

export function splitName(value: unknown): { firstName?: string; lastName?: string } {
  const normalized = normalizeName(value)
  if (!normalized) return {}
  const parts = normalized.split(' ')
  const lastName = parts.slice(1).join(' ')
  return { firstName: parts[0], lastName: lastName.length > 0 ? lastName : undefined }
}
```

A ordem das duas guardas em `normalizePhoneBR` é o que faz o DDD 55 funcionar: `'5591234567'` tem 10 dígitos, não entra no ramo do `startsWith('55')` (que exige mais de 11) e recebe o prefixo corretamente.

- [ ] **Step 8: Rodar os testes e confirmar que passam**

Run: `npm test`
Expected: PASS, 16 testes.

- [ ] **Step 9: Confirmar que o build segue de pé com o `api` no type-check**

Run: `npm run build`
Expected: sucesso. O aviso de `parse5` sobre `lista-de-espera/index.html:28` continua aparecendo — é o defeito pré-existente que a Task 7 corrige.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json tsconfig.node.json vitest.config.ts api/_lib/capi.ts api/_lib/capi.test.ts
git commit -m "feat: add Meta CAPI normalization helpers and vitest setup"
```

---

### Task 2: Montagem do payload da CAPI

**Files:**
- Modify: `api/_lib/capi.ts` (acrescenta ao final)
- Modify: `api/_lib/capi.test.ts` (acrescenta ao final)

**Interfaces:**
- Consumes: `sha256`, `normalizeEmail`, `normalizePhoneBR`, `splitName`, `AllowedEvent` da Task 1.
- Produces: `interface CapiUserData`, `buildUserData(input: BuildUserDataInput): CapiUserData`, `parseCookies(header: unknown): Record<string, string>`, `clientIpFromHeader(value: unknown): string | undefined`, `buildEventPayload(input: BuildEventPayloadInput): Record<string, unknown>`.

- [ ] **Step 1: Escrever os testes que falham**

Acrescente ao final de `api/_lib/capi.test.ts`, e adicione os quatro nomes novos ao `import` do topo do arquivo (`buildEventPayload`, `buildUserData`, `clientIpFromHeader`, `parseCookies`):

```ts
describe('parseCookies', () => {
  it('extrai os cookies do Meta do header', () => {
    const cookies = parseCookies('_fbp=fb.1.100.200; _fbc=fb.1.100.abc; outro=x')
    expect(cookies._fbp).toBe('fb.1.100.200')
    expect(cookies._fbc).toBe('fb.1.100.abc')
  })

  it('decodifica valores percent-encoded', () => {
    expect(parseCookies('nome=a%20b').nome).toBe('a b')
  })

  it('devolve objeto vazio para header ausente ou vazio', () => {
    expect(parseCookies(undefined)).toEqual({})
    expect(parseCookies('')).toEqual({})
  })
})

describe('clientIpFromHeader', () => {
  it('usa o primeiro IP da cadeia x-forwarded-for', () => {
    expect(clientIpFromHeader('203.0.113.7, 198.51.100.1')).toBe('203.0.113.7')
  })

  it('aceita header em forma de array', () => {
    expect(clientIpFromHeader(['203.0.113.7'])).toBe('203.0.113.7')
  })

  it('devolve undefined quando nao ha header', () => {
    expect(clientIpFromHeader(undefined)).toBeUndefined()
  })
})

describe('buildUserData', () => {
  it('hasheia email, telefone e nome, e deriva external_id do email', () => {
    const userData = buildUserData({
      email: 'Maria@Example.com',
      telefone: '11999999999',
      nome: 'Maria da Silva',
    })
    expect(userData.em).toEqual([sha256('maria@example.com')])
    expect(userData.ph).toEqual([sha256('5511999999999')])
    expect(userData.fn).toEqual([sha256('maria')])
    expect(userData.ln).toEqual([sha256('da silva')])
    expect(userData.external_id).toEqual([sha256('maria@example.com')])
  })

  it('repassa os identificadores de navegacao sem hashear', () => {
    const userData = buildUserData({
      fbp: 'fb.1.100.200',
      fbc: 'fb.1.100.abc',
      clientIpAddress: '203.0.113.7',
      clientUserAgent: 'Mozilla/5.0',
    })
    expect(userData.fbp).toBe('fb.1.100.200')
    expect(userData.fbc).toBe('fb.1.100.abc')
    expect(userData.client_ip_address).toBe('203.0.113.7')
    expect(userData.client_user_agent).toBe('Mozilla/5.0')
  })

  it('omite as chaves ausentes em vez de mandar vazio', () => {
    const userData = buildUserData({})
    expect(userData).toEqual({})
  })
})

describe('buildEventPayload', () => {
  const base = {
    eventName: 'Lead' as const,
    eventId: 'e-1',
    eventTime: 1700000000,
    accessToken: 'token-secreto',
  }

  it('monta o envelope que a CAPI espera', () => {
    const payload = buildEventPayload({
      ...base,
      eventSourceUrl: 'https://www.ambientalpro.com.br/posggsr/lista-de-espera',
      userData: buildUserData({ email: 'maria@example.com' }),
      customData: { content_name: 'Pós GGSR', content_category: 'lista-de-espera' },
    })
    const event = (payload.data as Record<string, unknown>[])[0]
    expect(event.event_name).toBe('Lead')
    expect(event.event_id).toBe('e-1')
    expect(event.event_time).toBe(1700000000)
    expect(event.action_source).toBe('website')
    expect(event.event_source_url).toBe(
      'https://www.ambientalpro.com.br/posggsr/lista-de-espera',
    )
    expect(payload.access_token).toBe('token-secreto')
  })

  it('inclui test_event_code somente quando fornecido', () => {
    expect(buildEventPayload({ ...base, userData: {} }).test_event_code).toBeUndefined()
    expect(
      buildEventPayload({ ...base, userData: {}, testEventCode: 'TEST123' }).test_event_code,
    ).toBe('TEST123')
  })

  it('omite event_source_url e custom_data quando ausentes', () => {
    const event = (
      buildEventPayload({ ...base, userData: {} }).data as Record<string, unknown>[]
    )[0]
    expect('event_source_url' in event).toBe(false)
    expect('custom_data' in event).toBe(false)
  })

  it('nao deixa PII em claro no payload serializado', () => {
    const serialized = JSON.stringify(
      buildEventPayload({
        ...base,
        userData: buildUserData({
          email: 'maria@example.com',
          telefone: '11999999999',
          nome: 'Maria da Silva',
        }),
      }),
    )
    expect(serialized).not.toContain('maria@example.com')
    expect(serialized).not.toContain('11999999999')
    expect(serialized).not.toContain('5511999999999')
    expect(serialized).not.toContain('Maria')
    expect(serialized).not.toContain('maria')
    expect(serialized).not.toContain('silva')
  })
})
```

O último teste é a guarda que importa mais no longo prazo: qualquer refactor futuro que passe a mandar e-mail ou telefone em claro para o Meta quebra esse teste.

- [ ] **Step 2: Rodar os testes e confirmar que falham**

Run: `npm test`
Expected: FAIL — `buildUserData is not a function` e erros de import para os quatro nomes novos.

- [ ] **Step 3: Implementar as funções**

Acrescente ao final de `api/_lib/capi.ts`:

```ts
export interface CapiUserData {
  em?: string[]
  ph?: string[]
  fn?: string[]
  ln?: string[]
  external_id?: string[]
  fbp?: string
  fbc?: string
  client_ip_address?: string
  client_user_agent?: string
}

export interface BuildUserDataInput {
  email?: unknown
  telefone?: unknown
  nome?: unknown
  fbp?: string
  fbc?: string
  clientIpAddress?: string
  clientUserAgent?: string
}

export function buildUserData(input: BuildUserDataInput): CapiUserData {
  const userData: CapiUserData = {}

  const email = normalizeEmail(input.email)
  if (email) {
    const hashedEmail = sha256(email)
    userData.em = [hashedEmail]
    userData.external_id = [hashedEmail]
  }

  const phone = normalizePhoneBR(input.telefone)
  if (phone) userData.ph = [sha256(phone)]

  const { firstName, lastName } = splitName(input.nome)
  if (firstName) userData.fn = [sha256(firstName)]
  if (lastName) userData.ln = [sha256(lastName)]

  if (input.fbp) userData.fbp = input.fbp
  if (input.fbc) userData.fbc = input.fbc
  if (input.clientIpAddress) userData.client_ip_address = input.clientIpAddress
  if (input.clientUserAgent) userData.client_user_agent = input.clientUserAgent

  return userData
}

export function parseCookies(header: unknown): Record<string, string> {
  if (typeof header !== 'string' || header.length === 0) return {}
  const cookies: Record<string, string> = {}
  for (const part of header.split(';')) {
    const separator = part.indexOf('=')
    if (separator < 1) continue
    const name = part.slice(0, separator).trim()
    if (name.length === 0) continue
    const rawValue = part.slice(separator + 1).trim()
    try {
      cookies[name] = decodeURIComponent(rawValue)
    } catch {
      cookies[name] = rawValue
    }
  }
  return cookies
}

export function clientIpFromHeader(value: unknown): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value
  if (typeof raw !== 'string') return undefined
  const first = raw.split(',')[0]?.trim()
  return first && first.length > 0 ? first : undefined
}

export interface BuildEventPayloadInput {
  eventName: AllowedEvent
  eventId: string
  eventTime: number
  accessToken: string
  userData: CapiUserData
  eventSourceUrl?: string
  customData?: Record<string, unknown>
  testEventCode?: string
}

export function buildEventPayload(input: BuildEventPayloadInput): Record<string, unknown> {
  const event: Record<string, unknown> = {
    event_name: input.eventName,
    event_time: input.eventTime,
    event_id: input.eventId,
    action_source: 'website',
    user_data: input.userData,
  }
  if (input.eventSourceUrl) event.event_source_url = input.eventSourceUrl
  if (input.customData) event.custom_data = input.customData

  const payload: Record<string, unknown> = {
    data: [event],
    access_token: input.accessToken,
  }
  if (input.testEventCode) payload.test_event_code = input.testEventCode
  return payload
}
```

O `decodeURIComponent` fica dentro de `try`/`catch` porque um cookie com `%` solto lança `URIError` e derrubaria o request inteiro por causa de um cookie de terceiro que não é nem nosso.

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `npm test`
Expected: PASS, 29 testes.

- [ ] **Step 5: Commit**

```bash
git add api/_lib/capi.ts api/_lib/capi.test.ts
git commit -m "feat: build hashed Meta CAPI event payload"
```

---

### Task 3: Handler HTTP `api/meta-capi.ts`

**Files:**
- Create: `api/meta-capi.ts`
- Create: `api/meta-capi.test.ts`

**Interfaces:**
- Consumes: `GRAPH_API_VERSION`, `isAllowedEvent`, `parseCookies`, `clientIpFromHeader`, `buildUserData`, `buildEventPayload` de `api/_lib/capi.ts`.
- Produces: `export default async function handler(req, res)` — a rota `POST /posggsr/api/meta-capi`, consumida pela Task 4. Aceita no corpo: `event_name`, `event_id`, `event_source_url`, `nome`, `email`, `telefone`, `fbp`, `fbc`, `custom_data`. Responde `204` sem corpo em caso de sucesso.

- [ ] **Step 1: Escrever os testes que falham**

Crie `api/meta-capi.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import handler from './meta-capi'
import { sha256 } from './_lib/capi'

interface FakeResponse {
  statusCode?: number
  body?: unknown
  ended: boolean
  status: (code: number) => FakeResponse
  json: (body: unknown) => FakeResponse
  end: () => FakeResponse
}

function createResponse(): FakeResponse {
  const res: FakeResponse = {
    ended: false,
    status(code) {
      res.statusCode = code
      return res
    },
    json(body) {
      res.body = body
      return res
    },
    end() {
      res.ended = true
      return res
    },
  }
  return res
}

interface FakeRequest {
  method?: string
  headers: Record<string, string | string[] | undefined>
  body?: unknown
}

function createRequest(overrides: Partial<FakeRequest> = {}): FakeRequest {
  return {
    method: 'POST',
    headers: {
      cookie: '_fbp=fb.1.100.200; _fbc=fb.1.100.abc',
      'user-agent': 'Mozilla/5.0',
      'x-forwarded-for': '203.0.113.7, 198.51.100.1',
    },
    body: { event_name: 'Lead', event_id: 'e-1' },
    ...overrides,
  }
}

const okResponse = { ok: true, status: 200, json: async () => ({ events_received: 1 }) }

beforeEach(() => {
  vi.stubEnv('META_PIXEL_ID', '1373287802810243')
  vi.stubEnv('META_CAPI_ACCESS_TOKEN', 'token-secreto')
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('handler', () => {
  it('rejeita metodo diferente de POST', async () => {
    const res = createResponse()
    await handler(createRequest({ method: 'GET' }), res)
    expect(res.statusCode).toBe(405)
  })

  it('responde 500 quando falta configuracao, sem citar a variavel', async () => {
    vi.stubEnv('META_CAPI_ACCESS_TOKEN', '')
    const res = createResponse()
    await handler(createRequest(), res)
    expect(res.statusCode).toBe(500)
    expect(JSON.stringify(res.body)).not.toContain('META_CAPI_ACCESS_TOKEN')
  })

  it('rejeita evento fora da allowlist', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const res = createResponse()
    await handler(createRequest({ body: { event_name: 'Purchase', event_id: 'e-1' } }), res)
    expect(res.statusCode).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejeita request sem event_id — sem ele nao ha deduplicacao', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const res = createResponse()
    await handler(createRequest({ body: { event_name: 'Lead' } }), res)
    expect(res.statusCode).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('envia o evento hasheado para o Graph API e responde 204', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse)
    vi.stubGlobal('fetch', fetchMock)
    const res = createResponse()

    await handler(
      createRequest({
        body: {
          event_name: 'Lead',
          event_id: 'e-1',
          event_source_url: 'https://www.ambientalpro.com.br/posggsr/lista-de-espera',
          nome: 'Maria da Silva',
          email: 'Maria@Example.com',
          telefone: '11999999999',
          custom_data: { content_name: 'Pós GGSR', content_category: 'lista-de-espera' },
        },
      }),
      res,
    )

    expect(res.statusCode).toBe(204)
    expect(res.ended).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://graph.facebook.com/v21.0/1373287802810243/events')
    expect(init.method).toBe('POST')

    const payload = JSON.parse(init.body)
    const event = payload.data[0]
    expect(event.event_id).toBe('e-1')
    expect(event.action_source).toBe('website')
    expect(event.user_data.em).toEqual([sha256('maria@example.com')])
    expect(event.user_data.ph).toEqual([sha256('5511999999999')])
    expect(typeof event.event_time).toBe('number')
    expect(init.body).not.toContain('Maria@Example.com')
  })

  it('prefere os cookies do request ao que o cliente manda no corpo', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse)
    vi.stubGlobal('fetch', fetchMock)
    await handler(
      createRequest({
        body: { event_name: 'Lead', event_id: 'e-1', fbp: 'fb.1.999.999' },
      }),
      createResponse(),
    )
    const event = JSON.parse(fetchMock.mock.calls[0][1].body).data[0]
    expect(event.user_data.fbp).toBe('fb.1.100.200')
  })

  it('usa o fbp do corpo quando o cookie nao chega', async () => {
    const fetchMock = vi.fn().mockResolvedValue(okResponse)
    vi.stubGlobal('fetch', fetchMock)
    await handler(
      createRequest({
        headers: { 'user-agent': 'Mozilla/5.0' },
        body: { event_name: 'Lead', event_id: 'e-1', fbp: 'fb.1.999.999' },
      }),
      createResponse(),
    )
    const event = JSON.parse(fetchMock.mock.calls[0][1].body).data[0]
    expect(event.user_data.fbp).toBe('fb.1.999.999')
  })

  it('responde 204 mesmo quando o Meta recusa o evento', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: { fbtrace_id: 'trace-1' } }),
      }),
    )
    const res = createResponse()
    await handler(createRequest(), res)
    expect(res.statusCode).toBe(204)
  })

  it('responde 204 mesmo quando o request ao Meta falha', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const res = createResponse()
    await handler(createRequest(), res)
    expect(res.statusCode).toBe(204)
  })

  it('nao registra PII nos logs de erro', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    await handler(
      createRequest({
        body: { event_name: 'Lead', event_id: 'e-1', email: 'maria@example.com' },
      }),
      createResponse(),
    )
    expect(JSON.stringify(errorSpy.mock.calls)).not.toContain('maria@example.com')
  })
})
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./meta-capi"`.

- [ ] **Step 3: Implementar o handler**

Crie `api/meta-capi.ts`:

```ts
import {
  GRAPH_API_VERSION,
  buildEventPayload,
  buildUserData,
  clientIpFromHeader,
  isAllowedEvent,
  parseCookies,
} from './_lib/capi'

const META_REQUEST_TIMEOUT_MS = 3000

interface CapiRequest {
  method?: string
  headers: Record<string, string | string[] | undefined>
  body?: unknown
}

interface CapiResponse {
  status: (code: number) => CapiResponse
  json: (body: unknown) => unknown
  end: () => unknown
}

export default async function handler(req: CapiRequest, res: CapiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const pixelId = process.env.META_PIXEL_ID
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN
  if (!pixelId || !accessToken) {
    console.error('Meta CAPI: integration not configured')
    return res.status(500).json({ error: 'Not configured' })
  }

  const body = (req.body ?? {}) as Record<string, unknown>

  const eventName = body.event_name
  if (!isAllowedEvent(eventName)) {
    console.error('Meta CAPI: rejected event outside the allowlist')
    return res.status(400).json({ error: 'Unsupported event' })
  }

  const eventId = typeof body.event_id === 'string' ? body.event_id : ''
  if (eventId.length === 0) {
    console.error('Meta CAPI: missing event_id', { event_name: eventName })
    return res.status(400).json({ error: 'Missing event_id' })
  }

  const cookies = parseCookies(req.headers.cookie)
  const userAgent = req.headers['user-agent']

  const payload = buildEventPayload({
    eventName,
    eventId,
    eventTime: Math.floor(Date.now() / 1000),
    accessToken,
    eventSourceUrl:
      typeof body.event_source_url === 'string' ? body.event_source_url : undefined,
    customData:
      body.custom_data !== null && typeof body.custom_data === 'object'
        ? (body.custom_data as Record<string, unknown>)
        : undefined,
    testEventCode: process.env.META_TEST_EVENT_CODE || undefined,
    userData: buildUserData({
      email: body.email,
      telefone: body.telefone,
      nome: body.nome,
      fbp: cookies._fbp ?? (typeof body.fbp === 'string' ? body.fbp : undefined),
      fbc: cookies._fbc ?? (typeof body.fbc === 'string' ? body.fbc : undefined),
      clientIpAddress: clientIpFromHeader(req.headers['x-forwarded-for']),
      clientUserAgent: typeof userAgent === 'string' ? userAgent : undefined,
    }),
  })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), META_REQUEST_TIMEOUT_MS)

  try {
    const metaRes = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      },
    )

    if (!metaRes.ok) {
      const detail = (await metaRes.json().catch(() => null)) as {
        error?: { fbtrace_id?: string }
      } | null
      console.error('Meta CAPI rejected the event', {
        event_name: eventName,
        status: metaRes.status,
        fbtrace_id: detail?.error?.fbtrace_id,
      })
    }
  } catch (error) {
    console.error('Meta CAPI request failed', {
      event_name: eventName,
      reason: error instanceof Error ? error.name : 'unknown',
    })
  } finally {
    clearTimeout(timeout)
  }

  return res.status(204).end()
}
```

Três decisões que os testes travam: o cookie do request tem precedência sobre o `fbp`/`fbc` do corpo (o cliente pode mentir, o cookie não); o `catch` loga só o `error.name`, nunca a mensagem, que pode carregar a URL com dados; e a resposta é sempre `204`, porque o browser não tem nada a fazer com um erro do Meta.

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `npm test`
Expected: PASS, 39 testes.

- [ ] **Step 5: Confirmar que o novo arquivo não introduz erro de lint**

Run: `npm run lint`
Expected: os mesmos 8 erros pré-existentes do baseline, nenhum em `api/meta-capi.ts` nem em `api/_lib/`.

- [ ] **Step 6: Commit**

```bash
git add api/meta-capi.ts api/meta-capi.test.ts
git commit -m "feat: add Meta CAPI serverless endpoint"
```

---

### Task 4: Camada de browser `src/lib/meta.ts`

**Files:**
- Create: `src/lib/meta.ts`
- Create: `src/lib/meta.test.ts`

**Interfaces:**
- Consumes: a rota `POST {BASE_URL}api/meta-capi` da Task 3.
- Produces: `readCookie(cookieString: string, name: string): string | undefined`, `deriveFbc(searchString: string, cookieString: string, now: number): string | undefined`, `trackMeta(eventName: string, options?: TrackMetaOptions): void`, `interface TrackMetaOptions { customData?: Record<string, unknown>; userData?: { nome?: string; email?: string; telefone?: string } }`. Declara globalmente `window.fbq` e `window.dataLayer` com tipos — é isso que permite às Tasks 5 e 6 pararem de usar `any`.

- [ ] **Step 1: Escrever os testes que falham**

Crie `src/lib/meta.test.ts`. Só as funções puras são testadas — `trackMeta` faz I/O e é validada de ponta a ponta na Task 8.

```ts
import { describe, expect, it } from 'vitest'
import { deriveFbc, readCookie } from './meta'

describe('readCookie', () => {
  it('encontra o cookie no meio da lista', () => {
    expect(readCookie('a=1; _fbp=fb.1.100.200; b=2', '_fbp')).toBe('fb.1.100.200')
  })

  it('nao confunde nome que e sufixo de outro', () => {
    expect(readCookie('x_fbp=errado; _fbp=certo', '_fbp')).toBe('certo')
  })

  it('devolve undefined quando o cookie nao existe', () => {
    expect(readCookie('a=1', '_fbp')).toBeUndefined()
    expect(readCookie('', '_fbp')).toBeUndefined()
  })
})

describe('deriveFbc', () => {
  it('da precedencia ao cookie _fbc existente', () => {
    expect(deriveFbc('?fbclid=novo', '_fbc=fb.1.100.antigo', 999)).toBe('fb.1.100.antigo')
  })

  it('deriva do fbclid da url quando nao ha cookie', () => {
    expect(deriveFbc('?fbclid=abc123', '', 1700000000000)).toBe('fb.1.1700000000000.abc123')
  })

  it('funciona com fbclid no meio da query string', () => {
    expect(deriveFbc('?utm_source=meta&fbclid=abc123', '', 1)).toBe('fb.1.1.abc123')
  })

  it('devolve undefined sem cookie e sem fbclid', () => {
    expect(deriveFbc('?utm_source=meta', '', 1)).toBeUndefined()
    expect(deriveFbc('', '', 1)).toBeUndefined()
  })
})
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./meta"`.

- [ ] **Step 3: Implementar `src/lib/meta.ts`**

```ts
declare global {
  interface Window {
    fbq?: (
      method: 'track' | 'trackCustom',
      eventName: string,
      params?: Record<string, unknown>,
      options?: { eventID?: string },
    ) => void
    dataLayer?: Record<string, unknown>[]
  }
}

/** Eventos padrao do Meta. Qualquer outro vai como trackCustom. */
const STANDARD_EVENTS = ['Lead', 'ViewContent'] as const

export interface TrackMetaOptions {
  customData?: Record<string, unknown>
  userData?: { nome?: string; email?: string; telefone?: string }
}

export function readCookie(cookieString: string, name: string): string | undefined {
  for (const part of cookieString.split(';')) {
    const separator = part.indexOf('=')
    if (separator < 1) continue
    if (part.slice(0, separator).trim() !== name) continue
    return part.slice(separator + 1).trim()
  }
  return undefined
}

export function deriveFbc(
  searchString: string,
  cookieString: string,
  now: number,
): string | undefined {
  const existing = readCookie(cookieString, '_fbc')
  if (existing) return existing
  const fbclid = new URLSearchParams(searchString).get('fbclid')
  if (!fbclid) return undefined
  return `fb.1.${now}.${fbclid}`
}

/**
 * Dispara o evento no pixel do browser e na Conversions API com o mesmo
 * event_id, para o Meta deduplicar. Nunca lanca: falha de tracking nao pode
 * afetar a experiencia do usuario.
 */
export function trackMeta(eventName: string, options: TrackMetaOptions = {}): void {
  if (typeof window === 'undefined') return

  try {
    const eventId = window.crypto.randomUUID()
    const method = (STANDARD_EVENTS as readonly string[]).includes(eventName)
      ? 'track'
      : 'trackCustom'

    window.fbq?.(method, eventName, options.customData, { eventID: eventId })

    const cookieString = typeof document === 'undefined' ? '' : document.cookie

    void fetch(`${import.meta.env.BASE_URL}api/meta-capi`, {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        event_source_url: window.location.href,
        fbp: readCookie(cookieString, '_fbp'),
        fbc: deriveFbc(window.location.search, cookieString, Date.now()),
        custom_data: options.customData,
        ...options.userData,
      }),
    }).catch(() => {
      /* silencioso de proposito — o pixel do browser ja disparou */
    })
  } catch {
    /* tracking nunca pode afetar o usuario nem o cadastro do lead */
  }
}
```

O `readCookie` compara o nome exato depois do `trim`, e é por isso que `x_fbp` não é confundido com `_fbp` — um `includes('_fbp=')` teria esse bug.

`import.meta.env.BASE_URL` resolve para `/posggsr/`, mesmo padrão do `LeadCaptureModal.tsx:93`, então a chamada respeita o subdiretório e casa com o rewrite do `vercel.json`.

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `npm test`
Expected: PASS, 46 testes.

- [ ] **Step 5: Confirmar o type-check**

Run: `npm run build`
Expected: sucesso. `src/lib/meta.ts` está sob `tsconfig.app.json` (que inclui `src`), então o `declare global` já vale para todo o app.

- [ ] **Step 6: Commit**

```bash
git add src/lib/meta.ts src/lib/meta.test.ts
git commit -m "feat: add browser-side Meta tracking helper with typed fbq"
```

---

### Task 5: Disparar `Lead` e `lead_qualificado` no formulário

Hoje quem responde "não" em "Possui formação?" não gera evento nenhum — não existe `Lead` no site. Esta task fecha esse buraco e, de passagem, elimina os 4 `any` de `LeadCaptureModal.tsx`.

**Files:**
- Modify: `src/components/LeadCaptureModal.tsx:1-3` (imports) e `:78-89` (bloco do `isWaitingList`)

**Interfaces:**
- Consumes: `trackMeta` e a tipagem global de `window.dataLayer` da Task 4.
- Produces: nada para tarefas posteriores.

- [ ] **Step 1: Importar o helper**

Depois do import do `useState` na linha 3, acrescente:

```tsx
import { trackMeta } from '../lib/meta';
```

- [ ] **Step 2: Substituir o bloco de tracking**

Troque o bloco atual das linhas 78-89 —

```tsx
      if (isWaitingList) {
        // Disparar evento de lead_qualificado se o usuário tiver formação
        if (formData.formacao.toLowerCase() === 'sim') {
          if (typeof window !== 'undefined') {
            if ((window as any).dataLayer) {
              (window as any).dataLayer.push({ event: 'lead_qualificado' });
            }
            if ((window as any).fbq) {
              (window as any).fbq('trackCustom', 'lead_qualificado');
            }
          }
        }
```

— por:

```tsx
      if (isWaitingList) {
        const metaOptions = {
          customData: {
            content_name: 'Pós GGSR',
            content_category: 'lista-de-espera',
          },
          userData: {
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,
          },
        };

        // Lead para todo submit — antes disso, quem respondia "não" na
        // formação não gerava evento nenhum.
        trackMeta('Lead', metaOptions);

        if (formData.formacao.toLowerCase() === 'sim') {
          window.dataLayer?.push({ event: 'lead_qualificado' });
          trackMeta('lead_qualificado', metaOptions);
        }
```

O `dataLayer` do GTM continua recebendo `lead_qualificado` exatamente como antes; o que muda é que o `fbq` agora sai pelo `trackMeta`, com `eventID`, e acompanhado da chamada à CAPI.

- [ ] **Step 3: Confirmar que os 4 erros de lint desapareceram**

Run: `npm run lint`
Expected: 4 erros, não mais 8. Os 4 `no-explicit-any` de `LeadCaptureModal.tsx` sumiram; restam os 3 de `api/subscribe.ts` e o `set-state-in-effect` de `App.tsx`, que a Task 6 resolve.

- [ ] **Step 4: Confirmar type-check e testes**

Run: `npm run build`
Expected: sucesso.

Run: `npm test`
Expected: PASS, 46 testes (nenhum teste novo — esta task é integração de UI, coberta na validação da Task 8).

- [ ] **Step 5: Commit**

```bash
git add src/components/LeadCaptureModal.tsx
git commit -m "feat: send Lead and lead_qualificado through pixel and CAPI"
```

---

### Task 6: `ViewContent` nas duas páginas

**Files:**
- Modify: `src/App.tsx:1-32` (imports, estado e efeitos)

**Interfaces:**
- Consumes: `trackMeta` da Task 4.
- Produces: nada para tarefas posteriores.

- [ ] **Step 1: Trocar imports e a derivação de `isWaitingList`**

Na linha 16, troque `import { useState, useEffect } from 'react'` por:

```tsx
import { useState, useEffect, useRef } from 'react'
import { trackMeta } from './lib/meta'
```

Em seguida, dentro de `function App()`, remova a linha 20 (`const [isWaitingList, setIsWaitingList] = useState(false);`) e o `useEffect` inteiro das linhas 23-31, substituindo por:

```tsx
  const isWaitingList =
    typeof window !== 'undefined' &&
    window.location.pathname.includes('/lista-de-espera');
  const viewContentSent = useRef(false);

  useEffect(() => {
    if (isWaitingList) {
      document.title = "Lista de Espera | Pós-Graduação em Georreferenciamento, Geoprocessamento e Sensoriamento Remoto";
    }
  }, [isWaitingList]);

  useEffect(() => {
    if (viewContentSent.current) return;
    viewContentSent.current = true;
    trackMeta('ViewContent', {
      customData: {
        content_name: 'Pós GGSR',
        content_category: isWaitingList ? 'lista-de-espera' : 'pagina-de-vendas',
      },
    });
  }, [isWaitingList]);
```

`const [isModalOpen, setIsModalOpen] = useState(false);` continua como está — o `useState` segue sendo usado.

Duas razões para derivar `isWaitingList` em render em vez de num efeito: resolve o erro de lint `react-hooks/set-state-in-effect` da linha 26, e garante que o `ViewContent` já saia com o `content_category` correto no primeiro disparo — com `useState(false)` o valor inicial seria sempre `'pagina-de-vendas'`, mesmo na lista de espera.

O `viewContentSent` existe porque o `StrictMode` (`src/main.tsx:7`) monta o componente duas vezes em desenvolvimento. Sem a guarda, você veria `ViewContent` duplicado ao testar local e ia caçar um bug que não existe em produção.

- [ ] **Step 2: Confirmar que o lint caiu para 3 erros**

Run: `npm run lint`
Expected: 3 erros, todos `no-explicit-any` em `api/subscribe.ts`. Este é o estado final esperado do plano.

- [ ] **Step 3: Confirmar type-check e testes**

Run: `npm run build`
Expected: sucesso.

Run: `npm test`
Expected: PASS, 46 testes.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: fire ViewContent on both pages and derive page kind in render"
```

---

### Task 7: Pixel e GTM na página de vendas, canonical e `noscript` válido

A página principal de vendas não tem pixel nem GTM hoje. Sem isso, o `ViewContent` da Task 6 chama a CAPI mas não tem pixel de browser para deduplicar contra, e nenhum outro evento dessa página existe.

**Files:**
- Modify: `index.html:12` (canonical), `:6` (ponto de inserção dos scripts no head) e `:31` (a tag `<body>`)
- Modify: `lista-de-espera/index.html:28-30` (mover o `noscript`)

**Interfaces:**
- Consumes: nada.
- Produces: `window.fbq` e `window.dataLayer` disponíveis na página de vendas, que `trackMeta` já usa condicionalmente.

- [ ] **Step 1: Corrigir o canonical da página de vendas**

Em `index.html`, linha 12, troque:

```html
    <link rel="canonical" href="https://posggsr.anhanguera.com/" />
```

por:

```html
    <link rel="canonical" href="https://www.ambientalpro.com.br/posggsr/" />
```

- [ ] **Step 2: Adicionar GTM e pixel ao `<head>` da página de vendas**

Em `index.html`, logo depois da linha 6 (`<meta name="viewport" ... />`), insira:

```html
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-MTZ9NFFN');</script>
    <!-- End Google Tag Manager -->

    <!-- Meta Pixel Code -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1373287802810243');
    fbq('track', 'PageView');
    </script>
    <!-- End Meta Pixel Code -->
```

O `<noscript>` do pixel **não** vai aqui. Ele vai no `<body>`, no passo seguinte — `<noscript><img>` dentro de `<head>` é HTML inválido e é exatamente a origem do aviso de parse que o build cospe hoje.

- [ ] **Step 3: Adicionar os fallbacks `noscript` ao `<body>` da página de vendas**

Em `index.html`, imediatamente depois da tag `<body>`, antes de `<div id="root"></div>`, insira:

```html
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MTZ9NFFN"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->

    <!-- Meta Pixel (noscript) -->
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=1373287802810243&ev=PageView&noscript=1"
    alt="" /></noscript>
```

- [ ] **Step 4: Mover o `noscript` do pixel na lista de espera para o `<body>`**

Em `lista-de-espera/index.html`, remova as linhas 28-30 do `<head>`:

```html
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=1373287802810243&ev=PageView&noscript=1"
    /></noscript>
```

E insira, no `<body>`, logo depois do bloco `<!-- End Google Tag Manager (noscript) -->` que já existe na linha 66:

```html
    <!-- Meta Pixel (noscript) -->
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=1373287802810243&ev=PageView&noscript=1"
    alt="" /></noscript>
```

- [ ] **Step 5: Confirmar que o aviso de parse do build desapareceu**

Run: `npm run build`
Expected: sucesso **sem** a linha `Unable to parse HTML; parse5 error code disallowed-content-in-noscript-in-head`. Esse aviso estava presente no baseline; se ainda aparecer, algum `<noscript><img>` ficou no `<head>`.

- [ ] **Step 6: Confirmar que o pixel entrou nos dois artefatos**

```bash
grep -o "1373287802810243" dist/index.html | wc -l
grep -o "1373287802810243" dist/lista-de-espera/index.html | wc -l
```

Expected: `2` em cada — o `fbq('init', ...)` e a URL do `noscript`. Use `grep -o | wc -l` e não `grep -c`: o Vite minifica os scripts inline do HTML e pode colapsar linhas, o que faria uma contagem por linha dar `1` mesmo estando tudo correto.

- [ ] **Step 7: Confirmar lint e testes**

Run: `npm run lint`
Expected: os mesmos 3 erros de `api/subscribe.ts`.

Run: `npm test`
Expected: PASS, 46 testes.

- [ ] **Step 8: Commit**

```bash
git add index.html lista-de-espera/index.html
git commit -m "feat: add pixel and GTM to sales page, fix canonical and noscript placement"
```

---

### Task 8: Validação end-to-end no Events Manager

Esta task não tem código. Nenhum teste automatizado prova que o Meta aceitou o evento e deduplicou — só o Events Manager prova. **Não considere o trabalho concluído sem esta task.**

**Files:** nenhum.

**Interfaces:**
- Consumes: tudo das Tasks 1-7.
- Produces: confirmação de que o pipeline funciona de ponta a ponta.

- [ ] **Step 1: Gerar o token de acesso**

No Events Manager, abra o dataset `1373287802810243` → Configurações → Conversions API → "Gerar token de acesso". Este passo depende do dono da conta; sem o token nada funciona.

- [ ] **Step 2: Configurar as env vars na Vercel**

No projeto da Vercel, em Settings → Environment Variables:

```
META_PIXEL_ID          = 1373287802810243
META_CAPI_ACCESS_TOKEN = <token do passo 1>
META_TEST_EVENT_CODE   = <código da aba Test Events>
```

O `META_TEST_EVENT_CODE` sai da aba Test Events do Events Manager e serve para os eventos aparecerem só ali, sem contaminar os dados de produção. **Remova essa variável ao final da validação** — se ela ficar, os eventos continuam sendo tratados como teste e não alimentam as campanhas.

- [ ] **Step 3: Fazer o deploy e submeter um lead de teste**

Faça o deploy do branch, abra `https://www.ambientalpro.com.br/posggsr/lista-de-espera?fbclid=teste123` e preencha o formulário com "Possui formação? = Sim".

O `fbclid` na URL é de propósito: é o que exercita o caminho do `deriveFbc`.

- [ ] **Step 4: Verificar na aba Test Events**

Confirme, para o `Lead`:

- o evento aparece **duas vezes**, uma com origem Browser e outra com origem Server;
- as duas estão marcadas como deduplicadas — se aparecerem como dois eventos distintos, o `event_id` não está casando entre os dois lados;
- o evento de servidor mostra e-mail, telefone, nome e sobrenome como parâmetros de correspondência recebidos;
- `fbc` e `fbp` estão presentes no evento de servidor.

Confirme também que `lead_qualificado` chegou pelos dois caminhos, e que `ViewContent` chegou ao abrir a página.

- [ ] **Step 5: Verificar o comportamento com formação "Não"**

Submeta outro lead com "Possui formação? = Não". Confirme que sai `Lead` (browser + server) e que **não** sai `lead_qualificado`.

- [ ] **Step 6: Conferir a qualidade da correspondência**

Na visão geral do dataset, confirme que a pontuação de qualidade de correspondência do `Lead` subiu em relação ao que era antes. Este é o objetivo do trabalho — se não subiu, a normalização está errada em algum ponto e vale revisitar a Task 1.

- [ ] **Step 7: Remover o `META_TEST_EVENT_CODE`**

Apague a variável na Vercel e faça um novo deploy. Confirme que os eventos passam a aparecer no relatório normal do dataset, e não mais na aba Test Events.

- [ ] **Step 8: Criar a Conversão Personalizada (recomendado)**

No Events Manager, crie uma Conversão Personalizada filtrando URL que contenha `/posggsr/`. Sem isso, os eventos da Pós GGSR ficam misturados com os do resto do negócio Ambiental Pro neste pixel compartilhado.

---

## Pendências fora deste plano

- **Consentimento / LGPD.** O site não tem banner de consentimento nem link para política de privacidade. Enviar e-mail e telefone hasheados server-side é prática padrão e o SHA-256 não é reversível na prática, mas continua sendo tratamento de dado pessoal e exige base legal declarada. Recomendação para o responsável pelo site: texto de consentimento no formulário e link para a política.
- **Os 3 `no-explicit-any` de `api/subscribe.ts`.** Ficam. Corrigi-los exigiria mexer na integração do ActiveCampaign, que não tem nada a ver com este trabalho.
- **`Purchase` e `InitiateCheckout`.** Já vêm server-side do checkout Voomp. Duplicar geraria conflito.
- **Versão do Graph API.** `v21.0` não pôde ser confirmada contra a documentação oficial (bloqueada pelo proxy de egress deste ambiente). Vale checar se há uma versão mais recente antes de considerar a integração finalizada — é uma constante só, em `api/_lib/capi.ts`.
