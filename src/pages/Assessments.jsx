import { useEffect, useState } from "react";
import { db } from "../db/db";
import { useNavigate } from "react-router-dom";

export default function Assessments() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const jobsData = await db.jobs.toArray();
      setJobs(jobsData);
      const assessmentsData = await db.assessments.toArray();
      setAssessments(assessmentsData);
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assessment?")) {
      await db.assessments.delete(id);
      setAssessments(assessments.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-full mx-auto space-y-6 dark:bg-gray-900 dark:text-gray-200">
      <div className="flex justify-between p-4">
        <h2 className="text-2xl font-bold">Assessments</h2>
        <button
          className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-3xl hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          onClick={() => navigate("/assessment/create")}
        >
          + Create Assessment
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {assessments.map((a) => {
          const job = jobs.find((j) => j.id === a.jobId);
          const totalQuestions = (a.sections || []).reduce(
            (acc, s) => acc + (s.questions?.length || 0),
            0
          );

          return (
            <div
              key={a.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col justify-between transition-colors duration-300"
            >
              <div className="space-y-1">
                <h3 className="font-bold text-lg">{a.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Job: {job?.title || "Job not found"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Sections: {a.sections?.length || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Questions: {totalQuestions}
                </p>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                <button
                  className="px-3 py-1 bg-yellow-500 dark:bg-yellow-400 text-white rounded hover:bg-yellow-600 dark:hover:bg-yellow-500 transition"
                  onClick={() => navigate(`/assessment/view/${a.id}`)}
                >
                  View
                </button>
                <button
                  className="px-3 py-1 bg-red-600 dark:bg-red-500 text-white rounded hover:bg-red-700 dark:hover:bg-red-600 transition"
                  onClick={() => handleDelete(a.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
