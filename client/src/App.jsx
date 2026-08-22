import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import FurnitureGallery from "./pages/FurnitureGallery";
import ProductDetails from "./pages/ProductDetails";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import Wishlist from "./pages/Wishlist";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import PaymentSuccess from "./pages/PaymentSuccess";
import Consultation from "./pages/Consultation";

import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import UserRoute from "./utils/UserRoute";

// =============================
// Admin Imports
// =============================

import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/Users";
import Products from "./admin/pages/Products";
import OrdersAdmin from "./admin/pages/Orders";
import AddProduct from "./admin/pages/AddProduct";
import Coupons from "./admin/pages/Coupons";
import Consultations from "./admin/pages/Consultations";
import Contacts from "./admin/pages/Contacts";
import Projects from "./admin/pages/Projects";

import AdminProtectedRoute from "./utils/AdminProtectedRoute";

// =============================

function AppContent() {

  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>

      <ScrollToTop />

      {!isAdminRoute && <Navbar />}

      <Routes>

        {/* ================= USER ROUTES ================= */}

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/gallery" element={<Gallery />} />

        <Route
          path="/furniture"
          element={<FurnitureGallery />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/account"
          element={<Account />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOTP />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/cart"
          element={
            <UserRoute>
              <Cart />
            </UserRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <UserRoute>
              <Wishlist />
            </UserRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <UserRoute>
              <Orders />
            </UserRoute>
          }
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/payment-success"
          element={<PaymentSuccess />}
        />

        <Route
          path="/consultation"
          element={<Consultation />}
        />

        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <Users />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminProtectedRoute>
              <Products />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminProtectedRoute>
              <OrdersAdmin />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/coupons"
          element={
              <AdminProtectedRoute>
                  <Coupons />
              </AdminProtectedRoute>
          }
       />

        <Route
          path="/admin/add-product"
          element={
            <AdminProtectedRoute>
              <AddProduct />
            </AdminProtectedRoute>
          }
        />

        <Route
            path="/admin/consultations"
            element={
                <AdminProtectedRoute>
                    <Consultations />
                </AdminProtectedRoute>
            }
        />

        <Route
          path="/admin/contacts"
          element={
              <AdminProtectedRoute>
                  <Contacts />
              </AdminProtectedRoute>
          }
        />
        <Route
            path="/admin/projects"
            element={
                <AdminProtectedRoute>
                    <Projects />
                </AdminProtectedRoute>
            }
        />

      </Routes>
      {!isAdminRoute && <Footer />}

    </>
  );
}

function App() {

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );

}

export default App;