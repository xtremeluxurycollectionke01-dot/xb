/*'use client'

import { useState, useMemo } from 'react'
import Container from '../layout/Container'
import CatalogueHeader from './CatalogueHeader'
import ViewToggle, { type ViewMode } from './ViewToggle'
import CategoryTree from './CategoryTree'
import FlipbookView from './FlipbookView'
import ListView from './ListView'
import QuickQuoteSidebar, { type QuoteFormData } from './QuickQuoteSidebar'
import { catalogueItems, type CatalogueItem } from '@/app/lib/catalogue-data'
import Button from '../ui/Button'
import { FiDownload } from 'react-icons/fi'

interface QuoteItem extends CatalogueItem {
  quantity: number
}

export default function CataloguePageClient() {
  const [viewMode, setViewMode] = useState<ViewMode>('flipbook')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])
  const [isQuoteSidebarOpen, setIsQuoteSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories(prev =>
      checked 
        ? [...prev, categoryId]
        : prev.filter(id => id !== categoryId)
    )
  }

  const handleSubcategoryChange = (subcategoryId: string, checked: boolean) => {
    setSelectedSubcategories(prev =>
      checked
        ? [...prev, subcategoryId]
        : prev.filter(id => id !== subcategoryId)
    )
  }

  const handleItemSelect = (itemId: string, checked: boolean) => {
    setSelectedItems(prev =>
      checked
        ? [...prev, itemId]
        : prev.filter(id => id !== itemId)
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(catalogueItems.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleAddToQuote = (items: CatalogueItem[]) => {
    const newItems: QuoteItem[] = items.map(item => ({
      ...item,
      quantity: item.minOrderQuantity,
    }))
    
    setQuoteItems(prev => {
      // Merge with existing items
      const merged = [...prev]
      newItems.forEach(newItem => {
        const existing = merged.find(i => i.id === newItem.id)
        if (existing) {
          existing.quantity = Math.max(existing.quantity, newItem.minOrderQuantity)
        } else {
          merged.push(newItem)
        }
      })
      return merged
    })
    
    setIsQuoteSidebarOpen(true)
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setQuoteItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const handleRemoveItem = (itemId: string) => {
    setQuoteItems(prev => prev.filter(item => item.id !== itemId))
    if (quoteItems.length === 1) {
      setIsQuoteSidebarOpen(false)
    }
  }

  const handleSubmitQuote = async (formData: QuoteFormData) => {
    console.log('Quote submitted:', { items: quoteItems, formData })
    // Here you would send to your API
    alert('Quote request submitted successfully! Our team will contact you shortly.')
    setQuoteItems([])
    setIsQuoteSidebarOpen(false)
  }

  const filteredItems = useMemo(() => {
    return catalogueItems.filter(item => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        )
      }
      
      // Category filters
      if (selectedCategories.length > 0 || selectedSubcategories.length > 0) {
        const categoryMatch = selectedCategories.length === 0 || 
          selectedCategories.includes(item.category)
        const subcategoryMatch = selectedSubcategories.length === 0 ||
          selectedSubcategories.includes(item.subcategory)
        return categoryMatch && subcategoryMatch
      }
      
      return true
    })
  }, [searchQuery, selectedCategories, selectedSubcategories])

  return (
    <>
      <CatalogueHeader onSearch={setSearchQuery} />
      
      <Container className="py-8">
        {/* View Toggle *
        <div className="flex justify-center mb-8">
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
        </div>

        {/* Main Content *
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar *
          <div className="lg:w-80 flex-shrink-0">
            <CategoryTree
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              selectedSubcategories={selectedSubcategories}
              onSubcategoryChange={handleSubcategoryChange}
            />
          </div>

          {/* Main Content Area *
          <div className="flex-1">
            {viewMode === 'flipbook' && (
              <FlipbookView onAddToQuote={handleAddToQuote} />
            )}
            
            {viewMode === 'list' && (
              <ListView
                selectedItems={selectedItems}
                onItemSelect={handleItemSelect}
                onSelectAll={handleSelectAll}
                onAddToQuote={handleAddToQuote}
              />
            )}
            
            {viewMode === 'pdf' && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-dark-text mb-4">Download Full Catalogue</h3>
                <p className="text-gray-600 mb-8">
                  Get the complete 2024 catalogue as a PDF file
                </p>
                <Button size="lg">
                  <FiDownload className="w-5 h-5 mr-2" />
                  Download PDF (24MB)
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Quick Quote Sidebar *
      <QuickQuoteSidebar
        isOpen={isQuoteSidebarOpen}
        onClose={() => setIsQuoteSidebarOpen(false)}
        items={quoteItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onSubmit={handleSubmitQuote}
      />
    </>
  )
}*/

'use client'

import { useState, useMemo } from 'react'
import Container from '../layout/Container'
import CatalogueHeader from './CatalogueHeader'
import ViewToggle, { type ViewMode } from './ViewToggle'
import CategoryTree from './CategoryTree'
import FlipbookView from './FlipbookView'
import ListView from './ListView'
import QuickQuoteSidebar, { type QuoteFormData } from './QuickQuoteSidebar'
import { catalogueItems, type CatalogueItem } from '@/app/lib/catalogue-data'
import Button from '../ui/Button'
import { FiDownload } from 'react-icons/fi'

interface QuoteItem extends CatalogueItem {
  quantity: number
}

export default function CataloguePageClient() {
  const [viewMode, setViewMode] = useState<ViewMode>('flipbook')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([])
  const [isQuoteSidebarOpen, setIsQuoteSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories(prev =>
      checked ? [...prev, categoryId] : prev.filter(id => id !== categoryId)
    )
  }

  const handleSubcategoryChange = (subcategoryId: string, checked: boolean) => {
    setSelectedSubcategories(prev =>
      checked ? [...prev, subcategoryId] : prev.filter(id => id !== subcategoryId)
    )
  }

  const handleItemSelect = (itemId: string, checked: boolean) => {
    setSelectedItems(prev =>
      checked ? [...prev, itemId] : prev.filter(id => id !== itemId)
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(catalogueItems.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleAddToQuote = (items: CatalogueItem[]) => {
    const newItems: QuoteItem[] = items.map(item => ({
      ...item,
      quantity: item.minOrderQuantity,
    }))

    setQuoteItems(prev => {
      const merged = [...prev]
      newItems.forEach(newItem => {
        const existing = merged.find(i => i.id === newItem.id)
        if (existing) {
          existing.quantity = Math.max(existing.quantity, newItem.minOrderQuantity)
        } else {
          merged.push(newItem)
        }
      })
      return merged
    })

    setIsQuoteSidebarOpen(true)
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setQuoteItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const handleRemoveItem = (itemId: string) => {
    setQuoteItems(prev => prev.filter(item => item.id !== itemId))
    if (quoteItems.length === 1) {
      setIsQuoteSidebarOpen(false)
    }
  }

  const handleSubmitQuote = async (formData: QuoteFormData) => {
    console.log('Quote submitted:', { items: quoteItems, formData })
    alert('Quote request submitted successfully! Our team will contact you shortly.')
    setQuoteItems([])
    setIsQuoteSidebarOpen(false)
  }

  const filteredItems = useMemo(() => {
    return catalogueItems.filter(item => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        )
      }

      if (selectedCategories.length > 0 || selectedSubcategories.length > 0) {
        const categoryMatch =
          selectedCategories.length === 0 ||
          selectedCategories.includes(item.category)

        const subcategoryMatch =
          selectedSubcategories.length === 0 ||
          selectedSubcategories.includes(item.subcategory)

        return categoryMatch && subcategoryMatch
      }

      return true
    })
  }, [searchQuery, selectedCategories, selectedSubcategories])

  return (
    <>
      <CatalogueHeader onSearch={setSearchQuery} />

      <Container className="py-8">
        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <CategoryTree
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              selectedSubcategories={selectedSubcategories}
              onSubcategoryChange={handleSubcategoryChange}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {viewMode === 'flipbook' && (
              <FlipbookView onAddToQuote={handleAddToQuote} />
            )}

            {viewMode === 'list' && (
              <ListView
                selectedItems={selectedItems}
                onItemSelect={handleItemSelect}
                onSelectAll={handleSelectAll}
                onAddToQuote={handleAddToQuote}
              />
            )}

            {viewMode === 'pdf' && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-[var(--dark-text)] dark:text-[var(--light-text)] mb-4">
                  Download Full Catalogue
                </h3>

                <p className="text-[var(--soft-gray)] dark:text-[var(--light-text)] mb-8">
                  Get the complete 2024 catalogue as a PDF file
                </p>

                <Button size="lg">
                  <FiDownload className="w-5 h-5 mr-2" />
                  Download PDF (24MB)
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Quick Quote Sidebar */}
      <QuickQuoteSidebar
        isOpen={isQuoteSidebarOpen}
        onClose={() => setIsQuoteSidebarOpen(false)}
        items={quoteItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onSubmit={handleSubmitQuote}
      />
    </>
  )
}