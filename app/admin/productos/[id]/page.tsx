import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductoById } from '@/services/productos'
import ProductForm from '@/components/admin/ProductForm'

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  try {
    const { id } = await params
    const p = await getProductoById(id)
    return { title: `Editar: ${p.nombre}` }
  } catch {
    return { title: 'Editar producto' }
  }
}

export default async function EditarProductoPage({ params }: { params: Params }) {
  const { id } = await params

  let producto
  try {
    producto = await getProductoById(id)
  } catch {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar producto</h1>
        <p className="text-sm text-gray-500">{producto.nombre}</p>
      </div>
      <ProductForm producto={producto} />
    </div>
  )
}
