import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider, useCart } from './context/CartContext'
import CartModal from './components/cart/CartModal'


// Pages existantes
import LandingPage from './components/pages/LandingPage'

// Nouvelles pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ShopPage from './pages/ShopPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminCatalog from './components/admin/AdminCatalog'
import AdminManagementPage from './components/admin/AdminManagementPage'
import DynamicProductPage from './pages/DynamicProductPage'

import StaticCategoryPage from './pages/StaticCategoryPage'
import ProductDetailPage from './pages/ProductDetailPage'
import BestSellersPage from './pages/BestSellersPage'
import SearchPage from './pages/SearchPage'


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
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/best-sellers" element={<BestSellersPage />} />
      <Route path="/search" element={<SearchPage />} />


      {/* Routes pour les produits statiques - AVANT les routes dynamiques */}
      <Route path="/staticcategory/:categoryType" element={<StaticCategoryPage />} />

      {/* Route pour les produits individuels (lightstick, huntrix, groupes, bestsellers) */}
      <Route path="/product/:slug" element={<ProductDetailPage />} />

      {/* Route dynamique pour les catégories */}
      <Route path="/category/:slug" element={<DynamicProductPage />} />

      {/* Routes protégées (authentification requise) */}
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

// ✅ Composant pour afficher le CartModal
const AppContent = () => {
  const { isCartOpen, closeCart } = useCart();

  return (
    <>
      <AppRoutes />
      <CartModal isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

const App = () => {
  React.useEffect(() => {
    // Initialiser la variable CSS pour le sidebar
    document.documentElement.style.setProperty('--sidebar-width', '256px');
  }, []);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
