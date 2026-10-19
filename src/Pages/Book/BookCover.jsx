import React from 'react'
import styles from "./BookFlip.module.css";

function BookImage({ book }) {

  return (
    <div className="h-full w-full bg-white border-1 cursor-pointer">
      <div className="w-full h-[80%] flex justify-center items-center">
        <img className="w-full h-full object-cover" src={book.imageUrl} alt={book.categoryName} />
      </div>
      <div className="flex justify-center items-center px-2">
        <p className="text-[15px] text-wrap text-gray-500">{book.categoryName}</p>
      </div>
    </div>
  );
}

function BookCover({ book }) {
  return (
    <div
      className={styles.bookCover}
      style={{
        "--cover-color": book.categoryColors?.color,
        "--spine-color": book.categoryColors?.spineColor,
        "--text-color": book.categoryColors?.textColor,
        "--accent-color": book.categoryColors?.accentColor,
      }}
    >
      <div className={styles.bookCoverSpine} />
      <div className={styles.bookCoverContent}>
        <p className={styles.bookCoverCategory}>{book.categoryName}</p>
        <div>
          <h2>{book.categoryName}</h2>
          <p>{book.description}</p>
        </div>
        <span className={styles.bookCoverOrnament}>✦</span>
      </div>
    </div>
  );
}
export default BookCover
export { BookImage }