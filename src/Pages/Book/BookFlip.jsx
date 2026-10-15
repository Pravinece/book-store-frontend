
import { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import "./BookFlip.css";

const books = [
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Classic Fiction",
    color: "#294C3B",
    spineColor: "#1D362A",
    textColor: "#FFF4D8",
    accentColor: "#E9D7A5",
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Programming",
    color: "#233B65",
    spineColor: "#172744",
    textColor: "#FFFFFF",
    accentColor: "#7FD9E8",
  },
];

function BookCover({ book }) {
  return (
    <div
      className="book-cover"
      style={{
        "--cover-color": book.color,
        "--spine-color": book.spineColor,
        "--text-color": book.textColor,
        "--accent-color": book.accentColor,
      }}
    >
      <div className="book-cover__spine" />

      <div className="book-cover__content">
        <p className="book-cover__category">{book.category}</p>
        <div>
          <h2>{book.title}</h2>
          <p>{book.author}</p>
        </div>
        <span className="book-cover__ornament">✦</span>
      </div>
    </div>
  );
}

export default function BookFlip() {
  const bookRef = useRef(null);

  const nextPage = () => {
    bookRef.current?.pageFlip().flipNext();
  };

  const previousPage = () => {
    bookRef.current?.pageFlip().flipPrev();
  };

  return (
    <main className="library">
      <h1>My Book Catalogue</h1>
      <p className="library-subtitle">
        Turn the pages to discover your next book.
      </p>

      <div className="book-container">
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
          usePortrait={true}
          mobileScrollSupport={false}
          flippingTime={900}
          className="flip-book"
        >
          {/* Front cover */}
          <div className="page" data-density="hard">
            <BookCover
              book={{
                title: "The Library",
                author: "A Collection of Ideas",
                category: "Welcome",
                color: "#493323",
                spineColor: "#2E2017",
                textColor: "#FFF4D8",
                accentColor: "#D9B77C",
              }}
            />
          </div>

          {/* Index page */}
          <div className="page">
            <p className="page-label">CONTENTS</p>
            <h2>Explore the Library</h2>
            <ul className="index-list">
              <li>Fiction</li>
              <li>Programming & Technology</li>
              <li>Science</li>
              <li>Business & Finance</li>
              <li>History</li>
            </ul>
            <span className="page-number">01</span>
          </div>

          {/* Book entries */}
          <div className="page">
            <p className="page-label">BOOK INDEX</p>
            <h2>Featured Books</h2>
            <ul className="book-list">
              {books.map((book) => (
                <li key={book.title}>
                  <strong>{book.title}</strong>
                  <span>{book.author}</span>
                </li>
              ))}
            </ul>
            <span className="page-number">02</span>
          </div>

          {/* Individual book covers */}
          {books.map((book) => (
            <div className="page" key={book.title} data-density="hard">
              <BookCover book={book} />
            </div>
          ))}

          {/* Back cover */}
          <div className="page" data-density="hard">
            <BookCover
              book={{
                title: "Keep Exploring",
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

      <div className="book-controls">
        <button onClick={previousPage}>← Previous</button>
        <button onClick={nextPage}>Next →</button>
      </div>
    </main>
  );
}
