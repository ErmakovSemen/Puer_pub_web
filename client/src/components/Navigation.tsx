import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Leaf, User, Coins } from "lucide-react";

interface NavigationProps {
  user: any;
}

export default function Navigation({ user }: NavigationProps) {
  const navItems = [
    { href: "/collection", label: "Collection", icon: "🃏", isRoute: true },
    { href: "/achievements", label: "Profile", icon: "👤", isRoute: true },
    { href: "#quests", label: "Quests", icon: "🗺️", isRoute: false },
    { href: "#events", label: "Events", icon: "📅", isRoute: false }
  ];

  return (
    <header className="border-b-4 border-yellow-400 shadow-2xl"
            style={{background: 'linear-gradient(to right, var(--burgundy-700), var(--adventure-brown-700))'}}>
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-400 p-3 rounded-full">
              <Leaf className="text-amber-900 h-6 w-6" />
            </div>
            <h1 className="font-adventure text-3xl font-bold text-yellow-400">Tea Quest Adventures</h1>
          </div>
          
          {/* Navigation Menu */}
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              item.isRoute ? (
                <Link key={item.href} href={item.href}>
                  <div className="nav-btn bg-red-900 hover:bg-red-800 px-4 py-2 rounded-lg border-2 border-yellow-400 font-quest font-semibold transition-all duration-300 text-amber-200 hover:text-yellow-300 cursor-pointer">
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </div>
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="nav-btn bg-red-900 hover:bg-red-800 px-4 py-2 rounded-lg border-2 border-yellow-400 font-quest font-semibold transition-all duration-300 text-amber-200 hover:text-yellow-300"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </a>
              )
            ))}
          </div>

          {/* User Stats */}
          <div className="flex items-center space-x-4">
            <Badge className="bg-yellow-400 text-amber-900 px-3 py-1 rounded-full font-bold">
              <Coins className="mr-1 h-4 w-4" />
              {user?.coins || 0}
            </Badge>
            <Badge className="bg-red-900 px-3 py-1 rounded-full font-bold border border-yellow-400 text-amber-200">
              Level {user?.level || 1}
            </Badge>
            <div className="w-10 h-10 bg-amber-900 rounded-full border-2 border-yellow-400 flex items-center justify-center">
              <User className="text-yellow-400 h-5 w-5" />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
