import { Suspense } from 'react'
import Image from 'next/image'
import { getProductos } from '@/services/productos'
import CatalogClient from '@/components/public/CatalogClient'
import Navbar from '@/components/public/Navbar'
import WhatsAppButton from '@/components/public/WhatsAppButton'
import { WebGLShader } from '@/components/ui/web-gl-shader'
import { TextEffect } from '@/components/ui/text-effect'
import { ShiningText } from '@/components/ui/shining-text'

export const revalidate = 60

export default async function HomePage() {
  const productos = await getProductos()
  const activos = productos.filter((p) => p.activo)
  const nombre = process.env.NEXT_PUBLIC_NOMBRE_TIENDA ?? 'Catálogo'

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col relative">
      <Navbar />

      {/* Hero con WebGL background */}
      <div className="relative overflow-hidden bg-linear-to-br from-slate-900 via-[#0d2614] to-emerald-900 text-white">
        {/* WebGL Canvas Background */}
        <div className="absolute inset-0 opacity-40">
          <WebGLShader />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 flex flex-col items-center justify-center gap-8">
          {/* Descripción */}
          <div className="flex flex-col items-center gap-4 text-center">
            <TextEffect
              per='word'
              as='h1'
              preset='slide'
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-lime-300 leading-tight"
            >
              Catálogo de Soluciones
            </TextEffect>
            <ShiningText
              text="Hardware · Sistemas · Servicios"
              className="text-base sm:text-lg font-semibold tracking-widest uppercase"
              delay={0.5}
            />
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
              {activos.length} producto{activos.length !== 1 ? 's' : ''} disponible{activos.length !== 1 ? 's' : ''} en nuestro catálogo
            </p>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <div className="flex flex-col items-center gap-1.5 bg-white/5 rounded-xl px-4 sm:px-5 py-3 border border-white/10 hover:border-lime-500/30 transition-colors">
              <span className="text-2xl sm:text-3xl font-extrabold text-lime-400">{activos.length}</span>
              <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">Productos</span>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex flex-col items-center gap-1.5 bg-white/5 rounded-xl px-4 sm:px-5 py-3 border border-white/10 hover:border-lime-500/30 transition-colors">
              <span className="text-2xl sm:text-3xl font-extrabold text-lime-400">✓</span>
              <span className="text-xs text-slate-400 uppercase tracking-wide font-medium">En stock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
        <Suspense fallback={
          <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
            Cargando productos…
          </div>
        }>
          <CatalogClient productos={productos} />
        </Suspense>
      </main>

      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-400 mt-auto">
        <span className="text-lime-500 font-semibold">{nombre}</span> © {new Date().getFullYear()}
      </footer>

      <WhatsAppButton />
    </div>
  )
}

