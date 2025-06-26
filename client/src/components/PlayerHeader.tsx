import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, User } from "lucide-react";

interface PlayerHeaderProps {
  user: {
    id: number;
    username: string;
    level: number;
    experience: number;
    coins: number;
  };
}

export default function PlayerHeader({ user }: PlayerHeaderProps) {
  // Calculate experience needed for next level (exponential growth)
  const getExpForLevel = (level: number) => level * 1000;
  const currentLevelExp = getExpForLevel(user.level);
  const nextLevelExp = getExpForLevel(user.level + 1);
  const expInCurrentLevel = user.experience - (user.level > 1 ? getExpForLevel(user.level - 1) : 0);
  const expNeededForLevel = nextLevelExp - currentLevelExp;
  const expProgress = Math.min((expInCurrentLevel / expNeededForLevel) * 100, 100);

  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-amber-900 to-amber-800 p-4 rounded-lg border-2 border-yellow-400 shadow-xl mb-6">
      {/* Left side - Coins */}
      <div className="flex items-center">
        <Badge className="bg-yellow-500 text-amber-900 px-4 py-2 rounded-full font-bold text-lg border-2 border-yellow-300 shadow-lg flex items-center space-x-2">
          <Coins className="h-5 w-5" />
          <span>{user.coins}</span>
        </Badge>
      </div>

      {/* Center - Level with Experience Bar */}
      <div className="flex flex-col items-center space-y-2">
        <Badge className="bg-burgundy-700 text-yellow-300 px-6 py-3 rounded-full font-adventure font-bold text-xl border-2 border-yellow-400 shadow-lg">
          Level {user.level}
        </Badge>
        
        {/* Experience Progress Bar */}
        <div className="w-48 space-y-1">
          <div className="flex justify-between text-xs text-yellow-300">
            <span>XP: {user.experience}</span>
            <span>Next: {nextLevelExp}</span>
          </div>
          <Progress 
            value={expProgress} 
            className="h-2 bg-amber-900 border border-yellow-400"
          />
        </div>
      </div>

      {/* Right side - User Profile */}
      <div className="flex items-center">
        <Badge className="bg-yellow-500 text-amber-900 px-4 py-2 rounded-full font-bold border-2 border-yellow-300 shadow-lg flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span className="hidden sm:inline">{user.username}</span>
        </Badge>
      </div>
    </div>
  );
}