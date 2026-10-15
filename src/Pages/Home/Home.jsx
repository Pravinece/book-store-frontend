import React, { useState, useRef } from 'react'
import { X } from 'lucide-react'
import books from '../../Datas/book-catalogue-data.json'
import BookFlip from '../Book/BookFlip'

function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [transformOrigin, setTransformOrigin] = useState('center center')
  const [isOpen, setIsOpen] = useState(false)

  const openModal = (category, e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    setTransformOrigin(`${x}px ${y}px`)
    setSelectedCategory(category)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setTimeout(() => setSelectedCategory(null), 300)
  }

  return (
    <div className="w-[50%] h-[80%] overflow-auto mx-auto">
      {books.categories.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
          {books.categories.map((book) => (
            <div
              key={book.id}
              onClick={(e) => openModal(book, e)}
              className="w-[150px] h-[200px] bg-white border-1 cursor-pointer"
            >
              <div className="w-full h-[160px]">
                <img className="w-full h-full object-cover" src={`${book.image}`} alt="" />
              </div>
              <div className="flex justify-start items-center px-2">
                <p className="text-[12px] text-wrap text-gray-500">{book.name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="text-4xl font-bold text-white">No Books Found</h1>
        </div>
      )}

      {/* Backdrop */}
      {selectedCategory && (
        <div
          onClick={closeModal}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          className={`fixed inset-0 z-40 transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Modal */}
      {selectedCategory && (
        <div
          style={{
            transformOrigin,
            width: '360px',
            height: '520px',
            top: '50%',
            left: '50%',
            translate: '-50% -50%',
          }}
          className={`fixed z-50 bg-[#e9e0d2] rounded-lg overflow-hidden shadow-2xl transition-all duration-300 ${
            isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        >
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 z-10 p-1 rounded-full bg-white/80 hover:bg-white cursor-pointer"
          >
            <X size={20} />
          </button>
          <BookFlip category={selectedCategory} />
        </div>
      )}
    </div>
  )
}

export default Home