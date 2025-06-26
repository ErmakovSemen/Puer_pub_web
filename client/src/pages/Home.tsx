import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import PlayerStats from "@/components/PlayerStats";
import TeaCard from "@/components/TeaCard";
import QuestCard from "@/components/QuestCard";
import WeeklyEvents from "@/components/WeeklyEvents";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, Trophy, Play, Eye, Plus } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [rarityFilter, setRarityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: userCards = [] } = useQuery({
    queryKey: ["/api/user-cards"],
  });

  const { data: quests = [] } = useQuery({
    queryKey: ["/api/quests"],
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ["/api/achievements"],
  });

  const filteredCards = userCards.filter((userCard: any) => {
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
          
          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-3">
            <PlayerStats 
              user={user} 
              achievements={achievements}
              experiencePercentage={experiencePercentage}
              collectionPercentage={collectionPercentage}
              userCards={userCards}
            />
          </aside>

          {/* Main Content */}
          <main className="col-span-12 lg:col-span-9">
            
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-2xl p-8 mb-8 border-4 shadow-2xl"
                     style={{
                       background: 'linear-gradient(to right, var(--burgundy-600), var(--adventure-brown-600))',
                       borderColor: 'var(--quest-gold-400)'
                     }}>
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-repeat opacity-20" 
                     style={{backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'><path fill='%23DAA520' d='M10 2c4 0 8 2 8 6s-4 6-8 6-8-2-8-6 4-6 8-6z'/></svg>")`}}></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="font-adventure text-4xl font-bold mb-4 text-yellow-300">Welcome, Tea Adventurer!</h2>
                <p className="font-quest text-lg mb-6 leading-relaxed text-amber-100">
                  Embark on an epic journey to discover and collect the world's most legendary teas. 
                  Complete quests, participate in events, and build the ultimate tea collection.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button 
                    className="bg-yellow-400 hover:bg-yellow-500 text-amber-900 font-bold py-3 px-6 animate-quest-pulse"
                    onClick={() => window.scrollTo({ top: document.getElementById('quests')?.offsetTop, behavior: 'smooth' })}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Daily Quest
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-2 border-yellow-400 text-amber-100 hover:bg-yellow-400 hover:text-amber-900 font-bold py-3 px-6"
                    onClick={() => window.scrollTo({ top: document.getElementById('collection')?.offsetTop, behavior: 'smooth' })}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Collection
                  </Button>
                </div>
              </div>
            </section>

            {/* Weekly Events */}
            <WeeklyEvents />

            {/* Tea Card Collection */}
            <section id="collection" className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="font-adventure text-3xl font-bold text-yellow-300">Your Tea Collection</h2>
                <div className="flex flex-wrap gap-4">
                  <Select value={rarityFilter} onValueChange={setRarityFilter}>
                    <SelectTrigger className="w-40 bg-amber-900 border-2 border-yellow-400 text-amber-100">
                      <SelectValue placeholder="All Rarities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rarities</SelectItem>
                      <SelectItem value="common">Common</SelectItem>
                      <SelectItem value="uncommon">Uncommon</SelectItem>
                      <SelectItem value="rare">Rare</SelectItem>
                      <SelectItem value="epic">Epic</SelectItem>
                      <SelectItem value="legendary">Legendary</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40 bg-amber-900 border-2 border-yellow-400 text-amber-100">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Green Tea">Green Tea</SelectItem>
                      <SelectItem value="Black Tea">Black Tea</SelectItem>
                      <SelectItem value="Oolong">Oolong</SelectItem>
                      <SelectItem value="White Tea">White Tea</SelectItem>
                      <SelectItem value="Herbal">Herbal</SelectItem>
                      <SelectItem value="Powdered Green">Powdered Green</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCards.map((userCard: any) => (
                  <TeaCard key={userCard.id} card={userCard.card} quantity={userCard.quantity} />
                ))}
                
                {/* Placeholder for more cards */}
                <Card className="border-4 border-dashed border-yellow-400 bg-gradient-to-b from-amber-900 to-red-900 cursor-pointer hover:bg-gradient-to-b hover:from-amber-800 hover:to-red-800 transition-all duration-300">
                  <CardContent className="flex items-center justify-center h-80 p-4">
                    <div className="text-center">
                      <Plus className="h-12 w-12 text-yellow-400 mb-3 mx-auto" />
                      <p className="font-quest text-yellow-400 font-semibold">Discover New Teas</p>
                      <p className="text-xs opacity-75 mt-2 text-amber-200">Complete quests to unlock</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Current Quests */}
            <section id="quests" className="mb-8">
              <h2 className="font-adventure text-3xl font-bold text-yellow-300 mb-6">Available Quests</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {quests.map((quest: any) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-4 border-yellow-400 py-8 mt-12"
              style={{background: 'linear-gradient(to right, var(--adventure-brown-800), var(--burgundy-800))'}}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-adventure text-xl font-bold text-yellow-400 mb-4">Tea Quest Adventures</h3>
              <p className="font-quest text-sm text-amber-200 opacity-75">
                Embark on the ultimate tea collecting adventure. Discover rare teas, complete epic quests, and build your legendary collection.
              </p>
            </div>
            
            <div>
              <h4 className="font-quest font-bold text-yellow-400 mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#collection" className="text-amber-200 hover:text-yellow-400 transition-colors">My Collection</a></li>
                <li><a href="#quests" className="text-amber-200 hover:text-yellow-400 transition-colors">Active Quests</a></li>
                <li><a href="#events" className="text-amber-200 hover:text-yellow-400 transition-colors">Events Calendar</a></li>
                <li><a href="#achievements" className="text-amber-200 hover:text-yellow-400 transition-colors">Achievements</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-quest font-bold text-yellow-400 mb-3">Game Guide</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-amber-200 hover:text-yellow-400 transition-colors">How to Play</a></li>
                <li><a href="#" className="text-amber-200 hover:text-yellow-400 transition-colors">Card Rarities</a></li>
                <li><a href="#" className="text-amber-200 hover:text-yellow-400 transition-colors">Quest System</a></li>
                <li><a href="#" className="text-amber-200 hover:text-yellow-400 transition-colors">Trading Guide</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-quest font-bold text-yellow-400 mb-3">Community</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-amber-200 hover:text-yellow-400 transition-colors">Discord Server</a></li>
                <li><a href="#" className="text-amber-200 hover:text-yellow-400 transition-colors">Forums</a></li>
                <li><a href="#" className="text-amber-200 hover:text-yellow-400 transition-colors">Leaderboards</a></li>
                <li><a href="#" className="text-amber-200 hover:text-yellow-400 transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-yellow-400 mt-8 pt-6 text-center">
            <p className="text-amber-200 text-sm opacity-75">
              &copy; 2024 Tea Quest Adventures. All rights reserved. | Terms of Service | Privacy Policy
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
