
import { useState } from "react";
import {
  ShoppingCart,
  UserPlus,
  LogIn,
  LogOut,
  Lock,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cartItems } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const cartCount = cartItems?.length || 0;

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <header className="navbar-style">
      <div className="container mx-auto navbar-container">
        <Link
          to="/"
          onClick={closeMenu}
          className="logo-link"
        >
          The Uncanny Collection
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="nav-link">
            Home
          </Link>

          {user && (
            <Link to="/cart" className="cart-link">
              <ShoppingCart size={20} className="icon-spacing" />
              <span>Cart</span>
              <span className="cart-badge">{cartCount}</span>
            </Link>
          )}

          {isAdmin && (
            <Link to="/dashboard" className="dashboard-btn">
              <Lock size={18} className="icon-spacing" />
              Dashboard
            </Link>
          )}

          {user ? (
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={18} className="icon-spacing" />
              Logout
            </button>
          ) : (
            <>
              <Link to="/signup" className="auth-btn">
                <UserPlus size={18} className="icon-spacing" />
                Sign Up
              </Link>
              <Link to="/login" className="auth-btn">
                <LogIn size={18} className="icon-spacing" />
                Login
              </Link>
            </>
          )}
        </nav>

        {/* Mobile navigation controls */}
        <div className="flex items-center gap-5 md:hidden">
          {user && (
            <Link
              to="/cart"
              onClick={closeMenu}
              className="cart-link"
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingCart size={22} />
              <span className="cart-badge">{cartCount}</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-red-500 hover:text-white"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav
          id="mobile-navigation"
          className="border-t border-red-900 bg-gray-900 px-5 py-4 md:hidden"
        >
          <div className="flex flex-col gap-4">
            <Link to="/" onClick={closeMenu} className="nav-link">
              Home
            </Link>

            {isAdmin && (
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="nav-link"
              >
                Dashboard
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="text-left text-red-500 hover:text-white"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="nav-link"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="nav-link"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
