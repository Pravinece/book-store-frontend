import React, { useState, useRef, useCallback, useEffect } from 'react'
import { X } from 'lucide-react'
import BookFlip from '../Book/BookFlip'
import { getBooks, getCategories } from '../../app/api/adminapi'

const MODAL_W = window.innerWidth < 480 ? 360 : 580
const MODAL_H = 520
const DURATION = 550
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)'

function getCardTransform(rect) {
  const finalLeft = window.innerWidth / 2 - MODAL_W / 2
  const finalTop = window.innerHeight / 2 - MODAL_H / 2
  const dx = rect.left - finalLeft
  const dy = rect.top - finalTop
  const sx = rect.width / MODAL_W
  const sy = rect.height / MODAL_H
  return `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`
}

function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [category, setCategory] = useState([])
  const [isOpen, setIsOpen] = useState(false) // false = at card position, true = centered
  const [fromTransform, setFromTransform] = useState('none')
  const [loading, setLoading] = useState(false)

  const cardRefs = useRef({})
  const closingRef = useRef(false)

  const loadCategory = () => {
      setLoading(true);
      getCategories().then(res => {
        setLoading(false);
        if (res.success) setCategory(res.data?.items || res.data?.categories || (Array.isArray(res.data) ? res.data : []));
        else setError(res.message);
      });
  };
  

  const openModal = useCallback((cat, e) => {
    getBooks({ categoryId: cat.id, page: 1, limit: 6 })
      .then((res) => {
        if (res.success) setSelectedCategory({
          ...cat,
          books: res.data.items,
          pagination: { page: res.data.page, total: res.data.total }
        })
      })
      .catch(err => console.error("Error fetching books:", err));
    const rect = e.currentTarget.getBoundingClientRect()
    closingRef.current = false
    setFromTransform(getCardTransform(rect))
    setIsOpen(false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsOpen(true))
    })
  }, [])

  const fetchPage = useCallback(async (pageNum, q = '') => {
    if (!selectedCategory) return null;
    const res = await getBooks({ categoryId: selectedCategory.id, page: pageNum, limit: 5, q });
    if (res.success) return res.data.items;
    return null;
  }, [selectedCategory])

  const closeModal = useCallback(() => {
    if (!selectedCategory || closingRef.current) return
    closingRef.current = true
    const el = cardRefs.current[selectedCategory.id]
    if (el) setFromTransform(getCardTransform(el.getBoundingClientRect()))
    setIsOpen(false)
  }, [selectedCategory])

  const handleTransitionEnd = (e) => {
    if (e.propertyName !== 'transform') return
    if (!isOpen && closingRef.current) {
      setSelectedCategory(null)
      closingRef.current = false
    }
  }

  // Close on Escape
  useEffect(() => {
    loadCategory();
    if (!selectedCategory) return
    const onKey = (e) => e.key === 'Escape' && closeModal()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedCategory, closeModal])

  return (
    <div className="max-w-[700px] w-[700px] min-w-[340px] h-[95%] overflow-auto mx-auto animate-slideUp">
      {category.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
          {category.map((book) => (
            <div
              key={book.id}
              ref={(el) => (cardRefs.current[book.id] = el)}
              onClick={(e) => openModal(book, e)}
              // Hide the original card while the modal "is" that card
              style={{ visibility: selectedCategory?.id === book.id ? 'hidden' : 'visible' }}
              className="w-[150px] h-[200px] place-items-center mx-auto bg-white border-1 border-gray-300 shadow-2xl cursor-pointer"
            >
              <div className="w-full h-[160px]">
                <img className="w-full h-full object-cover" src={`${book.imageUrl}`} alt="" />
              </div>
              <div className="flex justify-start items-center px-2">
                <p className="text-[12px] text-wrap text-gray-500">{book.categoryName}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="text-4xl font-bold text-white">No Books Found</h1>
        </div>
      )}

      {/* Invisible click-catcher: click outside the modal to close (no fade, no color) */}
      {selectedCategory && (
        <div className="fixed inset-0 z-40" onClick={closeModal} />
      )}

      {/* Modal */}
      {selectedCategory && (
        <div
          onTransitionEnd={handleTransitionEnd}
          style={{
            width: MODAL_W,
            height: MODAL_H,
            top: '50%',
            left: '50%',
            marginLeft: -MODAL_W / 2,
            marginTop: -MODAL_H / 2,
            transformOrigin: 'top left',
            transform: isOpen ? 'translate(0px, 0px) scale(1, 1)' : fromTransform,
            transition: `transform ${DURATION}ms ${EASING}`,
            willChange: 'transform',
          }}
          className="fixed z-50 bg-[#e9e0d2] rounded-lg overflow-hidden shadow-2xl"
        >
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 z-10 p-1 rounded-full bg-white/80 hover:bg-white cursor-pointer"
          >
            <X size={20} />
          </button>
          <BookFlip category={selectedCategory} onFetchPage={fetchPage} />
        </div>
      )}
    </div>
  )
}

export default Home