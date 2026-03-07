'use client'

import { useEffect, useState, useRef } from 'react'
import { cn } from '@/app/lib/utils'

interface CounterProps {
  end: number
  start?: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export default function Counter({ 
  end, 
  start = 0, 
  duration = 2000, 
  suffix = '', 
  prefix = '',
  className 
}: CounterProps) {
  const [count, setCount] = useState(start)
  const countRef = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const increment = (end - start) / (duration / 16) // 60fps
    let current = start
    let animationFrame: number

    const animate = () => {
      current += increment
      if (current >= end) {
        setCount(end)
        return
      }
      setCount(Math.floor(current))
      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, start, end, duration])

  return (
    <span ref={countRef} className={cn('font-bold', className)}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}