# React Data Grid with Web Workers

This project is a demonstration of using Web Workers to offload heavy computation from the main UI thread, ensuring a smooth and responsive user experience even when processing large datasets. The application features a simple data grid that can filter 200,000 records instantly without any input lag.

## Demo

Live Preview: https://react-webworker-data-grid.onrender.com

## Features

- **Lag-Free UI:** All data processing, including initial generation and subsequent filtering, is handled by a background Web Worker, leaving the main thread free to respond to user input.
- **Runtime Data Generation:** To keep the project lightweight and self-contained, the 200,000-record dataset is generated in memory by the worker when the application starts. No large JSON files are needed.
- **Responsive Interface:** A clean, modern UI allows users to interact with the large dataset, with clear status indicators for background processes.
- **Clear Worker Communication:** Demonstrates the standard and effective pattern of communication between a React component and a Web Worker using `postMessage` and `onmessage` events.

## A Note on Web Worker Placement

The Web Worker script (`public/data.worker.js`) is intentionally placed in the `public` directory. This is a key requirement for how Web Workers are loaded in a standard Create React App environment.

- **Why?** The browser needs to fetch the worker script as a separate, standalone file. Everything inside the `src` folder is bundled by Webpack into a single, optimized application script, meaning individual `src` files are not directly addressable by a URL. Files in the `public` folder, however, are served as-is from the root of the application.

- **In Practice:** Placing the worker in `public` allows the main application to instantiate it correctly with `new Worker('/data.worker.js')`. The browser can then successfully fetch the script from the root URL and run it in a separate thread.

## AI-Assisted Development

This project was developed by **[Devi R](https://www.linkedin.com/in/devi-r-06bb94a7)** in collaboration with an AI assistant in Cursor.

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js and npm (or yarn)

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/devi-r/React-WebWorker-Data-Grid.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Start the development server
    ```sh
    npm start
    ```
