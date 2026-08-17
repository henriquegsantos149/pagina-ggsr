import { afterEach, describe, expect, it, vi } from 'vitest'
import { deriveFbc, readCookie, trackMeta } from './meta'

afterEach(() => {
  vi.unstubAllGlobals()
})

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

describe('trackMeta', () => {
  it('nao propaga excecao quando o fbq lanca', () => {
    vi.stubGlobal('window', {
      crypto: { randomUUID: () => 'id-1' },
      location: { href: 'https://example.com/', search: '' },
      fbq: () => {
        throw new Error('pixel quebrado')
      },
    })
    vi.stubGlobal('document', { cookie: '' })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))

    expect(() => trackMeta('Lead')).not.toThrow()
  })

  it('chama a Conversions API mesmo quando o fbq lanca', () => {
    vi.stubGlobal('window', {
      crypto: { randomUUID: () => 'id-1' },
      location: { href: 'https://example.com/', search: '' },
      fbq: () => {
        throw new Error('pixel quebrado')
      },
    })
    vi.stubGlobal('document', { cookie: '' })
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    trackMeta('Lead')

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
