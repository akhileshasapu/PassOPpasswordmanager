import React from 'react'
import "./App.css";
import "./index.css";
import Manager from './components/Manager'
import Home from './components/Home';

import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />         
        <Route path="/manager" element={<Manager />} />   
     
      </Routes>
    </BrowserRouter>
  )
}

export default App