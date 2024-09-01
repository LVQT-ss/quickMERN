import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import CreateBooks from './pages/CreateBooks'
import ShowBook from './pages/ShowBook'
import Editbook from './pages/Editbook'
import DeleteBook from './pages/DeleteBook'

const App = () => {
  return (
//    <div className='bg-red-700'>
// 123
//    </div>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/books/create' element={<CreateBooks/>} />
      <Route path='/books/details/:id' element={<ShowBook/>} />
      <Route path='/books/eidt/:id' element={<Editbook/>} />
      <Route path='/boooks/delete/:id' element={<DeleteBook/>} />
    </Routes>
  )
}

export default App
