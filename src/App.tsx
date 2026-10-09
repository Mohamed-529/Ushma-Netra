import React, { useState } from 'react';
import { EditorialShowcase } from './components/showcase/EditorialShowcase';
import { LiveDualScreenCommand } from './components/showcase/LiveDualScreenCommand';
import { AWSArchitectureView } from './components/showcase/AWSArchitectureView';
import { ExploreTheWorld3D } from './components/showcase/ExploreTheWorld3D';

export type AppView = 'editorial' | 'command' | 'architecture' | 'explore_3d';

export default function App() {
  const [view, setView] = useState<AppView>('editorial');

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-slate-900 font-sans selection:bg-amber-200 selection:text-amber-900 antialiased">
      {view === 'editorial' && (
        <EditorialShowcase
          onTalkToWorker={() => setView('command')}
          onExploreWorld={() => setView('explore_3d')}
          onOpenStack={() => setView('architecture')}
        />
      )}

      {view === 'command' && (
        <LiveDualScreenCommand
          onBackToMain={() => setView('editorial')}
        />
      )}

      {view === 'architecture' && (
        <AWSArchitectureView
          onBackToMain={() => setView('editorial')}
        />
      )}

      {view === 'explore_3d' && (
        <ExploreTheWorld3D
          onBackToMain={() => setView('editorial')}
          onOpenLiveCommand={() => setView('command')}
          onOpenArchitecture={() => setView('architecture')}
        />
      )}
    </div>
  );
}
