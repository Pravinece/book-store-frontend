import React from 'react'
import books from '../../Datas/book-catalogue-data.json'
function Home() {
  return (
    <div className="w-[50%] h-[80%] overflow-auto mx-auto">
    {books.categories.length > 0 ? (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
        {books.categories.map((book) => (
          <div
            key={book.id}
            onClick={()=>{}}
            className="w-[140px] h-[200px] bg-white border-1 p-1 cursor-pointer"
          >
            <div className="w-full h-[150px]">
                <img className="w-full h-full object-cover" src={`${book.image}`} alt="" />
            </div>
            <div className="flex justify-start items-center px-2">
              <p className="text-[11px] text-gray-500">{book.name}</p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="w-full h-full flex justify-center items-center">
        <h1 className="text-4xl font-bold text-white">No Books Found</h1>
      </div>
    )}
  </div>

  )
}

export default Home