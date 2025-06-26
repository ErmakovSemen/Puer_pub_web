import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";

export default function WeeklyEvents() {
  const { data: events = [] } = useQuery({
    queryKey: ["/api/weekly-events"],
  });

  const eventsByDay = events.reduce((acc: any, event: any) => {
    if (!acc[event.dayOfWeek]) {
      acc[event.dayOfWeek] = [];
    }
    acc[event.dayOfWeek].push(event);
    return acc;
  }, {});

  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  const getDayDisplayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <section id="events" className="mb-8">
      <Card className="rounded-2xl border-4 border-yellow-400 p-8 shadow-2xl"
            style={{background: 'linear-gradient(to bottom, var(--burgundy-700), var(--adventure-brown-700))'}}>
        <CardContent className="p-0">
          <div className="text-center mb-6">
            <h2 className="font-adventure text-3xl font-bold text-yellow-400 mb-2">WEEKLY TEA EVENTS</h2>
            <p className="font-quest text-lg text-amber-200">ADVENTURE SCHEDULE</p>
            <div className="border-t-2 border-yellow-400 w-24 mx-auto mt-4"></div>
            <p className="font-quest mt-4 text-amber-200">
              DAILY QUESTS AVAILABLE<br />
              10:00 - 22:00
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Days */}
            <div className="space-y-4">
              {dayOrder.slice(0, 3).map(day => (
                <Card key={day} className="border-2 border-yellow-400 rounded-lg bg-amber-900">
                  <CardContent className="p-4">
                    <h3 className="font-adventure text-xl font-bold text-yellow-400 mb-2">
                      {getDayDisplayName(day)}
                    </h3>
                    <div className="border-t border-yellow-400 pt-2">
                      <div className="space-y-2">
                        {eventsByDay[day]?.map((event: any) => (
                          <div key={event.id}>
                            <div className="text-sm text-amber-100">
                              {event.time} - {event.title}
                            </div>
                            <div className="text-xs opacity-75 text-amber-200">
                              {event.description} {event.cost > 0 ? `| ${event.cost} Coins` : '| Free'}
                            </div>
                          </div>
                        )) || (
                          <div className="text-sm text-amber-200 opacity-75">No events scheduled</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right Column - Days */}
            <div className="space-y-4">
              {dayOrder.slice(3).map(day => (
                <Card key={day} className="border-2 border-yellow-400 rounded-lg bg-amber-900">
                  <CardContent className="p-4">
                    <h3 className="font-adventure text-xl font-bold text-yellow-400 mb-2">
                      {day === 'saturday' || day === 'sunday' ? 'WEEKEND' : getDayDisplayName(day)}
                    </h3>
                    <div className="border-t border-yellow-400 pt-2">
                      <div className="space-y-2">
                        {eventsByDay[day]?.map((event: any) => (
                          <div key={event.id}>
                            <div className="text-sm text-amber-100">
                              {event.time} - {event.title}
                            </div>
                            <div className="text-xs opacity-75 text-amber-200">
                              {event.description} {event.cost > 0 ? `| ${event.cost} Coins` : '| Free'}
                            </div>
                          </div>
                        )) || (
                          <div className="text-sm text-amber-200 opacity-75">No events scheduled</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
