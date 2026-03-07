/*'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut, FiDownload, FiShoppingCart } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { flipbookPages, type CatalogueItem } from '@/app/lib/catalogue-data'
import Card from '../ui/Card'
import Button from '../ui/Button'

interface FlipbookViewProps {
  //onAddToQuote: (item: CatalogueItem) => void
  onAddToQuote: (items: CatalogueItem[]) => void
}

export default function FlipbookView({ onAddToQuote }: FlipbookViewProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [isTwoPageView, setIsTwoPageView] = useState(true)

  const totalPages = flipbookPages.length
  const currentPageData = flipbookPages[currentPage]
  const nextPageData = isTwoPageView && currentPage + 1 < totalPages 
    ? flipbookPages[currentPage + 1] 
    : null

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(0, prev - (isTwoPageView ? 2 : 1)))
  }

  const handleNext = () => {
    setCurrentPage(prev => 
      Math.min(totalPages - (isTwoPageView ? 2 : 1), prev + (isTwoPageView ? 2 : 1))
    )
  }

  const handleZoomIn = () => setZoom(prev => Math.min(2, prev + 0.25))
  const handleZoomOut = () => setZoom(prev => Math.max(0.5, prev - 0.25))

  return (
    <div className="space-y-4">
      {/* Flipbook Controls *
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg p-4 border border-card-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
          >
            <FiZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 2}
          >
            <FiZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsTwoPageView(!isTwoPageView)}
            className={cn(
              'px-3 py-1 text-sm rounded-md transition-colors',
              isTwoPageView 
                ? 'bg-brand-500 text-white' 
                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
            )}
          >
            Two Page View
          </button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 0}
            >
              <FiChevronLeft className="w-4 h-4" />
            </Button>
            
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage + 1} {isTwoPageView && nextPageData && `- ${currentPage + 2}`} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage >= totalPages - (isTwoPageView ? 2 : 1)}
            >
              <FiChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Flipbook Pages *
      <div 
        className={cn(
          'flex gap-4 overflow-hidden transition-all',
          isTwoPageView ? 'flex-row' : 'justify-center'
        )}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        {/* Current Page *
        <div className={cn(
          'bg-white rounded-lg shadow-lg overflow-hidden',
          isTwoPageView ? 'w-1/2' : 'w-full max-w-3xl'
        )}>
          <div className="relative aspect-[3/4]">
            <Image
              src={currentPageData.imageUrl}
              alt={`Catalogue page ${currentPage + 1}`}
              fill
              className="object-cover"
            />
            
            {/* Interactive items overlay *
            <div className="absolute inset-0">
              {currentPageData.items.map((item) => (
                <button
                  key={item.id}
                  className="absolute group"
                  style={{
                    // These would be dynamically positioned based on actual page layout
                    top: '20%',
                    left: '30%',
                  }}
                  onClick={() => onAddToQuote([item])}
                >
                  <div className="relative">
                    <div className="w-6 h-6 bg-brand-500 rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-transform" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                      <Card className="p-2 whitespace-nowrap">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">KES {item.price}</p>
                      </Card>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-slate-900 flex justify-between items-center">
            <span className="text-sm text-gray-600">Page {currentPage + 1}</span>
            <Button variant="ghost" size="sm">
              <FiDownload className="w-4 h-4 mr-2" />
              Download Page
            </Button>
          </div>
        </div>

        {/* Next Page (if in two-page view) *
        {isTwoPageView && nextPageData && (
          <div className="w-1/2 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative aspect-[3/4]">
              <Image
                src={nextPageData.imageUrl}
                alt={`Catalogue page ${currentPage + 2}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3 bg-gray-50 dark:bg-slate-900 flex justify-between items-center">
              <span className="text-sm text-gray-600">Page {currentPage + 2}</span>
              <Button variant="ghost" size="sm">
                <FiDownload className="w-4 h-4 mr-2" />
                Download Page
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Page Items List *
      <Card className="p-4">
        <h4 className="font-medium text-dark-text mb-3">Items on this page</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentPageData.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-md">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">KES {item.price}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddToQuote([item])}
                className="text-brand-600"
              >
                <FiShoppingCart className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}*/

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut, FiDownload, FiShoppingCart } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { flipbookPages, type CatalogueItem } from '@/app/lib/catalogue-data'
import Card from '../ui/Card'
import Button from '../ui/Button'

interface FlipbookViewProps {
  onAddToQuote: (items: CatalogueItem[]) => void
}

export default function FlipbookView({ onAddToQuote }: FlipbookViewProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [isTwoPageView, setIsTwoPageView] = useState(true)

  const totalPages = flipbookPages.length
  const currentPageData = flipbookPages[currentPage]
  const nextPageData = isTwoPageView && currentPage + 1 < totalPages 
    ? flipbookPages[currentPage + 1] 
    : null

  const handlePrevious = () => setCurrentPage(prev => Math.max(0, prev - (isTwoPageView ? 2 : 1)))
  const handleNext = () => setCurrentPage(prev => Math.min(totalPages - (isTwoPageView ? 2 : 1), prev + (isTwoPageView ? 2 : 1)))
  const handleZoomIn = () => setZoom(prev => Math.min(2, prev + 0.25))
  const handleZoomOut = () => setZoom(prev => Math.max(0.5, prev - 0.25))

  return (
    <div className="space-y-4">
      {/* Flipbook Controls */}
      <div className="flex items-center justify-between bg-[var(--white)] dark:bg-[var(--dark-bg)] rounded-lg p-4 border border-[var(--card-border)]">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 0.5}>
            <FiZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-[var(--soft-gray)] dark:text-[var(--light-text)] min-w-[60px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 2}>
            <FiZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsTwoPageView(!isTwoPageView)}
            className={cn(
              'px-3 py-1 text-sm rounded-md transition-colors',
              isTwoPageView 
                ? 'bg-[var(--brand-500)] text-[var(--white)]'
                : 'bg-[var(--soft-gray)] dark:bg-[var(--card-border)] text-[var(--dark-text)] dark:text-[var(--light-text)]'
            )}
          >
            Two Page View
          </button>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePrevious} disabled={currentPage === 0}>
              <FiChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-[var(--soft-gray)] dark:text-[var(--light-text)]">
              Page {currentPage + 1} {isTwoPageView && nextPageData && `- ${currentPage + 2}`} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage >= totalPages - (isTwoPageView ? 2 : 1)}
            >
              <FiChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Flipbook Pages */}
      <div
        className={cn('flex gap-4 overflow-hidden transition-all', isTwoPageView ? 'flex-row' : 'justify-center')}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
      >
        {/* Current Page */}
        <div className={cn('rounded-lg shadow-lg overflow-hidden', isTwoPageView ? 'w-1/2 bg-[var(--white)] dark:bg-[var(--dark-bg)]' : 'w-full max-w-3xl')}>
          <div className="relative aspect-[3/4]">
            <Image src={currentPageData.imageUrl} alt={`Catalogue page ${currentPage + 1}`} fill className="object-cover" />
            <div className="absolute inset-0">
              {currentPageData.items.map((item) => (
                <button
                  key={item.id}
                  className="absolute group"
                  style={{ top: '20%', left: '30%' }}
                  onClick={() => onAddToQuote([item])}
                >
                  <div className="relative">
                    <div className="w-6 h-6 bg-[var(--brand-500)] rounded-full border-2 border-[var(--white)] shadow-lg group-hover:scale-110 transition-transform" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                      <Card className="p-2 whitespace-nowrap">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-[var(--soft-gray)] dark:text-[var(--light-text)]">KES {item.price}</p>
                      </Card>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="p-3 bg-[var(--soft-gray)] dark:bg-[var(--card-border)] flex justify-between items-center">
            <span className="text-sm text-[var(--dark-text)] dark:text-[var(--light-text)]">Page {currentPage + 1}</span>
            <Button variant="ghost" size="sm">
              <FiDownload className="w-4 h-4 mr-2" />
              Download Page
            </Button>
          </div>
        </div>

        {/* Next Page */}
        {isTwoPageView && nextPageData && (
          <div className="w-1/2 bg-[var(--white)] dark:bg-[var(--dark-bg)] rounded-lg shadow-lg overflow-hidden">
            <div className="relative aspect-[3/4]">
              <Image src={nextPageData.imageUrl} alt={`Catalogue page ${currentPage + 2}`} fill className="object-cover" />
            </div>
            <div className="p-3 bg-[var(--soft-gray)] dark:bg-[var(--card-border)] flex justify-between items-center">
              <span className="text-sm text-[var(--dark-text)] dark:text-[var(--light-text)]">Page {currentPage + 2}</span>
              <Button variant="ghost" size="sm">
                <FiDownload className="w-4 h-4 mr-2" />
                Download Page
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Page Items List */}
      <Card className="p-4">
        <h4 className="font-medium text-[var(--dark-text)] mb-3">Items on this page</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentPageData.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2 hover:bg-[var(--soft-gray)] dark:hover:bg-[var(--card-border)] rounded-md"
            >
              <div>
                <p className="text-sm font-medium text-[var(--dark-text)] dark:text-[var(--light-text)]">{item.name}</p>
                <p className="text-xs text-[var(--soft-gray)] dark:text-[var(--light-text)]">KES {item.price}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => onAddToQuote([item])} className="text-[var(--brand-500)]">
                <FiShoppingCart className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}