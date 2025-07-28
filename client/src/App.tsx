import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Router } from 'wouter';
import Home from './pages/Home';
import Collection from './pages/Collection';
import Achievements from './pages/Achievements';
import Events from './pages/Events';
import NotFound from './pages/not-found';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Route path="/" component={Home} />
          <Route path="/collection" component={Collection} />
          <Route path="/achievements" component={Achievements} />
          <Route path="/events" component={Events} />
          <Route component={NotFound} />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;