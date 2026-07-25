import React from 'react';

export function TodoToolbar({ search, setSearch, completedFilter, setCompletedFilter, setPage }) {
    return (
        <div className="w-full space-y-3 pb-3 border-b border-mono-light-200 dark:border-mono-dark-200">
            {/* 1. Search Bar */}
            <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                }}
                className="w-full px-3 py-2 text-xs border rounded-xl border-mono-light-200 dark:border-mono-dark-200 bg-mono-light-base dark:bg-mono-dark-base focus:outline-none focus:border-mono-light-900 dark:focus:border-mono-dark-900 font-medium"
            />

            {/* 2. Centered Filter Tabs */}
            <div className="flex justify-center w-full">
                <div className="flex gap-1 bg-mono-light-200/50 dark:bg-mono-dark-200/50 p-1 rounded-xl">
                    {[
                        { label: 'All', value: 'all' },
                        { label: 'Active', value: 'false' },
                        { label: 'Completed', value: 'true' },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => {
                                setCompletedFilter(tab.value);
                                setPage(0);
                            }}
                            className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg transition-all cursor-pointer ${
                                completedFilter === tab.value
                                    ? 'bg-mono-light-base dark:bg-mono-dark-base text-mono-light-900 dark:text-mono-dark-900 shadow-xs'
                                    : 'text-mono-light-500 dark:text-mono-dark-500 hover:text-mono-light-900'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function TodoPagination({ page, setPage, hasMore }) {
    return (
        <div className="w-full flex items-center justify-between pt-3 border-t border-mono-light-200 dark:border-mono-dark-200 text-xs">
            <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 text-[10px] font-bold uppercase border border-mono-light-200 dark:border-mono-dark-200 hover:bg-mono-light-200/40 dark:hover:bg-mono-dark-200/40 rounded-xl disabled:opacity-30 cursor-pointer transition-colors"
            >
                Prev
            </button>
            <span className="text-[10px] text-mono-light-500">
                Page {page + 1}
            </span>
            <button
                type="button"
                disabled={!hasMore}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-[10px] font-bold uppercase border border-mono-light-200 dark:border-mono-dark-200 hover:bg-mono-light-200/40 dark:hover:bg-mono-dark-200/40 rounded-xl disabled:opacity-30 cursor-pointer transition-colors"
            >
                Next
            </button>
        </div>
    );
}