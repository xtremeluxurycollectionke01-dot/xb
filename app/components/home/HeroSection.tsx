'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Button from '../ui/Button'
import Container from '../layout/Container'
import { cn } from '@/app/lib/utils'

const slides = [
  {
    id: 1,
    title: 'Your Office & Scientific Supplies Partner',
    description: 'Complete laboratory solutions from equipment to reagents',
    image: 'https://images.unsplash.com/photo-1572884267966-02340ebc90ac?w=1200&auto=format&fit=crop',
    cta: 'Shop Now',
    cta2: 'Request Quote',
  },
  {
    id: 2,
    title: 'Premium Laboratory Equipment',
    description: 'High-quality apparatus for research and education',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200',
    cta: 'Explore Equipment',
    cta2: 'Get Quote',
  },
  {
    id: 3,
    title: 'Same-Day Delivery Available',
    description: 'Fast delivery of chemicals and consumables',
    image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1200',
    cta: 'Order Now',
    cta2: 'Contact Sales',
  },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative h-screen min-h-[600px] max-h-[800px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          )}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Content */}
          <Container className="relative h-full flex items-center">
            <div className="max-w-3xl text-white animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-200">
                {slide.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="min-w-[200px]">
                  {slide.cta}
                </Button>
                <Button variant="secondary" size="lg" className="min-w-[200px]">
                  {slide.cta2}
                </Button>
              </div>
            </div>
          </Container>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              index === currentSlide
                ? 'w-8 bg-white'
                : 'bg-white/50 hover:bg-white/75'
            )}
          />
        ))}
      </div>
    </section>
  )
}