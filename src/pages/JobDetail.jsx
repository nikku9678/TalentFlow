import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { db } from "../db/db";
import AssessmentBuilder from "../components/AssessmentBuilder";
import JobModal from "../components/jobs/JobModal";

const STATUSES = ["draft", "active", "archived"];

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showJobModal, setShowJobModal] = useState(false);

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
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-bold">{job.title}</h2>
        {job.tags?.length > 0 && (
          <p>
            <span className="font-semibold">Tags:</span>{" "}
            {job.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-200 rounded-full px-2 py-1 mr-1"
              >
                {tag}
              </span>
            ))}
          </p>
        )}
        {job.description && (
          <div>
            <span className="font-semibold">Description:</span>
            <p className="mt-1 text-gray-700">{job.description}</p>
          </div>
        )}
      </div>

      {/* Drag & Drop Job Status */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Job Status</h3>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-3 gap-4">
            {STATUSES.map((status) => (
              <Droppable key={status} droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 rounded-lg min-h-[100px] ${
                      snapshot.isDraggingOver
                        ? "bg-blue-100"
                        : "bg-gray-50 border border-gray-200"
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
                                <button
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
                                </button>
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
