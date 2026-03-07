'use client'

import { useState } from 'react'
import { cn } from '@/app/lib/utils'

export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  badge?: number
}

interface TabsProps {
  tabs: TabItem[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  className?: string
}

export default function Tabs({ tabs, defaultTab, onChange, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Headers */}
      <div className="border-b border-card-border">
        <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors relative',
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              )}
            >
              {tab.label}
              {tab.badge ? (
                <span className={cn(
                  'ml-2 px-2 py-0.5 text-xs rounded-full',
                  activeTab === tab.id
                    ? 'bg-brand-100 text-brand-700'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                )}>
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  )
}