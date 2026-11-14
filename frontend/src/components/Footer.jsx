
import { Link, useNavigate, useLocation } from "react-router-dom";
import { scrollToHome } from "../utils/scrollToHome";
import { ExternalLink, Skull, Heart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const Footer = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
const { pathname } = useLocation();

  return (
    <footer
      id="contact"
      className="relative z-10 mt-auto w-full scroll-mt-24 border-t border-red-900/60 bg-gray-950 text-gray-300"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8 lg:py-16">

        {/* Branding */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <Skull className="h-6 w-6 text-red-500" />

            <h2 className="text-xl font-bold tracking-wide text-red-500 sm:text-2xl">
              The Uncanny Collection
            </h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-gray-400">
            Curiosities, curses, and questionable purchases.
            Everything you never knew you shouldn't own.
          </p>
        </div>

        
{/* Four footer columns */}
<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-8">

  {/* Help & Contact */}
  <div>
    <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-red-300">
      Help & Contact
    </h3>

    <div className="flex flex-col gap-5 text-sm">
      <div>
        <p className="font-medium text-gray-200">
          Need Help?
        </p>
        <p className="mt-1 text-xs text-gray-400">
          We don't offer that here.
        </p>
      </div>

      <div>
        <p className="font-medium text-gray-200">
          Contact Us
        </p>
        <p className="mt-1 text-xs text-gray-400">
          The spirits are currently unavailable.
        </p>
      </div>

      <div>
        <p className="font-medium text-gray-200">
          Response Time
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Between three business days and eternity.
        </p>
      </div>
    </div>
  </div>

  {/* Explore */}
  <div>
    <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-red-300">
      Explore
    </h3>

    <div className="flex flex-col gap-5 text-sm">
      <div>
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            scrollToHome(navigate, pathname);
          }}
          className="font-medium text-gray-200 transition-colors hover:text-red-400"
        >
          Home
        </Link>
        <p className="mt-1 text-xs text-gray-400">
          Where your bad decisions begin.
        </p>
      </div>

      <div>
        <Link
          to="/products"
          className="font-medium text-gray-200 transition-colors hover:text-red-400"
        >
          Our Collections
        </Link>
        <p className="mt-1 text-xs text-gray-400">
          Browse things better left untouched.
        </p>
      </div>

      <div>
        <span className="font-medium text-gray-200">
          Terms & Conditions
        </span>
        <p className="mt-1 text-xs text-gray-400">
          By entering, you've already agreed.
        </p>
      </div>

      {user && (
        <div>
          <Link
            to="/cart"
            className="font-medium text-gray-200 transition-colors hover:text-red-400"
          >
            Your Cart
          </Link>
          <p className="mt-1 text-xs text-gray-400">
            A collection of questionable choices.
          </p>
        </div>
      )}
    </div>
  </div>

  {/* Customer Misfortune */}
  <div>
    <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-red-300">
      Customer Misfortune
    </h3>

    <div className="flex flex-col gap-5 text-sm">
      <div>
        <p className="font-medium text-gray-200">
          Shipping & Curses
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Delivery is inevitable. Survival isn't.
        </p>
      </div>

      <div>
        <p className="font-medium text-gray-200">
          Returns (Good Luck)
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Why did you buy it in the first place?
        </p>
      </div>

      <div>
        <p className="font-medium text-gray-200">
          Contact the Living
        </p>
        <p className="mt-1 text-xs text-gray-400">
          They stopped answering years ago.
        </p>
      </div>
    </div>
  </div>

  {/* About the Developer */}
  <div>
    <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-red-300">
      About the Developer
    </h3>

    <div className="flex flex-col gap-5 text-sm">
      <div>
        <a
          href="https://quintoncodes2007.github.io/Portfolio/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-gray-200 transition-colors hover:text-red-400"
        >
          My Portfolio
          <ExternalLink size={12} className="ml-1 inline" />
        </a>
        <p className="mt-1 text-xs text-gray-400">
          The mind behind the madness.
        </p>
      </div>

      <div>
        <a
          href="https://github.com/quintonCodes2007"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-gray-200 transition-colors hover:text-red-400"
        >
          GitHub
          <ExternalLink size={12} className="ml-1 inline" />
        </a>
        <p className="mt-1 text-xs text-gray-400">
          Where the dark magic is written.
        </p>
      </div>

      <div>
        <a
          href="https://www.linkedin.com/in/quinton-khuwiseb-b85b432a2/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-gray-200 transition-colors hover:text-red-400"
        >
          LinkedIn
          <ExternalLink size={12} className="ml-1 inline" />
        </a>
        <p className="mt-1 text-xs text-gray-400">
          Surprisingly employable.
        </p>
      </div>
    </div>
  </div>

</div>
{/* End of four-column grid */}


        {/* Bottom section */}
        <div className="mt-12 border-t border-red-900/50 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">

            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} The Uncanny Collection.
              All souls reserved.
            </p>

            <p className="flex items-center gap-1 text-xs italic text-red-400">
              Summoned into existence with
              <Heart
                size={13}
                className="fill-red-600 text-red-600"
              />
              by QuintonCodes2007
            </p>

          </div>

          <p className="mt-5 text-center text-xs text-gray-600">
            Built with React, Node.js, MongoDB, and a questionable amount of dark magic.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
