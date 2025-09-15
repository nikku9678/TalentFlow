import { useState, useEffect } from "react";

export default function AssessmentModal({
  show,
  onClose,
  onSave,
  assessment,
  jobs,
  mode = "create", // "create", "edit", "view"
}) {
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (assessment) {
      setTitle(assessment.title);
      setSections(assessment.sections || []);
    } else {
      setTitle("");
      setSections([]);
    }
  }, [assessment]);

  const addSection = () => setSections([...sections, { title: "", questions: [] }]);
  const updateSectionTitle = (idx, value) => {
    const newSections = [...sections];
    newSections[idx].title = value;
    setSections(newSections);
  };
  const addQuestion = (sectionIdx, type = "short") => {
    const newSections = [...sections];
    newSections[sectionIdx].questions.push({ label: "", type, required: true });
    setSections(newSections);
  };
  const updateQuestion = (sectionIdx, qIdx, field, value) => {
    const newSections = [...sections];
    newSections[sectionIdx].questions[qIdx][field] = value;
    setSections(newSections);
  };

  if (!show) return null;

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const handleSaveClick = () => {
    if (onSave) {
      onSave({
        ...assessment,
        title,
        sections,
        jobId: assessment?.jobId || (jobs[0]?.id || 0),
        createdAt: assessment?.createdAt || new Date().toISOString(),
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl p-6 relative text-gray-900 dark:text-gray-200 transition-colors duration-300">
        <button
          className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="text-xl font-bold mb-4">
          {isViewMode ? "View Assessment" : isEditMode ? "Edit Assessment" : "Create Assessment"}
        </h3>

        <input
          type="text"
          className="w-full border dark:border-gray-600 rounded px-3 py-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          placeholder="Assessment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isViewMode}
        />

        {sections.map((s, sIdx) => (
          <div key={sIdx} className="mb-4 border dark:border-gray-600 p-3 rounded">
            <input
              type="text"
              className="w-full border dark:border-gray-600 rounded px-2 py-1 mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              placeholder={`Section ${sIdx + 1} Title`}
              value={s.title}
              onChange={(e) => updateSectionTitle(sIdx, e.target.value)}
              disabled={isViewMode}
            />

            {s.questions.map((q, qIdx) => (
              <div key={qIdx} className="flex gap-2 mb-1">
                <input
                  type="text"
                  className="flex-1 border dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                  placeholder="Question label"
                  value={q.label}
                  onChange={(e) => updateQuestion(sIdx, qIdx, "label", e.target.value)}
                  disabled={isViewMode}
                />
                <select
                  value={q.type}
                  onChange={(e) => updateQuestion(sIdx, qIdx, "type", e.target.value)}
                  className="border dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                  disabled={isViewMode}
                >
                  <option value="single">Single Choice</option>
                  <option value="multi">Multi Choice</option>
                  <option value="short">Short Text</option>
                  <option value="long">Long Text</option>
                  <option value="numeric">Numeric</option>
                  <option value="file">File Upload</option>
                </select>
              </div>
            ))}

            {!isViewMode && (
              <button
                className="px-3 py-1 bg-green-500 dark:bg-green-600 text-white rounded hover:bg-green-600 dark:hover:bg-green-500 mt-2 transition"
                onClick={() => addQuestion(sIdx)}
              >
                + Add Question
              </button>
            )}
          </div>
        ))}

        {!isViewMode && (
          <button
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            onClick={addSection}
          >
            + Add Section
          </button>
        )}

        <div className="mt-6 border-t dark:border-gray-600 pt-4">
          <h4 className="font-bold mb-2">Live Preview</h4>
          {(sections || []).map((s, idx) => (
            <div key={idx} className="mb-3">
              <p className="font-semibold">{s.title || `Section ${idx + 1}`}</p>
              <ul className="list-disc list-inside">
                {(s.questions || []).map((q, qidx) => (
                  <li key={qidx}>
                    {q.label || "Question"} ({q.type})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {!isViewMode && (
          <button
            className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            onClick={handleSaveClick}
          >
            Save Assessment
          </button>
        )}
      </div>
    </div>
  );
}
