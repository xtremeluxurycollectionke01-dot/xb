'use client'

import { FiDownload, FiFileText, FiStar } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { type Product, type Review } from '@/app/lib/products-data'
import Tabs, { type TabItem } from '../ui/Tabs'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

interface ProductTabsProps {
  product: Product
}

export default function ProductTabs({ product }: ProductTabsProps) {
  // Description Tab
  const DescriptionTab = () => (
    <div className="prose max-w-none dark:prose-invert">
      {product.fullDescription ? (
        <div dangerouslySetInnerHTML={{ __html: product.fullDescription }} />
      ) : (
        <p>{product.description}</p>
      )}
    </div>
  )

  // Specifications Tab
  const SpecificationsTab = () => (
    <div className="space-y-6">
      <table className="w-full">
        <tbody className="divide-y divide-card-border">
          {Object.entries(product.specifications).map(([key, value]) => (
            <tr key={key}>
              <td className="py-3 text-sm font-medium text-gray-600 dark:text-gray-400 w-1/3">
                {key}
              </td>
              <td className="py-3 text-sm text-dark-text">
                {value}
              </td>
            </tr>
          ))}
          <tr>
            <td className="py-3 text-sm font-medium text-gray-600">SKU</td>
            <td className="py-3 text-sm text-dark-text">{product.sku}</td>
          </tr>
          <tr>
            <td className="py-3 text-sm font-medium text-gray-600">Category</td>
            <td className="py-3 text-sm text-dark-text">{product.category}</td>
          </tr>
          <tr>
            <td className="py-3 text-sm font-medium text-gray-600">Brand</td>
            <td className="py-3 text-sm text-dark-text">{product.brand}</td>
          </tr>
          <tr>
            <td className="py-3 text-sm font-medium text-gray-600">Unit</td>
            <td className="py-3 text-sm text-dark-text">{product.unit}</td>
          </tr>
          <tr>
            <td className="py-3 text-sm font-medium text-gray-600">Min. Order</td>
            <td className="py-3 text-sm text-dark-text">{product.minOrderQuantity}</td>
          </tr>
        </tbody>
      </table>

      {/* Bulk Pricing */}
      {product.bulkPricing && product.bulkPricing.length > 0 && (
        <div>
          <h4 className="font-medium text-dark-text mb-3">Bulk Pricing</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {product.bulkPricing.map((tier, index) => (
              <div key={index} className="bg-soft-gray p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Buy {tier.quantity}+</p>
                <p className="text-lg font-bold text-brand-600">KES {tier.price}</p>
                <p className="text-xs text-gray-500">per {product.unit}</p>
                {tier.price < product.price && (
                  <Badge variant="success" className="mt-2">
                    Save {Math.round((1 - tier.price / product.price) * 100)}%
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // Downloads Tab
  const DownloadsTab = () => (
    <div className="space-y-4">
      {product.downloads && product.downloads.length > 0 ? (
        product.downloads.map((download, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-soft-gray rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FiFileText className="w-8 h-8 text-brand-600" />
              <div>
                <h4 className="font-medium text-dark-text">{download.name}</h4>
                <p className="text-sm text-gray-500">
                  {download.fileType} • {download.fileSize}
                </p>
              </div>
            </div>
            {/*<Button variant="outline" size="sm" as="a" href={download.url} download>
              <FiDownload className="w-4 h-4 mr-2" />
              Download
            </Button>*/}
            <a href={download.url} download>
            <Button variant="outline" size="sm">
                <FiDownload className="w-4 h-4 mr-2" />
                Download
            </Button>
            </a>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-8">No downloads available</p>
      )}
    </div>
  )

  // Reviews Tab
  const ReviewsTab = () => (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="flex items-start gap-8 p-6 bg-soft-gray rounded-lg">
        <div className="text-center">
          <div className="text-4xl font-bold text-dark-text">{product.rating}</div>
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={cn(
                  'w-4 h-4',
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                )}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">{product.reviewCount} reviews</p>
        </div>

        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = product.reviews?.filter(r => Math.floor(r.rating) === rating).length || 0
            const percentage = product.reviews ? (count / product.reviews.length) * 100 : 0
            
            return (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-12 text-gray-600">{rating} stars</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-12 text-gray-500">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Write Review Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-dark-text">Customer Reviews</h3>
        <Button variant="outline">Write a Review</Button>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No reviews yet</p>
        )}
      </div>
    </div>
  )

  const tabs: TabItem[] = [
    {
      id: 'description',
      label: 'Description',
      content: <DescriptionTab />,
    },
    {
      id: 'specifications',
      label: 'Specifications',
      content: <SpecificationsTab />,
    },
    {
      id: 'downloads',
      label: 'Downloads',
      content: <DownloadsTab />,
      badge: product.downloads?.length,
    },
    {
      id: 'reviews',
      label: 'Reviews',
      content: <ReviewsTab />,
      badge: product.reviewCount,
    },
  ]

  return <Tabs tabs={tabs} defaultTab="description" />
}

// Review Card Component
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border-b border-card-border last:border-0 pb-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {review.userAvatar ? (
            <img
              src={review.userAvatar}
              alt={review.userName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
              <span className="text-brand-600 font-medium">
                {review.userName.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h4 className="font-medium text-dark-text">{review.userName}</h4>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={cn(
                      'w-3 h-3',
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">
                {new Date(review.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
        {review.verified && (
          <Badge variant="success">Verified Purchase</Badge>
        )}
      </div>
      <h5 className="font-medium text-dark-text mb-2">{review.title}</h5>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        {review.comment}
      </p>
    </div>
  )
}