/*import Image from 'next/image'
import Link from 'next/link'
import { FiCalendar, FiArrowRight } from 'react-icons/fi'
import Container from '../layout/Container'
import SectionHeading from '../ui/SectionHeading'
import Card from '../ui/Card'
import Button from '../ui/Button'

const news = [
  {
    id: 1,
    title: 'New Digital Microscopes Arrived',
    excerpt: 'Check out our latest range of HD digital microscopes for research labs',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    category: 'Product Launch',
  },
  {
    id: 2,
    title: 'Holiday Delivery Schedule',
    excerpt: 'Updated delivery timings during the holiday season',
    date: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400',
    category: 'Announcement',
  },
  {
    id: 3,
    title: 'Lab Safety Training Workshop',
    excerpt: 'Join our free workshop on proper handling of chemicals',
    date: '2024-01-05',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
    category: 'Event',
  },
]

export default function NewsUpdates() {
  return (
    <section className="section-padding">
      <Container>
        <SectionHeading
          title="News & Updates"
          subtitle="Stay informed with the latest from LabPro"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <Card key={item.id} hoverable>
              <div className="relative aspect-video">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 bg-brand-500 text-white text-xs px-3 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                
                <h3 className="text-lg font-semibold text-dark-text mb-2">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {item.excerpt}
                </p>
                
                <Link
                  href={`/news/${item.id}`}
                  className="inline-flex items-center text-brand-600 font-medium hover:text-brand-700"
                >
                  Read More
                  <FiArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/news">
            <Button variant="outline" size="lg">
              View All Updates
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  )
}*/

/*'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FiCalendar, FiArrowRight } from 'react-icons/fi'
import Container from '../layout/Container'
import SectionHeading from '../ui/SectionHeading'
import Card from '../ui/Card'
import Button from '../ui/Button'

const news = [
  {
    id: 1,
    title: 'New Digital Microscopes Arrived',
    excerpt: 'Check out our latest range of HD digital microscopes for research labs',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    category: 'Product Launch',
  },
  {
    id: 2,
    title: 'Holiday Delivery Schedule',
    excerpt: 'Updated delivery timings during the holiday season',
    date: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400',
    category: 'Announcement',
  },
  {
    id: 3,
    title: 'Lab Safety Training Workshop',
    excerpt: 'Join our free workshop on proper handling of chemicals',
    date: '2024-01-05',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
    category: 'Event',
  },
]

export default function NewsUpdates() {
  return (
    <section className="section-padding bg-[var(--soft-gray)] dark:bg-[var(--dark-text)]">
      <Container>
        <SectionHeading
          title="News & Updates"
          subtitle="Stay informed with the latest from LabPro"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {news.map((item) => (
            <Card key={item.id} hoverable className="group">
              <div className="relative aspect-video">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover rounded-t-md"
                />
                <span className="absolute top-4 left-4 bg-[var(--brand-500)] text-white text-xs px-3 py-1 rounded-full">
                  {item.category}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <FiCalendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>

                <h3 className="text-lg font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)] mb-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {item.excerpt}
                </p>

                <Link
                  href={`/news/${item.id}`}
                  className="inline-flex items-center text-[var(--brand-600)] font-medium hover:text-[var(--brand-700)]"
                >
                  Read More
                  <FiArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/news">
            <Button variant="outline" size="lg">
              View All Updates
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  )
}*/

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiCalendar, FiArrowRight, FiImage } from 'react-icons/fi'
import Container from '../layout/Container'
import SectionHeading from '../ui/SectionHeading'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { cn } from '@/app/lib/utils'

const news = [
  {
    id: 1,
    title: 'New Digital Microscopes Arrived',
    excerpt: 'Check out our latest range of HD digital microscopes for research labs',
    date: '2024-01-15',
    image: 'https://images.nsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    category: 'Product Launch',
  },
  {
    id: 2,
    title: 'Holiday Delivery Schedule',
    excerpt: 'Updated delivery timings during the holiday season',
    date: '2024-01-10',
    image: 'https://images.nsplash.com/photo-1581091226033-d5c48150dbaa?w=400',
    category: 'Announcement',
  },
  {
    id: 3,
    title: 'Lab Safety Training Workshop',
    excerpt: 'Join our free workshop on proper handling of chemicals',
    date: '2024-01-05',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
    category: 'Event',
  },
]

// News image component with error handling
function NewsImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false)
  const placeholderImage = '/images/placeholder.png'
  const imageSrc = imageError ? placeholderImage : src

  return (
    <div className="relative aspect-video bg-[var(--soft-gray)] overflow-hidden">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          'transition-all duration-300',
          imageError ? 'object-contain p-8 opacity-60' : 'object-cover'
        )}
        onError={() => {
          console.log(`News image failed: ${alt}, switching to placeholder`)
          setImageError(true)
        }}
        unoptimized={imageError}
      />
      
      {/* Placeholder overlay */}
      {/*{imageError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <FiImage className="w-12 h-12 text-[var(--card-border)] mb-2" />
          <span className="text-sm text-[var(--card-border)]">Image not available</span>
        </div>
      )}*/}
    </div>
  )
}

export default function NewsUpdates() {
  return (
    <section className="section-padding bg-[var(--soft-gray)] dark:bg-[var(--dark-text)]">
      <Container>
        <SectionHeading
          title="News & Updates"
          subtitle="Stay informed with the latest from LabPro"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {news.map((item) => (
            <Card key={item.id} hoverable className="group overflow-hidden">
              <div className="relative aspect-video">
                <NewsImage src={item.image} alt={item.title} />
                <span className="absolute top-4 left-4 bg-[var(--brand-500)] text-[var(--white)] text-xs px-3 py-1 rounded-full z-10">
                  {item.category}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center text-sm text-[var(--dark-text)] mb-3">
                  <FiCalendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>

                <h3 className="text-lg font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)] mb-2">
                  {item.title}
                </h3>

                <p className="text-[var(--dark-text)] dark:text-gray-400 mb-4">
                  {item.excerpt}
                </p>

                <Link
                  href={`/news/${item.id}`}
                  className="inline-flex items-center text-[var(--brand-600)] font-medium hover:text-[var(--brand-700)]"
                >
                  Read More
                  <FiArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/news">
            <Button variant="outline" size="lg">
              View All Updates
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  )
}