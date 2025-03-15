'use client';

import dynamic from 'next/dynamic';

// Dynamically import the client component with no SSR
const WolframGameOfLifeClient = dynamic(
  () => import('./wolfram-game-of-life-client').then(mod => ({ default: mod.WolframGameOfLifeClient })),
  { ssr: false }
);

// Loading placeholder
const Loading = () => (
  <div className="w-full h-full flex items-center justify-center">
    <p className="text-white">Loading simulation...</p>
  </div>
);

export function WolframGameOfLife() {
  return <WolframGameOfLifeClient />;
}
