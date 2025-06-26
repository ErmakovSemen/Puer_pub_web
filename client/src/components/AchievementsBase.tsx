import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, ChevronRight } from "lucide-react";

interface Achievement {
  id: number;
  userId: number;
  title: string;
  description: string;
  type: string;
  requirement: number;
  progress: number;
  isCompleted: boolean;
  rewardXp: number;
  rewardCoins: number;
  icon: string;
  category: string;
  unlockedAt?: string;
}

export default function AchievementsBase() {
  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const completedCount = achievements.filter(a => a.isCompleted).length;
  const totalCount = achievements.length;

  // Display first 12 achievements in grid
  const displayedAchievements = achievements.slice(0, 12);

  return (
    <div className="magical-card rounded-2xl relative overflow-hidden animate-magical-float">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 pointer-events-none"></div>
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-cyan-400 animate-glow-pulse" />
            <h3 className="font-adventure text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Celestial Achievements
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <div className="magical-card px-4 py-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold">
              {completedCount}/{totalCount}
            </div>
            <Link href="/achievements">
              <ChevronRight className="h-6 w-6 text-cyan-400 hover:text-purple-300 cursor-pointer transition-colors duration-300" />
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {displayedAchievements.map((achievement) => (
            <Link key={achievement.id} href="/achievements">
              <div className="relative group cursor-pointer">
                <div 
                  className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 ${
                    achievement.isCompleted 
                      ? 'magical-border bg-gradient-to-br from-yellow-400 to-orange-500 text-slate-900 shadow-lg shadow-yellow-500/25 animate-glow-pulse' 
                      : 'bg-slate-600/50 border-slate-500 text-slate-400'
                  }`}
                >
                  {achievement.isCompleted ? '✨' : achievement.icon}
                </div>
                
                {/* Celestial completion indicator */}
                {achievement.isCompleted && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 magical-card bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border border-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <span className="text-white text-xs">🌟</span>
                  </div>
                )}
                
                {/* Mystical progress indicator */}
                {!achievement.isCompleted && achievement.progress > 0 && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 magical-card bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full border border-white flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <span className="text-white text-xs font-bold">
                      {Math.min(achievement.progress, achievement.requirement)}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
          
          {/* Mystical placeholders for locked achievements */}
          {displayedAchievements.length < 12 && 
            Array.from({ length: 12 - displayedAchievements.length }).map((_, index) => (
              <div key={`placeholder-${index}`} className="w-16 h-16 rounded-full border-2 border-dashed border-slate-500/50 flex items-center justify-center text-slate-400">
                <span className="text-2xl">🔮</span>
              </div>
            ))
          }
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/achievements">
            <span className="text-blue-200 font-quest text-sm hover:text-cyan-300 cursor-pointer inline-flex items-center transition-colors duration-300">
              View All Celestial Achievements
              <ChevronRight className="h-4 w-4 ml-1" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}