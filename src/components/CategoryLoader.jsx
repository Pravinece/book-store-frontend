import React from 'react'
import BookIcon from '../Pages/Book/BookIcon'
/**
 * CategoryLoader — inline SVG page-turning animation
 * One page lifts, flips across the spine, and lands on the left side.
 */
function CategoryLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full py-12">      
        <BookIcon />
      <p className="text-gray-500 text-sm font-medium animate-pulse">
        Loading categories…
      </p>
    </div>
  )
}

export default CategoryLoader
