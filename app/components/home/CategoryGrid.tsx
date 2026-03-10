/*import Image from 'next/image'
import Link from 'next/link'
import Container from '../layout/Container'
import SectionHeading from '../ui/SectionHeading'

const categories = [
  {
    name: 'Office Supplies',
    description: 'Stationery, furniture & more',
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
    href: '/products/office',
  },
  {
    name: 'Lab Equipment',
    description: 'Microscopes, centrifuges, incubators',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    href: '/products/equipment',
  },
  {
    name: 'Chemicals',
    description: 'Reagents, solvents, acids',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
    href: '/products/chemicals',
  },
  {
    name: 'Glassware',
    description: 'Beakers, flasks, pipettes',
    image: 'https://images.unsplash.com/photo-1576086213360-ff97d0d37d2b?w=400',
    href: '/products/glassware',
  },
  {
    name: 'Plasticware',
    description: 'Tubes, containers, racks',
    image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400',
    href: '/products/plasticware',
  },
]

export default function CategoryGrid() {
  return (
    <section className="section-padding">
      <Container>
        <SectionHeading
          title="Shop by Category"
          subtitle="Everything you need for your laboratory and office"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                <p className="text-sm text-gray-200">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}*/

/*'use client'

import Image from 'next/image'
import Link from 'next/link'
import Container from '../layout/Container'
import SectionHeading from '../ui/SectionHeading'

const categories = [
  {
    name: 'Office Supplies',
    description: 'Stationery, furniture & more',
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
    href: '/products/office',
  },
  {
    name: 'Lab Equipment',
    description: 'Microscopes, centrifuges, incubators',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    href: '/products/equipment',
  },
  {
    name: 'Chemicals',
    description: 'Reagents, solvents, acids',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
    href: '/products/chemicals',
  },
  {
    name: 'Glassware',
    description: 'Beakers, flasks, pipettes',
    image: 'https://images.unsplash.com/photo-1576086213360-ff97d0d37d2b?w=400',
    href: '/products/glassware',
  },
  {
    name: 'Plasticware',
    description: 'Tubes, containers, racks',
    image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400',
    href: '/products/plasticware',
  },
]

export default function CategoryGrid() {
  return (
    <section className="section-padding">
      <Container>
        <SectionHeading
          title="Shop by Category"
          subtitle="Everything you need for your laboratory and office"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent dark:from-[var(--dark-text)]/60 dark:via-[var(--dark-text)]/20" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-[var(--brand-700)] dark:text-[var(--brand-400)] mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-200 dark:text-gray-300">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}*/

'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FiArrowRight, 
  FiChevronLeft, 
  FiChevronRight,
  FiPackage
} from 'react-icons/fi'
import Container from '../layout/Container'
import Button from '../ui/Button'

// Helper function for conditional classes - MOVED TO TOP
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}

const categories = [
  {
    id: 'office',
    name: 'Office',
    image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&auto=format&fit=crop',
    color: 'from-[#1FB84F] to-[#63DB7C]',
    items: ['Paper', 'Pens', 'Storage', 'Accessories'],
    count: 240,
  },
  {
    id: 'lab-equipment',
    name: 'Lab Equipment',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop',
    color: 'from-[#3FCC63] to-[#8EE89F]',
    items: ['Glassware', 'Instruments', 'Plasticware', 'Safety'],
    count: 180,
  },
  {
    id: 'chemicals',
    name: 'Chemicals',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b3a?w=800&auto=format&fit=crop',
    color: 'from-[#14963F] to-[#3FCC63]',
    items: ['Acids', 'Solvents', 'Reagents', 'Indicators'],
    count: 320,
  },
  {
    id: 'lab-furniture',
    name: 'Furniture',
    image: 'https://images.unsplash.com/photo-1581277557426-befb1e49ff6a?w=800&auto=format&fit=crop',
    color: 'from-[#0E6F2F] to-[#1FB84F]',
    items: ['Workbenches', 'Cabinets', 'Fume Hoods', 'Stools'],
    count: 60,
  },
  {
    id: 'safety',
    name: 'Safety',
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop',
    color: 'from-[#63DB7C] to-[#B8F5C2]',
    items: ['PPE', 'Gloves', 'Goggles', 'First Aid'],
    count: 150,
  },
  {
    id: 'glassware',
    name: 'Glassware',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&auto=format&fit=crop',
    color: 'from-[#1FB84F] to-[#8EE89F]',
    items: ['Beakers', 'Flasks', 'Pipettes', 'Burettes'],
    count: 200,
  },
]

export default function CategoryGrid() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Placeholder image path
  const placeholderImage = '/images/placeholder.png'

  useEffect(() => {
    const updateMaxScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current
        setMaxScroll(scrollWidth - clientWidth)
      }
    }

    updateMaxScroll()
    window.addEventListener('resize', updateMaxScroll)
    return () => window.removeEventListener('resize', updateMaxScroll)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      
      setTimeout(() => {
        if (scrollContainerRef.current) {
          setScrollPosition(scrollContainerRef.current.scrollLeft)
        }
      }, 100)
    }
  }

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft)
    }
  }

  const handleImageError = (categoryId: string) => {
    setImageErrors(prev => ({ ...prev, [categoryId]: true }))
  }

  return (
    <section className="relative py-24 overflow-hidden">
      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-4">
          {/* Left: Shop by Category Badge */}
          <div>
            <div className="inline-flex items-center space-x-2 bg-[var(--brand-100)] dark:bg-[var(--brand-900)] px-4 py-4 rounded-full border border-[var(--brand-200)] dark:border-[var(--brand-700)]">
              <FiPackage className="w-4 h-4 text-[var(--brand-600)] dark:text-[var(--brand-400)]" />
              <span className="text-sm font-semibold text-[var(--brand-700)] dark:text-[var(--brand-300)]">
                Shop by Category
              </span>
            </div>
          </div>

          {/* Right: View All Button + Scroll Arrows */}
          <div className="flex items-center gap-4">
            {/* View All Button */}
            <Link href="/categories">
              <Button 
                variant="outline" 
                className="group rounded-full px-6 py-3 border-2 border-[var(--brand-200)] hover:border-[var(--brand-400)] transition-all duration-300"
              >
                <span>View All</span>
                <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            {/* Scroll Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={scrollPosition <= 0}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                  scrollPosition > 0
                    ? "bg-[var(--brand-500)] border-[var(--brand-500)] text-white hover:bg-[var(--brand-600)] hover:border-[var(--brand-600)] cursor-pointer"
                    : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700"
                )}
                aria-label="Scroll left"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={scrollPosition >= maxScroll}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                  scrollPosition < maxScroll
                    ? "bg-[var(--brand-500)] border-[var(--brand-500)] text-white hover:bg-[var(--brand-600)] hover:border-[var(--brand-600)] cursor-pointer"
                    : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700"
                )}
                aria-label="Scroll right"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Cards */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto scrollbar-hide gap-6 pb-8 px-2 -mx-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/${category.id}`}
              className="group flex-none w-[320px]"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-[var(--card-border)]">
                {/* Image Container */}
                {/*<div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={imageErrors[category.id] ? placeholderImage : category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 320px"
                    onError={() => handleImageError(category.id)}
                  />
                  
                  {/* Gradient Overlay *
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Category Title Overlay *
                  <div className="absolute bottom-4 left-4 z-10">
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                      {category.name}
                    </h3>
                    <p className="text-sm text-white/90 drop-shadow">
                      {category.count} items
                    </p>
                  </div>

                  {/* Brand Color Accent *
                  <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r",
                    category.color
                  )} />
                </div>*/}

                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={imageErrors[category.id] ? placeholderImage : category.image}
                    alt={category.name}
                    fill
                    className={cn(
                      "transition-transform duration-700 group-hover:scale-110",
                      imageErrors[category.id] 
                        ? "object-contain p-4" // Smaller with padding for placeholder
                        : "object-cover" // Full cover for actual images
                    )}
                    sizes="(max-width: 768px) 100vw, 320px"
                    onError={() => handleImageError(category.id)}
                  />
                  
                  {/* Gradient Overlay - Make it slightly lighter for placeholder */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent",
                    imageErrors[category.id] && "from-black/40" // Lighter overlay for placeholder
                  )} />
                  
                  {/* Category Title Overlay */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                      {category.name}
                    </h3>
                    <p className="text-sm text-white/90 drop-shadow">
                      {category.count} items
                    </p>
                  </div>

                  {/* Brand Color Accent */}
                  <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r",
                    category.color
                  )} />
                </div>
                                
                {/* Subcategories Grid */}
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-2">
                    {category.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[var(--brand-50)] dark:hover:bg-[var(--brand-900)] transition-all duration-300"
                      >
                        <div className={cn(
                          "w-1 h-1 rounded-full bg-gradient-to-r",
                          category.color
                        )} />
                        <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-[var(--brand-600)]">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--brand-500)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Navigation Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {categories.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({
                    left: idx * 336,
                    behavior: 'smooth'
                  })
                }
              }}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                Math.round(scrollPosition / 336) === idx
                  ? "w-8 bg-[var(--brand-500)]"
                  : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-[var(--brand-400)]"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}