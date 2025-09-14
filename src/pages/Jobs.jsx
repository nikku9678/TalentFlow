import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobModal from "../components/jobs/JobModal";
import { db } from "../db/db"; // if you want client-side DB for demo

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [modalProps, setModalProps] = useState({ show: false, job: null });
  const navigate = useNavigate();

  const fetchJobs = async () => {
    let filteredJobs = await db.jobs.toArray(); // client-side for demo

    // Search
    if (search) {
      filteredJobs = filteredJobs.filter((j) =>
        j.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    // Status filter
    if (statusFilter) {
      filteredJobs = filteredJobs.filter((j) => j.status === statusFilter);
    }
    // Tag filter
    if (tagFilter) {
      filteredJobs = filteredJobs.filter((j) => j.tags?.includes(tagFilter));
    }

    setTotal(filteredJobs.length);

    // Pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setJobs(filteredJobs.slice(start, end));
  };

  useEffect(() => {
    fetchJobs();
  }, [page, search, statusFilter, tagFilter]);

  const openModal = (job = null) => {
    setModalProps({ show: true, job });
  };

  const handleSaveJob = async (jobData) => {
    // Check unique slug
    const exists = await db.jobs.where("slug").equals(jobData.slug).first();
    if (exists && exists.id !== jobData.id) {
      return alert("Job with this title already exists.");
    }

    if (jobData.id) {
      await db.jobs.put(jobData);
      setJobs(jobs.map((j) => (j.id === jobData.id ? jobData : j)));
    } else {
      const id = await db.jobs.add(jobData);
      setJobs([...jobs, { ...jobData, id }]);
    }

    setModalProps({ show: false, job: null });
  };

  const handleArchive = async (job) => {
    const updated = {
      ...job,
      status: job.status === "archived" ? "active" : "archived",
    };
    await db.jobs.put(updated);
    setJobs(jobs.map((j) => (j.id === job.id ? updated : j)));
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Jobs</h2>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search title..."
          className="border px-3 py-1 rounded-3xl text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border px-6 py-1 rounded-3xl text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        <input
          type="text"
          placeholder="Filter by tag..."
          className="border px-3 py-1 rounded-3xl text-sm"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        />

        <button
          className="px-4 py-1 bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded-3xl text-sm"
          onClick={() => openModal()}
        >
          + Create Job
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <h3
                className="text-lg text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate(`/job/${job.id}`)}
              >
                {job.title}
              </h3>
              <p className="text-sm text-gray-500 my-2">Status: {job.status}</p>
              {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 my-2">
                  {job.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-200 rounded-full px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button
                className="px-6 py-1 bg-green-600 text-sm text-white rounded-2xl hover:bg-green-700"
                onClick={() => openModal(job)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 bg-yellow-500 text-white rounded-2xl hover:bg-yellow-600"
                onClick={() => handleArchive(job)}
              >
                {job.status === "archived" ? "Unarchive" : "Archive"}
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded-2xl hover:bg-red-700"
                onClick={async () => {
                  if (
                    window.confirm("Are you sure you want to delete this job?")
                  ) {
                    await db.jobs.delete(job.id);
                    setJobs(jobs.filter((j) => j.id !== job.id));
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          disabled={page === 1}
          className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 ${
            page === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 ${
            page === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>

      <JobModal
        show={modalProps.show}
        onClose={() => setModalProps({ show: false, job: null })}
        job={modalProps.job}
        onSave={handleSaveJob}
      />
    </div>
  );
}
