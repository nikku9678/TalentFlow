import { useEffect, useState } from "react";
import { db } from "../db/db";
import AssessmentModal from "../components/assessment/AssessmentModal";

export default function Assessments() {
  const [assessments, setAssessments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [modalProps, setModalProps] = useState({ show: false, mode: "create", assessment: null });

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

  const openModal = (mode = "create", assessment = null) => {
    setModalProps({ show: true, mode, assessment });
  };

  const handleSave = async (payload) => {
    if (modalProps.mode === "edit") {
      await db.assessments.put(payload);
      setAssessments(assessments.map((a) => (a.id === payload.id ? payload : a)));
    } else {
      const id = await db.assessments.add(payload);
      setAssessments([...assessments, { ...payload, id }]);
    }
    setModalProps({ ...modalProps, show: false });
  };

  return (
    <div className="min-h-screen p-6 max-w-full mx-auto space-y-6 dark:bg-gray-900 dark:text-gray-200">
      <div className="flex justify-between p-4 ">
        <h2 className="text-2xl font-bold">Assessments</h2>

      <button
        className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-3xl hover:bg-blue-700 dark:hover:bg-blue-600 transition"
        onClick={() => openModal("create")}
      >
        + Create Assessment
      </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {assessments.map((a) => {
          const job = jobs.find((j) => j.id === a.jobId);
          const sec = a.sections || [];
          const totalQuestions = sec.reduce((acc, s) => acc + (s.questions?.length || 0), 0);

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
                <p className="text-sm text-gray-600 dark:text-gray-300">Sections: {sec.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Questions: {totalQuestions}</p>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                <button
                  className="px-3 py-1 bg-green-600 dark:bg-green-500 text-white rounded hover:bg-green-700 dark:hover:bg-green-600 transition"
                  onClick={() => openModal("edit", a)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-yellow-500 dark:bg-yellow-400 text-white rounded hover:bg-yellow-600 dark:hover:bg-yellow-500 transition"
                  onClick={() => openModal("view", a)}
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

      <AssessmentModal
        show={modalProps.show}
        mode={modalProps.mode}
        assessment={modalProps.assessment}
        onClose={() => setModalProps({ ...modalProps, show: false })}
        onSave={handleSave}
        jobs={jobs}
      />
    </div>
  );
}
