import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import TodoList from '@/components/TodoList';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar userName={user?.name} />
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Welcome, {user?.name?.split(' ')[0]}!</h2>
        <TodoList userId={user?.id || 0} />
      </main>
    </div>
  );
};

export default Home;
