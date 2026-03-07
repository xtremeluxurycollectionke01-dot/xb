'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight, FiMaximize2 } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import Container from '../layout/Container'
import SectionHeading from '../ui/SectionHeading'
import Card from '../ui/Card'
import Modal from '../ui/Modal'

const facilities = [
  {
    title: 'Main Warehouse (Nairobi)',
    image: 'https://images.unsplash.com/photo-1586528116311-1861cdf4c2f9?w=800',
    description: '10,000 sq ft facility with modern inventory management',
  },
  {
    title: 'Showroom & Retail Shop',
    image: 'https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800',
    description: 'Visit us to see products firsthand',
  },
  {
    title: 'Delivery Fleet',
    image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800',
    description: '20+ vehicles ensuring timely deliveries',
  },
  {
    title: 'Chemical Storage',
    image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800',
    description: 'Temperature-controlled for sensitive materials',
  },
]

const stats = [
  { label: 'Warehouse Space', value: '10,000', unit: 'sq ft' },
  { label: 'Temperature-Controlled', value: '2,000', unit: 'sq ft' },
  { label: 'Delivery Vehicles', value: '20+' },
  { label: 'SKUs in Stock', value: '50,000+' },
]

export default function Facilities() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % facilities.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + facilities.length) % facilities.length)
  }

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    setShowLightbox(true)
  }

  return (
    <section className="section-padding">
      <Container>
        <SectionHeading
          title="Our Facilities"
          subtitle="State-of-the-art infrastructure to serve you better"
        />

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4 text-center">
              <div className="text-2xl font-bold text-[var(--brand-600)]">
                {stat.value} {stat.unit}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>

        {/* Gallery Slider */}
        <div className="relative">
          <div className="overflow-hidden rounded-xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {facilities.map((facility, index) => (
                <div key={facility.title} className="w-full flex-shrink-0">
                  <div className="relative aspect-video">
                    <Image
                      src={facility.image}
                      alt={facility.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    
                    {/* Caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-xl font-bold mb-2">{facility.title}</h3>
                      <p className="text-white/90">{facility.description}</p>
                    </div>

                    {/* Expand Button */}
                    <button
                      onClick={() => openLightbox(index)}
                      className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    >
                      <FiMaximize2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {facilities.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  currentIndex === index
                    ? 'w-6 bg-[var(--brand-500)]'
                    : 'bg-gray-300 hover:bg-gray-400'
                )}
              />
            ))}
          </div>
        </div>
      </Container>

      {/* Lightbox Modal */}
      <Modal
        isOpen={showLightbox}
        onClose={() => setShowLightbox(false)}
        size="xl"
      >
        <div className="relative">
          <Image
            src={facilities[selectedImage].image}
            alt={facilities[selectedImage].title}
            width={1200}
            height={800}
            className="w-full h-auto rounded-lg"
          />
          <div className="mt-4">
            <h3 className="text-xl font-bold text-[var(--dark-text)] mb-2">
              {facilities[selectedImage].title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {facilities[selectedImage].description}
            </p>
          </div>
        </div>
      </Modal>
    </section>
  )
}