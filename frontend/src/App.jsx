import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { useEffect } from "react";

import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import MyWishlistPage from "./pages/MyWishlistPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";
import PurchaseFailedPage from "./pages/PurchaseFailedPage";
import ScrollToTop from "./components/ScrollToTop";
import SearchResultsPage from "./pages/SearchResultsPage";

import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";

import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import Footer from "./components/Footer";




function App() {
  const { pathname } = useLocation();
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();

useEffect(() => {
  checkAuth();
}, [checkAuth]);

useEffect(() => {
  if (!user) return;
      getCartItems();
    }, [getCartItems, user]);

  if (checkingAuth) { 
    return <LoadingSpinner />;
  }

  if (pathname === "/checkout") {
    return (
      <>
        <ScrollToTop />
        {user ? <CheckoutPage /> : <Navigate to="/login" replace />}
      </>
    );
  }

  return (
    <div className="layout-wrapper">
      <ScrollToTop />
      <div className="bg-glow-overlay pointer-events-none"/>
      <div className="relative z-50 pt-20"/>
      

      <div>
      <Navbar />
      <main className="min-h-[70vh] flex-1 pb-12 sm:pb-16">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={user?.role === 'admin' ? <AdminPage /> : <Navigate to="/login" />} />
        <Route path="/category/:category" element= {<CategoryPage />}  />
        <Route path="/cart" element= {user ? <CartPage />: <Navigate to='/login'/>} />
        <Route path="/purchase-success" element= {user ? <PurchaseSuccessPage />: <Navigate to='/login'/>} />
        <Route path="/purchase-failed"element={<PurchaseFailedPage />} />
        <Route path="/purchase-cancel" element= {user ? <PurchaseCancelPage />: <Navigate to='/login'/>} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/wishlist" element={ user ? <MyWishlistPage /> : <Navigate to="/login" replace /> } />
      </Routes>
      </main>
    </div>
    <Footer />
    <Toaster/>
    </div>
  );
}

export default App;
