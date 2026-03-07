/*'use client'

import { useState } from 'react'
import { FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { type CatalogueItem } from '@/app/lib/catalogue-data'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'

interface QuoteItem extends CatalogueItem {
  quantity: number
}

interface QuickQuoteSidebarProps {
  isOpen: boolean
  onClose: () => void
  items: QuoteItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onSubmit: (formData: QuoteFormData) => void
}

export interface QuoteFormData {
  name: string
  email: string
  phone: string
  institution: string
  deliveryAddress: string
  deliveryDate: string
  notes: string
  isUrgent: boolean
}

export default function QuickQuoteSidebar({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onSubmit,
}: QuickQuoteSidebarProps) {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    institution: '',
    deliveryAddress: '',
    deliveryDate: '',
    notes: '',
    isUrgent: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => {
    // Apply bulk pricing if applicable
    const applicableTier = item.bulkPricing
      .sort((a, b) => b.quantity - a.quantity)
      .find(tier => item.quantity >= tier.quantity)
    
    const price = applicableTier?.price || item.price
    return sum + (price * item.quantity)
  }, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    onSubmit(formData)
    setIsSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay *
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar *
      <div className={cn(
        "fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 z-50 shadow-xl",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header *
        <div className="flex items-center justify-between p-6 border-b border-card-border">
          <div>
            <h2 className="text-xl font-bold text-dark-text">Quick Quote</h2>
            <p className="text-sm text-gray-600 mt-1">{totalItems} items selected</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content *
        <div className="p-6 h-full overflow-y-auto pb-32">
          {/* Selected Items *
          {items.length > 0 ? (
            <div className="space-y-4 mb-6">
              <h3 className="font-medium text-dark-text">Selected Items</h3>
              {items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.sku}</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-400 hover:text-danger"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 rounded-md border border-card-border hover:bg-gray-100"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="w-12 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-md border border-card-border hover:bg-gray-100"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-brand-600">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                      {item.bulkPricing.some(tier => item.quantity >= tier.quantity) && (
                        <p className="text-xs text-green-600">Bulk discount applied</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              
              {/* Subtotal *
              <div className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Subtotal</span>
                  <span className="text-xl font-bold text-brand-600">
                    KES {subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No items selected</p>
              <p className="text-sm text-gray-400 mt-2">
                Select products from the catalogue to request a quote
              </p>
            </div>
          )}

          {/* Quote Form *
          {items.length > 0 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-medium text-dark-text">Your Details</h3>
              
              <Input
                label="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              
              <Input
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              
              <Input
                label="Phone Number *"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
              
              <Input
                label="Institution/Company"
                value={formData.institution}
                onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
              />
              
              <Input
                label="Delivery Address"
                value={formData.deliveryAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
              />
              
              <Input
                label="Preferred Delivery Date"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-dark-text">Additional Notes</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-card-border rounded-md"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="urgent"
                  className="w-4 h-4 text-brand-600 rounded border-card-border"
                  checked={formData.isUrgent}
                  onChange={(e) => setFormData(prev => ({ ...prev, isUrgent: e.target.checked }))}
                />
                <label htmlFor="urgent" className="ml-2 text-sm text-dark-text">
                  This is an urgent request
                </label>
              </div>
              
              <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                Our sales team will respond within 24 hours
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  )
}*/

'use client'

import { useState } from 'react'
import { FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { type CatalogueItem } from '@/app/lib/catalogue-data'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'

interface QuoteItem extends CatalogueItem {
  quantity: number
}

interface QuickQuoteSidebarProps {
  isOpen: boolean
  onClose: () => void
  items: QuoteItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onSubmit: (formData: QuoteFormData) => void
}

export interface QuoteFormData {
  name: string
  email: string
  phone: string
  institution: string
  deliveryAddress: string
  deliveryDate: string
  notes: string
  isUrgent: boolean
}

export default function QuickQuoteSidebar({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onSubmit,
}: QuickQuoteSidebarProps) {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    institution: '',
    deliveryAddress: '',
    deliveryDate: '',
    notes: '',
    isUrgent: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => {
    const applicableTier = item.bulkPricing
      .sort((a, b) => b.quantity - a.quantity)
      .find(tier => item.quantity >= tier.quantity)
    
    const price = applicableTier?.price || item.price
    return sum + price * item.quantity
  }, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    onSubmit(formData)
    setIsSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full max-w-md bg-[var(--white)] dark:bg-[var(--dark-bg)] z-50 shadow-xl transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)]">
          <div>
            <h2 className="text-xl font-bold text-[var(--dark-text)] dark:text-[var(--light-text)]">Quick Quote</h2>
            <p className="text-sm text-[var(--soft-gray)] dark:text-[var(--light-text)] mt-1">
              {totalItems} items selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--soft-gray)] dark:hover:bg-[var(--card-border)] rounded-full"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 h-full overflow-y-auto pb-32">
          {/* Selected Items */}
          {items.length > 0 ? (
            <div className="space-y-4 mb-6">
              <h3 className="font-medium text-[var(--dark-text)]">Selected Items</h3>
              {items.map(item => (
                <Card key={item.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-[var(--dark-text)]">{item.name}</p>
                      <p className="text-xs text-[var(--soft-gray)]">{item.sku}</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[var(--gray-400)] hover:text-[var(--danger)]"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 rounded-md border border-[var(--card-border)] hover:bg-[var(--soft-gray)]"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                      <span className="w-12 text-center text-sm text-[var(--dark-text)]">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-md border border-[var(--card-border)] hover:bg-[var(--soft-gray)]"
                      >
                        <FiPlus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[var(--brand-500)]">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </p>
                      {item.bulkPricing.some(tier => item.quantity >= tier.quantity) && (
                        <p className="text-xs text-[var(--success)]">Bulk discount applied</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              {/* Subtotal */}
              <div className="bg-[var(--brand-50)] dark:bg-[var(--brand-900)/20] p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-[var(--dark-text)] dark:text-[var(--light-text)]">Subtotal</span>
                  <span className="text-xl font-bold text-[var(--brand-500)]">
                    KES {subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[var(--soft-gray)]">No items selected</p>
              <p className="text-sm text-[var(--gray-400)] mt-2">
                Select products from the catalogue to request a quote
              </p>
            </div>
          )}

          {/* Quote Form */}
          {items.length > 0 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-medium text-[var(--dark-text)]">Your Details</h3>

              <Input
                label="Full Name *"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input
                label="Email *"
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <Input
                label="Phone Number *"
                type="tel"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
              <Input
                label="Institution/Company"
                value={formData.institution}
                onChange={e => setFormData(prev => ({ ...prev, institution: e.target.value }))}
              />
              <Input
                label="Delivery Address"
                value={formData.deliveryAddress}
                onChange={e => setFormData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
              />
              <Input
                label="Preferred Delivery Date"
                type="date"
                value={formData.deliveryDate}
                onChange={e => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--dark-text)]">Additional Notes</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 bg-[var(--white)] border border-[var(--card-border)] rounded-md dark:bg-[var(--dark-bg)] dark:text-[var(--light-text)]"
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="urgent"
                  className="w-4 h-4 text-[var(--brand-500)] rounded border-[var(--card-border)]"
                  checked={formData.isUrgent}
                  onChange={e => setFormData(prev => ({ ...prev, isUrgent: e.target.checked }))}
                />
                <label htmlFor="urgent" className="ml-2 text-sm text-[var(--dark-text)]">
                  This is an urgent request
                </label>
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
              </Button>

              <p className="text-xs text-[var(--soft-gray)] text-center">
                Our sales team will respond within 24 hours
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  )
}