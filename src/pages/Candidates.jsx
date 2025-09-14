import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function Candidates() {
  const [candidates, setCandidates] = useState([])
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState("All")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20

  const fetchCandidates = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append("page", page)
      params.append("pageSize", pageSize)
      if (search) params.append("search", search)
      if (stageFilter !== "All") params.append("stage", stageFilter)

      const res = await fetch(`/candidates?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch candidates")

      const data = await res.json()
      setCandidates(data.items || [])
      setTotal(data.total || 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCandidates()
  }, [page, search, stageFilter])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Candidates</h2>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={stageFilter}
          onChange={(e) => { setStageFilter(e.target.value); setPage(1); }}
          className="w-full md:w-1/4 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && !error && candidates.length > 0 ? (
          candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <Link
                to={`/candidates/${candidate.id}`}
                className="text-lg font-semibold text-blue-600 hover:underline"
              >
                {candidate.name}
              </Link>
              <p className="text-gray-600">{candidate.email}</p>
              <span
                className={`inline-block mt-3 px-3 py-1 text-sm font-medium rounded-full 
                  ${
                    candidate.stage === "hired"
                      ? "bg-green-100 text-green-700"
                      : candidate.stage === "offer"
                      ? "bg-yellow-100 text-yellow-700"
                      : candidate.stage === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
              >
                {candidate.stage}
              </span>
            </div>
          ))
        ) : (
          !loading && !error && (
            <p className="text-center col-span-3 text-gray-500">
              No candidates found.
            </p>
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
        <span className="text-gray-700">
          Page {page} of {totalPages || 1}
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
  )
}
