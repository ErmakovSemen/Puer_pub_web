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
  };
  quantity: number;
}

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
    <Card className={`card-hover bg-gradient-to-b from-red-900 to-amber-900 rounded-xl border-4 p-4 shadow-2xl cursor-pointer ${borderClass} ${isLegendary ? 'animate-card-glow' : ''}`}>
      <CardContent className="p-0">
        <img 
          src={card.imageUrl} 
          alt={card.name}
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
        
        <div className="text-center mb-3">
          <h3 className="font-adventure text-lg font-bold text-yellow-300 mb-1">{card.name}</h3>
          {quantity > 1 && (
            <Badge variant="secondary" className="mb-2">
              x{quantity}
            </Badge>
          )}
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
        
        <div className="text-xs space-y-1 mb-3 text-amber-200">
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="text-yellow-300">{card.type}</span>
          </div>
          <div className="flex justify-between">
            <span>Origin:</span>
            <span className="text-yellow-300">{card.origin}</span>
          </div>
          <div className="flex justify-between">
            <span>Power:</span>
            <span className="text-yellow-300">+{card.power} {card.powerType}</span>
          </div>
        </div>
        
        <Badge className={`${rarityClass} text-xs font-bold w-full justify-center`}>
          {card.rarity.toUpperCase()}
        </Badge>
      </CardContent>
    </Card>
  );
}
