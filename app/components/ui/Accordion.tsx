'use client'

import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  defaultExpanded?: string[]
  className?: string
}

export default function Accordion({ 
  items, 
  allowMultiple = false, 
  defaultExpanded = [],
  className 
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded)

  const toggleItem = (itemId: string) => {
    if (allowMultiple) {
      setExpandedItems(prev =>
        prev.includes(itemId)
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      )
    } else {
      setExpandedItems(prev =>
        prev.includes(itemId) ? [] : [itemId]
      )
    }
  }

  return (
    <div className={cn('divide-y divide-[var(--card-border)]', className)}>
      {items.map((item) => (
        <div key={item.id} className="py-4">
          <button
            onClick={() => toggleItem(item.id)}
            className="w-full flex items-center justify-between text-left"
          >
            <span className="font-medium text-[var(--dark-text)]">
              {item.title}
            </span>
            <FiChevronDown
              className={cn(
                'w-5 h-5 text-gray-500 transition-transform duration-200',
                expandedItems.includes(item.id) && 'rotate-180'
              )}
            />
          </button>
          
          <div
            className={cn(
              'mt-2 text-gray-600 dark:text-gray-400 overflow-hidden transition-all duration-200',
              expandedItems.includes(item.id) ? 'max-h-96' : 'max-h-0'
            )}
          >
            <div className="pb-2">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}