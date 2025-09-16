import { useEffect, useState } from "react";
import CandidateCard from "../components/candidate/CandidateCard";
import CandidateStats from "../components/candidate/CandidateStats";
import Loader from "../components/loader/Loader";
import { db } from "../db/db";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all candidates from IndexedDB
      let allCandidates = [];
      if (window.api?.getCandidates) {
        allCandidates = await window.api.getCandidates();
      } else {
        allCandidates = await db.candidates.toArray();
      }

      // Apply search filter
      if (search) {
        allCandidates = allCandidates.filter(
          (c) =>
            c.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.email?.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply stage filter
      if (stageFilter !== "All") {
        allCandidates = allCandidates.filter((c) => c.stage === stageFilter);
      }

      setTotal(allCandidates.length);

      // Apply pagination
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      setCandidates(allCandidates.slice(start, end));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [page, search, stageFilter]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-start">Candidates</h2>

      {/* Candidate Stats */}
      <CandidateStats candidates={candidates} />

      {/* Search + Stage Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-1/2 dark:bg-gray-900 dark:text-white px-4 py-2 border rounded-3xl shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
        />
        <select
          value={stageFilter}
          onChange={(e) => {
            setStageFilter(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-1/4 px-4 py-2 border rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Stages</option>
          <option value="applied">Applied</option>
          <option value="screen">Screen</option>
          <option value="tech">Tech</option>
          <option value="offer">Offer</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Loading / Error */}
      {loading && <Loader />}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && !error && candidates.length > 0 ? (
          candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))
        ) : (
          !loading &&
          !error && (
            <div className="flex items-center justify-center col-span-3 min-h-[50vh]">
              <p className="text-center text-xl text-gray-500 dark:text-gray-400">
                No candidates found.
              </p>
            </div>
          )
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
