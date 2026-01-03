import { Header } from '@/components/layout/Header';
import { TimelineFeed } from '@/features/timeline/components/TimelineFeed';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-6">
        <TimelineFeed />
      </main>
    </div>
  );
}

export default App;
