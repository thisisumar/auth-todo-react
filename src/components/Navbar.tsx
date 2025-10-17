import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = ({ userName }: { userName?: string }) => {
  const { logout } = useAuth();

  return (
    <nav className="border-b p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">Todo App</h1>
        <div className="flex items-center gap-4">
          {userName && <span>{userName}</span>}
          <Button onClick={logout} variant="outline">Logout</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
