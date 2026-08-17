import { describe, expect, it } from 'vitest'
import {
  ALLOWED_EVENTS,
  buildEventPayload,
  buildUserData,
  clientIpFromHeader,
  filterCustomData,
  filterEventSourceUrl,
  isAllowedEvent,
  normalizeEmail,
  normalizeName,
  normalizePhoneBR,
  parseCookies,
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

describe('filterCustomData', () => {
  it('descarta chaves fora do allowlist', () => {
    expect(
      filterCustomData({ content_name: 'Pós GGSR', evil_key: 'payload' }),
    ).toEqual({ content_name: 'Pós GGSR' })
  })

  it('descarta valores que nao sao string', () => {
    expect(filterCustomData({ content_name: 123 })).toBeUndefined()
  })

  it('omite custom_data quando nada sobrevive ao filtro', () => {
    expect(filterCustomData({ evil_key: 'payload' })).toBeUndefined()
    expect(filterCustomData({})).toBeUndefined()
    expect(filterCustomData(undefined)).toBeUndefined()
    expect(filterCustomData(null)).toBeUndefined()
  })

  it('mantem content_name e content_category quando validos', () => {
    expect(
      filterCustomData({ content_name: 'Pós GGSR', content_category: 'lista-de-espera' }),
    ).toEqual({ content_name: 'Pós GGSR', content_category: 'lista-de-espera' })
  })
})

describe('filterEventSourceUrl', () => {
  it('mantem url que bate com a origem permitida', () => {
    const url = 'https://www.ambientalpro.com.br/posggsr/lista-de-espera'
    expect(filterEventSourceUrl(url)).toBe(url)
  })

  it('descarta url de origem estranha', () => {
    expect(filterEventSourceUrl('https://evil.example.com/posggsr/x')).toBeUndefined()
  })

  it('descarta valores que nao sao string', () => {
    expect(filterEventSourceUrl(undefined)).toBeUndefined()
    expect(filterEventSourceUrl(42)).toBeUndefined()
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
