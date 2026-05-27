type Variant = 'default' | 'destacado' | 'sin-stock' | 'activo' | 'inactivo'

const styles: Record<Variant, string> = {
  default: 'bg-gray-100 text-gray-700',
  destacado: 'bg-amber-400 text-amber-900',
  'sin-stock': 'bg-red-100 text-red-700',
  activo: 'bg-green-100 text-green-700',
  inactivo: 'bg-gray-100 text-gray-500',
}

type Props = {
  children: React.ReactNode
  variant?: Variant
  className?: string
}

export default function Badge({ children, variant = 'default', className = '' }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[variant]} ${className}`}>
      {children}
    </span>
  )
}
