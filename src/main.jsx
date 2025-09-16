import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { seedIfEmpty } from "./mock/seed";
import "./index.css";
import { ThemeProvider } from "./context/ThemeProvider";
import { db } from "./db/db";

async function init() {
  if (import.meta.env.DEV) {
    // ✅ Use MSW only in development
    const { initMocks } = await import("./mock/browser");
    await initMocks();
  }

  // ✅ Always seed IndexedDB (dev + prod)
  await seedIfEmpty();

  // ✅ Provide a global API shim for production
  if (!import.meta.env.DEV) {
    // mock fetch in production → read/write Dexie directly
    window.api = {
      getJobs: async () => db.jobs.toArray(),
      getCandidates: async () => db.candidates.toArray(),
      getAssessments: async () => db.assessments.toArray(),
      addCandidate: async (candidate) => db.candidates.add(candidate),
      addAssessment: async (assessment) => db.assessments.add(assessment),
      // add more functions as needed
    };
  }

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      {/* <ThemeProvider> */}
      <App />
      {/* </ThemeProvider> */}
    </React.StrictMode>
  );
}

init();
