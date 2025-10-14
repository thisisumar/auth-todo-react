import { LogOut, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface NavbarProps {
  userName?: string;
  userImage?: string;
}

const Navbar = ({ userName, userImage }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    toast({
      title: "Logged out successfully",
      description: "See you soon!",
    });
    navigate("/login");
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary shadow-glow">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TodoFlow
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {userImage && (
              <img
                src={userImage}
                alt={userName}
                className="w-10 h-10 rounded-full border-2 border-primary/20 shadow-sm"
              />
            )}
            {userName && (
              <span className="text-sm font-medium text-foreground hidden sm:inline-block">
                {userName}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 hover:bg-destructive/10 hover:text-destructive transition-smooth"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
