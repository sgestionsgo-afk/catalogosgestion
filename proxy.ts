import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas de admin que NO requieren sesión
  if (pathname === '/admin/login') return NextResponse.next()

  // Proteger todo /admin/*
  if (!pathname.startsWith('/admin')) return NextResponse.next()

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Update request cookies so server components see the refreshed session
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          // Recreate response with updated request and set cookies on it too
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() makes a server-side verification call — use getSession() for an
  // optimistic check in the proxy (the real auth check happens in server components)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/admin/login'
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
