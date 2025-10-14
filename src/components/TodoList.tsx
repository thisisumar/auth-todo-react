import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

interface TodoListProps {
  userId: string;
}

const TodoList = ({ userId }: TodoListProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, [userId]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://dummyjson.com/todos/user/${userId}`);
      const data = await response.json();
      setTodos(data.todos || []);
    } catch (error) {
      toast({
        title: "Error fetching todos",
        description: "Could not load your todos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) {
      toast({
        title: "Empty todo",
        description: "Please enter a todo item",
        variant: "destructive",
      });
      return;
    }

    try {
      setAdding(true);
      const response = await fetch("https://dummyjson.com/todos/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          todo: newTodo,
          completed: false,
          userId: parseInt(userId),
        }),
      });
      const data = await response.json();
      setTodos([data, ...todos]);
      setNewTodo("");
      toast({
        title: "Todo added!",
        description: "Your new todo has been created.",
      });
    } catch (error) {
      toast({
        title: "Error adding todo",
        description: "Could not add your todo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`https://dummyjson.com/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      const data = await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? data : todo)));
    } catch (error) {
      toast({
        title: "Error updating todo",
        description: "Could not update your todo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await fetch(`https://dummyjson.com/todos/${id}`, {
        method: "DELETE",
      });
      setTodos(todos.filter((todo) => todo.id !== id));
      toast({
        title: "Todo deleted",
        description: "Your todo has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error deleting todo",
        description: "Could not delete your todo. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
        />
        <Button onClick={addTodo} disabled={adding}>
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>

      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No todos yet</p>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} className="flex items-center gap-2 p-3 border rounded">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
              />
              <p className={`flex-1 ${todo.completed ? "line-through" : ""}`}>
                {todo.todo}
              </p>
              <Button variant="ghost" size="sm" onClick={() => deleteTodo(todo.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
