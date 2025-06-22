import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [displayedRecords, setDisplayedRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filter, setFilter] = useState("");
  const [status, setStatus] = useState("Initializing...");

  // Use a ref to hold the worker instance
  const workerRef = useRef(null);

  // 1. Initialize the worker and handle messages
  useEffect(() => {
    // Create the worker
    workerRef.current = new Worker("/data.worker.js");
    setStatus("Worker created. Generating data...");

    // Set up message listener
    workerRef.current.onmessage = (event) => {
      const { status: workerStatus, payload } = event.data;
      if (workerStatus === "ready") {
        setStatus("Data ready. Type to filter.");
        // Initial load with no filter
        workerRef.current.postMessage({ action: "filter", payload: "" });
      } else if (workerStatus === "filtered") {
        setDisplayedRecords(payload.filteredRecords);
        setTotalRecords(payload.totalCount);
      }
    };

    // Send initial command to generate data
    workerRef.current.postMessage({ action: "generate" });

    // Cleanup: terminate the worker when the component unmounts
    return () => {
      workerRef.current.terminate();
    };
  }, []); // Run only once on component mount

  // 2. Send filter commands to the worker when the input changes
  useEffect(() => {
    if (status.startsWith("Data ready")) {
      workerRef.current.postMessage({ action: "filter", payload: filter });
    }
  }, [filter, status]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Large Data Grid (Web Worker Version)</h1>
        <p>
          The UI remains perfectly responsive because data generation and
          filtering are handled by a background Web Worker.
        </p>
      </header>
      <div className="content">
        <input
          type="text"
          className="filter-input"
          placeholder="Filter by name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          disabled={!status.startsWith("Data ready")}
        />
        <div className="results-container">
          <p>
            <strong>Status:</strong> {status}
          </p>
          <p>
            Showing <strong>{displayedRecords.length}</strong> / {totalRecords}{" "}
            records
          </p>
          <ul>
            {displayedRecords.map((record) => (
              <li key={record.id}>
                <strong>{record.name}</strong> ({record.email}) - Value:{" "}
                {record.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
