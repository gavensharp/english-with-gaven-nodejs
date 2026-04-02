import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Logo Section */}
          <div className="flex flex-col items-center">
            <Image
              src="/site-images/logo.png"
              alt="English with Gaven Logo"
              width={80}
              height={80}
              className="mb-3"
            />
            <p className="text-gray-600">English with Gaven &copy; 2026</p>
          </div>

          {/* Account Links Column */}
          <div>
            <h4 className="font-bold text-primary-dark mb-4">Account</h4>
            <ul className="space-y-2">
              {/* <li>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-accent-orange transition">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-gray-700 hover:text-accent-orange transition">
                  Sign Up
                </Link>
              </li> */}
              <li>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-accent-orange transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Links Column */}
          <div>
            <h4 className="font-bold text-primary-dark mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-accent-orange transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-accent-orange transition">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/grammar"
                  className="text-gray-700 hover:text-accent-orange transition">
                  Grammar
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links Column */}
          <div>
            <h4 className="font-bold text-primary-dark mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-700 hover:text-accent-orange transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-700 hover:text-accent-orange transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-700 hover:text-accent-orange transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
