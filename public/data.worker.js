// No external scripts needed anymore.

let allRecords = [];

// The main message handler for the worker
self.onmessage = (event) => {
  const { action, payload } = event.data;

  switch (action) {
    case "generate":
      generateAndStoreData();
      break;
    case "filter":
      filterData(payload);
      break;
    default:
      self.postMessage({ error: "Unknown action" });
  }
};

// --- Worker Functions ---

function generateAndStoreData() {
  console.log("[Worker] Generating simple data...");
  const NUM_RECORDS = 200000;
  // Generate simple, non-random data.
  for (let i = 0; i < NUM_RECORDS; i++) {
    allRecords.push({
      id: i,
      name: `Person ${i + 1}`,
      email: `person_${i + 1}@example.com`,
      value: Math.floor(Math.random() * 10000),
    });
  }
  console.log("[Worker] Data generation complete.");
  // Let the main thread know we are ready.
  self.postMessage({ status: "ready" });
}

function filterData(filter) {
  console.log(`[Worker] Filtering data with term: "${filter}"`);
  if (!filter) {
    // If the filter is empty, return a subset of the full data
    self.postMessage({
      status: "filtered",
      payload: {
        filteredRecords: allRecords.slice(0, 100),
        totalCount: allRecords.length,
      },
    });
    return;
  }

  const lowercasedFilter = filter.toLowerCase();
  const filtered = allRecords.filter((record) =>
    record.name.toLowerCase().includes(lowercasedFilter)
  );

  self.postMessage({
    status: "filtered",
    payload: {
      // Return only the first 100 results for display
      filteredRecords: filtered.slice(0, 100),
      totalCount: filtered.length,
    },
  });
}
