import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { db } from "../db/db";
import AssessmentBuilder from "../components/AssessmentBuilder";
import JobModal from "../components/jobs/JobModal";

const STATUSES = ["draft", "active", "archived"];
const TABS = ["Job Description", "Dates & Deadlines", "Reviews", "FAQs & Discussions"];

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Job Description");

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/jobs?page=1&pageSize=1000`);
        const data = await res.json();
        setJob(data.items.find((j) => j.id === parseInt(id, 10)) || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  if (loading) return <p className="p-6">Loading job details...</p>;
  if (!job) return <p className="p-6">Job not found.</p>;

  const handleDragEnd = async (result) => {
    const { destination } = result;
    if (!destination) return;

    const newStatus = destination.droppableId;
    if (job.status === newStatus) return;

    const oldJob = { ...job };
    setJob({ ...job, status: newStatus });

    try {
      await db.jobs.update(job.id, { status: newStatus });
    } catch (err) {
      console.error("Failed to update job status:", err);
      setJob(oldJob);
      alert("Failed to update status. Try again.");
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-full mx-auto space-y-6 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
      {/* Back button */}
      {/* <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 bg-gray-200 dark:bg-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
      >
        ← Back
      </button> */}

      {/* Job Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors duration-300 space-y-4">
        <h2 className="text-2xl font-bold">{job.title}</h2>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <p><span className="font-semibold">Job Type:</span> {job.type || "In-Office"}</p>
          <p><span className="font-semibold">#Openings:</span> {job.openings || 2}</p>
          <p><span className="font-semibold">Start Date:</span> {job.startDate || "20 Oct 2025"}</p>
          <p><span className="font-semibold">Experience:</span> {job.experience || "0-3 years"}</p>
          <p><span className="font-semibold">Package:</span> {job.package || "₹4-6 LPA"}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors duration-300">
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-300 ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="text-gray-700 dark:text-gray-200 space-y-3 transition-colors duration-300">
          {activeTab === "Job Description" && (
            <div className="space-y-4">
              <p>
                {job.description || "We are looking for a passionate Software Engineer to join our dynamic team."}
              </p>
              <h4 className="font-semibold">Responsibilities:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Design, develop, and maintain web applications using React & Node.js.</li>
                <li>Collaborate with cross-functional teams to define and deliver new features.</li>
                <li>Write clean, efficient, and testable code following best practices.</li>
                <li>Troubleshoot, debug, and optimize performance for existing applications.</li>
                <li>Contribute to technical discussions and propose innovative solutions.</li>
              </ul>
              <h4 className="font-semibold">Requirements:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Bachelor’s degree in Computer Science or related field.</li>
                <li>Strong proficiency in JavaScript, React, and Node.js.</li>
                <li>Familiarity with REST APIs and databases (MySQL/MongoDB).</li>
                <li>Good understanding of version control (Git).</li>
                <li>Excellent problem-solving skills and attention to detail.</li>
              </ul>
            </div>
          )}

          {activeTab === "Dates & Deadlines" && (
            <div>
              <ul className="list-disc list-inside space-y-1">
                <li>Application Open: {job.startDate || "20 Oct 2025"}</li>
                <li>Application Deadline: {job.deadline || "15 Nov 2025"}</li>
                <li>Interview Rounds: Last week of Nov 2025</li>
                <li>Joining Date: {job.joiningDate || "Jan 2026"}</li>
              </ul>
            </div>
          )}

          {activeTab === "Reviews" && (
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 dark:border-gray-700 rounded">
                ⭐⭐⭐⭐ Great learning culture, but workload can be high.
              </div>
              <div className="p-3 border border-gray-200 dark:border-gray-700 rounded">
                ⭐⭐⭐⭐⭐ Supportive mentors and good exposure to real projects.
              </div>
            </div>
          )}

          {activeTab === "FAQs & Discussions" && (
            <div className="space-y-3">
              <div>
                <p className="font-medium">Q: Is this role remote or in-office?</p>
                <p>A: It’s {job.type || "In-Office"}.</p>
              </div>
              <div>
                <p className="font-medium">Q: What is the expected salary?</p>
                <p>A: {job.package || "₹4-6 LPA"}.</p>
              </div>
              <div>
                <p className="font-medium">Q: Do freshers qualify?</p>
                <p>A: Yes, experience range is {job.experience || "0-3 years"}.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drag & Drop Status Board */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Job Status</h3>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STATUSES.map((status) => (
              <Droppable key={status} droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 rounded-lg min-h-[100px] transition-colors duration-300 border ${
                      snapshot.isDraggingOver
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <h4 className="font-semibold capitalize mb-2">{status}</h4>
                    {job.status === status && (
                      <Draggable draggableId={job.id.toString()} index={0}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white dark:bg-gray-700 p-3 rounded shadow mb-2 transition-colors duration-300"
                          >
                            {job.title}
                          </div>
                        )}
                      </Draggable>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Assessment Builder */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors duration-300 space-y-4">
        <h3 className="text-xl font-semibold">Assessments for this Job</h3>
        <AssessmentBuilder jobId={id} />
      </div>

      {/* Job Modal */}
      {showJobModal && (
        <JobModal
          job={job}
          onClose={() => setShowJobModal(false)}
          onSave={(updatedJob) => setJob(updatedJob)}
        />
      )}
    </div>
  );
}
