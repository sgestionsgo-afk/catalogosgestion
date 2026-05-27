import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

type GoogleImageItem = {
  link: string
  title: string
  image?: { thumbnailLink?: string }
}

export async function GET(req: NextRequest) {
  // Solo usuarios autenticados pueden usar esta ruta
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q) {
    return NextResponse.json({ error: 'Falta el parámetro q' }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY
  const cx = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID

  if (!apiKey || !cx) {
    return NextResponse.json(
      { error: 'Búsqueda de imágenes no configurada. Revisá GOOGLE_CUSTOM_SEARCH_API_KEY y GOOGLE_CUSTOM_SEARCH_ENGINE_ID en .env.local' },
      { status: 503 }
    )
  }

  const searchUrl =
    `https://www.googleapis.com/customsearch/v1` +
    `?key=${apiKey}` +
    `&cx=${cx}` +
    `&q=${encodeURIComponent(q)}` +
    `&searchType=image` +
    `&num=9` +
    `&safe=active`

  let res: Response
  try {
    res = await fetch(searchUrl)
  } catch {
    return NextResponse.json({ error: 'Error al conectar con el servicio de búsqueda' }, { status: 502 })
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = body?.error?.message ?? 'Error en la búsqueda'
    return NextResponse.json({ error: message }, { status: 502 })
  }

  const data = await res.json()
  const items = ((data.items ?? []) as GoogleImageItem[]).map((item) => ({
    url: item.link,
    thumbnail: item.image?.thumbnailLink ?? item.link,
    title: item.title,
  }))

  return NextResponse.json({ items })
}
