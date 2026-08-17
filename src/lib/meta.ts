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
}
