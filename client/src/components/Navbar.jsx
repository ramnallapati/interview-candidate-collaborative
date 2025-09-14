import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // icons

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold text-indigo-400">
            <Link to="/">CodeCollab</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link to="/dashboard" className="hover:text-indigo-400">
              Dashboard
            </Link>
            <Link to="/editor" className="hover:text-indigo-400">
              Editor
            </Link>
            <Link to="/interview" className="hover:text-indigo-400">
              Interview
            </Link>
            <Link to="/chat" className="hover:text-indigo-400">
              Chat
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex space-x-4">
            <Link
              to="/login"
              className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-1 rounded-md border border-indigo-500 hover:bg-indigo-600"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="focus:outline-none">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 py-3 space-y-2">
          <Link
            to="/dashboard"
            className="block hover:text-indigo-400"
            onClick={toggleMenu}
          >
            Dashboard
          </Link>
          <Link
            to="/editor"
            className="block hover:text-indigo-400"
            onClick={toggleMenu}
          >
            Editor
          </Link>
          <Link
            to="/interview"
            className="block hover:text-indigo-400"
            onClick={toggleMenu}
          >
            Interview
          </Link>
          <Link
            to="/chat"
            className="block hover:text-indigo-400"
            onClick={toggleMenu}
          >
            Chat
          </Link>
          <Link
            to="/login"
            className="block hover:text-indigo-400"
            onClick={toggleMenu}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block hover:text-indigo-400"
            onClick={toggleMenu}
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
