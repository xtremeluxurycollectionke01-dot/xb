// app/context/CartContext.tsx
/*'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type CartItem = {
  id: number | string
  name: string
  price: number
  image: string
  quantity: number
  maxStock?: number
  sku?: string;
}

type CartContextType = {
  items: CartItem[]
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  tax: number
  shipping: number
  total: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'linkchem-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isInitialized])

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        // Check if we have max stock and haven't exceeded it
        if (existingItem.maxStock && existingItem.quantity + quantity > existingItem.maxStock) {
          // Show toast or notification here later
          return prevItems
        }
        
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      
      return [...prevItems, { ...product, quantity }]
    })
    
    // Open cart drawer when adding items
    setIsCartOpen(true)
  }

  // Update the addToCart function to handle conversion if needed
  //const addToCart = (item: Omit<CartItem, 'quantity'>) => {
  //  setCartItems(prev => {
  //    const existingItem = prev.find(i => String(i.id) === String(item.id))
      
  //    if (existingItem) {
  //      const newQuantity = Math.min(existingItem.quantity + 1, existingItem.maxStock)
  //     return prev.map(i =>
  //        String(i.id) === String(item.id)
  //          ? { ...i, quantity: newQuantity }
  //          : i
  //      )
  //    }
      
  //    return [...prev, { ...item, quantity: 1 }]
  //  })
  //}

  const removeFromCart = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id)
      return
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  // Calculations
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.16 // 16% VAT
  const shipping = subtotal > 50000 ? 0 : 1000 // Free shipping over KES 50,000
  const total = subtotal + tax + shipping

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      tax,
      shipping,
      total,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}*/

// app/context/CartContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type CartItem = {
  id: string  // Change to string consistently
  name: string
  price: number
  image: string
  quantity: number
  maxStock?: number
  sku?: string;
}

type CartContextType = {
  items: CartItem[]
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeFromCart: (id: string) => void  // Change to string
  updateQuantity: (id: string, quantity: number) => void  // Change to string
  clearCart: () => void
  totalItems: number
  subtotal: number
  tax: number
  shipping: number
  total: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'linkchem-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        // Ensure all IDs are strings for consistency
        const normalizedCart = parsedCart.map((item: any) => ({
          ...item,
          id: String(item.id)
        }))
        setItems(normalizedCart)
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isInitialized])

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems(prevItems => {
      // Normalize the product ID to string
      const productId = String(product.id)
      const existingItem = prevItems.find(item => String(item.id) === productId)
      
      if (existingItem) {
        // Check if we have max stock and haven't exceeded it
        const newQuantity = existingItem.quantity + quantity
        if (existingItem.maxStock && newQuantity > existingItem.maxStock) {
          // Show toast or notification here later
          console.warn(`Cannot add more than ${existingItem.maxStock} of this item`)
          return prevItems
        }
        
        return prevItems.map(item =>
          String(item.id) === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      }
      
      // Create new cart item with string ID
      return [...prevItems, { 
        ...product, 
        id: productId,
        quantity 
      }]
    })
    
    // Open cart drawer when adding items
    setIsCartOpen(true)
  }

  const removeFromCart = (id: string) => {
    setItems(prevItems => prevItems.filter(item => String(item.id) !== String(id)))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id)
      return
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        String(item.id) === String(id) ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  // Calculations
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.16 // 16% VAT
  const shipping = subtotal > 50000 ? 0 : 1000 // Free shipping over KES 50,000
  const total = subtotal + tax + shipping

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      tax,
      shipping,
      total,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}