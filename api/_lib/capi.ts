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
