
import { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import styles from "./BookFlip.module.css";
import SearchBox from "../../components/SearchBox";
import { useNavigate } from "react-router-dom";

const isLap = window.innerWidth > 480 ? true : false

function BookImage({ book }) {

  return (
    <div className="h-full w-full bg-white border-1 cursor-pointer">
      <div className="w-full h-[80%] flex justify-center items-center">
        <img className="w-full h-full object-cover" src={book.image} alt={book.name} />
      </div>
      <div className="flex justify-start items-center px-2">
        <p className="text-[15px] text-wrap text-gray-500">{book.name}</p>
      </div>
    </div>
  );
}
function BookCover({ book }) {
  return (
    <div
      className={styles.bookCover}
      style={{
        "--cover-color": book.color,
        "--spine-color": book.spineColor,
        "--text-color": book.textColor,
        "--accent-color": book.accentColor,
      }}
    >
      <div className={styles.bookCoverSpine} />
      <div className={styles.bookCoverContent}>
        <p className={styles.bookCoverCategory}>{book.name}</p>
        <div>
          <h2>{book.name}</h2>
          <p>{book.description}</p>
        </div>
        <span className={styles.bookCoverOrnament}>✦</span>
      </div>
    </div>
  );
}

export default function BookFlip({ category }) {
  const bookRef = useRef(null);
  let navigate = useNavigate();

  const nextPage = () => {
    bookRef.current?.pageFlip().flipNext();
  };

  const previousPage = () => {
    bookRef.current?.pageFlip().flipPrev();
  };

  const interactiveElements = document.querySelectorAll('tr');

  interactiveElements.forEach(element => {
      element.addEventListener('click', (e) => {
          e.stopPropagation();
          
          // Get the clicked row element
          const row = e.currentTarget;
          const bookId = row.getAttribute('data-book-id');
          
          // Find the corresponding book object from your data array
          const clickedBook = category.books.find(b => b.id === bookId);
          
          if (clickedBook) {
              navigate(`/bookflip`, { state: clickedBook });              
          }
      });
  });


  return (
    <main className={styles.library}>
      <div className={styles.bookContainer}>
        <div className="w-full flex justify-around items-center mb-2">
          <p className="text-black">Search By book Name :</p>
          <SearchBox />
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
          showCover={ true}
          usePortrait={isLap ? false : true}
          mobileScrollSupport={false}
          flippingTime={900}
          className="flip-book"
        >
          {/* Front cover */}
          <div className={styles.page} data-density="hard">
            <BookImage book={category} />
          </div>

          {/* Inner cover */}
          <div className={styles.page} data-density="hard">
            <BookCover book={category} />
          </div>

          {/* book lists - 6 per page */}
          {Array.from({ length: Math.ceil(category.books.length / 6) }, (_, pageIdx) => (
            <div className={styles.page} key={pageIdx}>
              <p className={styles.pageLabel}>List of Books</p>
              <h5 className={styles.pageHeading}>Explore the Library</h5>
              <table className="w-full border-collapse text-[0.72rem] font-[Georgia,serif]">
                <thead>
                  <tr style={{ backgroundColor: category.color, color: category.textColor }}>
                    <th className="py-[6px] text-[11px] px-2 text-center w-6 font-semibold tracking-wide">#</th>
                    <th className="py-[6px] text-[11px] px-2 text-left font-semibold tracking-wide">Title</th>
                    <th className="py-[6px] text-[11px] px-2 text-left font-semibold tracking-wide">Author</th>
                  </tr>
                </thead>
                <tbody>
                  {category.books.slice(pageIdx * 6, pageIdx * 6 + 6).map((book, i) => (
                    <tr key={book.id} className="cursor-pointer" data-book-id={book.id} style={{ backgroundColor: (pageIdx * 6 + i) % 2 === 1 ? `${category.color}18` : 'transparent' }}>
                      <td className="py-[6px] px-2 text-center text-[0.65rem]" style={{ color: category.color }}>{pageIdx * 6 + i + 1}</td>
                      <td className="py-[6px] px-2 border-b border-dotted border-gray-300 align-top text-[11px] text-black">{book.title}</td>
                      <td className="py-[6px] px-2 border-b border-dotted border-gray-300 align-top text-[10px] text-gray-400">{book.author}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <span className={styles.pageNumber}>{String(pageIdx + 1)}/{String(Math.ceil(category.books.length / 6))}</span>
            </div>
          ))}

          {/* Back cover */}
          <div className={styles.page} data-density="hard">
            <BookCover
              book={{
                name: "Keep Exploring",
                author: "Your next chapter awaits",
                category: "The End",
                color: "#493323",
                spineColor: "#2E2017",
                textColor: "#FFF4D8",
                accentColor: "#D9B77C",
              }}
            />
          </div>
        </HTMLFlipBook>
      </div>
    </main>
  );
}
