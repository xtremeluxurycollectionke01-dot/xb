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

'use client'

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
}