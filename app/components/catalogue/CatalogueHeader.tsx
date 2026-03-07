/*'use client'

import { FiDownload, FiBookOpen, FiSearch } from 'react-icons/fi'
import Container from '../layout/Container'
import Button from '../ui/Button'
import Input from '../ui/Input'

interface CatalogueHeaderProps {
  onSearch: (query: string) => void
}

export default function CatalogueHeader({ onSearch }: CatalogueHeaderProps) {
  return (
    <section className="relative bg-gradient-to-r from-brand-900 to-brand-700 text-white py-16 md:py-24">
      {/* Background Pattern *
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <Container className="relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge *
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 mb-6">
            <FiBookOpen className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">2024 Edition</span>
          </div>

          {/* Headline *
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Download Our Full Catalogue
          </h1>
          
          <p className="text-xl text-white/90 mb-8">
            Browse online or request quotes for bulk orders. Flip through our digital catalogue or download the PDF.
          </p>

          {/* Search Bar *
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="search"
                placeholder="Search products, SKUs, or categories..."
                className="pl-12 py-4 text-dark-text bg-white border-0 rounded-full shadow-lg"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons *
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-brand-700 hover:bg-gray-100 min-w-[200px]">
              <FiBookOpen className="w-5 h-5 mr-2" />
              Browse Online
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 min-w-[200px]">
              <FiDownload className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
          </div>

          {/* Stats *
          <div className="flex justify-center gap-8 mt-12 text-sm text-white/80">
            <div>
              <span className="font-bold text-white text-lg">2500+</span> Products
            </div>
            <div className="w-px h-6 bg-white/20" />
            <div>
              <span className="font-bold text-white text-lg">128</span> Pages
            </div>
            <div className="w-px h-6 bg-white/20" />
            <div>
              <span className="font-bold text-white text-lg">12</span> Categories
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}*/

'use client'

import { FiDownload, FiBookOpen, FiSearch } from 'react-icons/fi'
import Container from '../layout/Container'
import Button from '../ui/Button'
import Input from '../ui/Input'

interface CatalogueHeaderProps {
  onSearch: (query: string) => void
}

export default function CatalogueHeader({ onSearch }: CatalogueHeaderProps) {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-r from-[var(--brand-900)] to-[var(--brand-700)] text-[var(--white)] dark:text-[var(--dark-text)]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <Container className="relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center bg-white/20 dark:bg-[var(--soft-gray)/20] backdrop-blur-sm rounded-full px-4 py-1 mb-6">
            <FiBookOpen className="w-4 h-4 mr-2 text-[var(--white)] dark:text-[var(--dark-text)]" />
            <span className="text-sm font-medium text-[var(--white)] dark:text-[var(--dark-text)]">2024 Edition</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Download Our Full Catalogue
          </h1>

          <p className="text-xl text-[var(--white)/90] dark:text-[var(--dark-text)/90] mb-8">
            Browse online or request quotes for bulk orders. Flip through our digital catalogue or download the PDF.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--soft-gray)] dark:text-[var(--card-border)] w-5 h-5" />
              <Input
                type="search"
                placeholder="Search products, SKUs, or categories..."
                className="pl-12 py-4 text-[var(--dark-text)] dark:text-[var(--light-text)] bg-[var(--white)] dark:bg-[var(--dark-text)] border-0 rounded-full shadow-lg"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-[var(--white)] text-[var(--brand-700)] hover:bg-[var(--soft-gray)] min-w-[200px]"
            >
              <FiBookOpen className="w-5 h-5 mr-2" />
              Browse Online
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[var(--white)] text-[var(--white)] hover:bg-[var(--white)/10] min-w-[200px]"
            >
              <FiDownload className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-12 text-sm text-[var(--white)/80] dark:text-[var(--dark-text)/80]">
            <div>
              <span className="font-bold text-lg text-[var(--white)] dark:text-[var(--dark-text)]">2500+</span> Products
            </div>
            <div className="w-px h-6 bg-[var(--white)/20] dark:bg-[var(--dark-text)/20]" />
            <div>
              <span className="font-bold text-lg text-[var(--white)] dark:text-[var(--dark-text)]">128</span> Pages
            </div>
            <div className="w-px h-6 bg-[var(--white)/20] dark:bg-[var(--dark-text)/20]" />
            <div>
              <span className="font-bold text-lg text-[var(--white)] dark:text-[var(--dark-text)]">12</span> Categories
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}