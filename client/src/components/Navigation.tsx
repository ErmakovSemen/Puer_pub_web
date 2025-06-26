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
    { href: "/events", label: "Events", icon: "📅", isRoute: true }
  ];

  return (
    <header className="glass-morphism border-b border-blue-400/30 shadow-2xl relative"
            style={{boxShadow: '0 8px 32px hsla(220, 25%, 8%, 0.6), inset 0 1px 0 hsla(210, 90%, 65%, 0.1)'}}>
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4 animate-magical-float">
            <div className="magical-border rounded-full p-3 animate-glow-pulse">
              <Leaf className="text-blue-300 h-6 w-6" />
            </div>
            <h1 className="font-adventure text-3xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Tea Quest Adventures
            </h1>
          </div>
          
          {/* Navigation Menu */}
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              item.isRoute ? (
                <Link key={item.href} href={item.href}>
                  <div className="magical-card px-5 py-3 rounded-xl font-quest font-semibold transition-all duration-300 text-blue-200 hover:text-cyan-300 cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group">
                    <span className="mr-2 text-lg group-hover:animate-bounce">{item.icon}</span>
                    {item.label}
                  </div>
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="magical-card px-5 py-3 rounded-xl font-quest font-semibold transition-all duration-300 text-blue-200 hover:text-cyan-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group"
                >
                  <span className="mr-2 text-lg group-hover:animate-bounce">{item.icon}</span>
                  {item.label}
                </a>
              )
            ))}
          </div>

          {/* User Stats */}
          <div className="flex items-center space-x-3">
            <div className="magical-card px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 font-bold shadow-lg shadow-yellow-500/25">
              <Coins className="mr-1 h-4 w-4 inline" />
              {user?.coins || 0}
            </div>
            <div className="magical-card px-4 py-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold shadow-lg shadow-purple-500/25">
              Level {user?.level || 1}
            </div>
            <Link href="/achievements">
              <div className="w-12 h-12 magical-border rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 animate-glow-pulse">
                <User className="text-cyan-300 h-6 w-6" />
              </div>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
