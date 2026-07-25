import { useEffect, useState } from 'react';
import API from '../../api/api';

export default function VerifyEmail({ onSwitchToLogin }) {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('Verifying your email address...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Missing or invalid verification token.');
            return;
        }

        // Use relative path or API instance instead of hardcoded localhost
        API.get(`/auth/verify-email?token=${token}`)
            .then((res) => {
                setStatus('success');
                setMessage('Email verified successfully! Redirecting to login...');
                
                setTimeout(() => {
                    if (onSwitchToLogin) onSwitchToLogin();
                }, 3000);
            })
            .catch((err) => {
                setStatus('error');
                const errorMsg = err.response?.data?.detail || 'Verification failed or link has expired.';
                setMessage(errorMsg);
            });
    }, [token, onSwitchToLogin]);

    return (
        <div className="w-full border border-mono-light-200 dark:border-mono-dark-200 p-6 sm:p-8 bg-mono-light-50 dark:bg-mono-dark-50 rounded-2xl shadow-sm space-y-4">
            <div className="text-center space-y-1">
                <h2 className="text-sm font-black uppercase tracking-wider">
                    Account Verification
                </h2>
                <p className="text-[10px] text-mono-light-500 dark:text-mono-dark-500 uppercase tracking-widest">
                    Confirming workspace access
                </p>
            </div>

            {status === 'loading' && (
                <div className="p-4 text-center space-y-2">
                    <p className="text-xs font-medium text-mono-light-500 dark:text-mono-dark-500 animate-pulse">
                        {message}
                    </p>
                </div>
            )}

            {status === 'success' && (
                <div className="space-y-3">
                    <div className="p-3 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                        {message}
                    </div>
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="w-full py-2.5 bg-mono-light-900 text-mono-light-base dark:bg-mono-dark-900 dark:text-mono-dark-base text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-mono-light-800 dark:hover:bg-mono-dark-800 transition-colors cursor-pointer"
                    >
                        Sign In Now
                    </button>
                </div>
            )}

            {status === 'error' && (
                <div className="space-y-3">
                    <div className="p-3 text-[10px] font-bold text-rose-600 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
                        {message}
                    </div>
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="w-full py-2.5 bg-mono-light-900 text-mono-light-base dark:bg-mono-dark-900 dark:text-mono-dark-base text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-mono-light-800 dark:hover:bg-mono-dark-800 transition-colors cursor-pointer"
                    >
                        Return to Sign In
                    </button>
                </div>
            )}
        </div>
    );
}