'use client'

import Image from 'next/image'
import Container from '../layout/Container'

export default function ContactHeader() {
  return (
    <section className="relative min-h-[400px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=1600"
          alt="Modern office building in Nairobi"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--dark-text)]/90 via-[var(--dark-text)]/80 to-transparent" />
        
        {/* Abstract Map Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
              <circle cx="5" cy="5" r="1" fill="white" />
              <circle cx="15" cy="12" r="1" fill="white" />
              <circle cx="8" cy="18" r="1" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#map-grid)" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <Container className="relative z-10">
        <div className="max-w-3xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Get in Touch
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Have a question about an order? Need a bulk quotation?
            <br />
            <span className="text-[var(--brand-400)] font-medium">
              We're available Monday-Friday, 8am-5pm EAT
            </span>
          </p>

          {/* Availability Badge */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <span className="relative flex h-3 w-3 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium">Live support available now</span>
          </div>
        </div>
      </Container>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="var(--white)" />
        </svg>
      </div>
    </section>
  )
}