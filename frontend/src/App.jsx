import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateBooks from "./pages/CreateBooks";

const App = () => {
  return (
    //    <div className='bg-red-700'>
    // 123
    //    </div>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/books/create" element={<CreateBooks />} />
    </Routes>
  );
};

export default App;
