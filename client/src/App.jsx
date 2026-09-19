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
import Profile from "./pages/Profile";
import PaymentSuccess from "./pages/PaymentSuccess";
import Consultation from "./pages/Consultation";
import StyleFinder from "./pages/StyleFinder";

import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProjectCategoryProvider } from "./context/ProjectCategoryContext";
import { CompareProvider } from "./context/CompareContext";
import UserRoute from "./utils/UserRoute";

// =============================
// Admin Imports
// =============================

import AdminLogin from "./admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/Users";
import Products from "./admin/pages/Products";
import OrdersAdmin from "./admin/pages/Orders";
import Coupons from "./admin/pages/Coupons";
import Consultations from "./admin/pages/Consultations";
import Contacts from "./admin/pages/Contacts";
import Projects from "./admin/pages/Projects";
import ProjectCategories from "./admin/pages/ProjectCategories";
import HomeSettings from "./admin/pages/HomeSettings";
import EmailSettings from "./admin/pages/EmailSettings";
import ReviewsAdmin from "./admin/pages/Reviews";

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
          path="/profile"
          element={
            <UserRoute>
              <Profile />
            </UserRoute>
          }
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

        <Route
            path="/style-finder"
            element={<StyleFinder />}
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

        <Route
            path="/admin/project-categories"
            element={
                <AdminProtectedRoute>
                    <ProjectCategories />
                </AdminProtectedRoute>
            }
        />

        <Route
            path="/admin/reviews"
            element={
                <AdminProtectedRoute>
                    <ReviewsAdmin />
                </AdminProtectedRoute>
            }
        />

        <Route
            path="/admin/home-settings"
            element={
                <AdminProtectedRoute>
                    <HomeSettings />
                </AdminProtectedRoute>
            }
        />

        <Route
            path="/admin/email-settings"
            element={
                <AdminProtectedRoute>
                    <EmailSettings />
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
          <ProjectCategoryProvider>
            <BrowserRouter>
              <CompareProvider>
              <AppContent />
              </CompareProvider>
            </BrowserRouter>
          </ProjectCategoryProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );

}

export default App;