import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import RegisterPending from './components/Auth/RegisterPending';
import VerifyEmail from './components/Auth/VerifyEmail';
import TodoInput from './components/Todos/TodoInput';
import { TodoToolbar, TodoPagination } from './components/Todos/TodoFilter';
import TodoList from './components/Todos/TodoList';
import { getTodos, createTodo, updateTodo, deleteTodo } from './api/api';

export default function App() {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Auth view mode
  const [authMode, setAuthMode] = useState('login'); 
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Filtering & Pagination State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(''); // <--- Added Debounced Search
  const [completedFilter, setCompletedFilter] = useState('all');
  const [page, setPage] = useState(0);
  const limit = 10;
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Debounce Search Input (waits 300ms after user stops typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('token')) {
      setAuthMode('verify');
    }
  }, []);

  // Fetch todos with query parameters
  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true);
    try {
      const params = {
        skip: page * limit,
        limit: limit + 1,
        sort_by: 'id',
        order: 'desc',
      };

      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (completedFilter !== 'all') params.completed = completedFilter === 'true';

      const response = await getTodos(params);
      let data = response.data || response;

      if (!Array.isArray(data)) data = [];

      // --- CLIENT-SIDE FILTER SAFEGUARD ---
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.trim().toLowerCase();
        data = data.filter((t) => t.title && t.title.toLowerCase().includes(q));
      }

      if (completedFilter === 'true') {
        data = data.filter((t) => Boolean(t.completed ?? t.is_completed));
      } else if (completedFilter === 'false') {
        data = data.filter((t) => !Boolean(t.completed ?? t.is_completed));
      }

      if (data.length > limit) {
        setHasMore(true);
        setTasks(data.slice(0, limit));
      } else {
        setHasMore(false);
        setTasks(data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoadingTasks(false);
    }
  }, [page, debouncedSearch, completedFilter, limit]); // Listens to debouncedSearch instead of search

  // Trigger fetch only when dependencies change
  useEffect(() => {
    let isMounted = true;

    if (isAuthenticated) {
      // Only execute if component is actively mounted
      fetchTasks();
    } else {
      setTasks([]);
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, fetchTasks]);

  const handleAddTodo = async (title, description = '') => {
    try {
      const response = await createTodo({ title, description });
      const newTodo = response.data || response;
      
      // Add new todo directly to state instead of re-fetching the whole list
      setTasks((prev) => [newTodo, ...prev]);
    } catch (err) {
      console.error('Failed to add task:', err);
      fetchTasks(); // Only re-fetch if creation fails
    }
  };

  const handleUpdateTodo = async (id, updatedFields) => {
    // Optimistic update
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updatedFields } : task
      )
    );

    try {
      await updateTodo(id, updatedFields);
    } catch (err) {
      console.error('Failed to update task:', err);
      fetchTasks(); // Revert/sync only on error
    }
  };

  const handleDeleteTodo = async (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

    try {
      await deleteTodo(id);
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
      fetchTasks();
    }
  };

  const handleRegisterSuccess = (email) => {
    setRegisteredEmail(email);
    setAuthMode('pending');
  };

  const handleSwitchToLogin = () => {
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    setAuthMode('login');
  };

  return (
    <div className="min-h-screen w-full bg-mono-light-base dark:bg-mono-dark-base text-mono-light-950 dark:text-mono-dark-950 flex flex-col justify-between font-sans transition-colors duration-200">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="grow flex flex-col items-center p-4 sm:p-6 max-w-xl w-full mx-auto justify-start space-y-6">
        {!isAuthenticated ? (
          <>
            {authMode === 'login' && (
              <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
            )}
            {authMode === 'register' && (
              <RegisterForm 
                onSwitchToLogin={handleSwitchToLogin} 
                onRegisterSuccess={handleRegisterSuccess} 
              />
            )}
            {authMode === 'pending' && (
              <RegisterPending 
                email={registeredEmail} 
                onSwitchToLogin={handleSwitchToLogin} 
              />
            )}
            {authMode === 'verify' && (
              <VerifyEmail onSwitchToLogin={handleSwitchToLogin} />
            )}
          </>
        ) : (
          <>
            <TodoToolbar 
              search={search}
              setSearch={setSearch}
              completedFilter={completedFilter}
              setCompletedFilter={setCompletedFilter}
              setPage={setPage}
            />

            <TodoInput onAddTodo={handleAddTodo} />

            <TodoList 
              tasks={tasks} 
              onUpdateTodo={handleUpdateTodo} 
              onDeleteTodo={handleDeleteTodo} 
              loading={loadingTasks} 
            />

            <TodoPagination 
              page={page} 
              setPage={setPage} 
              hasMore={hasMore} 
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}