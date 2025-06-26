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
    <Card className="rounded-2xl p-6 border-4 border-yellow-400 shadow-2xl bg-gradient-to-br from-amber-800 to-amber-900 hover:scale-105 transition-all duration-300">
      <CardContent className="p-0">
        {/* Header with Icon and Lock */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">🍃</div>
          <div className="flex items-center">
            {task.isCompleted ? (
              <CheckCircle className="h-8 w-8 text-green-400" />
            ) : (
              <Lock className="h-8 w-8 text-gray-400" />
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-adventure text-2xl font-bold text-yellow-300 mb-3">
          {task.title}
        </h3>

        {/* Description */}
        <p className="font-quest text-amber-200 mb-6 leading-relaxed">
          {task.description}
        </p>

        {/* Progress Points */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-amber-200 font-quest font-bold">Progress</span>
            <span className="text-yellow-300 font-bold">{task.progress}/{task.requirement}</span>
          </div>
          
          {/* Visual Progress Points */}
          <div className="flex justify-center space-x-4 mb-4">
            {task.points.map((point, index) => (
              <div key={point.id} className="flex flex-col items-center">
                <div 
                  className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                    point.completed 
                      ? `bg-${point.color}-500 border-${point.color}-400 shadow-lg transform scale-110` 
                      : 'bg-gray-600 border-gray-500'
                  }`}
                >
                  {point.completed ? (
                    <CheckCircle className="h-6 w-6 text-white" />
                  ) : (
                    <div 
                      className={`w-6 h-6 rounded-full ${
                        point.color === 'yellow' ? 'bg-yellow-400' :
                        point.color === 'green' ? 'bg-green-400' :
                        point.color === 'red' ? 'bg-red-400' : 'bg-gray-400'
                      } opacity-50`}
                    />
                  )}
                </div>
                <span className={`text-xs mt-2 font-quest ${
                  point.completed ? 'text-yellow-300 font-bold' : 'text-gray-400'
                }`}>
                  {point.label}
                </span>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <Progress 
            value={progressPercentage} 
            className="h-4 bg-amber-900 border-2 border-yellow-400 rounded-full"
          />
        </div>

        {/* Rewards and Action */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-amber-200">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="font-bold">+{task.rewardXp} XP</span>
            </div>
            <div className="flex items-center space-x-1 text-amber-200">
              <Coins className="h-4 w-4 text-yellow-400" />
              <span className="font-bold">+{task.rewardCoins}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge 
              className={`text-sm font-bold px-3 py-1 ${
                task.isCompleted
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 text-blue-100'
              }`}
            >
              {task.isCompleted ? 'Completed' : `${Math.round(progressPercentage)}%`}
            </Badge>

            {canComplete && (
              <Button 
                className="bg-yellow-400 hover:bg-yellow-500 text-amber-900 font-bold px-6 py-2 rounded-full animate-pulse shadow-lg"
                onClick={() => completeTaskMutation.mutate()}
                disabled={completeTaskMutation.isPending}
              >
                {completeTaskMutation.isPending ? 'Claiming...' : 'Claim Reward!'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}