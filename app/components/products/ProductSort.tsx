'use client'

import { FiChevronDown } from 'react-icons/fi'

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating-desc' | 'newest'

interface ProductSortProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export default function ProductSort({ value, onChange }: ProductSortProps) {
  const options: { value: SortOption; label: string }[] = [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'rating-desc', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest Arrivals' },
  ]

  const selectedOption = options.find(opt => opt.value === value) || options[0]

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="appearance-none bg-white border border-card-border rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  )
}