'use client'

import { useState } from 'react'
import { FiMail, FiPhone, FiMessageCircle, FiChevronDown } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { departments } from '@/app/lib/contact-data'
import Container from '../layout/Container'
import Card from '../ui/Card'
import Button from '../ui/Button'

export default function DepartmentDirectory() {
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)

  return (
    <section className="section-padding">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark-text)] mb-4">
            Reach the Right Team
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Avoid transfers - contact the right department directly
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {departments.map((dept) => (
            <Card key={dept.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-16 h-16 bg-[var(--brand-100)] rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                  {dept.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[var(--dark-text)] mb-2">
                    {dept.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {dept.description}
                  </p>

                  {/* Contact Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <FiMail className="w-4 h-4 text-[var(--brand-500)]" />
                      <a 
                        href={`mailto:${dept.email}`}
                        className="text-gray-600 hover:text-[var(--brand-600)] transition-colors"
                      >
                        {dept.email}
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <FiPhone className="w-4 h-4 text-[var(--brand-500)]" />
                      <a 
                        href={`tel:${dept.phone}`}
                        className="text-gray-600 hover:text-[var(--brand-600)] transition-colors"
                      >
                        {dept.phone}
                      </a>
                    </div>

                    {dept.whatsapp && (
                      <div className="flex items-center gap-3 text-sm">
                        <FiMessageCircle className="w-4 h-4 text-green-500" />
                        <a 
                          href={`https://wa.me/${dept.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-[var(--brand-600)] transition-colors"
                        >
                          WhatsApp
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Response Time Badge */}
                  <div className="mt-4 inline-flex items-center px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
                    <span className="relative flex h-2 w-2 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-xs font-medium text-green-700 dark:text-green-400">
                      Response: {dept.responseTime}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden space-y-3">
          {departments.map((dept) => (
            <Card key={dept.id} className="overflow-hidden">
              <button
                onClick={() => setExpandedMobile(expandedMobile === dept.id ? null : dept.id)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--brand-100)] rounded-lg flex items-center justify-center text-xl">
                    {dept.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--dark-text)]">{dept.name}</h3>
                    <p className="text-xs text-gray-500">{dept.responseTime} response</p>
                  </div>
                </div>
                <FiChevronDown
                  className={cn(
                    'w-5 h-5 text-gray-500 transition-transform',
                    expandedMobile === dept.id && 'rotate-180'
                  )}
                />
              </button>

              {expandedMobile === dept.id && (
                <div className="p-4 pt-0 border-t border-[var(--card-border)]">
                  <p className="text-sm text-gray-600 mb-3">{dept.description}</p>
                  
                  <div className="space-y-2">
                    <a 
                      href={`mailto:${dept.email}`}
                      className="flex items-center gap-2 text-sm text-[var(--brand-600)]"
                    >
                      <FiMail className="w-4 h-4" />
                      {dept.email}
                    </a>
                    
                    <a 
                      href={`tel:${dept.phone}`}
                      className="flex items-center gap-2 text-sm text-[var(--brand-600)]"
                    >
                      <FiPhone className="w-4 h-4" />
                      {dept.phone}
                    </a>

                    {dept.whatsapp && (
                      <a 
                        href={`https://wa.me/${dept.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-green-600"
                      >
                        <FiMessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}