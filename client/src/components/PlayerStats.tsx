import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Medal, Star } from "lucide-react";

interface PlayerStatsProps {
  user: any;
  achievements: any[];
  experiencePercentage: number;
  collectionPercentage: number;
  userCards: any[];
}

export default function PlayerStats({ 
  user, 
  achievements, 
  experiencePercentage, 
  collectionPercentage,
  userCards 
}: PlayerStatsProps) {
  const activeQuests = [
    { title: "Dragon Well Discovery", progress: "3/5" },
    { title: "Master Blender", progress: "1/10" }
  ];

  return (
    <>
      {/* Player Progress */}
      <Card className="rounded-xl border-2 border-yellow-400 p-6 mb-6 shadow-2xl"
            style={{background: 'linear-gradient(to bottom, var(--burgundy-700), var(--adventure-brown-700))'}}>
        <CardContent className="p-0">
          <h3 className="font-adventure text-xl font-bold mb-4 text-yellow-400">Quest Progress</h3>
          
          {/* Experience Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1 text-amber-200">
              <span>Experience</span>
              <span>{user?.experience || 0} / 10,000</span>
            </div>
            <Progress 
              value={experiencePercentage} 
              className="h-3 bg-amber-900 border border-yellow-400"
            />
          </div>

          {/* Collection Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1 text-amber-200">
              <span>Collection</span>
              <span>{userCards.length} / 200</span>
            </div>
            <Progress 
              value={collectionPercentage} 
              className="h-3 bg-amber-900 border border-yellow-400"
            />
          </div>

          {/* Active Quests */}
          <div>
            <h4 className="font-quest font-bold mb-3 text-yellow-400">Active Quests</h4>
            <div className="space-y-2">
              {activeQuests.map((quest, index) => (
                <Card key={index} className="bg-amber-900 p-3 rounded-lg border border-yellow-400">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-amber-200">{quest.title}</span>
                    <Badge className={`text-xs px-2 py-1 rounded ${
                      index === 0 
                        ? 'bg-yellow-400 text-amber-900' 
                        : 'bg-red-900 text-amber-200'
                    }`}>
                      {quest.progress}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card className="rounded-xl border-2 border-yellow-400 p-6 shadow-2xl text-amber-900"
            style={{background: 'linear-gradient(to bottom, var(--quest-gold-600), var(--quest-gold-400))'}}>
        <CardContent className="p-0">
          <h3 className="font-adventure text-xl font-bold mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {achievements.slice(0, 2).map((achievement, index) => (
              <div key={achievement.id} className="flex items-center space-x-3">
                {index === 0 ? (
                  <Medal className="h-6 w-6 text-yellow-600" />
                ) : (
                  <Star className="h-6 w-6 text-yellow-600" />
                )}
                <div>
                  <div className="font-bold text-sm">{achievement.title}</div>
                  <div className="text-xs opacity-75">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
