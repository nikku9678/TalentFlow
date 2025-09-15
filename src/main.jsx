import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { seedIfEmpty } from "./mock/seed";
import './index.css'
import { ThemeProvider } from "./context/ThemeProvider";
// ✅ Only init MSW in development
async function init() {
  if (import.meta.env.DEV) {
    const { initMocks } = await import("./mock/browser");
    await initMocks();
  }

  // ✅ Always seed IndexedDB (dev + prod)
  await seedIfEmpty();

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <ThemeProvider>
         <App />
      </ThemeProvider>
     
    </React.StrictMode>
  );
}

init();
