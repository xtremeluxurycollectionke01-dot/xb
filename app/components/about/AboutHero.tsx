'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FiUsers, FiMapPin } from 'react-icons/fi'
import Container from '../layout/Container'
import Button from '../ui/Button'

export default function AboutHero() {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1572884267966-02340ebc90ac?w=1200&auto=format&fit=crop"
          alt="Modern warehouse facility"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--dark-text)]/90 to-[var(--dark-text)]/70" />
      </div>

      {/* Content */}
      <Container className="relative z-10">
        <div className="max-w-3xl text-white">
          {/* Established Badge */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-medium">Est. 2010</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Supplying Kenya's Workplaces Since{' '}
            <span className="text-[var(--brand-400)]">2010</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
            From small offices to industrial labs, we deliver the tools that keep business moving.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link href="#team">
              <Button size="lg" className="bg-white text-[var(--dark-text)] hover:bg-white/90 min-w-[200px]">
                <FiUsers className="w-5 h-5 mr-2" />
                Meet the Team
              </Button>
            </Link>
            <Link href="#locations">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 min-w-[200px]">
                <FiMapPin className="w-5 h-5 mr-2" />
                Our Locations
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/20">
            <div>
              <div className="text-2xl font-bold text-[var(--brand-400)]">15+</div>
              <div className="text-sm text-white/70">Years Experience</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--brand-400)]">5K+</div>
              <div className="text-sm text-white/70">Happy Clients</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--brand-400)]">50K+</div>
              <div className="text-sm text-white/70">Products</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--brand-400)]">24/7</div>
              <div className="text-sm text-white/70">Support</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}