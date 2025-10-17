import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Edit2, Check, X } from 'lucide-react';

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

const TodoItem = ({ 
  todo, 
  onToggle, 
  onUpdate, 
  onDelete 
}: { 
  todo: Todo; 
  onToggle: (id: number, completed: boolean) => void; 
  onUpdate: (id: number, newText: string) => void; 
  onDelete: (id: number) => void; 
}) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.todo);

  const handleUpdate = () => {
    if (editText.trim() && editText !== todo.todo) {
      onUpdate(todo.id, editText);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.todo);
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-2 p-3 border rounded">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id, todo.completed)}
      />
      {editing ? (
        <div className="flex-1 flex items-center gap-2">
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleUpdate();
              if (e.key === 'Escape') handleCancel();
            }}
            className="flex-1"
            autoFocus
          />
          <Button variant="ghost" size="sm" onClick={handleUpdate}>
            <Check className="h-4 w-4 text-green-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ) : (
        <>
          <p className={`flex-1 ${todo.completed ? 'line-through' : ''}`}>
            {todo.todo}
          </p>
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(todo.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export default TodoItem;
