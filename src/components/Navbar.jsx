// src/components/Navbar.jsx
import { Bell, Plus, Menu } from "lucide-react"

export default function Navbar({ onOpenModal, onOpenSidebar }) {
  return (
    <header className="flex items-center justify-between bg-white border-b p-4">
      <div className="flex items-center gap-3">
        {/* Hamburger - visible on small screens only */}
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-md hover:bg-gray-100 md:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        {/* App title on small screens */}
        <div className="text-lg font-semibold md:hidden">TalentFlow</div>

        {/* Search Bar - hidden on very small screens */}
        <input
          type="text"
          placeholder="Search..."
          className="hidden sm:block w-80 px-3 py-2 border rounded-lg"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Notification */}
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} />
        </button>

        {/* Create Job */}
        <button
          onClick={onOpenModal}
          className="hidden sm:flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Job
        </button>

        {/* Create Job small button for tiny screens */}
        <button
          onClick={onOpenModal}
          className="sm:hidden p-2 bg-blue-600 text-white rounded-md"
          aria-label="Create job"
        >
          <Plus size={16} />
        </button>
      </div>
    </header>
  )
}
