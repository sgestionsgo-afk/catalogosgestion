import { getProductos } from '@/services/productos'
import ProductGrid from '@/components/public/ProductGrid'
import Navbar from '@/components/public/Navbar'
import WhatsAppButton from '@/components/public/WhatsAppButton'

export const revalidate = 60

export default async function HomePage() {
  const productos = await getProductos()

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Nuestros productos
          </h1>
          <p className="mt-1 text-sm text-gray-400">{productos.length} productos disponibles</p>
        </div>
        <ProductGrid productos={productos} />
      </main>

      <footer className="border-t border-gray-100 bg-white py-6 text-center text-sm text-gray-400">
        {process.env.NEXT_PUBLIC_NOMBRE_TIENDA ?? 'Catálogo'} © {new Date().getFullYear()}
      </footer>

      <WhatsAppButton />
    </>
  )
}
