import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/Logo SGestiOn.png"
            alt="SGestión"
            width={200}
            height={60}
            className="h-16 w-auto"
            priority
          />
        </Link>

        {/* Acceso admin sutil */}
        <Link
          href="/admin"
          title="Panel de administración"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-lime-400 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-800"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.252-.562.86-.093 1.994.934 2.285 1.463.408 1.463 2.441 0 2.849-1.027.291-1.496 1.425-.934 2.285.94 1.426-.827 3.192-2.37 2.252a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.252.562-.86.093-1.994-.934-2.285-1.463-.408-1.463-2.441 0-2.849 1.027-.291 1.496-1.425.934-2.285-.94-1.426.827-3.192 2.37-2.252a1.724 1.724 0 002.573-1.066z" />
            <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
          </svg>
          <span className="hidden sm:inline">Admin</span>
        </Link>
      </div>
    </header>
  )
}
