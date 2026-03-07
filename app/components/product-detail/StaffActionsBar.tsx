'use client'

import { useState } from 'react'
import { FiUser, FiPackage, FiDollarSign, FiEdit2, FiChevronDown } from 'react-icons/fi'
import { type Product } from '@/app/lib/products-data'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Modal from '../ui/Modal'

interface StaffActionsBarProps {
  product: Product
  isStaff?: boolean // This would come from auth context
}

export default function StaffActionsBar({ product, isStaff = false }: StaffActionsBarProps) {
  const [showStockModal, setShowStockModal] = useState(false)
  const [showPriceModal, setShowPriceModal] = useState(false)

  if (!isStaff) return null

  return (
    <>
      <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
              ⚡ Staff Actions
            </span>
            <Badge variant="info">Staff Only</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-brand-300 text-brand-700 hover:bg-brand-100"
            >
              <FiUser className="w-4 h-4 mr-2" />
              Create Order for Client
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-brand-300 text-brand-700 hover:bg-brand-100"
              onClick={() => setShowStockModal(true)}
            >
              <FiPackage className="w-4 h-4 mr-2" />
              Check Stock
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-brand-300 text-brand-700 hover:bg-brand-100"
              onClick={() => setShowPriceModal(true)}
            >
              <FiDollarSign className="w-4 h-4 mr-2" />
              View Cost Price
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-brand-300 text-brand-700 hover:bg-brand-100"
            >
              <FiEdit2 className="w-4 h-4 mr-2" />
              Edit Product
            </Button>
          </div>
        </div>
      </div>

      {/* Stock Details Modal */}
      <Modal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        title="Stock Information"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-soft-gray p-4 rounded-lg">
              <p className="text-sm text-gray-600">Current Stock</p>
              <p className="text-2xl font-bold text-dark-text">{product.stock}</p>
            </div>
            <div className="bg-soft-gray p-4 rounded-lg">
              <p className="text-sm text-gray-600">Reorder Point</p>
              <p className="text-2xl font-bold text-dark-text">{product.reorderPoint || 10}</p>
            </div>
            <div className="bg-soft-gray p-4 rounded-lg">
              <p className="text-sm text-gray-600">Status</p>
              <Badge 
                variant={product.stockStatus === 'in-stock' ? 'success' : 'warning'}
                className="mt-1"
              >
                {product.stockStatus}
              </Badge>
            </div>
            <div className="bg-soft-gray p-4 rounded-lg">
              <p className="text-sm text-gray-600">Min Order</p>
              <p className="text-2xl font-bold text-dark-text">{product.minOrderQuantity}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-dark-text mb-3">Suppliers</h4>
            <div className="space-y-3">
              {product.suppliers?.map((supplier, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-card-border rounded-lg">
                  <div>
                    <p className="font-medium">{supplier.name}</p>
                    <p className="text-sm text-gray-500">Lead time: {supplier.leadTime}</p>
                  </div>
                  <Badge variant="default">Min: {supplier.minimumOrder}</Badge>
                </div>
              ))}
            </div>
          </div>

          <Button fullWidth onClick={() => setShowStockModal(false)}>
            Close
          </Button>
        </div>
      </Modal>

      {/* Price Details Modal */}
      <Modal
        isOpen={showPriceModal}
        onClose={() => setShowPriceModal(false)}
        title="Price Information"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-soft-gray p-4 rounded-lg">
              <p className="text-sm text-gray-600">Retail Price</p>
              <p className="text-2xl font-bold text-dark-text">KES {product.price}</p>
            </div>
            <div className="bg-soft-gray p-4 rounded-lg">
              <p className="text-sm text-gray-600">Wholesale Price</p>
              <p className="text-2xl font-bold text-brand-600">
                KES {product.wholesalePrice || product.price * 0.85}
              </p>
            </div>
            <div className="bg-soft-gray p-4 rounded-lg">
              <p className="text-sm text-gray-600">Cost Price</p>
              <p className="text-2xl font-bold text-green-600">
                KES {product.costPrice || product.price * 0.7}
              </p>
            </div>
            <div className="bg-soft-gray p-4 rounded-lg">
              <p className="text-sm text-gray-600">Margin</p>
              <p className="text-2xl font-bold text-dark-text">
                {Math.round(((product.price - (product.costPrice || product.price * 0.7)) / product.price) * 100)}%
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-dark-text mb-3">Bulk Pricing Tiers</h4>
            <div className="space-y-2">
              {product.bulkPricing?.map((tier, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-card-border rounded-lg">
                  <span className="text-sm">Qty: {tier.quantity}+</span>
                  <span className="font-medium">KES {tier.price}</span>
                  <span className="text-sm text-green-600">
                    Margin: {Math.round(((tier.price - (product.costPrice || product.price * 0.7)) / tier.price) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Button fullWidth onClick={() => setShowPriceModal(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  )
}