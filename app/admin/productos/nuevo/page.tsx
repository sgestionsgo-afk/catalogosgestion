import ProductForm from '@/components/admin/ProductForm'

export const metadata = { title: 'Nuevo producto' }

export default function NuevoProductoPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo producto</h1>
        <p className="text-sm text-gray-500">Completar los datos del producto</p>
      </div>
      <ProductForm />
    </div>
  )
}
