'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set('q', value)
      } else {
        params.delete('q')
      }
      startTransition(() => {
        router.push(`/?${params.toString()}`)
      })
    },
    [router, searchParams]
  )

  return (
    <div className="relative w-full">
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-600 pointer-events-none"
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <input
        type="search"
        placeholder="Buscar por nombre, categoría o descripción…"
        defaultValue={searchParams.get('q') ?? ''}
        onChange={handleChange}
        className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm shadow-sm
          focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-400
          placeholder:text-gray-400 transition-all duration-200
          ${isPending ? 'opacity-60' : ''}`}
      />
      {isPending && (
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lime-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
    </div>
  )
}
