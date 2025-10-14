import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import TodoList from "@/components/TodoList";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Home = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("https://dummyjson.com/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        // Token invalid or expired
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        toast({
          title: "Session expired",
          description: "Please log in again",
          variant: "destructive",
        });
        navigate("/login");
      }
    } catch (error) {
      toast({
        title: "Error loading user data",
        description: "Could not verify your session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        userName={user ? `${user.firstName} ${user.lastName}` : undefined}
        userImage={user?.image}
      />
      
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.firstName}! 👋
          </h2>
          <p className="text-muted-foreground">
            Let's get things done today
          </p>
        </div>

        {/* Todo List */}
        <TodoList userId={user?.id} />
      </main>
    </div>
  );
};

export default Home;
