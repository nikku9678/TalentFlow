export default function CandidateStats({ candidates }) {
  const total = candidates.length

  const stageCounts = candidates.reduce((acc, c) => {
    acc[c.stage] = (acc[c.stage] || 0) + 1
    return acc
  }, {})

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="col-span-2 md:col-span-3 text-center">
        <h3 className="text-lg font-semibold text-gray-700">Total Candidates</h3>
        <p className="text-2xl font-bold text-blue-600">{total}</p>
      </div>

      {Object.entries(stageCounts).map(([stage, count]) => (
        <div key={stage} className="bg-gray-50 p-4 rounded-lg text-center shadow-sm">
          <p className="text-sm font-medium text-gray-600">{stage}</p>
          <p className="text-lg font-bold text-gray-800">{count}</p>
        </div>
      ))}
    </div>
  )
}
