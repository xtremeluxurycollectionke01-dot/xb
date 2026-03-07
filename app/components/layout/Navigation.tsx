/*'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX,
  FiSun,
  FiMoon 
} from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import Button from '../ui/Button'
import Container from './Container'

const navigation = [
  { name: 'Products', href: '/products' },
  { name: 'Catalogue', href: '/catalogue' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <nav 
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md py-2' 
          : 'bg-transparent py-4'
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo *
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-brand-600">Lab<span className="text-brand-800">Pro</span></span>
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">Scientific Supplies</span>
          </Link>

          {/* Desktop Navigation *
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-brand-600',
                  pathname === item.href
                    ? 'text-brand-600'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Icons *
          <div className="hidden lg:flex items-center space-x-4">
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-brand-600 transition-colors">
              <FiSearch className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-brand-600 transition-colors relative">
              <FiShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
            <Button variant="ghost" size="sm">
              <FiUser className="w-4 h-4 mr-2" />
              Login
            </Button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-brand-600 transition-colors"
            >
              {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu button *
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-brand-600"
          >
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation *
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 shadow-lg py-4 animate-slide-in">
            <Container>
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'text-sm font-medium py-2 transition-colors hover:text-brand-600',
                      pathname === item.href
                        ? 'text-brand-600'
                        : 'text-gray-700 dark:text-gray-300'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex items-center space-x-4 pt-4 border-t border-card-border">
                  <button className="p-2 text-gray-600 dark:text-gray-400">
                    <FiSearch className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 dark:text-gray-400 relative">
                    <FiShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      3
                    </span>
                  </button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <FiUser className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </div>
              </div>
            </Container>
          </div>
        )}
      </Container>
    </nav>
  )
}*/



/*'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX,
  FiSun,
  FiMoon 
} from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import Button from '../ui/Button'
import Container from './Container'

const navigation = [
  { name: 'Products', href: '/products' },
  { name: 'Catalogue', href: '/catalogue' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const pathname = usePathname()

  // Scroll detection for sticky navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 dark:bg-[var(--dark-text)]/95 backdrop-blur-md shadow-md py-2'
          : 'bg-transparent py-4'
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo *
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[var(--brand-500)]">
              Link<span className="text-[var(--brand-700)]">chem</span>
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
              Supplies Limited
            </span>
          </Link>

          {/* Desktop Navigation *
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-[var(--brand-500)]',
                  pathname === item.href
                    ? 'text-[var(--brand-500)]'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Icons *
          <div className="hidden lg:flex items-center space-x-4">
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)] transition-colors">
              <FiSearch className="w-5 h-5" />
            </button>

            <button className="p-2 relative text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)] transition-colors">
              <FiShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-[var(--brand-500)] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            <Button variant="ghost" size="sm">
              <FiUser className="w-4 h-4 mr-2" />
              Login
            </Button>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)] transition-colors"
            >
              {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu button *
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)]"
          >
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation *
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[var(--dark-text)] shadow-lg py-4 animate-slide-in">
            <Container>
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'text-sm font-medium py-2 transition-colors hover:text-[var(--brand-500)]',
                      pathname === item.href
                        ? 'text-[var(--brand-500)]'
                        : 'text-gray-700 dark:text-gray-300'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="flex items-center space-x-4 pt-4 border-t border-[var(--card-border)]">
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)]">
                    <FiSearch className="w-5 h-5" />
                  </button>
                  <button className="p-2 relative text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)]">
                    <FiShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-[var(--brand-500)] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      3
                    </span>
                  </button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <FiUser className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </div>
              </div>
            </Container>
          </div>
        )}
      </Container>
    </nav>
  )
}*/



/*'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX,
  FiSun,
  FiMoon,
  FiLogOut,

  FiPackage,
  FiFileText,
  FiHeart
} from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { useAuth } from '@/app/hooks/useAuth'
import Button from '../ui/Button'
import Container from './Container'
import { FaUserCircle } from 'react-icons/fa'

const navigation = [
  { name: 'Products', href: '/products' },
  { name: 'Catalogue', href: '/catalogue' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const userMenuItems = [
  { name: 'My Dashboard', href: '/account', icon: FaUserCircle },
  { name: 'My Orders', href: '/account/orders', icon: FiPackage },
  { name: 'Quotations', href: '/account/quotations', icon: FiFileText },
  { name: 'Wishlist', href: '/account/wishlist', icon: FiHeart },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()

  // Scroll detection for sticky navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showUserMenu && !(e.target as Element).closest('.user-menu')) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showUserMenu])

  const handleLogout = async () => {
    await logout()
    setShowUserMenu(false)
  }

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 dark:bg-[var(--dark-text)]/95 backdrop-blur-md shadow-md py-2'
          : 'bg-transparent py-4'
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo *
          <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
            <span className="text-2xl font-bold text-[var(--brand-500)]">
              Link<span className="text-[var(--brand-700)]">chem</span>
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
              Supplies Limited
            </span>
          </Link>

          {/* Desktop Navigation *
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-[var(--brand-500)]',
                  pathname === item.href
                    ? 'text-[var(--brand-500)]'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Icons *
          <div className="hidden lg:flex items-center space-x-4">
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)] transition-colors">
              <FiSearch className="w-5 h-5" />
            </button>

            <Link href="/cart">
              <button className="p-2 relative text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)] transition-colors">
                <FiShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-[var(--brand-500)] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
            </Link>

            {/* User Menu *
            {isAuthenticated && user ? (
              <div className="relative user-menu">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[var(--soft-gray)] transition-colors"
                >
                  <div className="w-8 h-8 bg-[var(--brand-100)] rounded-full flex items-center justify-center">
                    <span className="text-[var(--brand-700)] font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 hidden xl:inline">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu *
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[var(--dark-text)] rounded-lg shadow-xl border border-[var(--card-border)] py-2">
                    {/* User Info *
                    <div className="px-4 py-3 border-b border-[var(--card-border)]">
                      <p className="text-sm font-medium text-[var(--dark-text)]">{user.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                      {user.clientNumber && (
                        <p className="text-xs text-[var(--brand-600)] mt-1">
                          Client #{user.clientNumber}
                        </p>
                      )}
                    </div>

                    {/* Menu Items *
                    {userMenuItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--soft-gray)] transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {item.name}
                        </Link>
                      )
                    })}

                    {/* Logout *
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-[var(--card-border)] mt-2"
                    >
                      <FiLogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <FiUser className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}

            {/* Dark Mode Toggle *
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)] transition-colors"
            >
              {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu button *
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)]"
          >
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation *
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[var(--dark-text)] shadow-lg py-4 animate-slide-in">
            <Container>
              <div className="flex flex-col space-y-4">
                {/* Mobile Nav Links *
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'text-sm font-medium py-2 transition-colors hover:text-[var(--brand-500)]',
                      pathname === item.href
                        ? 'text-[var(--brand-500)]'
                        : 'text-gray-700 dark:text-gray-300'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile User Section *
                {isAuthenticated && user ? (
                  <div className="pt-4 border-t border-[var(--card-border)]">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-[var(--brand-100)] rounded-full flex items-center justify-center">
                        <span className="text-[var(--brand-700)] font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--dark-text)]">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    {userMenuItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-[var(--brand-500)]"
                          onClick={() => setIsOpen(false)}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {item.name}
                        </Link>
                      )
                    })}

                    <button
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                      className="flex items-center w-full py-2 text-sm text-red-600 hover:text-red-700 mt-2"
                    >
                      <FiLogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-[var(--card-border)]">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="primary" fullWidth>
                        <FiUser className="w-4 h-4 mr-2" />
                        Sign In / Register
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Mobile Icons Row *
                <div className="flex items-center justify-between pt-4 border-t border-[var(--card-border)]">
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)]">
                    <FiSearch className="w-5 h-5" />
                  </button>
                  <Link href="/cart" onClick={() => setIsOpen(false)}>
                    <button className="p-2 relative text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)]">
                      <FiShoppingCart className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 bg-[var(--brand-500)] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        3
                      </span>
                    </button>
                  </Link>
                  <button
                    onClick={() => setIsDark(!isDark)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)]"
                  >
                    {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </Container>
          </div>
        )}
      </Container>
    </nav>
  )
}*/

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FiSearch, 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX,
  FiSun,
  FiMoon,
  FiLogOut,
  FiPackage,
  FiFileText,
  FiHeart,
  FiSettings,
  FiUsers
} from 'react-icons/fi'
import { FaUserCircle } from 'react-icons/fa'
import { cn } from '@/app/lib/utils'
import { useAuth } from '@/app/hooks/useAuth'
import Button from '../ui/Button'
import Container from './Container'

const navigation = [
  { name: 'Products', href: '/products' },
  { name: 'Catalogue', href: '/catalogue' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const clientMenuItems = [
  { name: 'Dashboard', href: '/account/dashboard', icon: FaUserCircle },
  { name: 'My Orders', href: '/account/orders', icon: FiPackage },
  { name: 'Quotations', href: '/account/quotations', icon: FiFileText },
  { name: 'Wishlist', href: '/account/wishlist', icon: FiHeart },
  { name: 'Settings', href: '/account/settings', icon: FiSettings },
]

const staffMenuItems = [
  { name: 'Staff Dashboard', href: '/staff/dashboard', icon: FaUserCircle },
  { name: 'Clients', href: '/staff/clients', icon: FiUsers },
  { name: 'Orders', href: '/staff/orders', icon: FiPackage },
  { name: 'Settings', href: '/staff/settings', icon: FiSettings },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()

  // Scroll detection for sticky navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showUserMenu && !(e.target as Element).closest('.user-menu')) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showUserMenu])

  const handleLogout = async () => {
    await logout()
    setShowUserMenu(false)
    setIsOpen(false)
  }

  // Determine which menu items to show based on user type
  const menuItems = user?.accountType === 'CLIENT' ? clientMenuItems : staffMenuItems

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 dark:bg-[var(--dark-text)]/95 backdrop-blur-md shadow-md py-2'
          : 'bg-transparent py-4'
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
            <span className="text-2xl font-bold text-[var(--brand-500)]">
              Link<span className="text-[var(--brand-700)]">chem</span>
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
              Supplies Limited
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-[var(--brand-500)]',
                  pathname === item.href
                    ? 'text-[var(--brand-500)]'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button 
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)] transition-colors"
              aria-label="Search"
            >
              <FiSearch className="w-5 h-5" />
            </button>

            <Link href="/cart">
              <button 
                className="p-2 relative text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)] transition-colors"
                aria-label="Shopping cart"
              >
                <FiShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-[var(--brand-500)] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
            </Link>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative user-menu">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[var(--soft-gray)] transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-[var(--brand-100)] rounded-full flex items-center justify-center">
                    <span className="text-[var(--brand-700)] font-medium">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 hidden xl:inline">
                    {user.name?.split(' ')[0] || 'User'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[var(--dark-text)] rounded-lg shadow-xl border border-[var(--card-border)] py-2">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-[var(--card-border)]">
                      <p className="text-sm font-medium text-[var(--dark-text)]">{user.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                      {user.clientNumber && (
                        <p className="text-xs text-[var(--brand-600)] mt-1">
                          Client #{user.clientNumber}
                        </p>
                      )}
                      {user.mustChangePassword && (
                        <p className="text-xs text-yellow-600 mt-1 flex items-center">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                          Password change required
                        </p>
                      )}
                    </div>

                    {/* Menu Items */}
                    {menuItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--soft-gray)] transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {item.name}
                        </Link>
                      )
                    })}

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-[var(--card-border)] mt-2"
                    >
                      <FiLogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <FiUser className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)] transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)]"
            aria-label="Toggle mobile menu"
          >
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[var(--dark-text)] shadow-lg py-4 animate-slide-in">
            <Container>
              <div className="flex flex-col space-y-4">
                {/* Mobile Nav Links */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'text-sm font-medium py-2 transition-colors hover:text-[var(--brand-500)]',
                      pathname === item.href
                        ? 'text-[var(--brand-500)]'
                        : 'text-gray-700 dark:text-gray-300'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile User Section */}
                {isAuthenticated && user ? (
                  <div className="pt-4 border-t border-[var(--card-border)]">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-[var(--brand-100)] rounded-full flex items-center justify-center">
                        <span className="text-[var(--brand-700)] font-medium">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--dark-text)]">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        {user.clientNumber && (
                          <p className="text-xs text-[var(--brand-600)]">#{user.clientNumber}</p>
                        )}
                      </div>
                    </div>

                    {menuItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-[var(--brand-500)]"
                          onClick={() => setIsOpen(false)}
                        >
                          <Icon className="w-4 h-4 mr-3" />
                          {item.name}
                        </Link>
                      )
                    })}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full py-2 text-sm text-red-600 hover:text-red-700 mt-2"
                    >
                      <FiLogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-[var(--card-border)]">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="primary" fullWidth>
                        <FiUser className="w-4 h-4 mr-2" />
                        Sign In / Register
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Mobile Icons Row */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--card-border)]">
                  <button 
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)]"
                    aria-label="Search"
                  >
                    <FiSearch className="w-5 h-5" />
                  </button>
                  <Link href="/cart" onClick={() => setIsOpen(false)}>
                    <button 
                      className="p-2 relative text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)]"
                      aria-label="Shopping cart"
                    >
                      <FiShoppingCart className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 bg-[var(--brand-500)] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        3
                      </span>
                    </button>
                  </Link>
                  <button
                    onClick={() => setIsDark(!isDark)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)]"
                    aria-label="Toggle dark mode"
                  >
                    {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </Container>
          </div>
        )}
      </Container>
    </nav>
  )
}