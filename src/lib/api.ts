const BASE_URL = 'https://dummyjson.com';

const getHeaders = () => {
  const token = localStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const api = {
  login: (credentials: { username: string; password: string }) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...credentials, expiresInMins: 30 })
    }).then(res => res.json()),

  getTodos: (userId: number) =>
    fetch(`${BASE_URL}/todos/user/${userId}`, { headers: getHeaders() })
      .then(res => res.json()),

  addTodo: (todo: { todo: string; completed: boolean; userId: number }) =>
    fetch(`${BASE_URL}/todos/add`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(todo)
    }).then(res => res.json()),

  updateTodo: (id: number, updates: { todo?: string; completed?: boolean }) =>
    fetch(`${BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    }).then(res => res.json()),

  deleteTodo: (id: number) =>
    fetch(`${BASE_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(res => res.json())
};