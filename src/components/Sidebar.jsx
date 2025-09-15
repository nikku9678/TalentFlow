// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { Home, Briefcase, Users, ClipboardList, X } from "lucide-react";

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { pathname } = useLocation();
  const links = [
    { to: "/", label: "Dashboard", icon: <Home size={18} /> },
    { to: "/jobs", label: "Jobs", icon: <Briefcase size={18} /> },
    { to: "/candidates", label: "Candidates", icon: <Users size={18} /> },
    { to: "/assessments", label: "Assessments", icon: <ClipboardList size={18} /> },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-64 border-r hidden md:flex flex-col dark:bg-gray-800 dark:border-gray-800 transition-colors duration-300">
        <div className="p-6 text-2xl font-bold text-black dark:text-white transition-colors duration-300">
          TalentFlow
        </div>
        <nav className="flex-1 p-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-2 transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                pathname === link.to
                  ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold"
                  : "text-black dark:text-gray-200"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile sidebar - overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        {/* Backdrop */}
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-black transition-opacity ${
            isOpen ? "opacity-50" : "opacity-0"
          }`}
        />

        {/* Panel */}
        <div
          className={`relative w-64 h-full bg-white dark:bg-gray-800 shadow-xl transform transition-transform transition-colors duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 flex items-center justify-between border-b dark:border-gray-800 transition-colors duration-300">
            <div className="text-lg font-bold text-black dark:text-white transition-colors duration-300">
              TalentFlow
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="p-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`flex items-center gap-2 p-2 rounded-lg mb-2 transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  pathname === link.to
                    ? "bg-gray-200 dark:bg-gray-700 font-semibold"
                    : "text-black dark:text-gray-200"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
