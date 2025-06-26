import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Plus, Thermometer, Clock, Leaf } from "lucide-react";

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

export default function Collection() {
  const [rarityFilter, setRarityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedCard, setSelectedCard] = useState<any>(null);

  const { data: userCards = [] } = useQuery<UserCard[]>({
    queryKey: ["/api/user-cards"],
  });

  const { data: allTeaCards = [] } = useQuery<any[]>({
    queryKey: ["/api/tea-cards"],
  });

  // Create a complete collection view with ownership status
  const completeCollection = (allTeaCards as any[]).map((teaCard: any) => {
    const ownedCard = userCards.find((userCard: any) => userCard.cardId === teaCard.id);
    return {
      ...teaCard,
      isOwned: !!ownedCard,
      quantity: ownedCard?.quantity || 0,
      userCardId: ownedCard?.id
    };
  });

  const filteredCards = completeCollection.filter((card: any) => {
    const matchesRarity = rarityFilter === "all" || card.rarity === rarityFilter;
    const matchesType = typeFilter === "all" || card.type === typeFilter;
    return matchesRarity && matchesType;
  });



  const rarityColors = {
    common: "bg-gray-600 text-white border-gray-400",
    uncommon: "bg-green-600 text-white border-green-400",
    rare: "bg-blue-600 text-white border-blue-400",
    epic: "bg-purple-600 text-white border-purple-400",
    legendary: "bg-yellow-600 text-amber-900 border-yellow-400"
  };

  const rarityBorderColors = {
    common: "border-gray-400",
    uncommon: "border-green-400",
    rare: "border-blue-400",
    epic: "border-purple-400",
    legendary: "border-yellow-400"
  };

  const abilityColors = {
    concentrates: "bg-blue-900 text-blue-200 border-blue-400",
    soothes: "bg-green-900 text-green-200 border-green-400",
    invigorates: "bg-red-900 text-red-200 border-red-400",
    calms: "bg-purple-900 text-purple-200 border-purple-400",
    refreshes: "bg-cyan-900 text-cyan-200 border-cyan-400",
    energizes: "bg-orange-900 text-orange-200 border-orange-400"
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b-4 border-yellow-400 shadow-2xl"
              style={{background: 'linear-gradient(to right, var(--burgundy-700), var(--adventure-brown-700))'}}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" className="border-2 border-yellow-400 text-amber-200 hover:bg-yellow-400 hover:text-amber-900">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Adventure
                </Button>
              </Link>
              <h1 className="font-adventure text-3xl font-bold text-yellow-400">Tea Collection</h1>
            </div>
            
            <div className="text-amber-200">
              <span className="font-quest text-lg">
                Collected: {userCards.length} / 200 Cards
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
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
          
          <div className="text-yellow-400 font-quest">
            Showing {filteredCards.length} cards • {completeCollection.filter(c => c.isOwned).length}/{completeCollection.length} collected
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {filteredCards.map((card: any) => {
            const rarityClass = rarityColors[card.rarity as keyof typeof rarityColors] || rarityColors.common;
            const borderClass = rarityBorderColors[card.rarity as keyof typeof rarityBorderColors] || rarityBorderColors.common;
            const isLegendary = card.rarity === 'legendary';
            
            return (
              <Card 
                key={card.id} 
                className={`card-hover rounded-lg border-2 p-3 shadow-lg cursor-pointer transition-all duration-300 ${
                  !card.isOwned 
                    ? 'bg-gradient-to-b from-gray-700 to-gray-800 border-gray-600 grayscale opacity-60' 
                    : `bg-gradient-to-b from-red-900 to-amber-900 ${borderClass} ${isLegendary ? 'animate-card-glow' : ''}`
                }`}
                onClick={() => setSelectedCard(card)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={card.imageUrl} 
                      alt={card.name}
                      className={`w-full h-24 object-cover rounded-md mb-2 ${!card.isOwned ? 'grayscale' : ''}`}
                    />
                    
                    {/* Quantity badge for owned cards */}
                    {card.isOwned && card.quantity > 1 && (
                      <div className="absolute top-1 right-1 bg-black bg-opacity-80 text-white px-1.5 py-0.5 rounded-full text-xs font-bold">
                        x{card.quantity}
                      </div>
                    )}
                    
                    {/* Lock icon for unowned cards */}
                    {!card.isOwned && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-70 text-gray-300 px-2 py-1 rounded-full text-lg">
                          🔒
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center mb-2">
                    <h3 className={`font-adventure text-sm font-bold mb-1 ${
                      card.isOwned ? 'text-yellow-300' : 'text-gray-400'
                    }`}>
                      {card.name}
                    </h3>
                  </div>
                  
                  {/* Compact card info */}
                  <div className="space-y-1 mb-2">
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div className="text-center">
                        <div className={`font-bold ${card.isOwned ? 'text-yellow-400' : 'text-gray-500'}`}>STR</div>
                        <div className={card.isOwned ? 'text-amber-200' : 'text-gray-400'}>{card.strength}</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold ${card.isOwned ? 'text-green-400' : 'text-gray-500'}`}>FRS</div>
                        <div className={card.isOwned ? 'text-amber-200' : 'text-gray-400'}>{card.freshness}</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold ${card.isOwned ? 'text-purple-400' : 'text-gray-500'}`}>ARM</div>
                        <div className={card.isOwned ? 'text-amber-200' : 'text-gray-400'}>{card.aroma}</div>
                      </div>
                    </div>
                    
                    <Badge className={`${
                      card.isOwned ? rarityClass : 'bg-gray-600 text-gray-400'
                    } text-xs font-bold w-full justify-center`}>
                      {card.rarity.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
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

        {/* Card Detail Modal */}
        {selectedCard && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
               onClick={() => setSelectedCard(null)}>
            <Card className="bg-gradient-to-b from-red-900 to-amber-900 border-4 border-yellow-400 max-w-md w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <img 
                    src={selectedCard.imageUrl} 
                    alt={selectedCard.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h2 className="font-adventure text-2xl font-bold text-yellow-300 mb-2">{selectedCard.name}</h2>
                  
                  <Badge className={`${rarityColors[selectedCard.rarity as keyof typeof rarityColors] || rarityColors.common} text-sm font-bold mb-4`}>
                    {selectedCard.rarity.toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-4 text-amber-200">
                  <p className="font-quest text-sm leading-relaxed">{selectedCard.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-yellow-400 font-bold">Type:</span>
                      <br />{selectedCard.type}
                    </div>
                    <div>
                      <span className="text-yellow-400 font-bold">Origin:</span>
                      <br />{selectedCard.origin}
                    </div>
                  </div>

                  {/* Characteristics */}
                  <div className="bg-amber-900 rounded-lg p-4 space-y-3">
                    <h3 className="font-adventure text-lg font-bold text-yellow-400">Characteristics</h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center"><Leaf className="h-4 w-4 mr-2 text-green-400" />Strength</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={selectedCard.strength * 10} className="w-20 h-2" />
                          <span className="text-yellow-300 font-bold">{selectedCard.strength}/10</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="flex items-center"><Leaf className="h-4 w-4 mr-2 text-green-400" />Freshness</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={selectedCard.freshness * 10} className="w-20 h-2" />
                          <span className="text-yellow-300 font-bold">{selectedCard.freshness}/10</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="flex items-center"><Leaf className="h-4 w-4 mr-2 text-purple-400" />Aroma</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={selectedCard.aroma * 10} className="w-20 h-2" />
                          <span className="text-yellow-300 font-bold">{selectedCard.aroma}/10</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-amber-700">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-yellow-400 font-bold">Ability Effect:</span>
                        <Badge className={`${abilityColors[selectedCard.ability as keyof typeof abilityColors] || 'bg-gray-600 text-white'} border-2`}>
                          {selectedCard.ability}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-yellow-400" />
                          <div>
                            <div className="text-yellow-400 font-bold">Brewing Time</div>
                            <div>{selectedCard.brewingTime}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Thermometer className="h-4 w-4 mr-2 text-red-400" />
                          <div>
                            <div className="text-yellow-400 font-bold">Temperature</div>
                            <div>{selectedCard.temperature}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Badge className={`${rarityColors[selectedCard.rarity as keyof typeof rarityColors]} text-sm font-bold px-4 py-2`}>
                      {selectedCard.rarity.toUpperCase()} CARD
                    </Badge>
                  </div>
                </div>

                <Button 
                  onClick={() => setSelectedCard(null)}
                  className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 text-amber-900 font-bold"
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}