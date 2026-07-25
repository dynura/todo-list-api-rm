import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://todo-list-api-rm.onrender.com',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to catch 401 Unauthorized globally
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear invalid session state
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Dispatch custom event so AuthContext/App can log out immediately
            window.dispatchEvent(new Event('unauthorized'));
        }
        return Promise.reject(error);
    }
);

// Todo API endpoints
export const getTodos = (params) => API.get('/todos', { params });
export const createTodo = (todoData) => API.post('/todos', todoData);
export const updateTodo = (id, updatedFields) => API.put(`/todos/${id}`, updatedFields);
export const deleteTodo = (id) => API.delete(`/todos/${id}`);

export default API;