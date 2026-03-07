'use client'

import { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi'
import { brands, categories, priceRanges, type FilterState } from '@/app/lib/products-data'
import Checkbox from '../ui/Checkbox'
import RangeSlider from '../ui/RangeSlider'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface ProductFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onClose?: () => void
  isMobile?: boolean
}

export default function ProductFilters({ 
  filters, 
  onFilterChange,
  onClose,
  isMobile = false 
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    brands: true,
    ratings: true,
    other: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const updateFilters = (updates: Partial<FilterState>) => {
    onFilterChange({ ...filters, ...updates })
  }

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      brands: [],
      priceRange: [0, 100000],
      ratings: [],
      inStock: false,
      onSale: false,
      newArrivals: false,
    })
  }

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 100000 ||
    filters.ratings.length > 0 ||
    filters.inStock ||
    filters.onSale ||
    filters.newArrivals

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string
    section: keyof typeof expandedSections
    children: React.ReactNode 
  }) => (
    <div className="border-b border-card-border last:border-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className="font-medium text-dark-text">{title}</span>
        {expandedSections[section] ? (
          <FiChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <FiChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="pb-4 space-y-2">
          {children}
        </div>
      )}
    </div>
  )

  const filterContent = (
    <div className="space-y-1">
      {/* Header with close button for mobile */}
      {isMobile && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-card-border">
          <h3 className="text-lg font-bold text-dark-text">Filters</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-soft-gray rounded-full"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Filters:</span>
            <button
              onClick={clearFilters}
              className="text-sm text-brand-600 hover:text-brand-700"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.categories.map(cat => (
              <span
                key={cat}
                className="inline-flex items-center px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded"
              >
                {cat}
                <button
                  onClick={() => updateFilters({ 
                    categories: filters.categories.filter(c => c !== cat) 
                  })}
                  className="ml-1 hover:text-brand-800"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.brands.map(brand => (
              <span
                key={brand}
                className="inline-flex items-center px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded"
              >
                {brand}
                <button
                  onClick={() => updateFilters({ 
                    brands: filters.brands.filter(b => b !== brand) 
                  })}
                  className="ml-1 hover:text-brand-800"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            ))}
            {(filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) && (
              <span className="inline-flex items-center px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded">
                KES {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()}
                <button
                  onClick={() => updateFilters({ priceRange: [0, 100000] })}
                  className="ml-1 hover:text-brand-800"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      <FilterSection title="Categories" section="categories">
        {categories.map(category => (
          <Checkbox
            key={category}
            id={`cat-${category}`}
            label={category}
            checked={filters.categories.includes(category)}
            onChange={(e) => {
              if (e.target.checked) {
                updateFilters({ categories: [...filters.categories, category] })
              } else {
                updateFilters({ categories: filters.categories.filter(c => c !== category) })
              }
            }}
          />
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range" section="price">
        <RangeSlider
          min={0}
          max={100000}
          step={100}
          value={filters.priceRange}
          onChange={(value) => updateFilters({ priceRange: value })}
        />
        <div className="grid grid-cols-2 gap-2 mt-2">
          {priceRanges.map(range => (
            <button
              key={range.label}
              onClick={() => updateFilters({ priceRange: [range.min, range.max] })}
              className="px-2 py-1 text-xs border border-card-border rounded hover:bg-soft-gray transition-colors"
            >
              {range.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brands" section="brands">
        {brands.slice(0, 10).map(brand => (
          <Checkbox
            key={brand}
            id={`brand-${brand}`}
            label={brand}
            checked={filters.brands.includes(brand)}
            onChange={(e) => {
              if (e.target.checked) {
                updateFilters({ brands: [...filters.brands, brand] })
              } else {
                updateFilters({ brands: filters.brands.filter(b => b !== brand) })
              }
            }}
          />
        ))}
        {brands.length > 10 && (
          <button className="text-sm text-brand-600 hover:text-brand-700 mt-2">
            Show More
          </button>
        )}
      </FilterSection>

      {/* Ratings */}
      <FilterSection title="Customer Rating" section="ratings">
        {[4, 3, 2, 1].map(rating => (
          <Checkbox
            key={rating}
            id={`rating-${rating}`}
            label={`${rating}+ Stars`}
            checked={filters.ratings.includes(rating)}
            onChange={(e) => {
              if (e.target.checked) {
                updateFilters({ ratings: [...filters.ratings, rating] })
              } else {
                updateFilters({ ratings: filters.ratings.filter(r => r !== rating) })
              }
            }}
          />
        ))}
      </FilterSection>

      {/* Other Filters */}
      <FilterSection title="Other" section="other">
        <Checkbox
          id="in-stock"
          label="In Stock Only"
          checked={filters.inStock}
          onChange={(e) => updateFilters({ inStock: e.target.checked })}
        />
        <Checkbox
          id="on-sale"
          label="On Sale"
          checked={filters.onSale}
          onChange={(e) => updateFilters({ onSale: e.target.checked })}
        />
        <Checkbox
          id="new-arrivals"
          label="New Arrivals"
          checked={filters.newArrivals}
          onChange={(e) => updateFilters({ newArrivals: e.target.checked })}
        />
      </FilterSection>

      {/* Apply Filters Button (Mobile) */}
      {isMobile && (
        <Button
          onClick={onClose}
          fullWidth
          className="mt-4"
        >
          Apply Filters
        </Button>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 overflow-y-auto p-4">
        {filterContent}
      </div>
    )
  }

  return (
    <Card className="p-4 sticky top-24">
      {filterContent}
    </Card>
  )
}