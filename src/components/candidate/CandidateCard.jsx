import { Link } from "react-router-dom"
import { UserIcon } from "lucide-react" // icon for avatar

export default function CandidateCard({ candidate }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-black dark:text-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-colors duration-300">
      {/* Top: Avatar + Info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
          <UserIcon size={24} />
        </div>
        <div className="ml-2">
          <Link
            to={`/candidates/${candidate.id}`}
            className="text-md font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {candidate.name}
          </Link>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{candidate.email}</p>
        </div>
      </div>

      {/* Stage Badge */}
      <span
        className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full transition-colors duration-300
          ${
            candidate.stage === "hired"
              ? "bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300"
              : candidate.stage === "offer"
              ? "bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300"
              : candidate.stage === "rejected"
              ? "bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300"
              : "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300"
          }`}
      >
        {candidate.stage}
      </span>
    </div>
  )
}
