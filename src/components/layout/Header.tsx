import { Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container flex h-14 items-center px-4">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold">RC Visualizer</h1>
        </div>
      </div>
    </header>
  );
}
