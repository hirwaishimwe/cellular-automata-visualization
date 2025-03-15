"use client";

import ClientWrapper from '@/components/client-wrapper';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black">
      <div className="z-10 w-full max-w-5xl">
        <h1 className="text-2xl font-bold mb-4 text-white">Wolfram's Game of Life</h1>
        <div className="w-full h-[600px] relative">
          <ClientWrapper />
        </div>
        <div className="mt-4 text-sm text-zinc-400">
          <p>
            A cellular automaton is a collection of cells on a grid that evolves in a series of steps, following a set of rules based on the states of neighboring cells.
          </p>
          <p className="mt-2">
            In this visualization, we are using Wolfram's cellular automaton as an input to Conway's Game of Life. Cells at the base of the simulation are populated with values from a row of cellular automata cells.
          </p>
          <p className="mt-2">
            You can use the control panel to edit the cellular automaton rules and choose from various presets. The 'Elementary' mode uses only binary states of neighboring cells, while the 'Totalistic' uses the total value of neighboring cells.
          </p>
        </div>
      </div>
    </main>
  );
}
