# Task Tracker App
This repository contains my completed solution to the [Task Tracker](https://roadmap.sh/projects/task-tracker-js) challenge on roadmap.sh.

## Project Details
The objective of this project is to create a task tracker that lets users add new tasks, mark them as complete, or delete them. Completed tasks will be moved to the end of the list and will have strikethrough, and users can unmark tasks to return them to the pending list.

## Requirements Met
- **Array Object State Architecture:** Stores tasks inside an array of objects utilizing strict requirement parameter mappings (`description` and `completed`).
- **Dynamic End-of-List Sorting Matrix:** Whenever a task is marked as complete, the array manipulation handler pushes the item to the absolute bottom of the list stack. Unmarking an entry returns it cleanly back to the pending stream pool.
- **Dynamic React Re-rendering Engine:** Implements the core concept of `renderTasks` natively through React's virtual DOM reconciliation loop. Adding, toggling, updating, or purging array objects instantly purges old DOM elements and updates the view layer with zero manual node traversal.
- **Strikethrough Treatment:** Completed items are immediately styled with a clean strikethrough effect and high-precision opacity reductions to keep active tasks prominent.
- **Inline Title Micro-editing:** Allows fast, zero-popup item name changes via text input transformations triggered by clicking straight onto an uncompleted entry title.
- **Persistent Cache Systems:** Automatically reads and writes state mutations cleanly to `localStorage` hooks.
- **Monochrome Styling & Theme System:** Designed using high-contrast variables, complete with light/dark theme toggle support.

## File Structure

```text
task-tracker/
├── src/
│   ├── App.jsx                # Core state arrays, manipulation functions & markup hooks
│   └── index.css              # Custom Tailwind directives & monochrome color scales
├── package.json               # Package metadata and compiler configuration rules
├── vite.config.js             # Asset building configuration presets
└── README.md                  # Comprehensive architectural project documentation
```

## Setup & Preview
To run the application locally:
- Clone the repository and enter the workspace:
```bash
cd task-tracker-rm
```

- Install the required dependencies:
```bash
npm install
```

- Boot up the development server:
```bash
npm run dev
```

- Launch the platform:
Navigate to the local URL provided by your terminal (typically http://localhost:5173/) to interact with the dashboard.