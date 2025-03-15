'use client';

import dynamic from 'next/dynamic';

// Load visualization with no SSR to avoid hydration issues
const WolframGameOfLife = dynamic(
  () => import('./wolfram-game-of-life').then(mod => ({
    default: mod.WolframGameOfLife
  })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] flex items-center justify-center bg-black">
        <div className="text-white">Loading visualization...</div>
      </div>
    )
  }
);

export default function ClientWrapper() {
  return <WolframGameOfLife />;
}
