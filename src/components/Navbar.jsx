// src/components/Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Settings, User, ChevronDown, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "../context/ThemeProvider";

export default function Navbar({ onOpenSidebar }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left: Logo (Mobile only) */}
        <div className="flex items-center gap-2 md:hidden">
          <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
            TalentFlow
          </Link>
        </div>

        {/* Center: Search Input */}
        <div className="flex-1 max-w-lg mx-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center space-x-3">
            <button className="p-2 rounded-full dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <Bell size={20} />
            </button>

            <button className="p-2 rounded-full dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <Settings size={20} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {theme === "dark" ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} />
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-1 px-3 py-2 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <User size={20} />
                <ChevronDown size={16} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50 transition-colors duration-300">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Settings
                  </Link>
                  <button className="w-full text-left px-4 py-2 text-sm text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Sidebar Toggle */}
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
