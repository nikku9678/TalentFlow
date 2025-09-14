import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/jobs?page=1&pageSize=1000`);
        const data = await res.json();
        const foundJob = data.items.find((j) => j.id === parseInt(id, 10));
        setJob(foundJob || null);
      } catch (err) {
        console.error("Failed to fetch job:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [id]);

  if (loading) return <p className="p-6">Loading job details...</p>;
  if (!job) return <p className="p-6">Job not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back
      </button>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-bold">{job.title}</h2>
        <p>
          <span className="font-semibold">Status:</span>{" "}
          <span className="capitalize">{job.status}</span>
        </p>
        {job.tags && job.tags.length > 0 && (
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
        {job.requirements && (
          <div>
            <span className="font-semibold">Requirements:</span>
            <ul className="list-disc list-inside mt-1 text-gray-700">
              {job.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}
        {job.salary && (
          <p>
            <span className="font-semibold">Salary:</span> {job.salary}
          </p>
        )}
        {job.location && (
          <p>
            <span className="font-semibold">Location:</span> {job.location}
          </p>
        )}
        {job.otherDetails && (
          <div>
            <span className="font-semibold">Other Details:</span>
            <p className="mt-1 text-gray-700">{job.otherDetails}</p>
          </div>
        )}
      </div>
    </div>
  );
}
