import { Link } from "react-router-dom"
import { UserIcon } from "lucide-react" // icon for avatar

export default function CandidateCard({ candidate }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <UserIcon size={24} />
        </div>
        <div>
          <Link
            to={`/candidates/${candidate.id}`}
            className="text-md font-semibold text-blue-600 hover:underline"
          >
            {candidate.name}
          </Link>
          <p className="text-gray-600 text-sm">{candidate.email}</p>
        </div>
      </div>
      <span
        className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full 
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
  )
}
