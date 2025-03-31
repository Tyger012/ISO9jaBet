import { FC } from "react";
import { Link, useLocation } from "wouter";
import { Home, History, Trophy, RotateCw, User } from "lucide-react";

const MobileNav: FC = () => {
  const [location] = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 shadow-lg z-40">
      <div className="grid grid-cols-5 text-center">
        <Link href="/">
          <a className={`p-3 flex flex-col items-center ${location === "/" ? "text-emerald-500" : "text-gray-400"}`}>
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        
        <Link href="/my-bets">
          <a className={`p-3 flex flex-col items-center ${location === "/my-bets" ? "text-emerald-500" : "text-gray-400"}`}>
            <History size={20} />
            <span className="text-xs mt-1">My Bets</span>
          </a>
        </Link>
        
        <Link href="/leaderboard">
          <a className={`p-3 flex flex-col items-center ${location === "/leaderboard" ? "text-emerald-500" : "text-gray-400"}`}>
            <Trophy size={20} />
            <span className="text-xs mt-1">Ranks</span>
          </a>
        </Link>
        
        <Link href="/lucky-spin">
          <a className={`p-3 flex flex-col items-center ${location === "/lucky-spin" ? "text-emerald-500" : "text-gray-400"}`}>
            <RotateCw size={20} />
            <span className="text-xs mt-1">Spin</span>
          </a>
        </Link>
        
        <Link href="/profile">
          <a className={`p-3 flex flex-col items-center ${location === "/profile" ? "text-emerald-500" : "text-gray-400"}`}>
            <User size={20} />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
