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
