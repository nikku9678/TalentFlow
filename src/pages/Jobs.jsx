import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10); // 10 jobs per page
  const navigate = useNavigate();

  const fetchJobs = async (pageNum = 1) => {
    try {
      const res = await fetch(`/jobs?page=${pageNum}&pageSize=${pageSize}`);
      const data = await res.json();
      setJobs(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs(page);
  }, [page]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Jobs</h2>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
            onClick={() => navigate(`/job/${job.id}`)}
          >
            <div>
              <h3 className="font-bold text-lg text-blue-600 hover:underline">
                {job.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Status: <span className="capitalize">{job.status}</span>
              </p>
              {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
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
            <div className="mt-4 text-right">
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/job/${job.id}`);
                }}
              >
                View Details
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
    </div>
  );
}
