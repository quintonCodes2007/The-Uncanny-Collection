
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const cartCount = cartItems?.length || 0;

  const [searchQuery, setSearchQuery] = useState("");

  const closeMenu = () => setMenuOpen(false);

useEffect(() => {
  if (!menuOpen) return;

  const handleEscape = (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  };

  const previousOverflow = document.body.style.overflow;

  // Prevent the homepage from scrolling behind the drawer.
  document.body.style.overflow = "hidden";

  document.addEventListener("keydown", handleEscape);

  return () => {
    document.body.style.overflow = previousOverflow;
    document.removeEventListener("keydown", handleEscape);
  };
}, [menuOpen]);


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
  // Close the drawer when navigating to a different page.
useEffect(() => {
  setMenuOpen(false);
}, [pathname]);

  

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

      <div className="container relative mx-auto navbar-container max-md:!justify-start max-md:!gap-2">

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-10 w-9 shrink-0 items-center justify-center text-red-500 hover:text-white md:hidden"
            aria-label="Open navigation"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <Menu size={19} />
          </button>

          {/* Logo */}
          <Link

          to="/"
          onClick={(e) => {
            e.preventDefault();
            closeMenu();
            scrollToHome(navigate, pathname);
          }}
          className="logo-link max-md:!max-w-none"
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
            <Search className="my-auto ml-4 shrink-0 text-gray-400" size={21} />

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

        
          {/* Mobile navigation controls — right side */}
          <div className="ml-auto flex shrink-0 items-center gap-3 md:hidden">

            {/* Search icon */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen((previous) => !previous)}
              aria-label={mobileSearchOpen ? "Close search" : "Open search"}
              aria-expanded={mobileSearchOpen}
              className="flex h-9 w-9 shrink-0 items-center justify-center text-red-500 transition-colors hover:text-white"
            >
              <Search size={19} />
            </button>

            {/* Cart icon */}
            <Link
              to={user ? "/cart" : "/login"}
              onClick={closeMenu}
              className="cart-link relative flex h-9 w-9 shrink-0 items-center justify-center"
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingCart size={19} />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

          </div>

      </div>


        {/* Expandable mobile search */}
        {showMarketplaceTools && mobileSearchOpen && (
          <form
            onSubmit={(event) => {
              handleSearch(event);
              setMobileSearchOpen(false);
            }}
            role="search"
            className="border-t border-red-900/50 bg-[#17121b] px-3 py-3 md:hidden"
          >
            <div className="flex overflow-hidden rounded-lg border border-[#76505a] bg-[#271923] focus-within:border-red-500">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search cursed artifacts..."
                aria-label="Search products"
                autoFocus
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-400"
              />

              <button
                type="submit"
                aria-label="Submit search"
                className="flex min-w-11 items-center justify-center bg-[#922638] text-white"
              >
                <Search size={19} />
              </button>
            </div>
          </form>
        )}


      
{/* Modern mobile slide-out drawer */}
{createPortal(
  <>
    {/* Dark overlay behind the drawer */}
    <div
      className={`fixed inset-0 z-[100] bg-black/70 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
        menuOpen
          ? "visible opacity-100"
          : "invisible pointer-events-none opacity-0"
      }`}
      onClick={closeMenu}
      aria-hidden="true"
    />

    {/* Left-side navigation drawer */}
    <aside
      id="mobile-navigation"
      role="dialog"
      aria-modal={menuOpen ? "true" : undefined}
      aria-label="Mobile navigation"
      aria-hidden={!menuOpen}
      inert={!menuOpen}
      className={`fixed inset-y-0 left-0 z-[101] flex w-[280px] max-w-[85vw] flex-col border-r border-[#69404b] bg-[#150f16] text-white shadow-2xl shadow-black/70 transition-transform duration-300 ease-out md:hidden ${
        menuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Drawer header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#69404b] px-4 py-4">
        <div>
          <h2 className="text-sm font-bold text-red-400">
            The Uncanny Collection
          </h2>
          <p className="mt-1 text-[10px] text-gray-400">
            Enter at your own risk.
          </p>
        </div>

        <button
          type="button"
          onClick={closeMenu}
          aria-label="Close navigation"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-red-950/50 hover:text-white"
        >
          <X size={22} />
        </button>
      </div>

      {/* Independently scrolling drawer content */}
      <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain px-3 py-4">
        {/* Account */}
        {user ? (
          <div className="rounded-lg border border-[#69404b] bg-[#301b26] px-3 py-3">
            <div className="flex items-center gap-3">
              <UserRound size={21} className="text-red-400" />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {user.username || user.name || "Cursed Member"}
                </p>
                <p className="truncate text-xs text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            onClick={closeMenu}
            className="flex min-h-12 items-center gap-3 rounded-lg bg-[#351c27] px-3 text-sm font-semibold text-white hover:bg-[#522333]"
          >
            <UserRound size={20} className="text-red-300" />
            Login / Sign Up
          </Link>
        )}

        {/* Cart */}
        <Link
          to={user ? "/cart" : "/login"}
          onClick={closeMenu}
          className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm hover:bg-red-950/40"
        >
          <ShoppingCart size={20} className="text-red-400" />
          <span className="flex-1">My Cart</span>
          <span className="rounded-full bg-red-800 px-2 py-0.5 text-xs">
            {cartCount}
          </span>
        </Link>

        {/* Admin dashboard */}
        {isAdmin && (
          <Link
            to="/dashboard"
            onClick={closeMenu}
            className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm hover:bg-red-950/40"
          >
            <Lock size={20} className="text-red-400" />
            <span className="flex-1">Dashboard</span>
            <span className="text-[10px] text-red-300">
              ADMIN
            </span>
          </Link>
        )}

        {/* Wishlist */}
        <Link
          to={user ? "/wishlist" : "/login"}
          onClick={closeMenu}
          className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm hover:bg-red-950/40"
        >
          <Heart size={20} className="text-red-400" />
          My Wishlist
        </Link>

        {/* Currency selector */}
        <div className="border-t border-[#69404b] px-2 py-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-300">
            Currency
          </p>

          <CurrencySelector />
        </div>

        
        {/* Categories and filters from the marketplace */}
        <div
          id="mobile-marketplace-tools"
          className="space-y-3"
          aria-label="Mobile marketplace categories and filters"
        />


        {/* Curse Club */}
        <div className="mt-4 rounded-xl border border-red-700/50 bg-gradient-to-br from-[#451a27] to-[#21131d] p-4">
          <div className="flex items-center gap-2 text-amber-300">
            <span>👑</span>
            <span className="text-sm font-semibold">
              Join the Curse Club
            </span>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-gray-300">
            Exclusive artifacts, early access, and
            members-only deals.
          </p>

          <span className="mt-3 inline-block rounded-full border border-amber-500/30 px-2 py-1 text-[10px] font-semibold text-amber-300">
            COMING SOON
          </span>
        </div>

        {/* Help & Contact */}
        <button
          type="button"
          onClick={() => {
            closeMenu();
            document.getElementById("contact")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
          className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-gray-200 hover:bg-red-950/40"
        >
          <span className="text-lg text-red-400">ⓘ</span>
          Help & Contact
        </button>

        {/* Logout */}
        {user && (
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-red-400 hover:bg-red-950/40"
          >
            <UserRound size={20} />
            Logout
          </button>
        )}
      </nav>
    </aside>
  </>,
  document.body
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
