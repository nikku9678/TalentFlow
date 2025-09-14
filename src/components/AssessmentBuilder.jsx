import { useEffect, useState } from "react";
import { db } from "../db/db";

const QUESTION_TYPES = [
  "single-choice",
  "multi-choice",
  "short-text",
  "long-text",
  "numeric",
  "file",
];

export default function AssessmentBuilder({ jobId }) {
  const [assessments, setAssessments] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState(null);

  const [title, setTitle] = useState("");
  const [sections, setSections] = useState([
    { title: "Section 1", questions: [{ type: "short-text", label: "", required: true, choices: [] }] },
  ]);

  // Fetch assessments per job
  useEffect(() => {
    async function fetchAssessments() {
      const data = await db.assessments.where("jobId").equals(Number(jobId)).toArray();
      setAssessments(data);
    }
    fetchAssessments();
  }, [jobId]);

  // Add new section
  const addSection = () => {
    setSections([...sections, { title: `Section ${sections.length + 1}`, questions: [{ type: "short-text", label: "", required: true, choices: [] }] }]);
  };

  // Add new question in section
  const addQuestion = (sectionIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions.push({ type: "short-text", label: "", required: true, choices: [] });
    setSections(newSections);
  };

  // Handle question change
  const handleQuestionChange = (sectionIndex, questionIndex, key, value) => {
    const newSections = [...sections];
    if (key === "choices") {
      newSections[sectionIndex].questions[questionIndex][key] = value.split(",").map((v) => v.trim());
    } else {
      newSections[sectionIndex].questions[questionIndex][key] = value;
    }
    setSections(newSections);
  };

  // Handle section title change
  const handleSectionTitleChange = (sectionIndex, value) => {
    const newSections = [...sections];
    newSections[sectionIndex].title = value;
    setSections(newSections);
  };

  // Delete question
  const deleteQuestion = (sectionIndex, questionIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions.splice(questionIndex, 1);
    setSections(newSections);
  };

  // Delete section
  const deleteSection = (sectionIndex) => {
    const newSections = [...sections];
    newSections.splice(sectionIndex, 1);
    setSections(newSections);
  };

  // Save assessment
  const saveAssessment = async () => {
    if (!title.trim()) return alert("Assessment title is required");
    if (sections.some(s => s.questions.some(q => !q.label.trim()))) return alert("All questions must have a label");

    const assessmentObj = {
      jobId: Number(jobId),
      title,
      sections,
      createdAt: new Date().toISOString(),
    };

    try {
      let id;
      if (editingAssessment) {
        await db.assessments.update(editingAssessment.id, assessmentObj);
        id = editingAssessment.id;
      } else {
        id = await db.assessments.add(assessmentObj);
      }
      setAssessments(await db.assessments.where("jobId").equals(Number(jobId)).toArray());

      // Reset form
      setTitle("");
      setSections([{ title: "Section 1", questions: [{ type: "short-text", label: "", required: true, choices: [] }] }]);
      setEditingAssessment(null);
      setShowBuilder(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save assessment");
    }
  };

  // Edit assessment
  const editAssessment = (assessment) => {
    setEditingAssessment(assessment);
    setTitle(assessment.title);
    setSections(assessment.sections);
    setShowBuilder(true);
  };

  // Delete assessment
  const deleteAssessment = async (id) => {
    if (!window.confirm("Are you sure to delete this assessment?")) return;
    await db.assessments.delete(id);
    setAssessments(await db.assessments.where("jobId").equals(Number(jobId)).toArray());
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => setShowBuilder(!showBuilder)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {showBuilder ? "Cancel" : editingAssessment ? "Edit Assessment" : "Create Assessment"}
      </button>

      {showBuilder && (
        <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Assessment Title"
            className="w-full border rounded px-3 py-2"
          />

          {sections.map((section, sIdx) => (
            <div key={sIdx} className="border p-3 rounded space-y-2 bg-white">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleSectionTitleChange(sIdx, e.target.value)}
                  placeholder="Section Title"
                  className="w-full border rounded px-2 py-1"
                />
                <button onClick={() => deleteSection(sIdx)} className="ml-2 text-red-600 font-bold">X</button>
              </div>

              {section.questions.map((q, qIdx) => (
                <div key={qIdx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={q.label}
                    onChange={(e) => handleQuestionChange(sIdx, qIdx, "label", e.target.value)}
                    placeholder="Question label"
                    className="flex-1 border rounded px-2 py-1"
                  />
                  <select
                    value={q.type}
                    onChange={(e) => handleQuestionChange(sIdx, qIdx, "type", e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    {QUESTION_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {["single-choice","multi-choice"].includes(q.type) && (
                    <input
                      type="text"
                      value={q.choices.join(", ")}
                      onChange={(e) => handleQuestionChange(sIdx, qIdx, "choices", e.target.value)}
                      placeholder="Choices comma-separated"
                      className="border rounded px-2 py-1"
                    />
                  )}
                  <button onClick={() => deleteQuestion(sIdx, qIdx)} className="text-red-600 font-bold">X</button>
                </div>
              ))}
              <button onClick={() => addQuestion(sIdx)} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition mt-1">+ Add Question</button>
            </div>
          ))}

          <button onClick={addSection} className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition">+ Add Section</button>

          {/* Live preview */}
          <div className="mt-4 p-4 border rounded-lg bg-gray-100">
            <h3 className="font-bold mb-2">Live Preview</h3>
            {sections.map((s, sIdx) => (
              <div key={sIdx} className="mb-2">
                <h4 className="font-semibold">{s.title}</h4>
                <div className="space-y-1">
                  {s.questions.map((q, qIdx) => (
                    <div key={qIdx}>
                      <label className="block text-gray-700">{q.label}</label>
                      {q.type === "short-text" && <input className="border rounded px-2 py-1 w-full" type="text" />}
                      {q.type === "long-text" && <textarea className="border rounded px-2 py-1 w-full" rows={3}></textarea>}
                      {q.type === "numeric" && <input className="border rounded px-2 py-1 w-full" type="number" />}
                      {q.type === "file" && <input className="border rounded px-2 py-1 w-full" type="file" disabled />}
                      {q.type === "single-choice" && q.choices.map((c, i) => (
                        <div key={i}><input type="radio" name={`q${sIdx}-${qIdx}`} /> {c}</div>
                      ))}
                      {q.type === "multi-choice" && q.choices.map((c, i) => (
                        <div key={i}><input type="checkbox" /> {c}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button onClick={saveAssessment} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition mt-2">
            {editingAssessment ? "Update Assessment" : "Save Assessment"}
          </button>
        </div>
      )}

      {/* List of saved assessments */}
      <div className="space-y-4">
        {assessments.map(a => (
          <div key={a.id} className="p-4 border rounded bg-white flex justify-between items-center">
            <div>
              <h4 className="font-bold">{a.title}</h4>
              <p className="text-sm text-gray-500">{a.sections?.length || 0} sections</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => editAssessment(a)} className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500">Edit</button>
              <button onClick={() => deleteAssessment(a.id)} className="px-2 py-1 bg-red-500 rounded hover:bg-red-600 text-white">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
