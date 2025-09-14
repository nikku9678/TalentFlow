// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"
import Jobs from "./pages/Jobs"
import Candidates from "./pages/Candidates"
import Assessments from "./pages/Assessments"
import Dashboard from "./pages/Dashboard"
import { useState } from "react"
import CreateJobModal from "./components/CreateJobModal"
import CandidateProfile from "./pages/CandidateProfile"
import JobDetail from "./pages/JobDetail"

export default function App() {
  // controls mobile sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar: pass open/close state */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          {/* Navbar gets a prop to open sidebar */}
          <Navbar onOpenModal={() => setIsModalOpen(true)} onOpenSidebar={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/assessments" element={<Assessments />} />
               <Route path="/candidates/:id" element={<CandidateProfile />} />
                <Route path="/job/:id" element={<JobDetail />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && <CreateJobModal onClose={() => setIsModalOpen(false)} />}
    </Router>
  )
}
