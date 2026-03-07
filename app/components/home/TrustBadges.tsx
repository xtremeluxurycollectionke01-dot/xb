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