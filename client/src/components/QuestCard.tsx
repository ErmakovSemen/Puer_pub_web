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
    <div className="magical-card rounded-2xl p-6 relative overflow-hidden hover:scale-105 transition-all duration-300 animate-magical-float">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 pointer-events-none"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-adventure text-xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">{quest.title}</h3>
          <div className={`magical-card px-4 py-2 rounded-full text-sm font-bold ${
            isDailyQuest 
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 shadow-yellow-500/25' 
              : 'bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-purple-500/25'
          }`}>
            ✨ {quest.type.toUpperCase()}
          </div>
        </div>
        
        <p className="font-quest mb-6 leading-relaxed text-blue-200">{quest.description}</p>
        
        {/* Mystical Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-3 text-blue-200">
            <span className="font-bold">✨ Progress</span>
            <span className="magical-card px-2 py-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs">{quest.progress}/{quest.requirement}</span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500 animate-shimmer"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <div className="text-blue-200 font-bold text-sm">🎁 Rewards:</div>
            <div className="flex items-center space-x-3">
              <div className="magical-card px-3 py-1 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 text-white text-sm flex items-center space-x-1">
                <Star className="h-4 w-4" />
                <span>+{quest.rewardXp} XP</span>
              </div>
              <div className="magical-card px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 text-sm flex items-center space-x-1">
                <Coins className="h-4 w-4" />
                <span>+{quest.rewardCoins}</span>
              </div>
              {quest.rewardCardId && (
                <div className="magical-card px-3 py-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs">
                  🌟 Rare Card
                </div>
              )}
            </div>
          </div>
          <Button 
            className={`magical-card font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 border-0 ${
              canComplete
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900 animate-pulse shadow-lg shadow-yellow-500/25'
                : quest.isCompleted
                ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white cursor-not-allowed shadow-lg shadow-emerald-500/25'
                : 'bg-slate-600/50 text-slate-400 cursor-not-allowed'
            }`}
            disabled={quest.isCompleted || completeQuestMutation.isPending}
            onClick={() => canComplete && completeQuestMutation.mutate()}
          >
            {completeQuestMutation.isPending 
              ? '🔮 Claiming...' 
              : quest.isCompleted 
              ? '✨ Completed' 
              : canComplete 
              ? '🌟 Claim Rewards' 
              : 'In Progress'}
          </Button>
        </div>
      </div>
    </div>
  );
}
