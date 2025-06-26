import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import WeeklyEvents from "@/components/WeeklyEvents";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface User {
  id: number;
  username: string;
  level: number;
  experience: number;
  coins: number;
}

export default function Events() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  return (
    <div className="min-h-screen">
      <Navigation user={user} />
      
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="border-2 border-yellow-400 text-amber-100 hover:bg-yellow-400 hover:text-amber-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-adventure text-4xl font-bold text-yellow-300 mb-2">
            Weekly Events
          </h1>
          <p className="text-amber-200 font-quest text-lg">
            Join special tea events throughout the week and earn exclusive rewards
          </p>
        </div>

        {/* Weekly Events Component */}
        <WeeklyEvents />
      </div>
    </div>
  );
}