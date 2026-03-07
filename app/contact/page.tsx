import type { Metadata } from 'next'
import ContactForm from '../components/contact/ContactForm'
import ContactHeader from '../components/contact/ContactHeader'
import ContactMethods from '../components/contact/ContactMethods'
import DepartmentDirectory from '../components/contact/DepartmentDirectory'
import EmergencySupport from '../components/contact/EmergencySupport'
import FAQPreview from '../components/contact/FAQPreview'
import PhysicalLocations from '../components/contact/PhysicalLocations'
import SocialMedia from '../components/contact/SocialMedia'

export const metadata: Metadata = {
  title: 'Contact Us | LabPro Scientific Supplies',
  description: 'Get in touch with our team for inquiries, quotes, or support. Multiple contact methods available including phone, email, WhatsApp, and physical locations.',
}

export default function ContactPage() {
  return (
    <>
      <ContactHeader />
      <ContactMethods />
      <DepartmentDirectory />
      <PhysicalLocations />
      <ContactForm />
      <EmergencySupport />
      <FAQPreview />
      <SocialMedia />
    </>
  )
}