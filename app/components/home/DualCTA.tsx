/*import Link from 'next/link'
import { FiShoppingBag, FiFileText } from 'react-icons/fi'
import Container from '../layout/Container'
import Card from '../ui/Card'
import Button from '../ui/Button'

export default function DualCTA() {
  return (
    <section className="section-padding">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Immediate Needs *
          <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-brand-50 to-white">
            <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-dark-text mb-4">
              Buy Now for Immediate Needs
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Quick checkout for urgent lab supplies, reagents, and consumables. Same-day delivery available.
            </p>
            <Link href="/products">
              <Button size="lg" className="min-w-[200px]">
                Shop Products
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-4">
              → Retail checkout with instant payment
            </p>
          </Card>

          {/* Large Project *
          <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-brand-600 to-brand-800 text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <FiFileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Planning a Large Project?
            </h3>
            <p className="text-white/90 mb-8 max-w-md mx-auto">
              Get competitive quotes for bulk orders, lab setup, and institutional supplies.
            </p>
            <Link href="/catalogue">
              <Button variant="secondary" size="lg" className="min-w-[200px]">
                Browse Catalogue
              </Button>
            </Link>
            <p className="text-sm text-white/80 mt-4">
              → Quotation flow for large orders
            </p>
          </Card>
        </div>
      </Container>
    </section>
  )
}*/

'use client'

import Link from 'next/link'
import { FiShoppingBag, FiFileText } from 'react-icons/fi'
import Container from '../layout/Container'
import Card from '../ui/Card'
import Button from '../ui/Button'

export default function DualCTA() {
  return (
    <section className="section-padding">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Immediate Needs */}
          <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-brand-50 to-white dark:from-slate-700 dark:to-slate-800">
            <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-[var(--dark-text)] dark:text-[var(--light-text)] mb-4">
              Buy Now for Immediate Needs
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Quick checkout for urgent lab supplies, reagents, and consumables. Same-day delivery available.
            </p>
            <Link href="/products">
              <Button size="lg" className="min-w-[200px]">
                Shop Products
              </Button>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              → Retail checkout with instant payment
            </p>
          </Card>

          {/* Large Project */}
          <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-brand-600 to-brand-800 text-white dark:from-brand-700 dark:to-brand-900">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <FiFileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Planning a Large Project?
            </h3>
            <p className="text-white/90 mb-8 max-w-md mx-auto">
              Get competitive quotes for bulk orders, lab setup, and institutional supplies.
            </p>
            <Link href="/catalogue">
              <Button variant="secondary" size="lg" className="min-w-[200px]">
                Browse Catalogue
              </Button>
            </Link>
            <p className="text-sm text-white/80 mt-4">
              → Quotation flow for large orders
            </p>
          </Card>

        </div>
      </Container>
    </section>
  )
}