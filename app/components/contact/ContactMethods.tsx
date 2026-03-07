'use client'

import Link from 'next/link'
import { FiPhone, FiMessageCircle, FiMail, FiClock } from 'react-icons/fi'
import Container from '../layout/Container'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { cn } from '@/app/lib/utils'

const methods = [
  {
    icon: <FiPhone className="w-8 h-8" />,
    title: 'Call Us',
    description: 'Speak directly with our team',
    details: [
      { label: 'Main Line', value: '0700 000 000', href: 'tel:0700000000' },
      { label: 'Emergency', value: '0722 000 000', href: 'tel:0722000000' },
    ],
    hours: 'Mon-Fri 8am - 5pm',
    action: 'Call Now',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: <FiMessageCircle className="w-8 h-8" />,
    title: 'WhatsApp',
    description: 'Quick responses for orders',
    details: [
      { label: 'Business Line', value: '0700 123 456', href: 'https://wa.me/254700123456' },
    ],
    hours: '24/7 Automated',
    action: 'Chat Now',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: <FiMail className="w-8 h-8" />,
    title: 'Email',
    description: 'Send us a message anytime',
    details: [
      { label: 'General', value: 'info@labpro.co.ke', href: 'mailto:info@labpro.co.ke' },
    ],
    hours: 'Response: 24 hours',
    action: 'Send Email',
    color: 'from-purple-500 to-purple-600',
  },
]

export default function ContactMethods() {
  return (
    <section className="section-padding bg-[var(--soft-gray)]">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark-text)] mb-4">
            Choose Your Preferred Way to Reach Us
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We're here to help through whatever channel works best for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {methods.map((method) => (
            <Card 
              key={method.title} 
              className="group relative overflow-hidden p-6 text-center hover:-translate-y-2 transition-all duration-300"
              hoverable
            >
              {/* Gradient Background on Hover */}
              <div className={cn(
                'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500',
                `bg-gradient-to-br ${method.color}`
              )} />

              {/* Icon */}
              <div className="relative z-10">
                <div className={cn(
                  'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center',
                  'bg-gradient-to-br text-white',
                  method.color
                )}>
                  {method.icon}
                </div>

                <h3 className="text-xl font-bold text-[var(--dark-text)] mb-2">
                  {method.title}
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {method.description}
                </p>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  {method.details.map((detail) => (
                    <div key={detail.label}>
                      <span className="text-xs text-gray-500">{detail.label}:</span>
                      <Link 
                        href={detail.href}
                        className="block text-sm font-medium text-[var(--brand-600)] hover:text-[var(--brand-700)]"
                      >
                        {detail.value}
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Hours */}
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-4">
                  <FiClock className="w-3 h-3" />
                  <span>{method.hours}</span>
                </div>

                {/* Action Button */}
                <Link href={method.details[0].href}>
                  <Button variant="outline" size="sm" className="w-full">
                    {method.action}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}