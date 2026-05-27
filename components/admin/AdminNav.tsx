'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminNav() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-lg font-bold text-gray-900">
            Admin
          </Link>
          <nav className="flex items-center gap-3 text-sm text-gray-500">
            <Link href="/admin/productos" className="hover:text-blue-600 transition-colors">
              Productos
            </Link>
            <Link href="/" target="_blank" className="hover:text-blue-600 transition-colors text-xs border border-gray-200 px-2 py-1 rounded-md">
              Ver catálogo ↗
            </Link>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
