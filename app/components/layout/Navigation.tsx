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
       {/* <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}> <span className="text-2xl font-bold text-[var(--brand-500)]"> Link<span className="text-[var(--brand-700)]">chem</span> </span> <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline"> Supplies Limited </span> </Link>*

          {/* Logo *
          <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
            {/* Logo Image *
            {/*<img
              src="/images/logo-dark.png"
              alt="Linkchem Supplies Logo"
              className="h-14 w-14 object-contain" // Square, same height as navbar
            />*
            <img
              src="/images/logo-dark.png"
              alt="Linkchem Supplies Logo"
              className="h-16 w-auto object-contain"
            />

            {/* Existing Text *
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

            {/* User Menu *
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
                      {user.mustChangePassword && (
                        <p className="text-xs text-yellow-600 mt-1 flex items-center">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                          Password change required
                        </p>
                      )}
                    </div>

                    {/* Menu Items *
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
              aria-label="Toggle dark mode"
            >
              {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu button *
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-500)]"
            aria-label="Toggle mobile menu"
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

                {/* Mobile Icons Row *
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
  FiUsers,
  FiChevronDown
} from 'react-icons/fi'
import { FaUserCircle } from 'react-icons/fa'
import { cn } from '@/app/lib/utils'
import { useAuth } from '@/app/hooks/useAuth'
import Button from '../ui/Button'
import Container from './Container'
import { useCart } from '@/app/context/CartContext'

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
  const { totalItems, setIsCartOpen } = useCart()

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
        'fixed top-0 w-full z-50 transition-all duration-500',
        isScrolled
          ? 'bg-white/90 dark:bg-[var(--dark-text)]/90 backdrop-blur-lg shadow-lg py-2'
          : 'bg-transparent py-4'
      )}
    >
      {/* Decorative gradient line when scrolled */}
      {isScrolled && (
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--brand-400)] to-transparent opacity-30"></div>
      )}

      <Container>
        <div className="flex items-center justify-between">
          {/* Enhanced Logo Section */}
          <Link 
            href="/" 
            className="group relative flex items-center space-x-3" 
            onClick={() => setIsOpen(false)}
          >
            {/* Logo with glow effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-500">
                <img
                  src="/images/logo-dark.png"
                  alt="Linkchem Supplies Logo"
                  className="h-12 w-auto object-contain transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Text with gradient effect */}
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] bg-clip-text text-transparent">
                  Link
                </span>
                {/*<span className="text-2xl font-bold text-gray-900 dark:text-white">
                  chem
                </span>*/}
                <span className="text-2xl font-bold text-[var(--brand-700)] dark:text-white">
                  chem
                </span>
                
                <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 bg-[var(--brand-50)] dark:bg-[var(--brand-900)] text-[var(--brand-700)] dark:text-[var(--brand-300)] rounded-full border border-[var(--brand-200)] dark:border-[var(--brand-700)]">
                  Since 2014
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 tracking-wider">
                Scientific Excellence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with elegant hover effect */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group',
                  pathname === item.href
                    ? 'text-[var(--brand-600)] dark:text-[var(--brand-400)]'
                    : 'text-gray-700 dark:text-gray-300 hover:text-[var(--brand-600)] dark:hover:text-[var(--brand-400)]'
                )}
              >
                <span className="relative z-10">{item.name}</span>
                {pathname === item.href && (
                  <span className="absolute inset-0 bg-[var(--brand-50)] dark:bg-[var(--brand-900)] rounded-lg border border-[var(--brand-200)] dark:border-[var(--brand-700)]"></span>
                )}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
              </Link>
            ))}
          </div>

          {/* Right Icons with enhanced styling */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Search with tooltip */}
            <div className="relative group">
              <button 
                className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] dark:hover:text-[var(--brand-400)] hover:bg-[var(--brand-50)] dark:hover:bg-[var(--brand-900)] rounded-xl transition-all duration-300"
                aria-label="Search"
              >
                <FiSearch className="w-5 h-5" />
              </button>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Search
              </span>
            </div>

            {/* Cart with elegant badge */}
            {/*<Link href="/cart" className="relative group">
              <button 
                className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] dark:hover:text-[var(--brand-400)] hover:bg-[var(--brand-50)] dark:hover:bg-[var(--brand-900)] rounded-xl transition-all duration-300 relative"
                aria-label="Shopping cart"
              >
                <FiShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1 shadow-lg">
                  3
                </span>
              </button>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Cart
              </span>
            </Link>*/}
            {/* Desktop Cart Button */}
            <Link href="/cart" className="relative group" onClick={(e) => {
              e.preventDefault()
              setIsCartOpen(true)
            }}>
              <button 
                className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] dark:hover:text-[var(--brand-400)] hover:bg-[var(--brand-50)] dark:hover:bg-[var(--brand-900)] rounded-xl transition-all duration-300 relative"
                aria-label="Shopping cart"
              >
                <FiShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1 shadow-lg animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Cart
              </span>
            </Link>

            {/* User Menu - Enhanced */}
            {isAuthenticated && user ? (
              <div className="relative user-menu">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-1.5 pr-3 rounded-xl hover:bg-[var(--brand-50)] dark:hover:bg-[var(--brand-900)] transition-all duration-300 border border-transparent hover:border-[var(--brand-200)] dark:hover:border-[var(--brand-700)] group"
                  aria-label="User menu"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <div className="relative w-9 h-9 bg-gradient-to-br from-[var(--brand-100)] to-[var(--brand-200)] dark:from-[var(--brand-800)] dark:to-[var(--brand-700)] rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-md">
                      <span className="text-[var(--brand-700)] dark:text-[var(--brand-300)] font-semibold">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                  </div>
                  <div className="hidden xl:flex items-center space-x-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.name?.split(' ')[0] || 'User'}
                    </span>
                    <FiChevronDown className={cn(
                      "w-4 h-4 text-gray-500 transition-transform duration-300",
                      showUserMenu && "rotate-180"
                    )} />
                  </div>
                </button>

                {/* Dropdown Menu - Enhanced */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-[var(--card-border)] py-2 animate-fadeIn">
                    {/* Decorative header */}
                    <div className="absolute -top-2 right-6 w-4 h-4 bg-white dark:bg-gray-900 border-l border-t border-[var(--card-border)] transform rotate-45"></div>
                    
                    {/* User Info - Enhanced */}
                    <div className="px-4 py-4 border-b border-[var(--card-border)] bg-gradient-to-r from-[var(--brand-50)]/50 to-transparent dark:from-[var(--brand-900)]/30 rounded-t-2xl">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
                      {user.clientNumber && (
                        <p className="text-xs text-[var(--brand-600)] dark:text-[var(--brand-400)] mt-2 font-mono bg-[var(--brand-100)] dark:bg-[var(--brand-900)] inline-block px-2 py-1 rounded-full">
                          Client #{user.clientNumber}
                        </p>
                      )}
                      {user.mustChangePassword && (
                        <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-2 flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1 animate-pulse"></span>
                          Password change required
                        </p>
                      )}
                    </div>

                    {/* Menu Items - Enhanced */}
                    <div className="py-2">
                      {menuItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--brand-50)] dark:hover:bg-[var(--brand-900)] transition-all duration-300 group"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-3 group-hover:bg-[var(--brand-100)] dark:group-hover:bg-[var(--brand-800)] transition-colors duration-300">
                              <Icon className="w-4 h-4 text-[var(--brand-600)] dark:text-[var(--brand-400)]" />
                            </div>
                            {item.name}
                          </Link>
                        )
                      })}
                    </div>

                    {/* Logout - Enhanced */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 border-t border-[var(--card-border)] mt-2 group"
                    >
                      <div className="w-8 h-8 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors duration-300">
                        <FiLogOut className="w-4 h-4" />
                      </div>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button 
                  variant="primary" 
                  size="sm"
                  className="rounded-xl px-5 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <FiUser className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}

            {/* Dark Mode Toggle - Enhanced */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="relative p-2.5 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] dark:hover:text-[var(--brand-400)] hover:bg-[var(--brand-50)] dark:hover:bg-[var(--brand-900)] rounded-xl transition-all duration-300 group"
              aria-label="Toggle dark mode"
            >
              <div className="relative w-5 h-5">
                <FiSun className={cn(
                  "absolute inset-0 transition-all duration-500 transform",
                  isDark ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"
                )} />
                <FiMoon className={cn(
                  "absolute inset-0 transition-all duration-500 transform",
                  isDark ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"
                )} />
              </div>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {isDark ? 'Light' : 'Dark'} mode
              </span>
            </button>
          </div>

          {/* Mobile menu button - Enhanced */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] dark:hover:text-[var(--brand-400)] hover:bg-[var(--brand-50)] dark:hover:bg-[var(--brand-900)] rounded-xl transition-all duration-300 group"
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-5 h-5">
              <FiX className={cn(
                "absolute inset-0 transition-all duration-300",
                isOpen ? "rotate-0 opacity-100 scale-100" : "rotate-90 opacity-0 scale-50"
              )} />
              <FiMenu className={cn(
                "absolute inset-0 transition-all duration-300",
                isOpen ? "-rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"
              )} />
            </div>
          </button>
        </div>

        {/* Mobile Navigation - Enhanced with animations */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-2xl py-6 border-t border-[var(--card-border)] animate-slideDown">
            {/* Decorative gradient line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--brand-400)] to-transparent"></div>
            
            <Container>
              <div className="flex flex-col space-y-4">
                {/* Mobile Nav Links */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'relative text-sm font-medium py-3 px-4 rounded-xl transition-all duration-300 group',
                      pathname === item.href
                        ? 'text-[var(--brand-600)] dark:text-[var(--brand-400)] bg-[var(--brand-50)] dark:bg-[var(--brand-900)] border border-[var(--brand-200)] dark:border-[var(--brand-700)]'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {pathname !== item.href && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
                    )}
                  </Link>
                ))}

                {/* Mobile User Section - Enhanced */}
                {isAuthenticated && user ? (
                  <div className="pt-4 border-t border-[var(--card-border)]">
                    <div className="flex items-center space-x-3 mb-6 p-3 bg-gradient-to-r from-[var(--brand-50)] to-transparent dark:from-[var(--brand-900)]/30 rounded-xl">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-100)] to-[var(--brand-200)] dark:from-[var(--brand-800)] dark:to-[var(--brand-700)] rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-md">
                          <span className="text-[var(--brand-700)] dark:text-[var(--brand-300)] font-semibold text-lg">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        {user.clientNumber && (
                          <p className="text-xs text-[var(--brand-600)] dark:text-[var(--brand-400)] mt-1">
                            Client #{user.clientNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    {menuItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center py-3 px-4 text-sm text-gray-700 dark:text-gray-300 hover:bg-[var(--brand-50)] dark:hover:bg-[var(--brand-900)] rounded-xl transition-all duration-300 group"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mr-3 group-hover:bg-[var(--brand-100)] dark:group-hover:bg-[var(--brand-800)] transition-colors duration-300">
                            <Icon className="w-4 h-4 text-[var(--brand-600)] dark:text-[var(--brand-400)]" />
                          </div>
                          {item.name}
                        </Link>
                      )
                    })}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full py-3 px-4 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 mt-2 group"
                    >
                      <div className="w-8 h-8 bg-red-50 dark:bg-red-900/30 rounded-lg flex items-center justify-center mr-3 group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors duration-300">
                        <FiLogOut className="w-4 h-4" />
                      </div>
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-[var(--card-border)]">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button 
                        variant="primary" 
                        fullWidth 
                        className="rounded-xl py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <FiUser className="w-4 h-4 mr-2" />
                        Sign In / Register
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Mobile Icons Row - Enhanced */}
                <div className="flex items-center justify-around pt-4 border-t border-[var(--card-border)]">
                  <button 
                    className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] dark:hover:text-[var(--brand-400)] group"
                    aria-label="Search"
                  >
                    <div className="p-2 rounded-xl group-hover:bg-[var(--brand-50)] dark:group-hover:bg-[var(--brand-900)] transition-all duration-300">
                      <FiSearch className="w-5 h-5" />
                    </div>
                    <span className="text-xs mt-1">Search</span>
                  </button>
                  
                  {/*<Link href="/cart" onClick={() => setIsOpen(false)}>
                    <button 
                      className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] dark:hover:text-[var(--brand-400)] group relative"
                      aria-label="Shopping cart"
                    >
                      <div className="p-2 rounded-xl group-hover:bg-[var(--brand-50)] dark:group-hover:bg-[var(--brand-900)] transition-all duration-300 relative">
                        <FiShoppingCart className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1 shadow-lg">
                          3
                        </span>
                      </div>
                      <span className="text-xs mt-1">Cart</span>
                    </button>
                  </Link>*/}

                  {/* Mobile Cart Button */}
                    <Link href="/cart" onClick={(e) => {
                      e.preventDefault()
                      setIsCartOpen(true)
                      setIsOpen(false)
                    }}>
                      <button 
                        className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] dark:hover:text-[var(--brand-400)] group relative"
                        aria-label="Shopping cart"
                      >
                        <div className="p-2 rounded-xl group-hover:bg-[var(--brand-50)] dark:group-hover:bg-[var(--brand-900)] transition-all duration-300 relative">
                          <FiShoppingCart className="w-5 h-5" />
                          {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1 shadow-lg">
                              {totalItems}
                            </span>
                          )}
                        </div>
                        <span className="text-xs mt-1">Cart</span>
                      </button>
                    </Link>
                                      
                  <button
                    onClick={() => setIsDark(!isDark)}
                    className="flex flex-col items-center p-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] dark:hover:text-[var(--brand-400)] group"
                    aria-label="Toggle dark mode"
                  >
                    <div className="p-2 rounded-xl group-hover:bg-[var(--brand-50)] dark:group-hover:bg-[var(--brand-900)] transition-all duration-300">
                      {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                    </div>
                    <span className="text-xs mt-1">{isDark ? 'Light' : 'Dark'}</span>
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