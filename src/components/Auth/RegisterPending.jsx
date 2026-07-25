import React from 'react';

export default function RegisterPending({ email, onSwitchToLogin }) {
    return (
        <div className="w-full border border-mono-light-200 dark:border-mono-dark-200 p-6 sm:p-8 bg-mono-light-50 dark:bg-mono-dark-50 rounded-2xl shadow-sm space-y-4">
            <div className="text-center space-y-1">
                <h2 className="text-sm font-black uppercase tracking-wider">
                    Check Your Email
                </h2>
                <p className="text-[10px] text-mono-light-500 dark:text-mono-dark-500 uppercase tracking-widest">
                    Verification link sent
                </p>
            </div>

            <div className="p-4 bg-mono-light-base dark:bg-mono-dark-base border border-mono-light-200 dark:border-mono-dark-200 rounded-xl text-center space-y-2">
                <p className="text-xs font-medium">
                    We sent a confirmation link to:
                </p>
                <p className="text-xs font-bold text-mono-light-900 dark:text-mono-dark-900 underline decoration-1 underline-offset-2">
                    {email || 'your email address'}
                </p>
                <p className="text-[10px] text-mono-light-500 dark:text-mono-dark-500 pt-1">
                    Please check your inbox (and spam folder) to verify your account before logging in.
                </p>
            </div>

            <button
                type="button"
                onClick={onSwitchToLogin}
                className="w-full py-2.5 bg-mono-light-900 text-mono-light-base dark:bg-mono-dark-900 dark:text-mono-dark-base text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-mono-light-800 dark:hover:bg-mono-dark-800 transition-colors cursor-pointer"
            >
                Back to Sign In
            </button>
        </div>
    );
}