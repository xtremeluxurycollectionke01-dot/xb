'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { FiCalendar } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import Container from '../layout/Container'
import SectionHeading from '../ui/SectionHeading'

const timelineEvents = [
  {
    year: '2010',
    title: 'Founded as small office supply shop',
    description: 'Started in Nairobi with a vision to provide quality workplace essentials.',
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600',
    icon: '🏪',
  },
  {
    year: '2015',
    title: 'Expanded to scientific & laboratory equipment',
    description: 'Recognized the growing need for quality lab supplies in educational institutions.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
    icon: '🔬',
  },
  {
    year: '2018',
    title: 'Launched B2B wholesale division',
    description: 'Opened new warehousing facility to serve bulk orders for institutions.',
    image: 'https://images.unsplash.com/photo-1586528116311-1861cdf4c2f9?w=600',
    icon: '🏭',
  },
  {
    year: '2022',
    title: 'Digital transformation - online platform',
    description: 'Launched our e-commerce platform for seamless ordering and instant quotations.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
    icon: '💻',
  },
  {
    year: '2026',
    title: 'Serving 5,000+ clients across East Africa',
    description: 'Now trusted by leading universities, hospitals, and businesses region-wide.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
    icon: '🌍',
  },
]

export default function JourneyTimeline() {
  const [activeIndex, setActiveIndex] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setActiveIndex(index)
          }
        })
      },
      { threshold: 0.5, rootMargin: '-100px 0px' }
    )

    const items = document.querySelectorAll('.timeline-item')
    items.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="section-padding bg-soft-gray">
      <Container>
        <SectionHeading
          title="Our Journey"
          subtitle="Fifteen years of growth, innovation, and service excellence"
        />

        {/* Desktop Timeline */}
        <div className="hidden md:block relative" ref={timelineRef}>
          {/* Timeline Line */}
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-[var(--card-border)] -translate-y-1/2" />
          
          {/* Events */}
          <div className="relative flex justify-between">
            {timelineEvents.map((event, index) => (
              <div
                key={event.year}
                data-index={index}
                className="timeline-item relative w-48 text-center group cursor-pointer"
              >
                {/* Year Marker */}
                <div className={cn(
                  'relative z-10 w-12 h-12 mx-auto rounded-full flex items-center justify-center transition-all duration-300',
                  activeIndex === index 
                    ? 'bg-[var(--brand-500)] scale-110 shadow-lg' 
                    : 'bg-white border-2 border-[var(--card-border)]'
                )}>
                  <span className="text-2xl">{event.icon}</span>
                </div>

                {/* Year */}
                <div className="mt-4 font-bold text-[var(--brand-600)]">{event.year}</div>

                {/* Title (shown on hover) */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl border border-[var(--card-border)]">
                    <h4 className="font-semibold text-[var(--dark-text)] mb-2">{event.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline (Vertical) */}
        <div className="md:hidden space-y-8">
          {timelineEvents.map((event, index) => (
            <div key={event.year} className="relative pl-8">
              {/* Timeline Line */}
              {index < timelineEvents.length - 1 && (
                <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-[var(--card-border)]" />
              )}

              {/* Marker */}
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[var(--brand-500)] flex items-center justify-center">
                <span className="text-xs">{event.icon}</span>
              </div>

              {/* Content */}
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <FiCalendar className="w-4 h-4 text-[var(--brand-500)]" />
                  <span className="font-bold text-[var(--brand-600)]">{event.year}</span>
                </div>
                <h4 className="font-semibold text-[var(--dark-text)] mb-2">{event.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}