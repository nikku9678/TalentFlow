import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobModal from "../components/jobs/JobModal";
import { db } from "../db/db"; // client-side DB demo

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
    let filteredJobs = await db.jobs.toArray();

    if (search) {
      filteredJobs = filteredJobs.filter((j) =>
        j.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter) {
      filteredJobs = filteredJobs.filter((j) => j.status === statusFilter);
    }
    if (tagFilter) {
      filteredJobs = filteredJobs.filter((j) => j.tags?.includes(tagFilter));
    }

    setTotal(filteredJobs.length);
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
    <div className="p-6 bg-gray-50 dark:bg-gray-800 min-h-screen transition-colors duration-300">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
        Jobs
      </h2>

      {/* Filters & Search */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search title..."
          className="border px-3 py-1 rounded-3xl text-sm bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border px-6 py-1 rounded-3xl text-sm bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
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
          className="border px-3 py-2 rounded-3xl text-sm bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        />

        <button
          className="px-4 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded-3xl text-sm transition"
          onClick={() => openModal()}
        >
          + Create Job
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between border border-gray-200 dark:border-gray-700"
          >
            <div>
              <h3
                className="text-lg text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                onClick={() => navigate(`/job/${job.id}`)}
              >
                {job.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 my-2">
                Status: {job.status}
              </p>
              {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 my-2">
                  {job.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button
                className="px-6 py-1 bg-green-600 text-sm text-white rounded-2xl hover:bg-green-700 transition"
                onClick={() => openModal(job)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-2xl hover:bg-yellow-600 transition"
                onClick={() => handleArchive(job)}
              >
                {job.status === "archived" ? "Unarchive" : "Archive"}
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-2xl hover:bg-red-700 transition"
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
          className={`px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition ${
            page === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span className="text-gray-800 dark:text-gray-300">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          className={`px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition ${
            page === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      <JobModal
        show={modalProps.show}
        onClose={() => setModalProps({ show: false, job: null })}
        job={modalProps.job}
        onSave={handleSaveJob}
      />
    </div>
  );
}
