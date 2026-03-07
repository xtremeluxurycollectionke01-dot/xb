export interface Department {
  id: string
  name: string
  description: string
  email: string
  phone: string
  whatsapp?: string
  icon: string
  responseTime: string
}

export const departments: Department[] = [
  {
    id: 'sales',
    name: 'Sales & Orders',
    description: 'For new orders, product inquiries, and quotations',
    email: 'sales@labpro.co.ke',
    phone: '+254 700 123 456',
    whatsapp: '+254 700 123 456',
    icon: '🛒',
    responseTime: '2 hours',
  },
  {
    id: 'accounts',
    name: 'Accounts & Billing',
    description: 'For invoices, payments, and credit account applications',
    email: 'accounts@labpro.co.ke',
    phone: '+254 700 123 457',
    icon: '💰',
    responseTime: '24 hours',
  },
  {
    id: 'logistics',
    name: 'Delivery & Logistics',
    description: 'Track orders, delivery issues, warehouse pickup',
    email: 'logistics@labpro.co.ke',
    phone: '+254 700 123 458',
    icon: '🚚',
    responseTime: '1 hour',
  },
  {
    id: 'technical',
    name: 'Technical Support',
    description: 'Equipment setup, chemical safety, product specifications',
    email: 'tech@labpro.co.ke',
    phone: '+254 700 123 459',
    whatsapp: '+254 700 123 459',
    icon: '🔧',
    responseTime: '4 hours',
  },
]

export interface Location {
  id: string
  city: string
  address: string
  building: string
  coordinates: { lat: number; lng: number }
  hours: string
  saturday: string
  sunday: string
  parking: string
  accessible: boolean
  isHeadOffice: boolean
}

export const locations: Location[] = [
  {
    id: 'nairobi',
    city: 'Nairobi',
    address: 'Lusaka Road',
    building: 'Industrial Area, Building 15, Ground Floor',
    coordinates: { lat: -1.3098, lng: 36.8432 },
    hours: '8:00 AM - 5:00 PM',
    saturday: '9:00 AM - 1:00 PM',
    sunday: 'Closed',
    parking: 'Available on site',
    accessible: true,
    isHeadOffice: true,
  },
  {
    id: 'mombasa',
    city: 'Mombasa',
    address: 'Moi Avenue',
    building: 'Commercial Plaza, 2nd Floor',
    coordinates: { lat: -4.0435, lng: 39.6682 },
    hours: '8:30 AM - 5:00 PM',
    saturday: '9:00 AM - 12:00 PM',
    sunday: 'Closed',
    parking: 'Street parking available',
    accessible: true,
    isHeadOffice: false,
  },
  {
    id: 'kisumu',
    city: 'Kisumu',
    address: 'Oginga Odinga Street',
    building: 'Lakeview Building, Suite 105',
    coordinates: { lat: -0.1022, lng: 34.7617 },
    hours: '8:30 AM - 4:30 PM',
    saturday: 'Closed',
    sunday: 'Closed',
    parking: 'Paid parking nearby',
    accessible: false,
    isHeadOffice: false,
  },
]

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export const faqs: FAQ[] = [
  {
    id: 'delivery',
    question: 'How fast is delivery?',
    answer: 'Same-day delivery in Nairobi for orders placed before 2 PM. Next-day delivery to major cities like Mombasa and Kisumu. Rural areas typically take 2-3 business days.',
    category: 'delivery',
  },
  {
    id: 'credit',
    question: 'Do you offer credit accounts?',
    answer: 'Yes! We offer 30-day credit terms for approved businesses and institutions. You can apply for a credit account through our accounts department or submit the online application form.',
    category: 'billing',
  },
  {
    id: 'returns',
    question: 'Can I return unused items?',
    answer: 'Unused items in original packaging can be returned within 14 days for a refund or exchange. Chemicals and custom orders cannot be returned due to safety regulations.',
    category: 'returns',
  },
  {
    id: 'wholesale',
    question: 'How do I get wholesale pricing?',
    answer: 'Wholesale pricing is automatically applied for orders above minimum quantities. For large projects, contact our sales team for customized quotes with volume discounts.',
    category: 'sales',
  },
]

export const socialLinks = [
  { platform: 'Facebook', icon: '📘', url: 'https://facebook.com/labpro', followers: '15K' },
  { platform: 'LinkedIn', icon: '💼', url: 'https://linkedin.com/company/labpro', followers: '8K' },
  { platform: 'Instagram', icon: '📸', url: 'https://instagram.com/labpro', followers: '22K' },
  { platform: 'Twitter/X', icon: '🐦', url: 'https://twitter.com/labpro', followers: '5K' },
  { platform: 'WhatsApp Business', icon: '📱', url: 'https://wa.me/254700123456', followers: 'N/A' },
]

export const inquiryTypes = [
  { value: 'general', label: 'General Question' },
  { value: 'quotation', label: 'Request Quotation (Bulk Order)' },
  { value: 'order-status', label: 'Order Status Check' },
  { value: 'return', label: 'Return/Exchange Request' },
  { value: 'supplier', label: 'Become a Supplier' },
  { value: 'careers', label: 'Careers/Job Application' },
  { value: 'technical', label: 'Technical Support' },
]