
import { useState } from "react";
import {
  ShoppingCart,
  UserRound,
  Lock,
  Menu,
  X,
  Search,
  ChevronDown,
  Globe,
  Heart,
  Tag, Sparkles, Flame, Gift, Box, Eye,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

import { scrollToHome } from "../utils/scrollToHome";

import CurrencySelector from "./CurrencySelector";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cartItems } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const cartCount = cartItems?.length || 0;

  const [searchQuery, setSearchQuery] = useState("");

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();
    if (query.length < 2) return;

    closeMenu();
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };



  const { pathname } = useLocation();

  

const showSecondaryNav =
  pathname === "/" ||
  pathname === "/products" ||
  pathname.startsWith("/category/") ||
  ["/deals", "/new-arrivals", "/hot-artifacts"].includes(pathname);


  
  const hideMarketplaceTools = [
    "/login",
    "/signup",
    "/dashboard",
  ].includes(pathname);

  const showMarketplaceTools = !hideMarketplaceTools;



  return (
  <header className="navbar-style">
   
{/* Top announcement strip */}
<div className="border-b border-red-900/50 bg-gradient-to-r from-[#1b1019] via-[#551623] to-[#1b1019] px-5 py-2.5">
  <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 text-xs text-gray-200">

    {/* Announcement message */}
    <span className="font-semibold tracking-wide">
      🚚 FREE SHIPPING TO THE AFTERLIFE - TERMS MAY APPLY ✨
    </span>

    {/* Announcement links */}
    <div className="hidden items-center gap-5 lg:flex">

      {/*
      <span>💀 Track a Soul</span>
      <span className="text-gray-500">|</span>

      <span>🎁 Gift Cards</span>
      <span className="text-gray-500">|</span>
      */}

      {/* Help & Contact */}
      <a
        href="#contact"
        onClick={(e) => {
          e.preventDefault();

          document.getElementById("contact")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }}
        className="transition-colors hover:text-red-400"
      >
        ⓘ Help & Contact
      </a>

      <span className="text-gray-500">|</span>

      {/* Future Curse Club membership */}
      <span
        className="flex items-center gap-2 text-amber-300"
        title="The Curse Club is coming soon"
      >
        👑 Join the Curse Club

        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-amber-200">
          COMING SOON
        </span>
      </span>

    </div>
  </div>
</div>

      <div className="container relative mx-auto navbar-container">
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
            scrollToHome(navigate, pathname);
          }}
          className="logo-link"
        >
          The Uncanny Collection
        </Link>

        {showMarketplaceTools && (
        <form
          onSubmit={handleSearch}
          role="search"
          className="absolute left-[47%] hidden w-full max-w-sm -translate-x-1/2 md:flex xl:max-w-md"
        >
          
      

          <div className="flex w-full overflow-hidden rounded-xl border border-[#76505a] bg-[#271923] focus-within:border-red-500">
            <Search className="my-auto ml-4 shrink-0 text-gray-400" size={20} />

            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for something forbidden..."
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-gray-400"
            />

            <button
              type="submit"
              aria-label="Search"
              className="flex items-center justify-center bg-[#9b2635] px-5 text-white transition-colors hover:bg-red-600"
            >
              <Search size={21} />
            </button>
          </div>
        </form>
      )}

        {/* Currency selector */}
        {showMarketplaceTools && (
          <div className="ml-auto hidden lg:block">
            <CurrencySelector />
          </div>
        )}

        
        {/* Wishlist */}
        {showMarketplaceTools && (
          <button
            type="button"
            onClick={() => {
              navigate(user ? "/wishlist" : "/login");
            }}
            aria-label="My Wishlist"
            title="My Wishlist"
            className="ml-3 mr-4 hidden items-center gap-2 text-gray-300 transition-colors hover:text-red-400 lg:flex"
          >
            <Heart size={21} />

            <span className="text-sm font-medium">
              Wishlist
            </span>
          </button>
        )}



        {/* Desktop navigation */}
       <nav className="hidden md:flex items-center gap-8">

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
            <button
              type="button"
              onClick={handleLogout}
              title="Sign out"
              className="flex items-center gap-2 text-gray-200 transition-colors hover:text-red-400"
            >
              <UserRound size={21} />
              <span className="text-sm">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 ml-3 text-gray-200 transition-colors hover:text-red-400"
            >
              <UserRound size={21} />
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs text-gray-400">Welcome, stranger</span>
                <span className="text-sm font-semibold">Sign In / Join</span>
              </div>
            </Link>
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

            
      {/* Secondary marketplace navigation */}
      {showSecondaryNav && (
        <div className="w-full border-y border-red-900/60 bg-gradient-to-r from-[#2a111c] via-[#461823] to-[#2a111c]">
          <nav
            aria-label="Marketplace categories"
            className="mx-auto flex max-w-[1600px] items-center justify-center gap-8 overflow-x-auto px-6 py-2.5 text-xs font-medium whitespace-nowrap scrollbar-hide lg:gap-12"
          >
            {[
              { label: "Deals", icon: Tag, path: "/deals" },
              { label: "New Arrivals", icon: Sparkles, path: "/new-arrivals" },
              { label: "Hot Artifacts", icon: Flame, path: "/hot-artifacts" },
            ].map(({ label, icon: Icon, path }) => (
              <Link
                key={path}
                to={path}
                className={`flex shrink-0 items-center gap-1.5 transition-colors hover:text-red-400 ${
                  pathname === path
                    ? "font-bold text-red-400"
                    : "text-gray-200"
                }`}
              >
                <Icon size={17} className="text-red-300" />
                {label}
              </Link>
            ))}

            <span
              aria-hidden="true"
              className="hidden h-4 w-px shrink-0 bg-red-500/30 lg:block"
            />

            <p className="hidden shrink-0 text-xs font-medium tracking-wide text-red-300 lg:block">
              💀 Every purchase comes with consequences.
            </p>
          </nav>
        </div>
      )}
    </header>
  );
};


/**
 * Returns the numeric price in the selected currency.
 * All stored product prices are in NAD.
 *
 * This uses the same conversion rules as CurrencyPrice.
 */
export const convertProductPrice = (
  price,
  currency = "NAD",
  rates = {}
) => {
  const nad = Number(price);

  if (!Number.isFinite(nad)) return null;

  // QBL has no ordinary price until authorized.
  if (currency === "QBL") return null;

  if (getCurrency(currency).type === "cursed") {
    return getCursedPrice(nad, currency);
  }

  if (currency === "BTC") {
    return rates.BTC > 0 ? nad / rates.BTC : nad;
  }

  if (currency === "USD" || currency === "KES") {
    return rates[currency] > 0
      ? nad * rates[currency]
      : nad;
  }

  return nad;
};


export default Navbar;
