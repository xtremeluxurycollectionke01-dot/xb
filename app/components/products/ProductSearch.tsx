'use client'

import { useState, useEffect } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import Input from '../ui/Input'

interface ProductSearchProps {
  onSearch: (query: string) => void
  initialQuery?: string
}

export default function ProductSearch({ onSearch, initialQuery = '' }: ProductSearchProps) {
  const [query, setQuery] = useState(initialQuery)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, onSearch])

  return (
    <div className={cn(
      'relative transition-all duration-200',
      isFocused ? 'scale-[1.02]' : ''
    )}>
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input
        type="search"
        placeholder="Search products by name, SKU, or category..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="pl-10 pr-10 py-3 w-full"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <FiX className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}