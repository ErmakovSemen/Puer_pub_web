import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Coins, Star } from "lucide-react";

interface QuestCardProps {
  quest: {
    id: number;
    title: string;
    description: string;
    type: string;
    requirement: number;
    progress: number;
    rewardXp: number;
    rewardCoins: number;
    rewardCardId?: number;
    isCompleted: boolean;
  };
}

export default function QuestCard({ quest }: QuestCardProps) {
  const progressPercentage = (quest.progress / quest.requirement) * 100;
  const isDailyQuest = quest.type === 'daily';
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const completeQuestMutation = useMutation({
    mutationFn: async (): Promise<any> => {
      const response = await fetch(`/api/complete-quest/${quest.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        throw new Error('Failed to complete quest');
      }
      return response.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/quests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "Quest Completed!",
        description: `Earned ${data.rewards.xp} XP and ${data.rewards.coins} coins${data.leveledUp ? '. Level up!' : ''}`,
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete quest",
        variant: "destructive",
      });
    }
  });

  const canComplete = quest.progress >= quest.requirement && !quest.isCompleted;

  return (
    <Card className={`rounded-xl p-6 border-4 border-yellow-400 shadow-2xl ${
      isDailyQuest 
        ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-amber-900' 
        : 'bg-gradient-to-r from-red-900 to-amber-900 text-amber-100'
    }`}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-adventure text-xl font-bold">{quest.title}</h3>
          <Badge className={`${
            isDailyQuest 
              ? 'bg-amber-900 text-yellow-400' 
              : 'bg-yellow-400 text-amber-900'
          } px-3 py-1 rounded-full text-sm font-bold`}>
            {quest.type.toUpperCase()}
          </Badge>
        </div>
        
        <p className="font-quest mb-4 leading-relaxed">{quest.description}</p>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{quest.progress}/{quest.requirement}</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className={`h-3 ${
              isDailyQuest 
                ? 'bg-amber-900' 
                : 'bg-amber-900'
            }`}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm space-y-1">
            <div className="font-bold">Rewards:</div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span>+{quest.rewardXp} XP</span>
              </div>
              <div className="flex items-center space-x-1">
                <Coins className="h-4 w-4" />
                <span>+{quest.rewardCoins}</span>
              </div>
              {quest.rewardCardId && (
                <div className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                  Rare Card
                </div>
              )}
            </div>
          </div>
          <Button 
            className={`font-bold py-2 px-4 rounded-lg transition-all ${
              canComplete
                ? isDailyQuest
                  ? 'bg-amber-900 hover:bg-red-900 text-yellow-400 animate-pulse'
                  : 'bg-yellow-400 hover:bg-yellow-500 text-amber-900 animate-pulse'
                : quest.isCompleted
                ? 'bg-green-600 text-white cursor-not-allowed'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            disabled={quest.isCompleted || completeQuestMutation.isPending}
            onClick={() => canComplete && completeQuestMutation.mutate()}
          >
            {completeQuestMutation.isPending 
              ? 'Completing...' 
              : quest.isCompleted 
              ? 'Completed ✓' 
              : canComplete 
              ? 'Claim Rewards' 
              : 'In Progress'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
