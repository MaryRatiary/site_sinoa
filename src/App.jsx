import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

// Pages existantes
import LandingPage from './components/pages/LandingPage'
import GroupProductPage from './components/pages/GroupProductPage'
import ProductPage from './components/pages/ProductPage'
import ProductDetailPage from './components/pages/ProductDetailPage'
import Cart from './components/Cart'
import Checkout from './components/Checkout'

// Nouvelles pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminCatalog from './pages/AdminCatalog'
import AdminManagementPage from './pages/AdminManagementPage'
import DynamicProductPage from './pages/DynamicProductPage'

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

// Composant pour les routes protégées (authentification requise)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Composant pour les routes protégées (admin)
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  
  return isAdmin() ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Pages publiques */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/products/:slug" element={<ProductPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/style/:slug" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      
      {/* Route dynamique pour les catégories */}
      <Route path="/category/:categoryId" element={<DynamicProductPage />} />
      
      {/* Routes protégées (authentification requise) */}
      <Route 
        path="/checkout" 
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/orders" 
        element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Routes admin */}
      <Route 
        path="/admin/dashboard" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } 
      />

      <Route 
        path="/admin/catalog" 
        element={
          <AdminRoute>
            <AdminCatalog />
          </AdminRoute>
        } 
      />

      <Route 
        path="/admin/management" 
        element={
          <AdminRoute>
            <AdminManagementPage />
          </AdminRoute>
        } 
      />
      
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
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App