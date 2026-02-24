import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './store/CartContext'
import LandingPage from './components/pages/LandingPage'
import GroupProductPage from './components/pages/GroupProductPage'
import ProductPage from './components/pages/ProductPage'
import ProductDetailPage from './components/pages/ProductDetailPage'
import Cart from './components/Cart'
import Checkout from './components/Checkout'

// Imports des données des produits
import btsProducts from './data/btsProducts'
import blackpinkProducts from './data/blackpinkProducts'
import huntrixProducts from './data/huntrixProducts'
import straykidsProducts from './data/straykidsProducts'
import twiceProducts from './data/twiceProducts'
import newjeansProducts from './data/newjeansProducts'
import ateezProducts from './data/ateezProducts'
import seventeenProducts from './data/seventeenProducts'
import txtProducts from './data/txtProducts'
import nctProducts from './data/nctProducts'
import itzyProducts from './data/itzyProducts'
import iveProducts from './data/iveProducts'

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/style/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Routes pour tous les groupes */}
          <Route 
            path="/groups/bts" 
            element={<GroupProductPage products={btsProducts} groupName="BTS – Bangtan Boys" groupDescription="Vêtements & Accessoires KPOP" />} 
          />
          <Route 
            path="/groups/blackpink" 
            element={<GroupProductPage products={blackpinkProducts} groupName="BLACKPINK" groupDescription="Vêtements & Accessoires KPOP" />} 
          />
          <Route 
            path="/groups/huntrix" 
            element={<GroupProductPage products={huntrixProducts} groupName="Huntrix" groupDescription="Vêtements & Accessoires KPOP" />} 
          />
          <Route 
            path="/groups/stray-kids" 
            element={<GroupProductPage products={straykidsProducts} groupName="Stray Kids" groupDescription="Vêtements & Accessoires KPOP" />} 
          />
          <Route 
            path="/groups/twice" 
            element={<GroupProductPage products={twiceProducts} groupName="TWICE" groupDescription="Vêtements & Accessoires KPOP" />} 
          />
          <Route 
            path="/groups/new-jeans" 
            element={<GroupProductPage products={newjeansProducts} groupName="NewJeans" groupDescription="Vêtements & Accessoires KPOP" />} 
          />
          <Route 
            path="/groups/ateez" 
            element={<GroupProductPage products={ateezProducts} groupName="ATEEZ" groupDescription="Vêtements & Accessoires KPOP" />} 
          />
          <Route 
            path="/groups/seventeen" 
            element={<GroupProductPage products={seventeenProducts} groupName="SEVENTEEN" groupDescription="Vêtements & Accessoires KPOP" />} 
          />
          <Route 
            path="/groups/txt" 
            element={<GroupProductPage products={txtProducts} groupName="TOMORROW X TOGETHER" groupDescription="Vêtements & Accessoires KPOP" />} 
          />
          <Route 
            path="/groups/nct" 
            element={<GroupProductPage products={nctProducts} groupName="NCT" groupDescription="Vêtements & Accessoires KPOP" />} 
          />
          <Route 
            path="/groups/itzy" 
            element={<GroupProductPage products={itzyProducts} groupName="ITZY" groupDescription="Vêtements & Accessoires KPOP" />} 
          />
          <Route 
            path="/groups/ive" 
            element={<GroupProductPage products={iveProducts} groupName="IVE" groupDescription="Vêtements & Accessoires KPOP" />} 
          />
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App