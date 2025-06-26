import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

interface WeeklyEvent {
  id: number;
  title: string;
  description: string;
  dayOfWeek: string;
  time: string;
  cost: number;
  type: string;
  isActive: boolean;
}

export default function WeeklyEvents() {
  const { data: events = [] } = useQuery<WeeklyEvent[]>({
    queryKey: ["/api/weekly-events"],
  });

  const eventsByDay = events.reduce((acc: any, event: WeeklyEvent) => {
    if (!acc[event.dayOfWeek]) {
      acc[event.dayOfWeek] = [];
    }
    acc[event.dayOfWeek].push(event);
    return acc;
  }, {});

  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayNames = {
    'monday': '✨ MONDAY',
    'tuesday': '🌟 TUESDAY', 
    'wednesday': '💫 WEDNESDAY',
    'thursday': '⭐ THURSDAY',
    'friday': '🔮 FRIDAY',
    'saturday': '🌙 SATURDAY',
    'sunday': '☄️ SUNDAY'
  };

  return (
    <section id="events" className="mb-8">
      <div className="magical-card rounded-2xl relative overflow-hidden animate-magical-float">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 pointer-events-none"></div>
        <div className="p-8 relative z-10">
          {/* Celestial Header */}
          <div className="text-center mb-8 magical-card border-2 border-cyan-400/30 p-8 rounded-xl relative">
            {/* Magical corners */}
            <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400 rounded-tl-lg"></div>
            <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-400 rounded-tr-lg"></div>
            <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-400 rounded-bl-lg"></div>
            <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-400 rounded-br-lg"></div>

            <h2 className="font-adventure text-4xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-4 tracking-wider">✨ CELESTIAL TEA REALM</h2>
            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className="w-10 h-10 magical-border rounded-full flex items-center justify-center animate-glow-pulse">
                <span className="text-2xl">🌟</span>
              </div>
              <p className="font-quest text-lg text-cyan-200 uppercase tracking-wide">WEEKLY MYSTICAL ADVENTURES</p>
              <div className="w-10 h-10 magical-border rounded-full flex items-center justify-center animate-glow-pulse">
                <span className="text-2xl">🌙</span>
              </div>
            </div>
            
            <div className="border-t-2 border-gradient-to-r from-cyan-400 to-purple-400 w-40 mx-auto mb-6"></div>
            
            <div className="text-center space-y-3">
              <p className="font-quest text-blue-200 text-lg uppercase tracking-wider">
                OPEN DAILY FOR MYSTICAL JOURNEYS
              </p>
              <p className="font-quest text-cyan-300 text-xl font-bold">
                10:00 AM - 10:00 PM
              </p>
              <div className="border-t border-cyan-400/50 w-32 mx-auto"></div>
              <p className="font-quest text-blue-200 text-sm uppercase opacity-75">
                Realm of Endless Tea Adventures
              </p>
            </div>
          </div>

          {/* Schedule Grid */}
          <div className="border-4 border-yellow-400"
               style={{ background: 'var(--burgundy-700)' }}>
            
            {/* Decorative corners for main schedule */}
            <div className="relative">
              <div className="absolute top-2 left-2 w-6 h-6 border-l-4 border-t-4 border-yellow-400"></div>
              <div className="absolute top-2 right-2 w-6 h-6 border-r-4 border-t-4 border-yellow-400"></div>
              <div className="absolute bottom-2 left-2 w-6 h-6 border-l-4 border-b-4 border-yellow-400"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 border-r-4 border-b-4 border-yellow-400"></div>
              
              <div className="grid grid-cols-12 gap-0 p-6">
                {/* Days Column */}
                <div className="col-span-3 space-y-0">
                  {dayOrder.map((day, index) => (
                    <div key={day} 
                         className={`p-4 border-b-2 border-yellow-400 ${index === dayOrder.length - 1 ? 'border-b-0' : ''}`}>
                      <h3 className="font-adventure text-xl font-bold text-yellow-400 uppercase tracking-wide">
                        {dayNames[day as keyof typeof dayNames]}
                      </h3>
                      <div className="border-t-2 border-yellow-400 w-full mt-2"></div>
                    </div>
                  ))}
                </div>

                {/* Events Column */}
                <div className="col-span-9 space-y-0">
                  {dayOrder.map((day, index) => (
                    <div key={day} 
                         className={`p-4 border-b-2 border-yellow-400 border-l-2 ${index === dayOrder.length - 1 ? 'border-b-0' : ''}`}>
                      <div className="space-y-3">
                        {eventsByDay[day]?.map((event: WeeklyEvent) => (
                          <div key={event.id} className="space-y-1">
                            <div className="font-quest text-amber-100 text-lg font-bold">
                              {event.time} - {event.title.toUpperCase()}
                            </div>
                            <div className="font-quest text-amber-200 text-sm">
                              {event.description} | {event.cost > 0 ? `${event.cost} РУБЛЕЙ | ИГРА ПО ЗАПИСИ` : 'БЕСПЛАТНО'}
                            </div>
                            <div className="border-t border-yellow-400 w-full opacity-50"></div>
                          </div>
                        )) || (
                          <div className="font-quest text-amber-200 text-lg opacity-75">
                            —
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mystical Bottom Section */}
          <div className="mt-8 text-center">
            <div className="magical-card inline-block p-6 border border-cyan-400/30 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
              <p className="font-quest text-cyan-300 text-sm">
                🌟 Discover legendary teas through mystical adventures 🌙
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
