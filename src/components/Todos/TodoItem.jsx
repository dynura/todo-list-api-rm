import { useState } from 'react';

export default function TodoItem({ task, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.title);

    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        onUpdate(task.id, { 
            title: task.title, 
            description: task.description || '', 
            completed: isChecked 
        });
    };

    const handleSave = () => {
        if (!editText.trim()) return;
        onUpdate(task.id, { 
            title: editText.trim(), 
            description: task.description || '',
            completed: task.completed 
        });
        setIsEditing(false);
    };

    return (
        <div className={`w-full py-2.5 px-2 flex justify-between items-center transition-all duration-150 group border-b border-mono-light-100 dark:border-mono-dark-100/50 last:border-none ${
            task.completed ? 'opacity-50' : ''
        }`}>
            <div className="grow flex items-center gap-3 min-w-0 pr-4">
                {/* Native Checkbox via Styled Label */}
                <label className="relative flex items-center justify-center shrink-0 cursor-pointer p-1">
                    <input
                        type="checkbox"
                        checked={!!task.completed}
                        onChange={handleCheckboxChange}
                        className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded-full border border-mono-light-400 dark:border-mono-dark-400 peer-checked:border-mono-light-900 peer-checked:bg-mono-light-900 dark:peer-checked:border-mono-dark-950 dark:peer-checked:bg-mono-dark-950 flex items-center justify-center transition-all">
                        {task.completed && (
                            <span className="text-[10px] font-bold text-mono-light-base dark:text-mono-dark-base leading-none select-none">
                                ✓
                            </span>
                        )}
                    </div>
                </label>

                {/* Inline Editing / Display */}
                <div className="grow min-w-0">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            className="w-full border-b border-mono-light-900 dark:border-mono-dark-900 bg-transparent text-xs font-semibold py-0.5 focus:outline-none"
                            autoFocus
                        />
                    ) : (
                        <h3 
                            onClick={() => !task.completed && setIsEditing(true)}
                            className={`text-xs font-medium tracking-tight break-words select-none ${
                                task.completed 
                                ? 'line-through text-mono-light-400 dark:text-mono-dark-500' 
                                : 'cursor-text hover:text-mono-light-900 dark:hover:text-mono-dark-900'
                            }`}
                        >
                            {task.title}
                        </h3>
                    )}
                </div>
            </div>

            {/* Delete button */}
            <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="p-1 text-mono-light-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Delete Entry"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
}