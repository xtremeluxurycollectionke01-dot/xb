/*'use client'

import { FiBook, FiDownload, FiList } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'

export type ViewMode = 'flipbook' | 'pdf' | 'list'

interface ViewToggleProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  const views = [
    { id: 'flipbook', label: 'Flipbook View', icon: FiBook },
    { id: 'pdf', label: 'PDF Download', icon: FiDownload },
    { id: 'list', label: 'List View', icon: FiList },
  ] as const

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-1 inline-flex">
      {views.map((view) => {
        const Icon = view.icon
        const isActive = currentView === view.id
        
        return (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id as ViewMode)}
            className={cn(
              'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all',
              isActive 
                ? 'bg-brand-500 text-white shadow-md' 
                : 'text-gray-600 dark:text-gray-400 hover:text-brand-600'
            )}
          >
            <Icon className="w-4 h-4 mr-2" />
            {view.label}
          </button>
        )
      })}
    </div>
  )
}*/

'use client'

import { FiBook, FiDownload, FiList } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'

export type ViewMode = 'flipbook' | 'pdf' | 'list'

interface ViewToggleProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  const views = [
    { id: 'flipbook', label: 'Flipbook View', icon: FiBook },
    { id: 'pdf', label: 'PDF Download', icon: FiDownload },
    { id: 'list', label: 'List View', icon: FiList },
  ] as const

  return (
    <div className="bg-[var(--white)] dark:bg-[var(--dark-text)] rounded-lg shadow-sm p-1 inline-flex">
      {views.map((view) => {
        const Icon = view.icon
        const isActive = currentView === view.id

        return (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id as ViewMode)}
            className={cn(
              'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all',
              isActive
                ? 'bg-[var(--brand-500)] text-[var(--white)] dark:text-[var(--dark-text)] shadow-md'
                : 'text-[var(--dark-text)] dark:text-[var(--light-text)] hover:text-[var(--brand-500)]'
            )}
          >
            <Icon className="w-4 h-4 mr-2" />
            {view.label}
          </button>
        )
      })}
    </div>
  )
}