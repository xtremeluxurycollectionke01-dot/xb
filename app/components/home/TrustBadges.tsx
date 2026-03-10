/*import { FiClock, FiUsers, FiTruck, FiCreditCard } from 'react-icons/fi'
import Container from '../layout/Container'

const badges = [
  {
    icon: FiClock,
    title: '10+ Years Experience',
    description: 'Trusted by institutions since 2014',
  },
  {
    icon: FiUsers,
    title: '5000+ Clients',
    description: 'Serving schools, colleges & universities',
  },
  {
    icon: FiTruck,
    title: 'Same-Day Delivery',
    description: 'Within Nairobi & selected areas',
  },
  {
    icon: FiCreditCard,
    title: 'M-Pesa Accepted',
    description: 'Secure & convenient payments',
  },
]

export default function TrustBadges() {
  return (
    <section className="section-padding bg-soft-gray">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-200 transition-colors">
                  <Icon className="w-8 h-8 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-dark-text mb-2">
                  {badge.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {badge.description}
                </p>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}*/


/*'use client'

import { FiClock, FiUsers, FiTruck, FiCreditCard } from 'react-icons/fi'
import Container from '../layout/Container'
import { useEffect, useRef, useState } from 'react'

const badges = [
  {
    icon: FiClock,
    title: '10+ Years Experience',
    description: 'Trusted by institutions since 2014',
    gradient: 'from-amber-400 to-orange-500',
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-amber-900/20',
  },
  {
    icon: FiUsers,
    title: '5000+ Clients',
    description: 'Serving schools, colleges & universities',
    gradient: 'from-blue-400 to-indigo-500',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-900/20',
  },
  {
    icon: FiTruck,
    title: 'Same-Day Delivery',
    description: 'Within Nairobi & selected areas',
    gradient: 'from-emerald-400 to-teal-500',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-900/20',
  },
  {
    icon: FiCreditCard,
    title: 'M-Pesa Accepted',
    description: 'Secure & convenient payments',
    gradient: 'from-purple-400 to-pink-500',
    bgLight: 'bg-purple-50',
    bgDark: 'dark:bg-purple-900/20',
  },
]

export default function TrustBadges() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 overflow-hidden bg-gradient-to-b from-[var(--soft-gray)] to-white dark:from-[var(--dark-text)] dark:to-gray-900"
    >
      {/* Decorative Background Elements *
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[var(--brand-200)] rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--brand-300)] rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Grid Pattern Overlay *
      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, var(--brand-200) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
        opacity: 0.1
      }}></div>

      <Container className="relative z-10">
        {/* Section Header *
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-[var(--brand-100)] dark:bg-[var(--brand-900)] text-[var(--brand-700)] dark:text-[var(--brand-300)] rounded-full text-sm font-semibold mb-4 border border-[var(--brand-200)] dark:border-[var(--brand-700)]">
            Why Choose Us
          </span>
          <h2 className="text-4xl font-bold text-[var(--dark-text)] dark:text-[var(--light-text)] mb-4">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] bg-clip-text text-transparent">
              Kenya's Top Institutions
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join thousands of satisfied customers who rely on us for their laboratory and scientific supply needs
          </p>
        </div>

        {/* Badges Grid *
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 perspective">
          {badges.map((badge, index) => {
            const Icon = badge.icon
            const delay = index * 150

            return (
              <div
                key={index}
                className={cn(
                  "group relative transform transition-all duration-700 hover:scale-105 hover:-translate-y-2",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}
                style={{ transitionDelay: `${delay}ms` }}
              >
                {/* Animated border gradient *
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500"></div>
                
                {/* Main card *
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-[var(--card-border)] overflow-hidden">
                  {/* Decorative corner accent *
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[var(--brand-400)] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-bl-3xl"></div>
                  
                  {/* Icon container with enhanced styling *
                  <div className="relative mb-6">
                    {/* Background glow *
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-r rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-all duration-500",
                      badge.gradient
                    )}></div>
                    
                    {/* Icon circle *
                    <div className={cn(
                      "relative w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-all duration-500",
                      badge.bgLight,
                      badge.bgDark,
                      "group-hover:rounded-3xl group-hover:rotate-3 group-hover:shadow-xl"
                    )}>
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
                        badge.gradient
                      )}></div>
                      <Icon className={cn(
                        "w-10 h-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                        `text-[var(--brand-600)] dark:text-[var(--brand-400)]`
                      )} />
                    </div>

                    {/* Animated rings *
                    <div className="absolute inset-0 border-2 border-[var(--brand-400)] rounded-2xl opacity-0 group-hover:opacity-30 animate-ping"></div>
                  </div>

                  {/* Title with gradient hover effect *
                  <h3 className="text-xl font-bold text-[var(--dark-text)] dark:text-[var(--light-text)] mb-3 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[var(--brand-400)] group-hover:to-[var(--brand-600)] group-hover:bg-clip-text group-hover:text-transparent">
                    {badge.title}
                  </h3>

                  {/* Description *
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {badge.description}
                  </p>

                  {/* Decorative bottom line *
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-gradient-to-r from-transparent via-[var(--brand-400)] to-transparent transition-all duration-500 delay-100"></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Counter/Stats Row *
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-[var(--card-border)]">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] bg-clip-text text-transparent">
              10+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Years of Excellence</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] bg-clip-text text-transparent">
              5K+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] bg-clip-text text-transparent">
              24/7
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Support Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] bg-clip-text text-transparent">
              100%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Satisfaction Rate</div>
          </div>
        </div>
      </Container>
    </section>
  )
}

// Helper function for conditional classes
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ')
}*/


'use client'

import { FiClock, FiUsers, FiTruck, FiCreditCard } from 'react-icons/fi'
import Container from '../layout/Container'

const badges = [
  {
    icon: FiClock,
    title: '10+ Years Experience',
    description: 'Trusted by institutions since 2014',
  },
  {
    icon: FiUsers,
    title: '5000+ Clients',
    description: 'Serving schools, colleges & universities',
  },
  {
    icon: FiTruck,
    title: 'Same-Day Delivery',
    description: 'Within Nairobi & selected areas',
  },
  {
    icon: FiCreditCard,
    title: 'M-Pesa Accepted',
    description: 'Secure & convenient payments',
  },
]

export default function TrustBadges() {
  return (
    <section className="section-padding bg-[var(--soft-gray)] dark:bg-[var(--dark-text)]">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-16 h-16 bg-[var(--brand-100)] rounded-full flex items-center justify-center mb-4 group-hover:bg-[var(--brand-200)] transition-colors">
                  <Icon className="w-8 h-8 text-[var(--brand-600)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)] mb-2">
                  {badge.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {badge.description}
                </p>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}