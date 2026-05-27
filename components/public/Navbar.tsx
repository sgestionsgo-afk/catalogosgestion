import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
          {process.env.NEXT_PUBLIC_NOMBRE_TIENDA ?? 'Catálogo'}
        </Link>
      </div>
    </header>
  )
}
