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
    'monday': 'ПОНЕДЕЛЬНИК',
    'tuesday': 'ВТОРНИК', 
    'wednesday': 'СРЕДА',
    'thursday': 'ЧЕТВЕРГ',
    'friday': 'ПЯТНИЦА',
    'saturday': 'СУББОТА',
    'sunday': 'ВОСКРЕСЕНЬЕ'
  };

  return (
    <section id="events" className="mb-8">
      <Card className="rounded-none border-4 border-yellow-400 shadow-2xl"
            style={{
              background: 'linear-gradient(to bottom, var(--burgundy-800), var(--adventure-brown-800))',
              fontFamily: 'monospace'
            }}>
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8 border-4 border-yellow-400 p-6"
               style={{
                 background: 'var(--burgundy-700)',
                 position: 'relative'
               }}>
            {/* Decorative corners */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-yellow-400"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-yellow-400"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-yellow-400"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-yellow-400"></div>

            <h2 className="font-adventure text-4xl font-bold text-yellow-400 mb-2 tracking-wider">PUER PUB</h2>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-8 h-8 rounded-full border-2 border-yellow-400 flex items-center justify-center">
                <span className="text-yellow-400 text-lg">🍃</span>
              </div>
              <p className="font-quest text-lg text-amber-200 uppercase tracking-wide">WEEKLY TEA ADVENTURES</p>
              <div className="w-8 h-8 rounded-full border-2 border-yellow-400 flex items-center justify-center">
                <span className="text-yellow-400 text-lg">🍃</span>
              </div>
            </div>
            
            <div className="border-t-2 border-yellow-400 w-32 mx-auto mb-4"></div>
            
            <div className="text-center">
              <p className="font-quest text-amber-200 text-lg uppercase tracking-wider">
                РАБОТАЕМ ЕЖЕДНЕВНО
              </p>
              <p className="font-quest text-yellow-400 text-xl font-bold">
                С 10:00 ДО 22:00
              </p>
              <div className="border-t border-yellow-400 w-24 mx-auto mt-2"></div>
              <p className="font-quest text-amber-200 text-sm mt-2 uppercase">
                Электросталь, Проспект Ленина 40/8
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

          {/* Bottom image placeholder */}
          <div className="mt-8 text-center">
            <div className="inline-block p-4 border-2 border-yellow-400 rounded-lg bg-amber-900">
              <p className="font-quest text-yellow-400 text-sm">
                🫖 Discover legendary teas through epic adventures 🫖
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
