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
    <Card className="rounded-xl border-2 border-yellow-400 shadow-xl"
          style={{background: 'linear-gradient(to bottom, var(--burgundy-700), var(--adventure-brown-700))'}}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Trophy className="h-6 w-6 text-yellow-400" />
            <CardTitle className="font-adventure text-2xl font-bold text-yellow-300">
              Achievements
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-yellow-500 text-amber-900 px-3 py-1 font-bold">
              {completedCount}/{totalCount}
            </Badge>
            <Link href="/achievements">
              <ChevronRight className="h-5 w-5 text-yellow-400 hover:text-yellow-300 cursor-pointer" />
            </Link>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-4 gap-4">
          {displayedAchievements.map((achievement) => (
            <Link key={achievement.id} href="/achievements">
              <div className="relative group cursor-pointer">
                <div 
                  className={`w-16 h-16 rounded-full border-3 flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110 ${
                    achievement.isCompleted 
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 shadow-lg' 
                      : 'bg-gray-600 border-gray-500 grayscale'
                  }`}
                >
                  {achievement.icon}
                </div>
                
                {/* Completion indicator */}
                {achievement.isCompleted && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
                
                {/* Progress indicator for incomplete achievements */}
                {!achievement.isCompleted && achievement.progress > 0 && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {Math.min(achievement.progress, achievement.requirement)}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
          
          {/* Add more achievements placeholder if less than 12 */}
          {displayedAchievements.length < 12 && 
            Array.from({ length: 12 - displayedAchievements.length }).map((_, index) => (
              <div key={`placeholder-${index}`} className="w-16 h-16 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center text-gray-500">
                <span className="text-2xl">?</span>
              </div>
            ))
          }
        </div>
        
        <div className="mt-4 text-center">
          <Link href="/achievements">
            <span className="text-amber-200 font-quest text-sm hover:text-yellow-300 cursor-pointer inline-flex items-center">
              View All Achievements
              <ChevronRight className="h-4 w-4 ml-1" />
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}