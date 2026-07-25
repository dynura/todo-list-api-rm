import { useState } from 'react';

export default function TodoInput({ onAddTodo }) {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAddTodo(title.trim());
        setTitle('');
    };

    return (
        <form 
        onSubmit={handleSubmit}
        className="w-full flex gap-2 border border-mono-light-200 dark:border-mono-dark-200 p-3 bg-mono-light-50 dark:bg-mono-dark-50 rounded-2xl shadow-sm"
        >
        <input
            type="text"
            placeholder="Log new workspace task entry..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="grow px-3 py-2 text-xs border rounded-xl border-mono-light-200 dark:border-mono-dark-200 bg-mono-light-base dark:bg-mono-dark-base focus:outline-none focus:border-mono-light-900 dark:focus:border-mono-dark-900 font-medium"
        />
        <button 
            type="submit"
            className="px-4 py-2 bg-mono-light-900 text-mono-light-base dark:bg-mono-dark-900 dark:text-mono-dark-base text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-mono-light-800 dark:hover:bg-mono-dark-800 transition-colors cursor-pointer"
        >
            Add
        </button>
        </form>
    );
}