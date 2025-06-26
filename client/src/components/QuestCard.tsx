import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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
          <div className="text-sm">
            <div className="font-bold">Rewards:</div>
            <div>+{quest.rewardXp} XP, +{quest.rewardCoins} Coins{quest.rewardCardId ? ', Rare Card' : ''}</div>
          </div>
          <Button 
            className={`font-bold py-2 px-4 rounded-lg transition-all ${
              isDailyQuest
                ? 'bg-amber-900 hover:bg-red-900 text-yellow-400'
                : 'bg-yellow-400 hover:bg-yellow-500 text-amber-900'
            }`}
            disabled={quest.isCompleted}
          >
            {quest.isCompleted ? 'Completed' : 'Continue'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
