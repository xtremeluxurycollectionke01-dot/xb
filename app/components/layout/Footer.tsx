/*import Link from 'next/link'
import { 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiFacebook, 
  FiTwitter, 
  FiLinkedin, 
  FiInstagram,
  FiSend 
} from 'react-icons/fi'
import Container from './Container'
import Button from '../ui/Button'

const footerSections = {
  products: [
    { name: 'Lab Equipment', href: '/products/equipment' },
    { name: 'Chemicals', href: '/products/chemicals' },
    { name: 'Glassware', href: '/products/glassware' },
    { name: 'Plasticware', href: '/products/plasticware' },
    { name: 'Office Supplies', href: '/products/office' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
}

const socialLinks = [
  { icon: FiFacebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FiInstagram, href: 'https://instagram.com', label: 'Instagram' },
]

export default function Footer() {
  return (
    <footer className="bg-dark-text text-white pt-16 pb-8">
      <Container>
        {/* Main Footer Content *
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info *
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-brand-400">Lab<span className="text-white">Pro</span></span>
            </Link>
            <p className="text-gray-400 text-sm">
              Your trusted partner in laboratory and scientific supplies. 
              Serving educational institutions and research facilities since 2014.
            </p>
            
            {/* Contact Info *
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-400">
                <FiMapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>123 Industrial Area, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <FiPhone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>+254 700 123 456</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <FiMail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>info@labpro.co.ke</span>
              </div>
            </div>

            {/* Social Links *
            <div className="flex space-x-4 pt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-brand-400 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Footer Links *
          <div>
            <h3 className="font-semibold text-lg mb-4">Products</h3>
            <ul className="space-y-2">
              {footerSections.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-brand-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {footerSections.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-brand-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              {footerSections.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-brand-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter & Copyright *
        <div className="border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Newsletter *
            <div>
              <h4 className="font-semibold mb-2">Subscribe to our newsletter</h4>
              <p className="text-sm text-gray-400 mb-4">
                Get the latest updates on new products and special offers
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Button variant="primary" size="sm">
                  <FiSend className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Copyright *
            <div className="text-right text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} LabPro Supplies Ltd.</p>
              <p>All rights reserved.</p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}*/

'use client'

import Link from 'next/link'
import { 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiFacebook, 
  FiTwitter, 
  FiLinkedin, 
  FiInstagram,
  FiSend 
} from 'react-icons/fi'
import Container from './Container'
import Button from '../ui/Button'

const footerSections = {
  products: [
    { name: 'Lab Equipment', href: '/products/equipment' },
    { name: 'Chemicals', href: '/products/chemicals' },
    { name: 'Glassware', href: '/products/glassware' },
    { name: 'Plasticware', href: '/products/plasticware' },
    { name: 'Office Supplies', href: '/products/office' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
}

const socialLinks = [
  { icon: FiFacebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FiInstagram, href: 'https://instagram.com', label: 'Instagram' },
]

export default function Footer() {
  return (
    <footer className="bg-[var(--dark-text)] text-white pt-16 pb-8">
      <Container>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-[var(--brand-400)]">
                Link<span className="text-white dark:text-[var(--light-text)]">chem</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm">
              Your trusted partner in laboratory and scientific supplies. 
              Serving educational institutions and research facilities since 2014.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-400">
                <FiMapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>123 Industrial Area, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <FiPhone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>+254 700 123 456</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <FiMail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>info@linkchem.co.ke</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[var(--brand-400)] transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerSections).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-semibold text-lg mb-4 capitalize">{section}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-[var(--brand-400)] text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Newsletter & Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            
            {/* Newsletter */}
            <div>
              <h4 className="font-semibold mb-2">Subscribe to our newsletter</h4>
              <p className="text-sm text-gray-400 mb-4">
                Get the latest updates on new products and special offers
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                />
                <Button variant="primary" size="sm">
                  <FiSend className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Copyright */}
            <div className="text-right text-sm text-gray-400">
              <p>&copy; {new Date().getFullYear()} LabPro Supplies Ltd.</p>
              <p>All rights reserved.</p>
            </div>

          </div>
        </div>
      </Container>
    </footer>
  )
}