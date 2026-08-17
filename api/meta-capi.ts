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
