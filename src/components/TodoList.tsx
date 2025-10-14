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
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Add Todo Input */}
      <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            className="flex-1 h-12 px-4 bg-secondary/50 border-border focus:border-primary transition-smooth"
          />
          <Button
            onClick={addTodo}
            disabled={adding}
            className="h-12 px-6 bg-gradient-primary hover:opacity-90 transition-smooth shadow-glow"
          >
            {adding ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground text-lg">No todos yet. Start by adding one!</p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="group bg-card rounded-xl shadow-md hover:shadow-lg p-4 border border-border transition-smooth"
            >
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
                  className="h-5 w-5 data-[state=checked]:bg-success data-[state=checked]:border-success"
                />
                <p
                  className={`flex-1 text-base ${
                    todo.completed
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  } transition-smooth`}
                >
                  {todo.todo}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 transition-smooth hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {todos.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
          <span>{todos.filter((t) => !t.completed).length} active</span>
          <span>{todos.filter((t) => t.completed).length} completed</span>
        </div>
      )}
    </div>
  );
};

export default TodoList;
