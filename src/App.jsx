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
import AssessmentBuilder from "./components/AssessmentBuilder"
import AssessmentView from "./components/assessment/AssessmentView"
import CreateJob from "./components/jobs/CreateJob"

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <Router>
      <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-green-50 to-gray-100 text-black">
        {/* Sidebar: hidden on mobile, visible on lg */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main area */}
        <div className="flex-1 flex flex-col">
          {/* Navbar always on top */}
          <Navbar
            onOpenModal={() => setIsModalOpen(true)}
            onOpenSidebar={() => setSidebarOpen(true)}
          />

          {/* Content */}
<main className="flex-1 overflow-y-auto dark:border-1 dark:border-gray-800 dark:bg-red-800 dark:text-white">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/assessments" element={<Assessments />} />
              <Route path="/candidates/:id" element={<CandidateProfile />} />
              <Route path="/job/:id" element={<JobDetail />} />
             <Route path="/assessment/create/:id" element={<AssessmentBuilder />} />
  <Route path="/assessment/edit/:id" element={<AssessmentBuilder mode="edit" />} />
  <Route path="/assessment/view/:id" element={<AssessmentView />} />
  <Route path="/job/create" element={<CreateJob />} />
            </Routes>
          </main>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && <CreateJobModal onClose={() => setIsModalOpen(false)} />}
    </Router>
  )
}
