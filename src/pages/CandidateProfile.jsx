import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import { db } from "../db/db";

const STAGES = ["applied", "screen", "tech", "offer", "hired", "rejected"];

export default function CandidateProfile() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [board, setBoard] = useState({});

  // Fetch candidate
  const fetchCandidate = async () => {
    const data = await db.candidates.get(Number(id));
    setCandidate(data);
  };

  // Fetch timeline
  const fetchTimeline = async () => {
    const data = await db.timelines
      .where("candidateId")
      .equals(Number(id))
      .toArray();
    setTimeline(data);
  };

  // Fetch notes
  const fetchNotes = async () => {
    const data = await db.notes
      .where("candidateId")
      .equals(Number(id))
      .toArray();
    setNotes(data);
  };

  // Build kanban board
  const buildBoard = (candidate) => {
    const columns = {};
    STAGES.forEach((stage) => {
      columns[stage] =
        candidate.stage === stage
          ? [
              {
                id: candidate.id.toString(),
                name: candidate.name,
                email: candidate.email,
              },
            ]
          : [];
    });
    return columns;
  };

  useEffect(() => {
    fetchCandidate();
    fetchTimeline();
    fetchNotes();
  }, [id]);

  useEffect(() => {
    if (candidate) setBoard(buildBoard(candidate));
  }, [candidate]);

  // Handle drag end
  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    if (sourceCol !== destCol) {
      // Persist change
      const response = await fetch(`/candidates/${candidate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: destCol }),
      });

      if (!response.ok) {
        alert("Failed to update stage");
        return;
      }

      const updatedCandidate = await response.json();
      setCandidate(updatedCandidate);

      // Update timeline
      const timelineRes = await fetch(`/candidates/${candidate.id}/timeline`);
      const timelineData = await timelineRes.json();
      setTimeline(timelineData.items);
    }

    // Update UI
    const newBoard = { ...board };
    const [moved] = newBoard[sourceCol].splice(source.index, 1);
    newBoard[destCol].splice(destination.index, 0, moved);
    setBoard(newBoard);
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    const note = {
      candidateId: Number(id),
      text: newNote,
      createdAt: new Date().toISOString(),
    };
    await db.notes.add(note);
    setNewNote("");
    fetchNotes();
  };

  if (!candidate) return <p className="p-6">Loading candidate...</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">{candidate.name}</h2>
      <p className="text-gray-600">{candidate.email}</p>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto">
          {STAGES.map((stage) => (
            <Droppable key={stage} droppableId={stage}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 p-4 rounded-lg w-56 min-h-[300px]"
                >
                  <h3 className="font-semibold mb-2">
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </h3>
                  {board[stage]?.map((card, index) => (
                    <Draggable
                      key={card.id}
                      draggableId={card.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-3 bg-white rounded shadow mb-2"
                        >
                          <p className="font-medium">{card.name}</p>
                          <p className="text-sm text-gray-500">
                            {card.email}
                          </p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Timeline */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Timeline</h3>
        <ul className="space-y-2">
          {timeline.map((t, i) => (
            <li key={i} className="p-3 bg-gray-100 rounded">
              <span className="font-medium">{t.fromStage || "Created"}</span> →{" "}
              <span className="font-medium">{t.toStage}</span>
              <p className="text-sm text-gray-600">{t.meta?.note}</p>
              <p className="text-xs text-gray-500">
                {new Date(t.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Notes */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Notes</h3>
        <div className="space-y-2 mb-4">
          {notes.map((n, i) => (
            <div key={i} className="p-2 bg-white shadow rounded">
              <p>{n.text}</p>
              <span className="text-xs text-gray-500">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a note... use @ to mention"
          className="w-full border rounded-lg p-2 mb-2"
        />
        <button
          onClick={addNote}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Add Note
        </button>
      </div>
    </div>
  );
}
