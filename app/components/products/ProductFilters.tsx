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


/*'use client'

import { useState, useEffect } from 'react'
import { FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi'
import { type FilterState } from '@/lib/models/product.model'
import { productService } from '@/lib/business/product.service'
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

interface FilterOption {
  value: string
  label: string
  count?: number
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

  const [categories, setCategories] = useState<FilterOption[]>([])
  const [brands, setBrands] = useState<FilterOption[]>([])
  const [showAllBrands, setShowAllBrands] = useState(false)
  const [isLoadingFilters, setIsLoadingFilters] = useState(false)

  // Price ranges from service
  const priceRanges = productService.getPriceRanges()

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions()
  }, [])

  const fetchFilterOptions = async () => {
    setIsLoadingFilters(true)
    try {
      // Fetch all products to extract filter options
      // In a production app, you'd want a dedicated endpoint for filter options
      const response = await productService.getProducts(1, 1000, {}, { field: 'name', order: 'asc' })
      
      // Extract unique categories with counts
      const categoryMap = new Map<string, number>()
      response.data.forEach(product => {
        if (product.category) {
          categoryMap.set(product.category, (categoryMap.get(product.category) || 0) + 1)
        }
      })
      
      const categoryOptions = Array.from(categoryMap.entries())
        .map(([value, count]) => ({
          value,
          label: value,
          count
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
      
      // Extract unique brands with counts
      const brandMap = new Map<string, number>()
      response.data.forEach(product => {
        if (product.brand) {
          brandMap.set(product.brand, (brandMap.get(product.brand) || 0) + 1)
        }
      })
      
      const brandOptions = Array.from(brandMap.entries())
        .map(([value, count]) => ({
          value,
          label: value,
          count
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
      
      setCategories(categoryOptions)
      setBrands(brandOptions)
    } catch (error) {
      console.error('Error fetching filter options:', error)
    } finally {
      setIsLoadingFilters(false)
    }
  }

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

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      updateFilters({ categories: [...filters.categories, category] })
    } else {
      updateFilters({ categories: filters.categories.filter(c => c !== category) })
    }
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      updateFilters({ brands: [...filters.brands, brand] })
    } else {
      updateFilters({ brands: filters.brands.filter(b => b !== brand) })
    }
  }

  const handleRatingChange = (rating: number, checked: boolean) => {
    if (checked) {
      updateFilters({ ratings: [...filters.ratings, rating] })
    } else {
      updateFilters({ ratings: filters.ratings.filter(r => r !== rating) })
    }
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
    children,
    isLoading = false 
  }: { 
    title: string
    section: keyof typeof expandedSections
    children: React.ReactNode 
    isLoading?: boolean
  }) => (
    <div className="border-b border-card-border last:border-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between py-3 text-left"
        disabled={isLoading}
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
          {isLoading ? (
            <div className="py-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            </div>
          ) : (
            children
          )}
        </div>
      )}
    </div>
  )

  const filterContent = (
    <div className="space-y-1">
      {/* Header with close button for mobile *
      {isMobile && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-card-border">
          <h3 className="text-lg font-bold text-dark-text">Filters</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-soft-gray rounded-full"
            aria-label="Close filters"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Active filters *
      {hasActiveFilters && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Filters:</span>
            <button
              onClick={clearFilters}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.categories.map(cat => {
              const category = categories.find(c => c.value === cat)
              return (
                <span
                  key={cat}
                  className="inline-flex items-center px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded"
                >
                  {category?.label || cat}
                  <button
                    onClick={() => handleCategoryChange(cat, false)}
                    className="ml-1 hover:text-brand-800"
                    aria-label={`Remove ${cat} filter`}
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )
            })}
            {filters.brands.map(brand => {
              const brandOption = brands.find(b => b.value === brand)
              return (
                <span
                  key={brand}
                  className="inline-flex items-center px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded"
                >
                  {brandOption?.label || brand}
                  <button
                    onClick={() => handleBrandChange(brand, false)}
                    className="ml-1 hover:text-brand-800"
                    aria-label={`Remove ${brand} filter`}
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              )
            })}
            {(filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) && (
              <span className="inline-flex items-center px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded">
                KES {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()}
                <button
                  onClick={() => updateFilters({ priceRange: [0, 100000] })}
                  className="ml-1 hover:text-brand-800"
                  aria-label="Remove price filter"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.ratings.map(rating => (
              <span
                key={rating}
                className="inline-flex items-center px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded"
              >
                {rating}+ Stars
                <button
                  onClick={() => handleRatingChange(rating, false)}
                  className="ml-1 hover:text-brand-800"
                  aria-label={`Remove ${rating}+ stars filter`}
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.inStock && (
              <span className="inline-flex items-center px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded">
                In Stock
                <button
                  onClick={() => updateFilters({ inStock: false })}
                  className="ml-1 hover:text-brand-800"
                  aria-label="Remove in stock filter"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.onSale && (
              <span className="inline-flex items-center px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded">
                On Sale
                <button
                  onClick={() => updateFilters({ onSale: false })}
                  className="ml-1 hover:text-brand-800"
                  aria-label="Remove on sale filter"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.newArrivals && (
              <span className="inline-flex items-center px-2 py-1 bg-brand-50 text-brand-700 text-xs rounded">
                New Arrivals
                <button
                  onClick={() => updateFilters({ newArrivals: false })}
                  className="ml-1 hover:text-brand-800"
                  aria-label="Remove new arrivals filter"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Categories *
      <FilterSection title="Categories" section="categories" isLoading={isLoadingFilters}>
        {categories.length === 0 && !isLoadingFilters ? (
          <p className="text-sm text-gray-500 py-1">No categories available</p>
        ) : (
          categories.map(category => (
            <div key={category.value} className="flex items-center justify-between">
              <Checkbox
                id={`cat-${category.value}`}
                label={category.label}
                checked={filters.categories.includes(category.value)}
                onChange={(e) => handleCategoryChange(category.value, e.target.checked)}
              />
              {category.count !== undefined && (
                <span className="text-xs text-gray-500">({category.count})</span>
              )}
            </div>
          ))
        )}
      </FilterSection>

      {/* Price Range *
      <FilterSection title="Price Range" section="price">
        <RangeSlider
          min={0}
          max={100000}
          step={100}
          value={filters.priceRange}
          onChange={(value) => updateFilters({ priceRange: value })}
          formatValue={(value) => `KES ${value.toLocaleString()}`}
        />
        <div className="grid grid-cols-2 gap-2 mt-4">
          {priceRanges.map(range => (
            <button
              key={range.label}
              onClick={() => updateFilters({ priceRange: [range.min, range.max] })}
              className={`px-2 py-1 text-xs border rounded transition-colors ${
                filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                  ? 'bg-brand-50 border-brand-500 text-brand-700'
                  : 'border-card-border hover:bg-soft-gray'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brands *
      <FilterSection title="Brands" section="brands" isLoading={isLoadingFilters}>
        {brands.length === 0 && !isLoadingFilters ? (
          <p className="text-sm text-gray-500 py-1">No brands available</p>
        ) : (
          <>
            {(showAllBrands ? brands : brands.slice(0, 10)).map(brand => (
              <div key={brand.value} className="flex items-center justify-between">
                <Checkbox
                  id={`brand-${brand.value}`}
                  label={brand.label}
                  checked={filters.brands.includes(brand.value)}
                  onChange={(e) => handleBrandChange(brand.value, e.target.checked)}
                />
                {brand.count !== undefined && (
                  <span className="text-xs text-gray-500">({brand.count})</span>
                )}
              </div>
            ))}
            {brands.length > 10 && (
              <button
                onClick={() => setShowAllBrands(!showAllBrands)}
                className="text-sm text-brand-600 hover:text-brand-700 mt-2 font-medium"
              >
                {showAllBrands ? 'Show Less' : `Show ${brands.length - 10} More`}
              </button>
            )}
          </>
        )}
      </FilterSection>

      {/* Ratings *
      <FilterSection title="Customer Rating" section="ratings">
        {[4, 3, 2, 1].map(rating => {
          const ratingText = rating === 4 ? '4+ Stars' : 
                            rating === 3 ? '3+ Stars' : 
                            rating === 2 ? '2+ Stars' : '1+ Stars'
          return (
            <Checkbox
              key={rating}
              id={`rating-${rating}`}
              label={ratingText}
              checked={filters.ratings.includes(rating)}
              onChange={(e) => handleRatingChange(rating, e.target.checked)}
            />
          )
        })}
      </FilterSection>

      {/* Other Filters *
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

      {/* Apply Filters Button (Mobile) *
      {isMobile && (
        <Button
          onClick={onClose}
          fullWidth
          className="mt-6"
        >
          Apply Filters
        </Button>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 overflow-y-auto">
        <div className="p-4">
          {filterContent}
        </div>
      </div>
    )
  }

  return (
    <Card className="p-4 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      {filterContent}
    </Card>
  )
}*/