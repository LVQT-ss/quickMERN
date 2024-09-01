import React from 'react'
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
const BookTable = ({books}) => {
  return (
    <table className='w-full bg-white border border-gray-300 rounded-lg shadow-md'>
    <thead>
      <tr className='bg-gray-200 text-gray-700'>
        <th className='py-3 px-4 text-left'>No</th>
        <th className='py-3 px-4 text-left'>Title</th>
        <th className='py-3 px-4 text-left max-md:hidden'>Author</th>
        <th className='py-3 px-4 text-left max-md:hidden'>Publish Year</th>
        <th className='py-3 px-4 text-center'>Operations</th>
      </tr>
    </thead>
    <tbody>
      {books.map((book, index) => (
        <tr key={book._id} className='hover:bg-gray-100 transition duration-300'>
          <td className='py-2 px-4 border-t border-gray-300 text-center'>{index + 1}</td>
          <td className='py-2 px-4 border-t border-gray-300'>{book.title}</td>
          <td className='py-2 px-4 border-t border-gray-300 max-md:hidden'>{book.author}</td>
          <td className='py-2 px-4 border-t border-gray-300 max-md:hidden'>{book.publishYear}</td>
          <td className='py-2 px-4 border-t border-gray-300 text-center'>
            <div className='flex justify-center gap-x-4'>
              <Link to={`/books/details/${book._id}`}>
                <BsInfoCircle className='text-green-800 text-2xl hover:text-green-600 transition duration-300' />
              </Link>
              <Link to={`/books/edit/${book._id}`}>
                <AiOutlineEdit className='text-yellow-600 text-2xl hover:text-yellow-400 transition duration-300' />
              </Link>
              <Link to={`/books/delete/${book._id}`}>
                <MdOutlineDelete className='text-red-600 text-2xl hover:text-red-400 transition duration-300' />
              </Link>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  )
}

export default BookTable
