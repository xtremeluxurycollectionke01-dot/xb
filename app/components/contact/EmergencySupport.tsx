'use client'

import { useState } from 'react'
import { FiAlertTriangle, FiPhone, FiX } from 'react-icons/fi'
import Container from '../layout/Container'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Modal from '../ui/Modal'

export default function EmergencySupport() {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)

  return (
    <>
      <section className="section-padding pt-0">
        <Container>
          <Card className="relative overflow-hidden border-2 border-red-200 dark:border-red-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <pattern id="emergency-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 10 20 M 0 10 L 20 10" stroke="red" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#emergency-pattern)" />
              </svg>
            </div>

            <div className="relative z-10 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                  <FiAlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[var(--dark-text)] mb-2">
                    Urgent After-Hours Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    For critical supply emergencies (hospitals, labs) outside business hours
                  </p>
                </div>
              </div>

              <Button
                variant="danger"
                size="lg"
                onClick={() => setShowEmergencyModal(true)}
                className="min-w-[200px]"
              >
                <FiPhone className="w-5 h-5 mr-2" />
                Emergency Hotline
              </Button>
            </div>
          </Card>
        </Container>
      </section>

      {/* Emergency Modal */}
      <Modal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        title="Emergency Support"
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertTriangle className="w-10 h-10 text-red-600" />
          </div>

          <p className="text-lg font-medium text-[var(--dark-text)] mb-2">
            Critical Emergency Hotline
          </p>
          <p className="text-sm text-gray-600 mb-6">
            For chemical spills, equipment failures, and urgent medical supply needs
          </p>

          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg mb-6">
            <p className="text-xs text-gray-500 mb-2">24/7 Emergency Contact</p>
            <a 
              href="tel:+254722000000"
              className="text-3xl font-bold text-red-600 hover:text-red-700"
            >
              0722 000 000
            </a>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              ⚠️ This line is for genuine emergencies only
            </p>
            <p className="text-sm text-gray-600">
              For non-urgent inquiries, please use our regular contact methods
            </p>
          </div>

          <Button
            variant="outline"
            fullWidth
            className="mt-6"
            onClick={() => setShowEmergencyModal(false)}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  )
}