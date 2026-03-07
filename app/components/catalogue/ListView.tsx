/*'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiChevronDown, FiChevronUp, FiShoppingCart, FiInfo } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { catalogueItems, type CatalogueItem } from '@/app/lib/catalogue-data'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Checkbox from '../ui/Checkbox'
import Badge from '../ui/Badge'
import React from 'react'

interface ListViewProps {
  selectedItems: string[]
  onItemSelect: (itemId: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onAddToQuote: (items: CatalogueItem[]) => void
}

type SortField = 'name' | 'price' | 'sku'
type SortOrder = 'asc' | 'desc'

export default function ListView({ 
  selectedItems, 
  onItemSelect, 
  onSelectAll,
  onAddToQuote 
}: ListViewProps) {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [expandedRows, setExpandedRows] = useState<string[]>([])

  const toggleRow = (itemId: string) => {
    setExpandedRows(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const sortedItems = [...catalogueItems].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1
    
    if (sortField === 'name') {
      return multiplier * a.name.localeCompare(b.name)
    } else if (sortField === 'price') {
      return multiplier * (a.price - b.price)
    } else {
      return multiplier * a.sku.localeCompare(b.sku)
    }
  })

  const allSelected = selectedItems.length === catalogueItems.length
  const someSelected = selectedItems.length > 0 && !allSelected

  return (
    <div className="space-y-4">
      {/* List Controls *
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Checkbox
              id="select-all"
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
              label={`Select All (${selectedItems.length} selected)`}
            />
            
            {selectedItems.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const items = catalogueItems.filter(item => 
                    selectedItems.includes(item.id)
                  )
                  onAddToQuote(items)
                }}
              >
                Request Quote for Selected ({selectedItems.length})
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-600">Sort by:</span>
            <button
              onClick={() => handleSort('name')}
              className={cn(
                'px-3 py-1 rounded-md flex items-center',
                sortField === 'name' 
                  ? 'bg-brand-50 text-brand-600' 
                  : 'hover:bg-gray-100'
              )}
            >
              Name
              {sortField === 'name' && (
                sortOrder === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
              )}
            </button>
            <button
              onClick={() => handleSort('price')}
              className={cn(
                'px-3 py-1 rounded-md flex items-center',
                sortField === 'price' 
                  ? 'bg-brand-50 text-brand-600' 
                  : 'hover:bg-gray-100'
              )}
            >
              Price
              {sortField === 'price' && (
                sortOrder === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
              )}
            </button>
            <button
              onClick={() => handleSort('sku')}
              className={cn(
                'px-3 py-1 rounded-md flex items-center',
                sortField === 'sku' 
                  ? 'bg-brand-50 text-brand-600' 
                  : 'hover:bg-gray-100'
              )}
            >
              SKU
              {sortField === 'sku' && (
                sortOrder === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
              )}
            </button>
          </div>
        </div>
      </Card>

      {/* List Table *
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-900">
              <tr>
                <th className="w-12 px-4 py-3"></th>
                <th className="w-20 px-4 py-3"></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MOQ
                </th>
                <th className="w-20 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {sortedItems.map((item) => (
                <React.Fragment key={item.id}>
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                    <td className="px-4 py-3">
                      <Checkbox
                        id={`item-${item.id}`}
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => onItemSelect(item.id, e.target.checked)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                          src={item.image || '/placeholder.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-dark-text">{item.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.sku}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-dark-text">KES {item.price}</p>
                        <p className="text-xs text-gray-500">per {item.unit}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.inStock ? (
                        <Badge variant="success">In Stock</Badge>
                      ) : (
                        <Badge variant="danger">Out of Stock</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.minOrderQuantity}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleRow(item.id)}
                          className="text-gray-400 hover:text-brand-600"
                        >
                          <FiInfo className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onAddToQuote([item])}
                          className="text-brand-600 hover:text-brand-700"
                        >
                          <FiShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Expanded Row - Bulk Pricing *
                  {expandedRows.includes(item.id) && (
                    <tr className="bg-gray-50 dark:bg-slate-900">
                      <td colSpan={8} className="px-4 py-3">
                        <div className="text-sm">
                          <p className="font-medium mb-2">Bulk Pricing Tiers:</p>
                          <div className="flex space-x-4">
                            {item.bulkPricing.map((tier, index) => (
                              <div key={index} className="bg-white dark:bg-slate-800 px-3 py-2 rounded-md shadow-sm">
                                <p className="text-xs text-gray-500">{tier.quantity}+ {item.unit}s</p>
                                <p className="text-sm font-medium text-brand-600">KES {tier.price}</p>
                                <p className="text-xs text-gray-500">Save {Math.round((1 - tier.price/item.price) * 100)}%</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
               </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination *
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing 1-{sortedItems.length} of {catalogueItems.length} products
        </p>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="primary" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  )
}*/

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiChevronDown, FiChevronUp, FiShoppingCart, FiInfo } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { catalogueItems, type CatalogueItem } from '@/app/lib/catalogue-data'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Checkbox from '../ui/Checkbox'
import Badge from '../ui/Badge'
import React from 'react'

interface ListViewProps {
  selectedItems: string[]
  onItemSelect: (itemId: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onAddToQuote: (items: CatalogueItem[]) => void
}

type SortField = 'name' | 'price' | 'sku'
type SortOrder = 'asc' | 'desc'

export default function ListView({ 
  selectedItems, 
  onItemSelect, 
  onSelectAll,
  onAddToQuote 
}: ListViewProps) {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [expandedRows, setExpandedRows] = useState<string[]>([])

  const toggleRow = (itemId: string) => {
    setExpandedRows(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const sortedItems = [...catalogueItems].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1
    if (sortField === 'name') return multiplier * a.name.localeCompare(b.name)
    if (sortField === 'price') return multiplier * (a.price - b.price)
    return multiplier * a.sku.localeCompare(b.sku)
  })

  const allSelected = selectedItems.length === catalogueItems.length
  const someSelected = selectedItems.length > 0 && !allSelected

  return (
    <div className="space-y-4">
      {/* List Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Checkbox
              id="select-all"
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(e) => onSelectAll(e.target.checked)}
              label={`Select All (${selectedItems.length} selected)`}
            />
            
            {selectedItems.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const items = catalogueItems.filter(item => 
                    selectedItems.includes(item.id)
                  )
                  onAddToQuote(items)
                }}
              >
                Request Quote for Selected ({selectedItems.length})
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <span className="text-[var(--dark-text)] dark:text-[var(--light-text)]">Sort by:</span>
            {(['name', 'price', 'sku'] as SortField[]).map((field) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={cn(
                  'px-3 py-1 rounded-md flex items-center',
                  sortField === field
                    ? 'bg-[var(--brand-50)] text-[var(--brand-500)] dark:text-[var(--brand-700)]'
                    : 'hover:bg-[var(--soft-gray)] dark:hover:bg-[var(--card-border)]'
                )}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {sortField === field && (
                  sortOrder === 'asc' ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />
                )}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* List Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--soft-gray)] dark:bg-[var(--card-border)]">
              <tr>
                <th className="w-12 px-4 py-3"></th>
                <th className="w-20 px-4 py-3"></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--dark-text)] dark:text-[var(--light-text)] uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--dark-text)] dark:text-[var(--light-text)] uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--dark-text)] dark:text-[var(--light-text)] uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--dark-text)] dark:text-[var(--light-text)] uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--dark-text)] dark:text-[var(--light-text)] uppercase tracking-wider">
                  MOQ
                </th>
                <th className="w-20 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y border-[var(--card-border)] dark:border-[var(--soft-gray)]">
              {sortedItems.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="hover:bg-[var(--soft-gray)] dark:hover:bg-[var(--card-border)]">
                    <td className="px-4 py-3">
                      <Checkbox
                        id={`item-${item.id}`}
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => onItemSelect(item.id, e.target.checked)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                        <Image
                          src={item.image || '/placeholder.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-[var(--dark-text)] dark:text-[var(--light-text)]">{item.name}</p>
                        <p className="text-xs text-[var(--soft-gray)] dark:text-[var(--card-border)] line-clamp-1">{item.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--dark-text)] dark:text-[var(--light-text)]">{item.sku}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-[var(--dark-text)] dark:text-[var(--light-text)]">KES {item.price}</p>
                      <p className="text-xs text-[var(--soft-gray)] dark:text-[var(--card-border)]">per {item.unit}</p>
                    </td>
                    <td className="px-4 py-3">
                      {item.inStock ? (
                        <Badge variant="success">{'In Stock'}</Badge>
                      ) : (
                        <Badge variant="danger">{'Out of Stock'}</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--dark-text)] dark:text-[var(--light-text)]">{item.minOrderQuantity}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleRow(item.id)}
                          className="text-[var(--soft-gray)] dark:text-[var(--card-border)] hover:text-[var(--brand-500)]"
                        >
                          <FiInfo className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onAddToQuote([item])}
                          className="text-[var(--brand-500)] hover:text-[var(--brand-700)]"
                        >
                          <FiShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row - Bulk Pricing */}
                  {expandedRows.includes(item.id) && (
                    <tr className="bg-[var(--soft-gray)] dark:bg-[var(--card-border)]">
                      <td colSpan={8} className="px-4 py-3">
                        <div className="text-sm">
                          <p className="font-medium mb-2 text-[var(--dark-text)] dark:text-[var(--light-text)]">Bulk Pricing Tiers:</p>
                          <div className="flex space-x-4">
                            {item.bulkPricing.map((tier, index) => (
                              <div key={index} className="bg-[var(--white)] dark:bg-[var(--dark-text)] px-3 py-2 rounded-md shadow-sm">
                                <p className="text-xs text-[var(--soft-gray)] dark:text-[var(--card-border)]">{tier.quantity}+ {item.unit}s</p>
                                <p className="text-sm font-medium text-[var(--brand-500)]">KES {tier.price}</p>
                                <p className="text-xs text-[var(--soft-gray)] dark:text-[var(--card-border)]">Save {Math.round((1 - tier.price/item.price) * 100)}%</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
               </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-[var(--dark-text)] dark:text-[var(--light-text)]">
          Showing 1-{sortedItems.length} of {catalogueItems.length} products
        </p>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="primary" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  )
}