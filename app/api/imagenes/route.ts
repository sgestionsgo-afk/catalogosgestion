import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

const BASE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'es-419,es;q=0.9,en;q=0.8',
}

type ImageResult = { url: string; thumbnail: string; title: string }

async function searchDuckDuckGoImages(q: string): Promise<ImageResult[]> {
  // Paso 1: cargar la página para obtener el token vqd y las cookies de sesión
  const initUrl = `https://duckduckgo.com/?q=${encodeURIComponent(q)}&iax=images&ia=images`
  const initRes = await fetch(initUrl, {
    headers: { ...BASE_HEADERS, Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
    redirect: 'follow',
  })
  const html = await initRes.text()

  // Extraer el token vqd con varios patrones posibles
  const vqd =
    html.match(/vqd=["']([\d-]+)["']/)?.[1] ??
    html.match(/vqd=([\d-]+)[&"'\s]/)?.[1] ??
    html.match(/"vqd":"([\d-]+)"/)?.[1]

  if (!vqd) {
    throw new Error('No se pudo obtener el token de búsqueda de DDG')
  }

  // Reenviar cookies de sesión que DDG requiere
  const setCookie = initRes.headers.get('set-cookie') ?? ''
  const cookieStr = setCookie
    .split(',')
    .map((c) => c.split(';')[0].trim())
    .filter(Boolean)
    .join('; ')

  // Paso 2: llamar al endpoint de imágenes con el token
  const imgParams = new URLSearchParams({ q, vqd, o: 'json', p: '1', s: '0', u: 'bing', f: ',,,,,', l: 'es-419' })
  const imgRes = await fetch(`https://duckduckgo.com/i.js?${imgParams}`, {
    headers: {
      ...BASE_HEADERS,
      Accept: 'application/json, text/javascript, */*; q=0.01',
      Referer: initUrl,
      'X-Requested-With': 'XMLHttpRequest',
      ...(cookieStr ? { Cookie: cookieStr } : {}),
    },
  })

  if (!imgRes.ok) {
    throw new Error(`DuckDuckGo respondió con ${imgRes.status}`)
  }

  const data = await imgRes.json()
  return ((data.results ?? []) as { image: string; thumbnail: string; title: string }[]).map((r) => ({
    url: r.image,
    thumbnail: r.thumbnail,
    title: r.title,
  }))
}

export async function GET(req: NextRequest) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q) {
    return NextResponse.json({ error: 'Falta el parámetro q' }, { status: 400 })
  }

  let results: ImageResult[]
  try {
    results = await searchDuckDuckGoImages(q)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al buscar imágenes'
    console.error('[/api/imagenes] Error DDG:', message)
    return NextResponse.json({ error: message }, { status: 502 })
  }

  return NextResponse.json({ items: results.slice(0, 12) })
}

