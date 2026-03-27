import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

// Pages existantes
import LandingPage from './components/pages/LandingPage'

// Nouvelles pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminCatalog from './pages/AdminCatalog'
import AdminManagementPage from './pages/AdminManagementPage'
import DynamicProductPage from './pages/DynamicProductPage'
import StaticProductPage from './pages/StaticProductPage'
import StaticCategoryPage from './pages/StaticCategoryPage'

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
      <Route path="/cart" element={<CartPage />} />
      
      {/* Routes pour les produits statiques - AVANT les routes dynamiques */}
      <Route path="/static/:productType" element={<StaticProductPage />} />
      <Route path="/staticcategory/:categoryType" element={<StaticCategoryPage />} />
      
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

      <Route 
        path="/order/:orderId" 
        element={
          <ProtectedRoute>
            <OrderDetailPage />
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
