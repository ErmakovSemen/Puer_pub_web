import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import PlayerHeader from "@/components/PlayerHeader";
import TeaCard from "@/components/TeaCard";
import QuestCard from "@/components/QuestCard";
import TaskBubble from "@/components/TaskBubble";
import AchievementsBase from "@/components/AchievementsBase";
import WeeklyEvents from "@/components/WeeklyEvents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, Trophy, Play, Eye, Plus } from "lucide-react";
import { useState } from "react";

interface UserCard {
  id: number;
  userId: number;
  cardId: number;
  quantity: number;
  card: {
    id: number;
    name: string;
    type: string;
    origin: string;
    rarity: string;
    power: number;
    powerType: string;
    imageUrl: string;
    description?: string;
    strength: number;
    freshness: number;
    aroma: number;
    ability: string;
    brewingTime?: string;
    temperature?: string;
  };
}

interface User {
  id: number;
  username: string;
  level: number;
  experience: number;
  coins: number;
}

interface Quest {
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
}

export default function Home() {
  const [rarityFilter, setRarityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: userCards = [] } = useQuery<UserCard[]>({
    queryKey: ["/api/user-cards"],
  });

  const { data: quests = [] } = useQuery<Quest[]>({
    queryKey: ["/api/quests"],
  });

  const { data: achievements = [] } = useQuery<any[]>({
    queryKey: ["/api/achievements"],
  });

  const filteredCards = userCards.filter((userCard: UserCard) => {
    const matchesRarity = rarityFilter === "all" || userCard.card.rarity === rarityFilter;
    const matchesType = typeFilter === "all" || userCard.card.type === typeFilter;
    return matchesRarity && matchesType;
  });

  const experiencePercentage = user ? (user.experience / 10000) * 100 : 0;
  const collectionPercentage = (userCards.length / 200) * 100;

  return (
    <div className="min-h-screen">
      <Navigation user={user} />
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <main className="col-span-12">

            {/* Weekly Events */}
            <WeeklyEvents />

            {/* Tea Card Collection */}
            <section id="collection" className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="font-adventure text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">✨ Celestial Tea Collection</h2>
                <div className="flex flex-wrap gap-4">
                  <Link href="/collection">
                    <Button className="magical-card bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 font-bold px-6 py-2 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/25">
                      View Full Collection ({userCards.length} cards)
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Card Grid - Show limited cards on home page */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCards.slice(0, 7).map((userCard: UserCard) => (
                  <TeaCard key={userCard.id} card={userCard.card} quantity={userCard.quantity} />
                ))}
                
                {/* View All Cards Link */}
                <Link href="/collection">
                  <div className="magical-card rounded-2xl border-2 border-dashed border-cyan-400/50 cursor-pointer hover:border-cyan-400 transition-all duration-300 hover:scale-105 animate-magical-float">
                    <div className="flex items-center justify-center h-80 p-4">
                      <div className="text-center">
                        <Plus className="h-16 w-16 text-cyan-400 mb-4 mx-auto animate-glow-pulse" />
                        <p className="font-quest text-cyan-300 font-semibold text-lg mb-2">View Full Collection</p>
                        <p className="text-sm text-blue-200 opacity-75">{userCards.length} magical cards available</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </section>

            {/* Current Quests */}
            <section id="quests" className="mb-8">
              <h2 className="font-adventure text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mb-8">🌟 Celestial Quests</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {quests.map((quest: any) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            </section>

            {/* Achievements Base */}
            <section id="achievements" className="mb-8">
              <AchievementsBase />
            </section>

          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="magical-card border-t border-cyan-400/30 py-12 mt-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-adventure text-xl font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mb-4">✨ Celestial Tea Realm</h3>
              <p className="font-quest text-sm text-blue-200 opacity-75 leading-relaxed">
                Embark on the ultimate magical tea collecting adventure. Discover celestial teas, complete mystical quests, and build your legendary collection.
              </p>
            </div>
            
            <div>
              <h4 className="font-quest font-bold text-cyan-300 mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#collection" className="text-blue-200 hover:text-cyan-300 transition-colors">Collection</a></li>
                <li><a href="#quests" className="text-blue-200 hover:text-cyan-300 transition-colors">Quests</a></li>
                <li><a href="#events" className="text-blue-200 hover:text-cyan-300 transition-colors">Events</a></li>
                <li><a href="#achievements" className="text-blue-200 hover:text-cyan-300 transition-colors">Achievements</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-quest font-bold text-cyan-300 mb-3">Mystical Guide</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-blue-200 hover:text-cyan-300 transition-colors">How to Play</a></li>
                <li><a href="#" className="text-blue-200 hover:text-cyan-300 transition-colors">Card Rarities</a></li>
                <li><a href="#" className="text-blue-200 hover:text-cyan-300 transition-colors">Quest System</a></li>
                <li><a href="#" className="text-blue-200 hover:text-cyan-300 transition-colors">Trading Guide</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-quest font-bold text-cyan-300 mb-3">Community</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-blue-200 hover:text-cyan-300 transition-colors">Discord Server</a></li>
                <li><a href="#" className="text-blue-200 hover:text-cyan-300 transition-colors">Forums</a></li>
                <li><a href="#" className="text-blue-200 hover:text-cyan-300 transition-colors">Leaderboards</a></li>
                <li><a href="#" className="text-blue-200 hover:text-cyan-300 transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-cyan-400/30 mt-8 pt-6 text-center">
            <p className="text-blue-200 text-sm opacity-75">
              &copy; 2024 Celestial Tea Realm. All rights reserved. | Terms of Service | Privacy Policy
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
