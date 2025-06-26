import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface TeaCardProps {
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
  quantity: number;
}

const rarityColors = {
  common: "bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-slate-500/25",
  uncommon: "bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-emerald-500/25",
  rare: "bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-blue-500/25",
  epic: "bg-gradient-to-br from-purple-400 to-pink-500 text-white shadow-purple-500/25",
  legendary: "bg-gradient-to-br from-yellow-400 to-orange-500 text-slate-900 shadow-yellow-500/25 animate-glow-pulse"
};

const rarityBorderColors = {
  common: "border-slate-400/50",
  uncommon: "border-emerald-400/50",
  rare: "border-blue-400/50",
  epic: "border-purple-400/50",
  legendary: "border-yellow-400/50"
};

const abilityColors = {
  concentrates: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-200 border-cyan-400/30",
  soothes: "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-200 border-emerald-400/30",
  invigorates: "bg-gradient-to-r from-rose-500/20 to-red-500/20 text-rose-200 border-rose-400/30",
  calms: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border-purple-400/30",
  refreshes: "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 border-cyan-400/30",
  energizes: "bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-200 border-orange-400/30"
};

export default function TeaCard({ card, quantity }: TeaCardProps) {
  const rarityClass = rarityColors[card.rarity as keyof typeof rarityColors] || rarityColors.common;
  const borderClass = rarityBorderColors[card.rarity as keyof typeof rarityBorderColors] || rarityBorderColors.common;
  
  const getStarCount = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 5;
      case 'epic': return 4;
      case 'rare': return 3;
      case 'uncommon': return 2;
      case 'common': return 1;
      default: return 1;
    }
  };

  const starCount = getStarCount(card.rarity);
  const isLegendary = card.rarity === 'legendary';

  return (
    <div className={`magical-card rounded-2xl p-4 relative overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 animate-magical-float ${borderClass} ${isLegendary ? 'animate-glow-pulse' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 pointer-events-none"></div>
      <div className="relative z-10">
        <div className="relative mb-4">
          <img 
            src={card.imageUrl} 
            alt={card.name}
            className="w-full h-32 object-cover rounded-xl shadow-lg"
          />
          {quantity > 1 && (
            <div className="absolute top-2 right-2 magical-card px-2 py-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs font-bold">
              x{quantity}
            </div>
          )}
        </div>
        
        <div className="text-center mb-4">
          <h3 className="font-adventure text-lg font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent mb-2">{card.name}</h3>
          <div className="flex justify-center items-center space-x-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < starCount 
                    ? card.rarity === 'legendary' 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : card.rarity === 'epic'
                      ? 'text-purple-400 fill-purple-400'
                      : card.rarity === 'rare'
                      ? 'text-blue-400 fill-blue-400'
                      : card.rarity === 'uncommon'
                      ? 'text-green-400 fill-green-400'
                      : 'text-gray-400 fill-gray-400'
                    : 'text-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="text-xs space-y-2 mb-4 text-blue-200">
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="text-cyan-300">{card.type}</span>
          </div>
          <div className="flex justify-between">
            <span>Origin:</span>
            <span className="text-cyan-300">{card.origin}</span>
          </div>
          <div className="flex justify-between">
            <span>Power:</span>
            <span className="text-cyan-300">+{card.power} {card.powerType}</span>
          </div>
        </div>

        {/* Mystical Characteristics */}
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="magical-card p-2 rounded-lg text-center bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
              <div className="text-yellow-300 font-bold text-xs">STR</div>
              <div className="text-white font-bold">{card.strength}/10</div>
            </div>
            <div className="magical-card p-2 rounded-lg text-center bg-gradient-to-br from-emerald-500/20 to-green-500/20">
              <div className="text-emerald-300 font-bold text-xs">FRS</div>
              <div className="text-white font-bold">{card.freshness}/10</div>
            </div>
            <div className="magical-card p-2 rounded-lg text-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <div className="text-purple-300 font-bold text-xs">ARM</div>
              <div className="text-white font-bold">{card.aroma}/10</div>
            </div>
          </div>
          
          <div className={`magical-card ${abilityColors[card.ability as keyof typeof abilityColors] || 'bg-slate-600/50 text-white'} text-xs font-bold w-full text-center py-2 px-3 rounded-lg border`}>
            ✨ {card.ability.toUpperCase()}
          </div>
        </div>
        
        <div className={`magical-card ${rarityClass} text-xs font-bold w-full text-center py-2 px-3 rounded-lg shadow-lg`}>
          {card.rarity.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
