import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import TaskBubble from "@/components/TaskBubble";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Star, Coins, Lock, CheckCircle, Target, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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

interface User {
  id: number;
  username: string;
  level: number;
  experience: number;
  coins: number;
}

export default function Achievements() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: allAchievements = [] } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  const completeAchievementMutation = useMutation({
    mutationFn: async (achievementId: number): Promise<any> => {
      const response = await fetch(`/api/complete-achievement/${achievementId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        throw new Error('Failed to complete achievement');
      }
      return response.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "Achievement Unlocked!",
        description: `Earned ${data.rewards.xp} XP and ${data.rewards.coins} coins${data.leveledUp ? '. Level up!' : ''}`,
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete achievement",
        variant: "destructive",
      });
    }
  });

  const categories = [
    { id: "all", name: "All", icon: Trophy },
    { id: "collection", name: "Collection", icon: Star },
    { id: "quest", name: "Quests", icon: Target },
    { id: "event", name: "Events", icon: Calendar },
    { id: "level", name: "Levels", icon: Coins }
  ];

  // Transform achievements to task format for bubble display
  const transformAchievementToTask = (achievement: Achievement) => {
    let points: any[] = [];
    
    // Special handling for Tea Explorer achievement with 3 tea types
    if (achievement.title === "Tea Explorer") {
      points = [
        {
          id: "yellow",
          label: "Yellow Tea", 
          color: "yellow",
          completed: achievement.progress >= 1,
          teaType: "yellow"
        },
        {
          id: "green", 
          label: "Green Tea",
          color: "green", 
          completed: achievement.progress >= 2,
          teaType: "green"
        },
        {
          id: "red",
          label: "Red Tea",
          color: "red",
          completed: achievement.progress >= 3,
          teaType: "red"
        }
      ];
    }
    
    return {
      ...achievement,
      points
    };
  };

  const filteredAchievements = selectedCategory === "all" 
    ? allAchievements 
    : allAchievements.filter(achievement => achievement.category === selectedCategory);

  const completedCount = allAchievements.filter(a => a.isCompleted).length;
  const totalCount = allAchievements.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Calculate experience needed for next level
  const getExpForLevel = (level: number) => level * 1000;
  const currentLevelExp = user ? getExpForLevel(user.level) : 1000;
  const nextLevelExp = user ? getExpForLevel(user.level + 1) : 2000;
  const expInCurrentLevel = user ? user.experience - (user.level > 1 ? getExpForLevel(user.level - 1) : 0) : 0;
  const expNeededForLevel = nextLevelExp - currentLevelExp;
  const expProgress = user ? Math.min((expInCurrentLevel / expNeededForLevel) * 100, 100) : 0;

  return (
    <div className="min-h-screen">
      <Navigation user={user} />
      
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="border-2 border-yellow-400 text-amber-100 hover:bg-yellow-400 hover:text-amber-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Player Profile Section */}
        {user && (
          <Card className="rounded-xl border-2 border-yellow-400 p-6 mb-8 shadow-2xl"
                style={{background: 'linear-gradient(to bottom, var(--burgundy-700), var(--adventure-brown-700))'}}>
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-adventure text-3xl font-bold text-yellow-300 mb-2">
                    {user.username}'s Profile
                  </h1>
                  <p className="text-amber-200 font-quest">
                    Tea Master in Training
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl mb-2">👤</div>
                  <Badge className="bg-yellow-500 text-amber-900 px-3 py-1 font-bold">
                    Level {user.level}
                  </Badge>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">{user.experience}</div>
                  <div className="text-amber-200 text-sm">Total Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">{user.coins}</div>
                  <div className="text-amber-200 text-sm">Coins Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">{completedCount}/{totalCount}</div>
                  <div className="text-amber-200 text-sm">Achievements</div>
                </div>
              </div>

              {/* Experience Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2 text-amber-200">
                  <span>Progress to Level {user.level + 1}</span>
                  <span>{expInCurrentLevel}/{expNeededForLevel} XP</span>
                </div>
                <Progress 
                  value={expProgress} 
                  className="h-3 bg-amber-900 border border-yellow-400"
                />
              </div>

              {/* Achievement Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2 text-amber-200">
                  <span>Achievement Progress</span>
                  <span>{completedCount}/{totalCount}</span>
                </div>
                <Progress 
                  value={completionPercentage} 
                  className="h-3 bg-amber-900 border border-yellow-400"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Achievement Categories */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <Button
                key={category.id}
                variant={isSelected ? "default" : "outline"}
                className={`${
                  isSelected
                    ? 'bg-yellow-400 text-amber-900 border-yellow-400'
                    : 'border-yellow-400 text-amber-100 hover:bg-yellow-400 hover:text-amber-900'
                } font-bold`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => {
            const taskData = transformAchievementToTask(achievement);
            
            // Use TaskBubble for collection achievements with progress points
            if (achievement.category === "collection" && taskData.points.length > 0) {
              return (
                <TaskBubble key={achievement.id} task={taskData} />
              );
            }
            
            // Regular achievement card for other types
            const progressPercentage = (achievement.progress / achievement.requirement) * 100;
            const canComplete = achievement.progress >= achievement.requirement && !achievement.isCompleted;
            
            return (
              <Card
                key={achievement.id}
                className={`rounded-xl p-6 border-2 shadow-xl transition-all hover:scale-105 ${
                  achievement.isCompleted
                    ? 'bg-gradient-to-r from-green-700 to-green-600 border-green-400'
                    : 'bg-gradient-to-r from-amber-900 to-amber-800 border-yellow-400'
                }`}
              >
                <CardContent className="p-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex items-center">
                      {achievement.isCompleted ? (
                        <CheckCircle className="h-6 w-6 text-green-300" />
                      ) : (
                        <Lock className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-adventure text-xl font-bold text-yellow-300 mb-2">
                    {achievement.title}
                  </h3>
                  
                  <p className="font-quest text-sm text-amber-200 mb-4 leading-relaxed">
                    {achievement.description}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1 text-amber-200">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.requirement}</span>
                    </div>
                    <Progress 
                      value={progressPercentage} 
                      className="h-2 bg-amber-900 border border-yellow-400"
                    />
                  </div>
                  
                  {/* Rewards and Action */}
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-amber-200">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>+{achievement.rewardXp} XP</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Coins className="h-3 w-3" />
                          <span>+{achievement.rewardCoins}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {canComplete && (
                        <Button 
                          size="sm"
                          className="bg-yellow-400 hover:bg-yellow-500 text-amber-900 font-bold animate-pulse"
                          onClick={() => completeAchievementMutation.mutate(achievement.id)}
                          disabled={completeAchievementMutation.isPending}
                        >
                          {completeAchievementMutation.isPending ? 'Claiming...' : 'Claim!'}
                        </Button>
                      )}
                      
                      <Badge 
                        className={`text-xs px-2 py-1 ${
                          achievement.isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        {achievement.isCompleted ? 'Completed' : `${Math.round(progressPercentage)}%`}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="font-adventure text-2xl font-bold text-yellow-300 mb-2">
              No Achievements Yet
            </h3>
            <p className="text-amber-200 font-quest">
              Complete quests and collect tea cards to unlock achievements!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}