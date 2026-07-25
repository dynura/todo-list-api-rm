import TodoItem from './TodoItem';

export default function TodoList({ tasks, onUpdateTodo, onDeleteTodo, loading }) {
    if (loading && tasks.length === 0) {
        return (
            <div className="w-full py-8 text-center text-xs text-mono-light-400 animate-pulse">
                Loading workspace entries...
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="w-full py-8 text-center text-xs text-mono-light-400">
                No entries found.
            </div>
        );
    }

    return (
        <div className={`w-full divide-y divide-mono-light-100 dark:divide-mono-dark-100 transition-opacity duration-150 ${loading ? 'opacity-50' : 'opacity-100'}`}>
            {tasks.map((task) => (
                <TodoItem 
                    key={task.id} 
                    task={task} 
                    onUpdate={onUpdateTodo} 
                    onDelete={onDeleteTodo} 
                />
            ))}
        </div>
    );
}