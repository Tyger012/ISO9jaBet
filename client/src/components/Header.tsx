import { FC } from "react";
import { Link, useLocation } from "wouter";
import { useAuthStore } from "../lib/auth";
import { formatCurrency } from "../lib/formatters";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings } from "lucide-react";

interface TabItem {
  name: string;
  path: string;
}

const tabs: TabItem[] = [
  { name: "Home", path: "/" },
  { name: "My Bets", path: "/my-bets" },
  { name: "Leaderboard", path: "/leaderboard" },
  { name: "Withdraw", path: "/withdraw" },
  { name: "VIP", path: "/vip" },
  { name: "Lucky Spin", path: "/lucky-spin" }
];

const Header: FC = () => {
  const [location] = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <header className="bg-gray-900 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/">
                <a className="text-emerald-500 font-bold text-xl md:text-2xl">
                  ISO9ja<span className="text-gray-100">Bet</span>
                </a>
              </Link>
            </div>
            
            <div className="flex items-center">
              {user && (
                <div className="hidden md:flex items-center mr-4">
                  <span className="text-gray-100 mr-2">Balance:</span>
                  <span className="text-emerald-500 font-bold">{formatCurrency(user.balance)}</span>
                </div>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full py-1 px-3 text-gray-100 hover:bg-gray-800">
                    <span className="mr-2 hidden md:inline">{user?.username || "Guest"}</span>
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-gray-900">
                      {user?.username ? user.username.substring(0, 2).toUpperCase() : "GU"}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {user && (
                    <>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      
      <div className="bg-gray-800 text-gray-100">
        <div className="container mx-auto px-4">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <Link key={tab.path} href={tab.path}>
                <a className={`px-4 py-3 font-medium border-b-2 whitespace-nowrap ${
                  location === tab.path 
                    ? "border-emerald-500 text-emerald-500" 
                    : "border-transparent hover:text-emerald-500"
                }`}>
                  {tab.name}
                </a>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
