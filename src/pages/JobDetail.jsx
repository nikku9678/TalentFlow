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

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await db.jobs.delete(job.id);
      navigate("/jobs");
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      {/* Job Header */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
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
      <div className="bg-white p-6 rounded-lg shadow">
        {/* Tab Headers */}
        <div className="flex border-b mb-4 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="text-gray-700 space-y-3">
          {activeTab === "Job Description" && (
            <div>
              <h3 className="font-semibold">About this Job</h3>
             <div className="mt-2 space-y-3">
  <p>
    {job.description ||
      "We are looking for a passionate Software Engineer to join our dynamic team and work on building scalable applications."}
  </p>

  <h4 className="font-semibold mt-4">Responsibilities:</h4>
  <ul className="list-disc list-inside space-y-1">
    <li>Design, develop, and maintain web applications using React & Node.js.</li>
    <li>Collaborate with cross-functional teams to define and deliver new features.</li>
    <li>Write clean, efficient, and testable code following best practices.</li>
    <li>Troubleshoot, debug, and optimize performance for existing applications.</li>
    <li>Contribute to technical discussions and propose innovative solutions.</li>
  </ul>

  <h4 className="font-semibold mt-4">Requirements:</h4>
  <ul className="list-disc list-inside space-y-1">
    <li>Bachelor’s degree in Computer Science or related field.</li>
    <li>Strong proficiency in JavaScript, React, and Node.js.</li>
    <li>Familiarity with REST APIs and database technologies (MySQL/MongoDB).</li>
    <li>Good understanding of version control (Git).</li>
    <li>Excellent problem-solving skills and attention to detail.</li>
  </ul>

  <h4 className="font-semibold mt-4">Perks:</h4>
  <ul className="list-disc list-inside space-y-1">
    <li>Competitive salary and performance-based bonuses.</li>
    <li>Flexible work hours with hybrid options.</li>
    <li>Health insurance and wellness programs.</li>
    <li>Learning & development budget for certifications and courses.</li>
    <li>Fun team outings and hackathons.</li>
  </ul>
</div>


              {job.requirements && (
                <div className="mt-4">
                  <h4 className="font-semibold">Requirements</h4>
                  <ul className="list-disc list-inside mt-1">
                    {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
                  </ul>
                  
                </div>
              )}

              {job.skills && (
                <div className="mt-4">
                  <h4 className="font-semibold">Skills</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {job.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "Dates & Deadlines" && (
            <div>
              <h3 className="font-semibold">Important Dates</h3>
              <ul className="list-disc list-inside mt-2">
                <li>Application Open: {job.startDate || "20 Oct 2025"}</li>
                <li>Application Deadline: {job.deadline || "15 Nov 2025"}</li>
                <li>Interview Rounds: Last week of Nov 2025</li>
                <li>Joining Date: {job.joiningDate || "Jan 2026"}</li>
              </ul>
            </div>
          )}

          {activeTab === "Reviews" && (
            <div>
              <h3 className="font-semibold">What candidates say</h3>
              <div className="space-y-3 mt-2">
                <div className="p-3 border rounded">
                  ⭐⭐⭐⭐ Great learning culture, but workload can be high.
                </div>
                <div className="p-3 border rounded">
                  ⭐⭐⭐⭐⭐ Supportive mentors and good exposure to real projects.
                </div>
              </div>
            </div>
          )}

          {activeTab === "FAQs & Discussions" && (
            <div>
              <h3 className="font-semibold">Frequently Asked Questions</h3>
              <div className="mt-2 space-y-3">
                <div>
                  <p className="font-medium">Q: Is this role remote or in-office?</p>
                  <p className="text-sm text-gray-600">A: It’s {job.type || "In-Office"}.</p>
                </div>
                <div>
                  <p className="font-medium">Q: What is the expected salary?</p>
                  <p className="text-sm text-gray-600">A: {job.package || "₹4-6 LPA"}.</p>
                </div>
                <div>
                  <p className="font-medium">Q: Do freshers qualify?</p>
                  <p className="text-sm text-gray-600">A: Yes, experience range is {job.experience || "0-3 years"}.</p>
                </div>
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
                    className={`p-4 rounded-lg min-h-[100px] transition-colors ${
                      snapshot.isDraggingOver ? "bg-blue-100" : "bg-gray-50 border border-gray-200"
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
                            className="bg-white p-3 rounded shadow mb-2"
                          >
                            <div className="flex justify-between items-center">
                              <span>{job.title}</span>
                              <div className="flex gap-1">
                                {/* <button
                                  className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                                  onClick={() => setShowJobModal(true)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                                  onClick={handleDelete}
                                >
                                  Delete
                                </button> */}
                              </div>
                            </div>
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

      {/* Integrated Assessment Builder */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-xl font-semibold">Assessments for this Job</h3>
        <AssessmentBuilder jobId={id} />
      </div>

      {/* Job Edit Modal */}
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
