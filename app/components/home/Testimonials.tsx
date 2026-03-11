/*'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi'
import Container from '../layout/Container'
import SectionHeading from '../ui/SectionHeading'
import Card from '../ui/Card'
import { cn } from '@/app/lib/utils'

const testimonials = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'Lab Director, Nairobi University',
    content: 'LabPro has been our trusted supplier for over 5 years. Their equipment quality and after-sales support are exceptional.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108777-385ef6eebf7b?w=200',
  },
  {
    id: 2,
    name: 'Prof. James Mwangi',
    role: 'Chemistry Dept., Strathmore',
    content: 'The fastest delivery of chemicals and reagents in the city. Their team understands the urgency of lab supplies.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  },
  {
    id: 3,
    name: 'Emily Akinyi',
    role: 'Lab Technician, Kenyatta Hospital',
    content: 'Great variety of glassware and plasticware. Always get exactly what I need at competitive prices.',
    rating: 4,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
  },
  {
    id: 4,
    name: 'Michael Ochieng',
    role: 'Procurement, Maseno University',
    content: 'Their quotation process for large projects is seamless. Highly recommended for institutional supplies.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % (testimonials.length - 2))
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length - 2) % (testimonials.length - 2))
  }

  return (
    <section className="section-padding bg-soft-gray">
      <Container>
        <SectionHeading
          title="What Our Clients Say"
          subtitle="Trusted by leading institutions across the country"
        />

        <div className="relative">
          {/* Testimonials Grid *
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(currentIndex, currentIndex + 3).map((testimonial) => (
              <Card key={testimonial.id} className="p-6">
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-text">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>

                <p className="text-gray-700 dark:text-gray-300 italic">
                  "{testimonial.content}"
                </p>
              </Card>
            ))}
          </div>

          {/* Navigation Arrows *
          <button
            onClick={prev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <FiChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={next}
            className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <FiChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </Container>
    </section>
  )
}*/

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight, FiStar, FiUser } from 'react-icons/fi'
import Container from '../layout/Container'
import SectionHeading from '../ui/SectionHeading'
import Card from '../ui/Card'
import { cn } from '@/app/lib/utils'

const testimonials = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'Lab Director, Nairobi University',
    content: 'LabPro has been our trusted supplier for over 5 years. Their equipment quality and after-sales support are exceptional.',
    rating: 5,
    image: 'https://images.nsplash.com/photo-1494790108777-385ef6eebf7b?w=200',
  },
  {
    id: 2,
    name: 'Prof. James Mwangi',
    role: 'Chemistry Dept., Strathmore',
    content: 'The fastest delivery of chemicals and reagents in the city. Their team understands the urgency of lab supplies.',
    rating: 5,
    image: 'https://images.nsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  },
  {
    id: 3,
    name: 'Emily Akinyi',
    role: 'Lab Technician, Kenyatta Hospital',
    content: 'Great variety of glassware and plasticware. Always get exactly what I need at competitive prices.',
    rating: 4,
    image: 'https://images.nsplash.com/photo-1438761681033-6461ffad8d80?w=200',
  },
  {
    id: 4,
    name: 'Michael Ochieng',
    role: 'Procurement, Maseno University',
    content: 'Their quotation process for large projects is seamless. Highly recommended for institutional supplies.',
    rating: 5,
    image: 'https://images.nsplash.com/photo-1500648767791-00dcc994a43e?w=200',
  },
]

// Avatar component with error handling
function Avatar({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false)
  const placeholderImage = '/images/placeholder.png'
  const imageSrc = imageError ? placeholderImage : src

  return (
    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[var(--soft-gray)] flex-shrink-0">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="48px"
        className={cn(
          'transition-all duration-300',
          imageError ? 'object-contain p-2 opacity-60' : 'object-cover'
        )}
        onError={() => {
          console.log(`Avatar failed for ${alt}, switching to placeholder`)
          setImageError(true)
        }}
        unoptimized={imageError}
      />
      
      {/* Fallback icon */}
      {/*{imageError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <FiUser className="w-6 h-6 text-[var(--card-border)]" />
        </div>
      )}*/}
    </div>
  )
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % (testimonials.length - 2))
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length - 2) % (testimonials.length - 2))
  }

  return (
    <section className="section-padding bg-[var(--soft-gray)]">
      <Container>
        <SectionHeading
          title="What Our Clients Say"
          subtitle="Trusted by leading institutions across the country"
        />

        <div className="relative">
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(currentIndex, currentIndex + 3).map((testimonial) => (
              <Card key={testimonial.id} className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar src={testimonial.image} alt={testimonial.name} />
                  <div className="ml-4">
                    <h4 className="font-semibold text-[var(--dark-text)]">{testimonial.name}</h4>
                    <p className="text-sm text-[var(--card-border)]">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>

                <p className="text-[var(--dark-text)] dark:text-[var(--light-text)] italic">
                  "{testimonial.content}"
                </p>
              </Card>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 bg-[var(--white)] dark:bg-[var(--brand-800)] p-2 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <FiChevronLeft className="w-5 h-5 text-[var(--dark-text)] dark:text-[var(--light-text)]" />
          </button>
          <button
            onClick={next}
            className="absolute -right-4 top-1/2 -translate-y-1/2 bg-[var(--white)] dark:bg-[var(--brand-800)] p-2 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <FiChevronRight className="w-5 h-5 text-[var(--dark-text)] dark:text-[var(--light-text)]" />
          </button>
        </div>
      </Container>
    </section>
  )
}