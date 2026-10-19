import { useRef, useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import styles from "./BookFlip.module.css";
import { useNavigate } from "react-router-dom";
import BookCover, { BookImage } from "./BookCover";
import SearchBox from "../../components/SearchBox";

const BOOKS_PER_PAGE = 5;

export default function BookFlip({ category, onFetchPage }) {
  const bookRef = useRef(null);
  const navigate = useNavigate();
  const isLap = window.innerWidth > 480;

  const colors = category.categoryColors || {};
  const totalBooks = category.pagination?.total || category.books?.length || 0;
  const totalPages = Math.ceil(totalBooks / BOOKS_PER_PAGE);

  // Store fetched books per page: { 1: [...], 2: [...] }
  const [pageBooks, setPageBooks] = useState({ 1: category.books || [] });
  const [loadingPage, setLoadingPage] = useState(null);
  const [q, setQ] = useState('');

  const fetchPage = async (pageNum, query = q) => {
    if (loadingPage === pageNum) return;
    setLoadingPage(pageNum);
    const books = await onFetchPage(pageNum, query);
    setLoadingPage(null);
    if (books) setPageBooks(prev => ({ ...prev, [pageNum]: books }));
  };

  const handleSearch = (val) => {
    setQ(val);
    setPageBooks({});
    fetchPage(1, val);
    bookRef.current?.pageFlip().flip(2);
  };

  const handleFlip = (e) => {
    const flipPage = e.data;
    const bookPageIdx = flipPage - 1;
    if (bookPageIdx >= 1 && bookPageIdx <= totalPages) {
      fetchPage(bookPageIdx, q);
      if (bookPageIdx + 1 <= totalPages) fetchPage(bookPageIdx + 1, q);
    }
  };

  const handleBookClick = (e, book) => {
    e.stopPropagation();
    navigate(`/${book.id}`);
  };

  const coverColors = {
    color: colors.color || "#294C3B",
    spineColor: colors.spineColor || "#1D362A",
    textColor: colors.textColor || "#FFF4D8",
    accentColor: colors.accentColor || "#E9D7A5",
  };

  return (
    <main className={styles.library}>
      <div className={styles.bookContainer}>
        <div className="w-full flex justify-around items-center mb-2">
          <p className="text-black text-sm">Search :</p>
          <SearchBox placeholder="Search books..." onSearch={handleSearch} />
        </div>

        <HTMLFlipBook
          ref={bookRef}
          width={320}
          height={480}
          size="stretch"
          minWidth={280}
          maxWidth={650}
          minHeight={400}
          maxHeight={800}
          maxShadowOpacity={0.45}
          showCover={true}
          usePortrait={!isLap}
          mobileScrollSupport={false}
          flippingTime={900}
          className="flip-book"
          onFlip={handleFlip}
        >
          {/* Front cover */}
          <div className={styles.page} data-density="hard">
            <BookImage book={{ ...category, image: category.imageUrl, name: category.categoryName }} />
          </div>

          {/* Inner cover */}
          <div className={styles.page} data-density="hard">
            <BookCover book={{ ...category, name: category.categoryName, ...coverColors }} />
          </div>

          {/* Book list pages — one per BOOKS_PER_PAGE */}
          {Array.from({ length: totalPages }, (_, idx) => {
            const pageNum = idx + 1;
            const books = pageBooks[pageNum];
            return (
              <div
                className={styles.page}
                key={pageNum}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                <p className={styles.pageLabel}>{category.categoryName}</p>
                <h5 className={styles.pageHeading}>Book List</h5>

                {!books || loadingPage === pageNum ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60%' }}>
                    <p style={{ color: '#92754f', fontSize: '0.8rem' }}>Loading…</p>
                  </div>
                ) : (
                  <table className="w-full border-collapse text-[0.72rem] font-[Georgia,serif]">
                    <thead>
                      <tr style={{ backgroundColor: coverColors.color, color: coverColors.textColor }}>
                        <th className="py-[6px] text-[11px] px-2 text-center w-6 font-semibold tracking-wide">#</th>
                        <th className="py-[6px] text-[11px] px-2 text-left font-semibold tracking-wide">Title - autor</th>
                        {/* <th className="py-[6px] text-[11px] px-2 text-left font-semibold tracking-wide">Author</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {books.map((book, i) => (
                        <tr
                          key={book.id}
                          className="cursor-pointer"
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => handleBookClick(e, book)}
                          style={{ backgroundColor: i % 2 === 1 ? `${coverColors.color}18` : 'transparent' }}
                        >
                          <td className="py-[6px] px-2 text-center text-[0.65rem]" style={{ color: coverColors.color }}>
                            {(pageNum - 1) * BOOKS_PER_PAGE + i + 1}
                          </td>
                          <td className="py-[6px] px-2 border-b border-dotted border-gray-300 align-top text-[11px] text-black">{book.name}
                            <span className="block text-[0.65rem] truncate w-48 text-nowrap text-gray-500">{book.author}</span>
                          </td>
                          {/* <td className="py-[6px] px-2 border-b border-dotted border-gray-300 align-top text-[10px] text-gray-400">{book.author}</td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <span className={styles.pageNumber}>{pageNum} / {totalPages}</span>
              </div>
            );
          })}

          {/* Back cover */}
          <div className={styles.page} data-density="hard">
            <BookCover
              book={{
                categoryColors : category.categoryColors,
                categoryName: "Keep Exploring",
                description: "Your next chapter awaits",
              }}
            />
          </div>
        </HTMLFlipBook>
      </div>
    </main>
  );
}
