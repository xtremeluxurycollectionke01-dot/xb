'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { FiCheckCircle } from 'react-icons/fi'
import Container from '../layout/Container'
import Counter from '../ui/Counter'
import Badge from '../ui/Badge'

const clients = [
  { name: 'University of Nairobi', logo: '/logos/uon.png' },
  { name: 'Kenyatta University', logo: '/logos/ku.png' },
  { name: 'Strathmore University', logo: '/logos/strathmore.png' },
  { name: 'Kenyatta Hospital', logo: '/logos/knh.png' },
  { name: 'Aga Khan Hospital', logo: '/logos/agakhan.png' },
  { name: 'Kenya Power', logo: '/logos/kplc.png' },
  { name: 'Safaricom', logo: '/logos/safaricom.png' },
  { name: 'KCB Bank', logo: '/logos/kcb.png' },
]

const certifications = [
  { name: 'KRA Certified', icon: '🇰🇪' },
  { name: 'KEPSA Member', icon: '🤝' },
  { name: 'ISO 9001:2015', icon: '✅' },
  { name: 'Chemical Handling Certified', icon: '🧪' },
]

const paymentMethods = [
  { name: 'M-Pesa', icon: '📱' },
  { name: 'Visa', icon: '💳' },
  { name: 'Mastercard', icon: '💳' },
  { name: 'Bank Transfer', icon: '🏦' },
]

export default function TrustSignals() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
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
    <section ref={sectionRef} className="section-padding bg-soft-gray">
      <Container>
        {/* Client Counter */}
        <div className="text-center mb-16">
          <div className="text-5xl md:text-6xl font-bold text-[var(--brand-600)] mb-4">
            {isVisible && <Counter end={5000} suffix="+" />}
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Happy Clients and Growing
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Trusted by leading universities, hospitals, and businesses across Kenya
          </p>
        </div>

        {/* Client Logos Grid */}
        <div className="mb-16">
          <h3 className="text-lg font-semibold text-center text-[var(--dark-text)] mb-8">
            Proud Suppliers To
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {clients.map((client) => (
              <div 
                key={client.name}
                className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
              >
                <div className="relative h-12 w-32">
                  {/* Placeholder for client logos */}
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500">
                    {client.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Affiliations */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Certifications */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-md">
            <h3 className="text-xl font-bold text-[var(--dark-text)] mb-6">
              Certifications & Affiliations
            </h3>
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.name} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--brand-100)] rounded-full flex items-center justify-center">
                    <span className="text-xl">{cert.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--dark-text)]">{cert.name}</p>
                    <Badge variant="success" className="mt-1">Verified</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-md">
            <h3 className="text-xl font-bold text-[var(--dark-text)] mb-6">
              Payment Methods
            </h3>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.name} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--brand-100)] rounded-full flex items-center justify-center">
                    <span className="text-xl">{method.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--dark-text)]">{method.name}</p>
                    <p className="text-sm text-gray-500">Secure & Instant</p>
                  </div>
                  <FiCheckCircle className="ml-auto w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}