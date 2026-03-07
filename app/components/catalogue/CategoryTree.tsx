/*'use client'

import { useState } from 'react'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'
import { categories, type Category, type Subcategory } from '@/app/lib/catalogue-data'
import Checkbox from '../ui/Checkbox'
import Badge from '../ui/Badge'

interface CategoryTreeProps {
  selectedCategories: string[]
  onCategoryChange: (categoryId: string, checked: boolean) => void
  selectedSubcategories: string[]
  onSubcategoryChange: (subcategoryId: string, checked: boolean) => void
}

export default function CategoryTree({
  selectedCategories,
  onCategoryChange,
  selectedSubcategories,
  onSubcategoryChange,
}: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.map(c => c.id) // Expand all by default
  )

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const isCategorySelected = (category: Category) => {
    return selectedCategories.includes(category.id)
  }

  const areAllSubcategoriesSelected = (category: Category) => {
    return category.subcategories.every(sub => 
      selectedSubcategories.includes(sub.id)
    )
  }

  const areSomeSubcategoriesSelected = (category: Category) => {
    return category.subcategories.some(sub => 
      selectedSubcategories.includes(sub.id)
    ) && !areAllSubcategoriesSelected(category)
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-card-border p-4">
      <h3 className="font-semibold text-dark-text mb-4">Categories</h3>
      
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="space-y-2">
            {/* Category Header *
            <div className="flex items-center">
              <button
                onClick={() => toggleCategory(category.id)}
                className="mr-2 text-gray-500 hover:text-brand-600"
              >
                {expandedCategories.includes(category.id) ? (
                  <FiChevronDown className="w-4 h-4" />
                ) : (
                  <FiChevronRight className="w-4 h-4" />
                )}
              </button>
              
              <Checkbox
                id={`cat-${category.id}`}
                checked={isCategorySelected(category)}
                onChange={(e) => onCategoryChange(category.id, e.target.checked)}
                indeterminate={!isCategorySelected(category) && areSomeSubcategoriesSelected(category)}
              />
              
              <label
                htmlFor={`cat-${category.id}`}
                className="ml-2 text-sm font-medium text-dark-text flex-1 cursor-pointer"
              >
                {category.name}
              </label>
              
              <Badge variant="default" className="ml-2">
                {category.subcategories.reduce((sum, sub) => sum + sub.itemCount, 0)}
              </Badge>
            </div>

            {/* Subcategories *
            {expandedCategories.includes(category.id) && (
              <div className="ml-8 space-y-2">
                {category.subcategories.map((subcategory) => (
                  <div key={subcategory.id} className="flex items-center">
                    <Checkbox
                      id={`sub-${subcategory.id}`}
                      checked={selectedSubcategories.includes(subcategory.id)}
                      onChange={(e) => onSubcategoryChange(subcategory.id, e.target.checked)}
                    />
                    <label
                      htmlFor={`sub-${subcategory.id}`}
                      className="ml-2 text-sm text-gray-600 dark:text-gray-400 flex-1 cursor-pointer"
                    >
                      {subcategory.name}
                    </label>
                    <Badge variant="default" className="text-xs">
                      {subcategory.itemCount}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Filters *
      <div className="mt-6 pt-4 border-t border-card-border">
        <h4 className="text-sm font-medium text-dark-text mb-3">Quick Filters</h4>
        <div className="space-y-2">
          <Checkbox id="in-stock" label="In Stock Only" />
          <Checkbox id="on-sale" label="On Sale" />
          <Checkbox id="new-arrivals" label="New Arrivals" />
        </div>
      </div>
    </div>
  )
}*/

'use client'

import { useState } from 'react'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'
import { categories, type Category } from '@/app/lib/catalogue-data'
import Checkbox from '../ui/Checkbox'
import Badge from '../ui/Badge'

interface CategoryTreeProps {
  selectedCategories: string[]
  onCategoryChange: (categoryId: string, checked: boolean) => void
  selectedSubcategories: string[]
  onSubcategoryChange: (subcategoryId: string, checked: boolean) => void
}

export default function CategoryTree({
  selectedCategories,
  onCategoryChange,
  selectedSubcategories,
  onSubcategoryChange,
}: CategoryTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.map(c => c.id) // Expand all by default
  )

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const isCategorySelected = (category: Category) =>
    selectedCategories.includes(category.id)

  const areAllSubcategoriesSelected = (category: Category) =>
    category.subcategories.every(sub =>
      selectedSubcategories.includes(sub.id)
    )

  const areSomeSubcategoriesSelected = (category: Category) =>
    category.subcategories.some(sub =>
      selectedSubcategories.includes(sub.id)
    ) && !areAllSubcategoriesSelected(category)

  return (
    <div className="bg-[var(--white)] dark:bg-[var(--dark-text)] rounded-lg border border-[var(--card-border)] dark:border-[var(--soft-gray)] p-4">
      <h3 className="font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)] mb-4">
        Categories
      </h3>

      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.id} className="space-y-2">
            {/* Category Header */}
            <div className="flex items-center">
              <button
                onClick={() => toggleCategory(category.id)}
                className="mr-2 text-[var(--soft-gray)] dark:text-[var(--card-border)] hover:text-[var(--brand-500)]"
              >
                {expandedCategories.includes(category.id) ? (
                  <FiChevronDown className="w-4 h-4" />
                ) : (
                  <FiChevronRight className="w-4 h-4" />
                )}
              </button>

              <Checkbox
                id={`cat-${category.id}`}
                checked={isCategorySelected(category)}
                onChange={(e) => onCategoryChange(category.id, e.target.checked)}
                indeterminate={!isCategorySelected(category) && areSomeSubcategoriesSelected(category)}
              />

              <label
                htmlFor={`cat-${category.id}`}
                className="ml-2 text-sm font-medium text-[var(--dark-text)] dark:text-[var(--light-text)] flex-1 cursor-pointer"
              >
                {category.name}
              </label>

              <Badge variant="default" className="ml-2">
                {category.subcategories.reduce((sum, sub) => sum + sub.itemCount, 0)}
              </Badge>
            </div>

            {/* Subcategories */}
            {expandedCategories.includes(category.id) && (
              <div className="ml-8 space-y-2">
                {category.subcategories.map((subcategory) => (
                  <div key={subcategory.id} className="flex items-center">
                    <Checkbox
                      id={`sub-${subcategory.id}`}
                      checked={selectedSubcategories.includes(subcategory.id)}
                      onChange={(e) => onSubcategoryChange(subcategory.id, e.target.checked)}
                    />
                    <label
                      htmlFor={`sub-${subcategory.id}`}
                      className="ml-2 text-sm text-[var(--dark-text)] dark:text-[var(--light-text)] flex-1 cursor-pointer"
                    >
                      {subcategory.name}
                    </label>
                    <Badge variant="default" className="text-xs">
                      {subcategory.itemCount}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Filters */}
      <div className="mt-6 pt-4 border-t border-[var(--card-border)] dark:border-[var(--soft-gray)]">
        <h4 className="text-sm font-medium text-[var(--dark-text)] dark:text-[var(--light-text)] mb-3">
          Quick Filters
        </h4>
        <div className="space-y-2">
          <Checkbox id="in-stock" label="In Stock Only" />
          <Checkbox id="on-sale" label="On Sale" />
          <Checkbox id="new-arrivals" label="New Arrivals" />
        </div>
      </div>
    </div>
  )
}