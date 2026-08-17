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
