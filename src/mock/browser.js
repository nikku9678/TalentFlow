// src/mocks/browser.js
// import { setupWorker } from "msw";
import { setupWorker } from "msw/browser";

import { handlers } from "./handlers";
import { seedIfEmpty } from "./seed";

export const worker = setupWorker(...handlers);

// helper to init worker and seed DB
export async function initMocks() {
  // ensure DB seeded before worker starts (so GET endpoints work)
  await seedIfEmpty();
  await worker.start({
    onUnhandledRequest: "warn",
    // Delay can be zero because we simulate latency per handler
  });
  console.log("MSW started");
}
