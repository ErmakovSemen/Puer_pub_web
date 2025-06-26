import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Star, Coins, CheckCircle, Lock } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface TaskPoint {
  id: string;
  label: string;
  color: string;
  completed: boolean;
  teaType: string;
}

interface TaskBubbleProps {
  task: {
    id: number;
    title: string;
    description: string;
    progress: number;
    requirement: number;
    rewardXp: number;
    rewardCoins: number;
    isCompleted: boolean;
    points: TaskPoint[];
  };
}

export default function TaskBubble({ task }: TaskBubbleProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const completeTaskMutation = useMutation({
    mutationFn: async (): Promise<any> => {
      const response = await fetch(`/api/complete-achievement/${task.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        throw new Error('Failed to complete task');
      }
      return response.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "Task Completed!",
        description: `Earned ${data.rewards.xp} XP and ${data.rewards.coins} coins${data.leveledUp ? '. Level up!' : ''}`,
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete task",
        variant: "destructive",
      });
    }
  });

  const progressPercentage = (task.progress / task.requirement) * 100;
  const canComplete = task.progress >= task.requirement && !task.isCompleted;

  return (
    <div className="magical-card rounded-2xl p-6 relative overflow-hidden hover:scale-105 transition-all duration-300 animate-magical-float">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 pointer-events-none"></div>
      <div className="relative z-10">
        {/* Header with Icon and Lock */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-5xl animate-glow-pulse">🍃</div>
          <div className="flex items-center">
            {task.isCompleted ? (
              <CheckCircle className="h-8 w-8 text-emerald-400 animate-pulse" />
            ) : (
              <Lock className="h-8 w-8 text-slate-400" />
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-adventure text-2xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mb-3">
          {task.title}
        </h3>

        {/* Description */}
        <p className="font-quest text-blue-200 mb-6 leading-relaxed">
          {task.description}
        </p>

        {/* Progress Points */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-blue-200 font-quest font-bold">✨ Progress</span>
            <span className="magical-card px-3 py-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold text-sm">{task.progress}/{task.requirement}</span>
          </div>
          
          {/* Visual Progress Points */}
          <div className="flex justify-center space-x-6 mb-6">
            {task.points.map((point, index) => (
              <div key={point.id} className="flex flex-col items-center">
                <div 
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-500 hover:scale-110 ${
                    point.completed 
                      ? `magical-border bg-gradient-to-br ${
                          point.color === 'yellow' ? 'from-yellow-400 to-orange-500 shadow-yellow-500/25' :
                          point.color === 'green' ? 'from-emerald-400 to-green-500 shadow-emerald-500/25' :
                          point.color === 'red' ? 'from-rose-400 to-red-500 shadow-rose-500/25' : 'from-slate-400 to-slate-500'
                        } text-white shadow-lg animate-glow-pulse` 
                      : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:bg-slate-600/50'
                  }`}
                >
                  {point.completed ? (
                    <div className="text-2xl">✨</div>
                  ) : (
                    <div 
                      className={`w-8 h-8 rounded-full ${
                        point.color === 'yellow' ? 'bg-yellow-400/30' :
                        point.color === 'green' ? 'bg-emerald-400/30' :
                        point.color === 'red' ? 'bg-rose-400/30' : 'bg-slate-400/30'
                      } border border-slate-500`}
                    />
                  )}
                </div>
                <span className={`text-xs mt-2 font-quest ${
                  point.completed ? 'text-cyan-300 font-bold' : 'text-slate-400'
                }`}>
                  {point.label}
                </span>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500 animate-shimmer"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Rewards and Action */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="magical-card px-3 py-1 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white font-bold text-sm flex items-center space-x-1">
              <Star className="h-4 w-4" />
              <span>+{task.rewardXp} XP</span>
            </div>
            <div className="magical-card px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 font-bold text-sm flex items-center space-x-1">
              <Coins className="h-4 w-4" />
              <span>+{task.rewardCoins}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div 
              className={`magical-card px-4 py-2 rounded-full text-sm font-bold ${
                task.isCompleted
                  ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-purple-400 to-pink-400 text-white'
              }`}
            >
              {task.isCompleted ? '✨ Completed' : `${Math.round(progressPercentage)}%`}
            </div>

            {canComplete && (
              <Button 
                className="magical-card bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900 font-bold px-6 py-2 rounded-full animate-pulse shadow-lg shadow-yellow-500/25 border-0"
                onClick={() => completeTaskMutation.mutate()}
                disabled={completeTaskMutation.isPending}
              >
                {completeTaskMutation.isPending ? '🔮 Claiming...' : '🌟 Claim Reward!'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}