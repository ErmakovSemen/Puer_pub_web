import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import PlayerHeader from '../components/PlayerHeader';
import QuestSection from '../components/QuestSection';
import AchievementsBase from '../components/AchievementsBase';

export default function Home() {
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
  });

  const { data: quests } = useQuery({
    queryKey: ['/api/quests'],
  });

  const { data: achievements } = useQuery({
    queryKey: ['/api/achievements'],
  });

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="magical-card m-4 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent">
            Tea Quest Adventures
          </h1>
          <div className="flex gap-4">
            <Link href="/collection">
              <button className="magical-button px-4 py-2 rounded-lg">Collection</button>
            </Link>
            <Link href="/achievements">
              <button className="magical-button px-4 py-2 rounded-lg">Profile</button>
            </Link>
            <Link href="/events">
              <button className="magical-button px-4 py-2 rounded-lg">Events</button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 space-y-6">
        {/* Player Stats */}
        {user && <PlayerHeader player={user} />}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quest Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-cyan-300">Current Quests</h2>
            {quests && <QuestSection quests={quests.slice(0, 3)} />}
          </div>

          {/* Achievements Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-purple-300">Achievements</h2>
              <Link href="/achievements">
                <button className="text-sm text-cyan-400 hover:text-cyan-300">View All →</button>
              </Link>
            </div>
            {achievements && <AchievementsBase achievements={achievements.slice(0, 6)} />}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="magical-card p-6">
          <h3 className="text-xl font-bold text-yellow-300 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/collection">
              <button className="magical-button p-4 rounded-lg w-full">
                <div className="text-center">
                  <div className="text-2xl mb-2">🍃</div>
                  <div className="text-sm">Tea Collection</div>
                </div>
              </button>
            </Link>
            <Link href="/events">
              <button className="magical-button p-4 rounded-lg w-full">
                <div className="text-center">
                  <div className="text-2xl mb-2">📅</div>
                  <div className="text-sm">Weekly Events</div>
                </div>
              </button>
            </Link>
            <Link href="/achievements">
              <button className="magical-button p-4 rounded-lg w-full">
                <div className="text-center">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="text-sm">Achievements</div>
                </div>
              </button>
            </Link>
            <button className="magical-button p-4 rounded-lg w-full">
              <div className="text-center">
                <div className="text-2xl mb-2">⭐</div>
                <div className="text-sm">Daily Bonus</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}