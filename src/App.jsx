import { useState, useEffect } from 'react';

export default function App() {
  // STATE CORE INITIALIZATION & LOCALSTORAGE MANAGEMENT
  const [tasks, setTasks] = useState(() => {
    const cached = localStorage.getItem('git_tracker_tasks');
    return cached ? JSON.parse(cached) : [];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Sync state mutations to localStorage
  useEffect(() => {
    localStorage.setItem('git_tracker_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Sync dark theme mutations to HTML document root element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // CORE SYSTEM OPERATION HANDLERS
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask = {
      id: Date.now(),
      description: inputValue.trim(), // Explicit requirement matching key name
      completed: false,               // Simplified status model flag
      createdAt: new Date().toLocaleDateString(),
    };

    // New items default to the top of the pending list stack
    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const handleToggleComplete = (id) => {
    setTasks(prevTasks => {
      // 1. Toggle the completed property boolean state
      const updatedTasks = prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      );

      // 2. Active items stay up top, completed items drop to the end of the list array
      const pending = updatedTasks.filter(task => !task.completed);
      const completed = updatedTasks.filter(task => task.completed);
      
      return [...pending, ...completed];
    });
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleSaveEdit = (id) => {
    if (!editingText.trim()) return;
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, description: editingText.trim() } : task
    ));
    setEditingId(null);
  };

  return (
    <div className="min-h-screen w-full bg-mono-light-base dark:bg-mono-dark-base text-mono-light-950 dark:text-mono-dark-950 flex flex-col justify-between font-sans transition-colors duration-200">
      
      {/* 1. TOP APP HEADER */}
      <header className="border-b border-mono-light-200 dark:border-mono-dark-200 px-4 sm:px-6 py-4 flex justify-between items-center bg-mono-light-50 dark:bg-mono-dark-50 z-30 w-full">
        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-black uppercase tracking-tight">Task Tracker</h1>
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-mono-light-900 text-mono-light-base dark:bg-mono-dark-900 dark:text-mono-dark-base tracking-widest">
            LOG
          </span>
        </div>
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="border border-mono-light-300 dark:border-mono-dark-300 text-[9px] uppercase font-bold tracking-widest px-2.5 py-1.5 rounded-lg hover:border-mono-light-900 dark:hover:border-mono-dark-950 cursor-pointer transition-colors"
        >
          {darkMode ? 'Light' : 'Dark'}
        </button>
      </header>

      {/* 2. CENTRAL WORKSPACE DISPLAY VIEW */}
      <main className="grow flex flex-col items-center p-4 sm:p-6 max-w-xl w-full mx-auto justify-start space-y-6">
        
        {/* TASK LOG ENTRY INPUT */}
        <form 
          onSubmit={handleAddTask}
          className="w-full flex gap-2 border border-mono-light-200 dark:border-mono-dark-200 p-3 bg-mono-light-50 dark:bg-mono-dark-50 rounded-2xl shadow-sm"
        >
          <input
            type="text"
            placeholder="Log new workspace task entry..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="grow px-3 py-2 text-xs border rounded-xl border-mono-light-200 dark:border-mono-dark-200 bg-mono-light-base dark:bg-mono-dark-base focus:outline-none focus:border-mono-light-900 dark:focus:border-mono-dark-900 font-medium"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-mono-light-900 text-mono-light-base dark:bg-mono-dark-900 dark:text-mono-dark-base text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-mono-light-800 dark:hover:bg-mono-dark-800 transition-colors cursor-pointer"
          >
            Add
          </button>
        </form>

        {/* TASK STREAM ELEMENT HOUSINGS (renderTasks implementation mapping state natively) */}
        <div className="w-full space-y-2.5">
          {tasks.length === 0 ? (
            <div className="w-full text-center border border-dashed border-mono-light-200 dark:border-mono-dark-200 p-12 rounded-2xl opacity-40">
              <p className="text-[10px] font-bold uppercase tracking-widest">No matching tasks recorded in workspace stack</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id}
                className={`w-full border p-4 rounded-2xl flex justify-between items-center shadow-sm transition-all duration-200 ${
                  task.completed 
                    ? 'border-mono-light-200/40 bg-mono-light-100/40 dark:border-mono-dark-200/20 dark:bg-mono-dark-100/10 opacity-50' 
                    : 'border-mono-light-200 bg-mono-light-50 dark:border-mono-dark-200 dark:bg-mono-dark-50'
                }`}
              >
                {/* Left Active Segment Matrix */}
                <div className="grow flex items-center gap-3 min-w-0 pr-4">
                  {/* Circle Checkbox Button Interaction Element */}
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(task.id)}
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                      task.completed 
                        ? 'border-mono-light-900 bg-mono-light-900 text-mono-light-base dark:border-mono-dark-950 dark:bg-mono-dark-950 dark:text-mono-dark-base' 
                        : 'border-mono-light-400 dark:border-mono-dark-400 hover:border-mono-light-900 dark:hover:border-mono-dark-950'
                    }`}
                  >
                    {task.completed && <span className="text-[9px] font-bold leading-none">✓</span>}
                  </button>

                  <div className="grow min-w-0">
                    {editingId === task.id ? (
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onBlur={() => handleSaveEdit(task.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(task.id)}
                        className="w-full border-b border-mono-light-900 dark:border-mono-dark-900 bg-transparent text-xs font-bold py-0.5 focus:outline-none"
                        autoFocus
                      />
                    ) : (
                      <h3 
                        onClick={() => !task.completed && startEditing(task.id, task.description)}
                        className={`text-xs font-bold tracking-tight break-words select-none ${
                          task.completed 
                            ? 'line-through text-mono-light-400 dark:text-mono-dark-500' 
                            : 'cursor-text'
                        }`}
                      >
                        {task.description}
                      </h3>
                    )}
                  </div>
                </div>

                {/* Right Operation Action Layouts */}
                <div className="flex items-center shrink-0">
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 border border-mono-light-200 dark:border-mono-dark-200 hover:border-rose-300 hover:text-rose-600 dark:hover:border-rose-500 rounded-lg transition-colors cursor-pointer opacity-60 hover:opacity-100"
                    title="Delete Entry Logs"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </main>

      {/* 3. TERMINAL BOTTOM FOOTER */}
      <footer className="border-t border-mono-light-200 dark:border-mono-dark-200 px-4 py-4 text-center text-[9px] tracking-widest uppercase opacity-40 bg-mono-light-50 dark:bg-mono-dark-50 w-full">
        State Management Dashboard Node • React Engine Architecture
      </footer>
    </div>
  );
}