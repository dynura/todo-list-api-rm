import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function RegisterForm({ onSwitchToLogin, onRegisterSuccess }) {
    const { register, loading, authError } = useAuth();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (!name || !email || !password || !confirmPassword) {
            setLocalError('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            setLocalError('Passwords do not match.');
            return;
        }

        const success = await register(name, email, password, confirmPassword);

        if (success) {
            // Notify parent App component to switch view to RegisterPending
            if (onRegisterSuccess) {
                onRegisterSuccess(email);
            }
        }
    };

    return (
        <div className="w-full border border-mono-light-200 dark:border-mono-dark-200 p-6 sm:p-8 bg-mono-light-50 dark:bg-mono-dark-50 rounded-2xl shadow-sm space-y-4">
            <div className="text-center space-y-1">
                <h2 className="text-sm font-black uppercase tracking-wider">
                    Create Workspace Account
                </h2>
                <p className="text-[10px] text-mono-light-500 dark:text-mono-dark-500 uppercase tracking-widest">
                    Register to manage your tasks
                </p>
            </div>

            {(authError || localError) && (
                <div className="p-3 text-[10px] font-bold text-rose-600 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
                    {localError || authError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-mono-light-500 dark:text-mono-dark-500 block mb-1">
                        Username
                    </label>
                    <input
                        type="text"
                        placeholder="johndoe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 text-xs border rounded-xl border-mono-light-200 dark:border-mono-dark-200 bg-mono-light-base dark:bg-mono-dark-base focus:outline-none focus:border-mono-light-900 dark:focus:border-mono-dark-900 font-medium"
                    />
                </div>

                <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-mono-light-500 dark:text-mono-dark-500 block mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs border rounded-xl border-mono-light-200 dark:border-mono-dark-200 bg-mono-light-base dark:bg-mono-dark-base focus:outline-none focus:border-mono-light-900 dark:focus:border-mono-dark-900 font-medium"
                    />
                </div>

                <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-mono-light-500 dark:text-mono-dark-500 block mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 text-xs border rounded-xl border-mono-light-200 dark:border-mono-dark-200 bg-mono-light-base dark:bg-mono-dark-base focus:outline-none focus:border-mono-light-900 dark:focus:border-mono-dark-900 font-medium"
                    />
                </div>

                <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-mono-light-500 dark:text-mono-dark-500 block mb-1">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 text-xs border rounded-xl border-mono-light-200 dark:border-mono-dark-200 bg-mono-light-base dark:bg-mono-dark-base focus:outline-none focus:border-mono-light-900 dark:focus:border-mono-dark-900 font-medium"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-mono-light-900 text-mono-light-base dark:bg-mono-dark-900 dark:text-mono-dark-base text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-mono-light-800 dark:hover:bg-mono-dark-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>

            <div className="text-center pt-2">
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-[9px] font-bold uppercase tracking-widest text-mono-light-500 dark:text-mono-dark-500 hover:underline cursor-pointer"
                >
                    Already have an account? Sign In
                </button>
            </div>
        </div>
    );
}