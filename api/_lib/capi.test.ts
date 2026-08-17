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
