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



/*'use client'

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
        {/* Main Footer Content *
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info *
          <div className="space-y-4">
            {/*<Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-[var(--brand-400)]">
                Link<span className="text-white dark:text-[var(--light-text)]">chem</span>
              </span>
            </Link>*
            <Link href="/" className="flex items-center space-x-2">
              {/* Logo *
              <img
                src="/images/brand-400.png"
                alt="Linkchem Supplies Logo"
                className="h-10 w-auto object-contain"
              />

              {/* Text *
              <span className="text-2xl font-bold text-[var(--brand-400)]">
                Link<span className="text-white dark:text-[var(--light-text)]">chem</span>
              </span>
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
                <span>info@linkchem.co.ke</span>
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
                    className="text-gray-400 hover:text-[var(--brand-400)] transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Footer Links *
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
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
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
    <footer className="bg-gradient-to-br from-gray-900 via-[var(--dark-text)] to-gray-900 text-white pt-20 pb-8 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--brand-400)] rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--brand-600)] rounded-full filter blur-3xl"></div>
      </div>
      
      <Container className="relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Company Info - Enhanced Logo Section */}
          <div className="space-y-6 lg:col-span-1">
            {/* Logo Container - Made prominent and beautiful */}
            <Link href="/" className="group block">
              <div className="flex flex-col space-y-4">
                {/* Logo with elegant container */}
                <div className="relative">
                  {/* Background glow effect */}
                  <div className="absolute inset-0 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                  
                  {/* Logo and text container */}
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 group-hover:border-[var(--brand-400)] transition-all duration-500">
                    <div className="flex items-center space-x-4">
                      {/* Logo with elegant styling */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-[var(--brand-400)] rounded-full blur-md opacity-50"></div>
                        <img
                          src="/images/brand-400.png"
                          alt="Linkchem Supplies Logo"
                          className="relative h-16 w-auto object-contain transform group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Text with gradient effect */}
                      <div>
                        <span className="text-3xl font-bold bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-300)] bg-clip-text text-transparent">
                          Link
                        </span>
                        <span className="text-3xl font-bold text-white">
                          chem
                        </span>
                      </div>
                    </div>
                    
                    {/* Tagline */}
                    <div className="mt-3 text-xs text-gray-400 tracking-wider uppercase">
                      Scientific Excellence Since 2014
                    </div>
                  </div>
                </div>

                {/* Company Description - Enhanced */}
                <div className="relative">
                  <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-[var(--brand-400)] to-transparent"></div>
                  <p className="text-gray-300 text-sm leading-relaxed pl-2">
                    Your trusted partner in laboratory and scientific supplies, 
                    delivering excellence to educational institutions and research 
                    facilities across East Africa.
                  </p>
                </div>
              </div>
            </Link>

            {/* Contact Info - Enhanced */}
            <div className="space-y-3 bg-gray-800/50 p-4 rounded-xl backdrop-blur-sm">
              <div className="flex items-center text-sm text-gray-300 group hover:text-[var(--brand-400)] transition-colors">
                <div className="p-2 bg-[var(--brand-400)]/10 rounded-lg mr-3 group-hover:bg-[var(--brand-400)]/20 transition-colors">
                  <FiMapPin className="w-4 h-4 text-[var(--brand-400)]" />
                </div>
                <span>123 Industrial Area, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center text-sm text-gray-300 group hover:text-[var(--brand-400)] transition-colors">
                <div className="p-2 bg-[var(--brand-400)]/10 rounded-lg mr-3 group-hover:bg-[var(--brand-400)]/20 transition-colors">
                  <FiPhone className="w-4 h-4 text-[var(--brand-400)]" />
                </div>
                <span>+254 700 123 456</span>
              </div>
              <div className="flex items-center text-sm text-gray-300 group hover:text-[var(--brand-400)] transition-colors">
                <div className="p-2 bg-[var(--brand-400)]/10 rounded-lg mr-3 group-hover:bg-[var(--brand-400)]/20 transition-colors">
                  <FiMail className="w-4 h-4 text-[var(--brand-400)]" />
                </div>
                <span>info@linkchem.co.ke</span>
              </div>
            </div>

            {/* Social Links - Enhanced */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group"
                    aria-label={social.label}
                  >
                    <div className="absolute inset-0 bg-[var(--brand-400)] rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <div className="relative p-3 bg-gray-800 rounded-lg border border-gray-700 group-hover:border-[var(--brand-400)] group-hover:bg-gray-700 transition-all duration-300">
                      <Icon className="w-4 h-4 text-gray-400 group-hover:text-[var(--brand-400)] transition-colors duration-300" />
                    </div>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Footer Links - Rest remains similar but with enhanced styling */}
          {Object.entries(footerSections).map(([section, links]) => (
            <div key={section} className="lg:col-span-1">
              <h3 className="text-lg font-semibold mb-6 relative inline-block">
                <span className="relative z-10 capitalize">{section}</span>
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-[var(--brand-400)] to-transparent"></span>
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-[var(--brand-400)] text-sm transition-all duration-300 hover:translate-x-2 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter & Copyright - Enhanced */}
        {/*<div className="border-t border-gray-800 pt-10 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Newsletter - Softer *
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--brand-400)]/20 to-[var(--brand-500)]/20 rounded-lg blur-sm opacity-40"></div>
            
            <div className="relative bg-gray-800/60 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
              <h4 className="font-semibold mb-2">Subscribe to our newsletter</h4>
              <p className="text-sm text-gray-400 mb-4">
                Get the latest updates on new products and special offers
              </p>

              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] border border-gray-700 focus:border-transparent"
                />

                <Button variant="primary" size="sm" className="px-6">
                  <FiSend className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Copyright *
          <div className="text-right">
            <div className="inline-block text-right">
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()}
                <span className="text-[var(--brand-400)] font-semibold mx-1">
                  Linkchem Supplies Ltd.
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Crafted with precision • All rights reserved
              </p>
            </div>
          </div>

        </div>
      </div>*/}
      {/* Newsletter & Copyright */}

    <div className="border-t border-gray-800 pt-10 mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">


    {/* Newsletter */}
    <div className="relative group">

      {/* Soft glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--brand-400)]/15 to-[var(--brand-500)]/15 rounded-lg blur-sm opacity-40 group-hover:opacity-60 transition duration-500"></div>

      {/* Card */}
      <div className="relative bg-gray-800/60 backdrop-blur-sm p-6 rounded-lg border border-gray-700 
        transition-all duration-300 group-hover:border-[var(--brand-400)]/60 
        group-hover:-translate-y-[2px] group-hover:shadow-lg">

        <h4 className="font-semibold mb-2 text-white">
          Subscribe to our newsletter
        </h4>

        <p className="text-sm text-gray-400 mb-4">
          Get the latest updates on new products and special offers
        </p>

        <form className="flex gap-2">

          {/* Email Input */}
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-700
            focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent
            hover:border-gray-500 transition-colors duration-300 placeholder-gray-500"
          />

          {/* Send Button */}
          <Button
            variant="primary"
            size="sm"
            className="px-6 transition-all duration-300 hover:scale-[1.04] hover:shadow-md active:scale-95"
          >
            <FiSend className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Button>

        </form>

      </div>
    </div>

    {/* Copyright */}
      <div className="text-right">
          <div className="inline-block text-right">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()}
              <span className="text-[var(--brand-400)] font-semibold mx-1">
                Linkchem Supplies Ltd.
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Crafted with precision • All rights reserved
            </p>
          </div>
      </div>
    </div>
    </div>

      </Container>
    </footer>
  )
}