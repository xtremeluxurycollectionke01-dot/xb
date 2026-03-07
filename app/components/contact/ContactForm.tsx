'use client'

import { useState } from 'react'
import { FiUpload, FiCheckCircle } from 'react-icons/fi'
import { inquiryTypes } from '@/app/lib/contact-data'
import Container from '../layout/Container'
import Card from '../ui/Card'
import Input from '../ui/Input'
import Select from '../ui/Select'

import Button from '../ui/Button'
import Textarea from '../ui/Textarea'


interface FormData {
  inquiryType: string
  fullName: string
  email: string
  phone: string
  companyName?: string
  itemsNeeded?: string
  estimatedQuantity?: string
  deliveryLocation?: string
  orderNumber?: string
  orderEmail?: string
  message: string
  attachments?: FileList
}

interface FormErrors {
  [key: string]: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    inquiryType: 'general',
    fullName: '',
    email: '',
    phone: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName) newErrors.fullName = 'Full name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    
    if (formData.inquiryType === 'quotation') {
      if (!formData.companyName) newErrors.companyName = 'Company name is required'
      if (!formData.itemsNeeded) newErrors.itemsNeeded = 'Please list items needed'
    }

    if (formData.inquiryType === 'order-status') {
      if (!formData.orderNumber) newErrors.orderNumber = 'Order number is required'
      if (!formData.orderEmail) newErrors.orderEmail = 'Email is required'
    }

    if (!formData.message) newErrors.message = 'Message is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        inquiryType: 'general',
        fullName: '',
        email: '',
        phone: '',
        message: '',
      })
    }, 3000)
  }

  if (isSubmitted) {
    return (
      <section className="section-padding">
        <Container>
          <Card className="max-w-2xl mx-auto p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--dark-text)] mb-4">
              Message Sent Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>
              Send Another Message
            </Button>
          </Card>
        </Container>
      </section>
    )
  }

  return (
    <section className="section-padding">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark-text)] mb-4">
            Send Us a Message
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            We reply within 24 business hours
          </p>
        </div>

        <Card className="max-w-3xl mx-auto p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Inquiry Type */}
            <Select
              label="Inquiry Type *"
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
              options={inquiryTypes}
              error={errors.inquiryType}
            />

            {/* Conditional Fields based on Inquiry Type */}
            {formData.inquiryType === 'quotation' && (
              <div className="space-y-4 p-4 bg-[var(--brand-50)] dark:bg-[var(--brand-900)]/20 rounded-lg">
                <h4 className="font-medium text-[var(--dark-text)]">Quotation Details</h4>
                <Input
                  label="Company Name *"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleChange}
                  error={errors.companyName}
                  placeholder="Your company or institution name"
                />
                <Textarea
                  label="Items Needed *"
                  name="itemsNeeded"
                  value={formData.itemsNeeded || ''}
                  onChange={handleChange}
                  error={errors.itemsNeeded}
                  placeholder="Please list the items you need, including quantities and specifications"
                  rows={3}
                />
                <Input
                  label="Estimated Quantity"
                  name="estimatedQuantity"
                  value={formData.estimatedQuantity || ''}
                  onChange={handleChange}
                  placeholder="e.g., 100 units, 5 boxes, etc."
                />
                <Input
                  label="Delivery Location"
                  name="deliveryLocation"
                  value={formData.deliveryLocation || ''}
                  onChange={handleChange}
                  placeholder="Where should we deliver?"
                />
              </div>
            )}

            {formData.inquiryType === 'order-status' && (
              <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-[var(--dark-text)]">Order Information</h4>
                <Input
                  label="Order Number *"
                  name="orderNumber"
                  value={formData.orderNumber || ''}
                  onChange={handleChange}
                  error={errors.orderNumber}
                  placeholder="e.g., ORD-2024-001"
                />
                <Input
                  label="Email Used for Order *"
                  name="orderEmail"
                  type="email"
                  value={formData.orderEmail || ''}
                  onChange={handleChange}
                  error={errors.orderEmail}
                  placeholder="Enter the email you used when ordering"
                />
              </div>
            )}

            {/* Standard Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                placeholder="John Doe"
              />
              <Input
                label="Email Address *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="john@example.com"
              />
            </div>

            <Input
              label="Phone Number *"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="+254 700 000 000"
            />

            <Textarea
              label="Message *"
              name="message"
              value={formData.message}
              onChange={handleChange}
              error={errors.message}
              placeholder="How can we help you?"
              rows={4}
            />

            {/* File Attachment */}
            <div>
              <label className="block text-sm font-medium text-[var(--dark-text)] mb-2">
                Attachment (optional)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--card-border)] rounded-lg cursor-pointer hover:border-[var(--brand-500)] transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-[var(--brand-600)]">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PDF, DOC, Images (Max 10MB)
                    </p>
                  </div>
                  <input type="file" className="hidden" multiple />
                </label>
              </div>
            </div>

            {/* Honeypot for spam prevention */}
            <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </div>
              ) : (
                'Send Message'
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              * Required fields. Your information is kept private and secure.
            </p>
          </form>
        </Card>
      </Container>
    </section>
  )
}