import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductoById } from '@/services/productos'
import { formatPrecio } from '@/lib/utils'
import Navbar from '@/components/public/Navbar'
import WhatsAppButton from '@/components/public/WhatsAppButton'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  try {
    const { id } = await params
    const p = await getProductoById(id)
    return { title: p.nombre, description: p.descripcion ?? undefined }
  } catch {
    return { title: 'Producto no encontrado' }
  }
}

export default async function ProductoDetailPage({ params }: { params: Params }) {
  const { id } = await params

  let producto
  try {
    producto = await getProductoById(id)
  } catch {
    notFound()
  }

  if (!producto.activo) notFound()

  const WA_NUMERO = process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? '5491100000000'
  const mensajeWA = `Hola, me interesa el producto: *${producto.nombre}* (${formatPrecio(producto.precio)})`

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          ← Volver al catálogo
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Imagen */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
            {producto.imagen_url ? (
              <Image
                src={producto.imagen_url}
                alt={producto.nombre}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-300">
                <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Datos */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm uppercase tracking-wide text-gray-400">{producto.categoria}</span>
              {producto.destacado && (
                <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
                  Destacado
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold leading-tight text-gray-900">{producto.nombre}</h1>

            {producto.descripcion && (
              <p className="leading-relaxed text-gray-600">{producto.descripcion}</p>
            )}

            <p className="text-3xl font-bold text-blue-600">{formatPrecio(producto.precio)}</p>

            {producto.stock === 0 ? (
              <p className="text-sm font-medium text-red-500">Sin stock</p>
            ) : producto.stock !== null ? (
              <p className="text-sm font-medium text-green-600">✓ En stock ({producto.stock} disponibles)</p>
            ) : null}

            <a
              href={`https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(mensajeWA)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-600"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 bg-white py-6 text-center text-sm text-gray-400">
        {process.env.NEXT_PUBLIC_NOMBRE_TIENDA ?? 'Catálogo'} © {new Date().getFullYear()}
      </footer>

      <WhatsAppButton mensaje={mensajeWA} />
    </>
  )
}
