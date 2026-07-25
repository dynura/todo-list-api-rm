import { useAuth } from '../../context/AuthContext';

export default function Header({ darkMode, setDarkMode }) {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <header className="border-b border-mono-light-200 dark:border-mono-dark-200 px-4 sm:px-6 py-4 flex justify-between items-center bg-mono-light-50 dark:bg-mono-dark-50 z-30 w-full">
        <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black uppercase tracking-tight">Task Tracker</h1>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-mono-light-900 text-mono-light-base dark:bg-mono-dark-900 dark:text-mono-dark-base tracking-widest">
            LOG
            </span>
        </div>

        <div className="flex items-center gap-3">
            {isAuthenticated && (
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold opacity-70">@{user}</span>
                <button
                onClick={logout}
                className="text-[9px] uppercase font-bold tracking-widest px-2 py-1 rounded border border-mono-light-300 dark:border-mono-dark-300 hover:border-rose-500 hover:text-rose-500 cursor-pointer transition-colors"
                >
                Logout
                </button>
            </div>
            )}
            <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="border border-mono-light-300 dark:border-mono-dark-300 text-[9px] uppercase font-bold tracking-widest px-2.5 py-1.5 rounded-lg hover:border-mono-light-900 dark:hover:border-mono-dark-950 cursor-pointer transition-colors"
            >
            {darkMode ? 'Light' : 'Dark'}
            </button>
        </div>
        </header>
    );
}