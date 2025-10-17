import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import TodoItem from './TodoItem';

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

const TodoList = ({ userId }: { userId: number }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, [userId]);

  const fetchTodos = async () => {
    try {
      const data = await api.getTodos(userId);
      setTodos(data.todos || []);
    } catch {
      toast({ title: 'Error fetching todos', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    
    try {
      const data = await api.addTodo({
        todo: newTodo,
        completed: false,
        userId
      });
      setTodos([data, ...todos]);
      setNewTodo('');
    } catch {
      toast({ title: 'Error adding todo', variant: 'destructive' });
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const data = await api.updateTodo(id, { completed: !completed });
      setTodos(todos.map(todo => todo.id === id ? data : todo));
    } catch {
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
    }
  };

  const updateTodo = async (id: number, newText: string) => {
    try {
      const data = await api.updateTodo(id, { todo: newText });
      setTodos(todos.map(todo => todo.id === id ? data : todo));
    } catch {
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, todo: newText } : todo
      ));
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await api.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch {
      toast({ title: 'Error deleting todo', variant: 'destructive' });
    }
  };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <Button onClick={addTodo}><Plus className="h-4 w-4" /></Button>
      </div>

      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No todos yet</p>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;