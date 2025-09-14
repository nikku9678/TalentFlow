import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Briefcase,
  Users,
  ClipboardList,
  Bell,
  Settings,
  User,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const links = [
    { to: "/", label: "Dashboard", icon: <Home size={18} /> },
    { to: "/jobs", label: "Jobs", icon: <Briefcase size={18} /> },
    { to: "/candidates", label: "Candidates", icon: <Users size={18} /> },
    { to: "/assessments", label: "Assessments", icon: <ClipboardList size={18} /> },
  ];

  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-8">
        {/* Left: Brand */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          TalentFlow
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6">
          {links.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition ${
                pathname === to
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Right: Icons + User */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Settings size={20} />
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100"
            >
              <User size={20} />
              <ChevronDown size={16} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {links.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                pathname === to
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
