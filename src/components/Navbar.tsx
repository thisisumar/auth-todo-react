import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  userName?: string;
  userImage?: string;
}

const Navbar = ({ userName }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <nav className="border-b p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">Todo App</h1>
        <div className="flex items-center gap-4">
          {userName && <span>{userName}</span>}
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
