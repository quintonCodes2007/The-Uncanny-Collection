
import { Link } from "react-router-dom";
import { ExternalLink, Skull, Heart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const Footer = () => {
  const { user } = useUserStore();

  return (
    <footer className="relative z-10 mt-auto w-full border-t border-red-900/60 bg-gray-950 text-gray-300">

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

        {/* Three footer columns */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-12">

          {/* Explore */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-red-300">
              Explore
            </h3>

            <div className="flex flex-col items-start gap-3 text-sm">
              <Link to="/" className="transition-colors hover:text-red-400">
                Home
              </Link>

              <Link to="/" className="transition-colors hover:text-red-400">
                Our Collections
              </Link>

              <Link to="/" className="transition-colors hover:text-red-400">
                Terms & Conditions
              </Link>

              {user && (
                <Link to="/cart" className="transition-colors hover:text-red-400">
                  Your Cart
                </Link>
              )}
            </div>
          </div>

          {/* Customer Misfortune */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-red-300">
              Customer Misfortune
            </h3>

            <div className="flex flex-col items-start gap-3 text-sm text-gray-400">
              <span>Shipping & Curses</span>
              <span>Returns (Good Luck)</span>
              <span>Contact the Living</span>
            </div>
          </div>

          {/* About Developer */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-red-300">
              About the Developer
            </h3>

            <div className="flex flex-col items-start gap-3 text-sm">

              <a
                href="https://quintoncodes2007.github.io/Portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-red-400"
              >
                My Portfolio
                <ExternalLink size={14} />
              </a>

              <a
                href="https://github.com/quintonCodes2007"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-red-400"
              >
                GitHub
                <ExternalLink size={16} />
              </a>

              {/* LinkedIn */}            
                <a
                href="https://www.linkedin.com/in/quinton-khuwiseb-b85b432a2/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-red-400"
                >
                LinkedIn
                <ExternalLink size={16} />
                </a>


            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-red-900/50 pt-6">

          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">

            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} The Uncanny Collection.
              All souls reserved.
            </p>

            <p className="flex items-center gap-1 text-xs italic text-red-400">
              Summoned into existence with
              <Heart size={13} className="fill-red-600 text-red-600" />
              by Quinton Codes.
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
