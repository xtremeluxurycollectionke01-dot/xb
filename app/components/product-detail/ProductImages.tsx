'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiZoomIn, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import Modal from '../ui/Modal'

interface ProductImagesProps {
  images: string[]
  productName: string
}

export default function ProductImages({ images, productName }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showLightbox, setShowLightbox] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div
          className={cn(
            'relative aspect-square rounded-lg overflow-hidden bg-soft-gray cursor-crosshair',
            isZoomed && 'cursor-zoom-out'
          )}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <Image
            src={images[selectedImage]}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={cn(
              'object-cover transition-transform duration-200',
              isZoomed && 'scale-150'
            )}
            style={isZoomed ? {
              transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
            } : undefined}
            priority
          />

          {/* Zoom Indicator */}
          <button
            className="absolute bottom-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setShowLightbox(true)
            }}
          >
            <FiZoomIn className="w-5 h-5" />
          </button>

          {/* Navigation Arrows (for mobile) */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors md:hidden"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors md:hidden"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  'relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all',
                  selectedImage === index
                    ? 'border-brand-500'
                    : 'border-transparent hover:border-brand-300'
                )}
              >
                <Image
                  src={image}
                  alt={`${productName} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={showLightbox}
        onClose={() => setShowLightbox(false)}
        size="full"
      >
        <div className="relative h-full">
          {/* Close button */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>

          {/* Image container */}
          <div className="flex items-center justify-center h-full">
            <div className="relative w-full h-full max-h-[80vh]">
              <Image
                src={images[selectedImage]}
                alt={productName}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  'relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all',
                  selectedImage === index ? 'border-brand-500' : 'border-transparent'
                )}
              >
                <Image
                  src={image}
                  alt={`${productName} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  )
}