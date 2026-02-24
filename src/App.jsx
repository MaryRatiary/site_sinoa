import React from 'react'
import LandingPage from './components/pages/LandingPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProductPage from './components/pages/ProductPage'

const App = () => {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products/:slug" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App