/*'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { FiFilter, FiGrid, FiList } from 'react-icons/fi'
import { products, type Product, type FilterState } from '@/app/lib/products-data'
import Container from '../layout/Container'
import ProductBreadcrumb from './ProductBreadcrumb'
import ProductFilters from './ProductFilters'
import ProductSearch from './ProductSearch'
import ProductSort, { type SortOption } from './ProductSort'
import ProductGrid from './ProductGrid'
import Button from '../ui/Button'

export default function ProductsPageClient() {
  const searchParams = useSearchParams()
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 100000],
    ratings: [],
    inStock: false,
    onSale: false,
    newArrivals: false,
  })

  // Parse URL params on mount
  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setFilters(prev => ({
        ...prev,
        categories: [category]
      }))
    }
  }, [searchParams])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.category))
    }

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand))
    }

    // Price filter
    filtered = filtered.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )

    // Rating filter
    if (filters.ratings.length > 0) {
      filtered = filtered.filter(p => 
        filters.ratings.some(rating => p.rating >= rating)
      )
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(p => p.stockStatus !== 'out-of-stock')
    }

    // Sale filter
    if (filters.onSale) {
      filtered = filtered.filter(p => p.discount && p.discount > 0)
    }

    // New arrivals filter
    if (filters.newArrivals) {
      filtered = filtered.filter(p => p.isNew)
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'rating-desc':
          return b.rating - a.rating
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        default:
          return 0
      }
    })

    return filtered
  }, [products, searchQuery, filters, sortBy])

  const productsPerPage = 12
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )

  return (
    <div className="py-8">
      <Container>
        {/* Breadcrumb *
        <ProductBreadcrumb />

        {/* Header *
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-dark-text mb-2">
            All Products
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} products found
          </p>
        </div>

        {/* Search Bar *
        <div className="mb-6">
          <ProductSearch onSearch={setSearchQuery} />
        </div>

        {/* Mobile Filter Button *
        <div className="lg:hidden mb-4">
          <Button
            onClick={() => setShowMobileFilters(true)}
            variant="outline"
            fullWidth
          >
            <FiFilter className="w-4 h-4 mr-2" />
            Show Filters
          </Button>
        </div>

        {/* Main Content *
        <div className="flex gap-8">
          {/* Sidebar Filters (Desktop) *
          <div className="hidden lg:block w-80 flex-shrink-0">
            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>

          {/* Mobile Filters (Slide-over) *
          {showMobileFilters && (
            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
              onClose={() => setShowMobileFilters(false)}
              isMobile
            />
          )}

          {/* Main Content *
          <div className="flex-1">
            {/* Sort Bar *
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">View:</span>
                <button className="p-2 bg-brand-50 text-brand-600 rounded">
                  <FiGrid className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-soft-gray rounded">
                  <FiList className="w-4 h-4" />
                </button>
              </div>
              <ProductSort value={sortBy} onChange={setSortBy} />
            </div>

            {/* Product Grid *
            <ProductGrid
              products={paginatedProducts}
              hasMore={currentPage < totalPages}
              onLoadMore={() => setCurrentPage(prev => prev + 1)}
            />
          </div>
        </div>
      </Container>
    </div>
  )
}*/

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { FiFilter, FiGrid, FiList } from 'react-icons/fi'
import Container from '../layout/Container'
import ProductBreadcrumb from './ProductBreadcrumb'
import ProductFilters from './ProductFilters'
import ProductSearch from './ProductSearch'
import ProductSort, { type SortOption } from './ProductSort'
import ProductGrid from './ProductGrid'
import Button from '../ui/Button'
import { productService } from '@/app/lib/buiness/product.service'
import { type Product, type FilterState } from '@/app/lib/models/product.model'

export default function ProductsPageClient() {
  const searchParams = useSearchParams()
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 100000],
    ratings: [],
    inStock: false,
    onSale: false,
    newArrivals: false,
  })

  // Parse URL params on mount
  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setFilters(prev => ({
        ...prev,
        categories: [category]
      }))
    }
  }, [searchParams])

  // Convert sortBy string to SortOption object for API
  const getSortOption = useCallback((sort: string): { field: string; order: 'asc' | 'desc' } => {
    switch (sort) {
      case 'price-asc':
        return { field: 'price', order: 'asc' }
      case 'price-desc':
        return { field: 'price', order: 'desc' }
      case 'name-asc':
        return { field: 'name', order: 'asc' }
      case 'name-desc':
        return { field: 'name', order: 'desc' }
      case 'rating-desc':
        return { field: 'rating', order: 'desc' }
      case 'newest':
        return { field: 'createdAt', order: 'desc' }
      default:
        return { field: 'name', order: 'asc' }
    }
  }, [])

  // Fetch products from API
  const fetchProducts = useCallback(async (page: number, isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true)
    } else {
      setIsLoading(true)
    }
    setError(null)
    
    try {
      const sortOption = getSortOption(sortBy)
      
      const response = await productService.getProducts(
        page,
        12,
        filters,
        sortOption,
        searchQuery
      )
      
      if (isLoadMore) {
        setProducts(prev => [...prev, ...response.data])
      } else {
        setProducts(response.data)
      }
      
      setTotalPages(response.pagination.totalPages)
      setTotalItems(response.pagination.totalItems)
    } catch (err) {
      setError('Failed to load products. Please try again.')
      console.error('Error fetching products:', err)
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false)
      } else {
        setIsLoading(false)
      }
    }
  }, [filters, sortBy, searchQuery, getSortOption])

  // Fetch products when dependencies change
  useEffect(() => {
    setCurrentPage(1)
    fetchProducts(1, false)
  }, [fetchProducts])

  // Handle load more
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      fetchProducts(nextPage, true)
    }
  }

  // Handle filter change
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  // Handle sort change
  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy)
    setCurrentPage(1)
  }

  return (
    <div className="py-8">
      <Container>
        {/* Breadcrumb */}
        <ProductBreadcrumb />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-dark-text mb-2">
            All Products
          </h1>
          {!isLoading && !error && (
            <p className="text-gray-600">
              {totalItems} product{totalItems !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <ProductSearch onSearch={handleSearch} />
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <Button
            onClick={() => setShowMobileFilters(true)}
            variant="outline"
            fullWidth
            disabled={isLoading}
          >
            <FiFilter className="w-4 h-4 mr-2" />
            Show Filters
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Mobile Filters (Slide-over) */}
          {showMobileFilters && (
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClose={() => setShowMobileFilters(false)}
              isMobile
            />
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">View:</span>
                <button 
                  className="p-2 bg-brand-50 text-brand-600 rounded"
                  aria-label="Grid view"
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 hover:bg-soft-gray rounded"
                  aria-label="List view"
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
              <ProductSort 
                value={sortBy} 
                onChange={handleSortChange}
                disabled={isLoading}
              />
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="relative">
                  {/* Background spinner */}
                  <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
                  {/* Foreground spinner */}
                  <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-brand-600 border-t-transparent animate-spin"></div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-12">
                <div className="bg-red-50 text-red-800 p-6 rounded-lg max-w-md mx-auto">
                  <p className="text-lg font-semibold mb-2">Oops! Something went wrong</p>
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button 
                    onClick={() => fetchProducts(1, false)} 
                    variant="primary"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Product Grid */}
            {!isLoading && !error && (
              <ProductGrid
                products={products}
                hasMore={currentPage < totalPages}
                onLoadMore={handleLoadMore}
                isLoading={isLoadingMore}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}