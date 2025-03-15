"use client";

import { useEffect, useState } from "react";
import { CAMode, PRESET_OPTIONS } from "@/lib/cellular-automaton";

interface RulePattern {
  pattern: boolean[];
  result: boolean;
}

interface RuleConfigProps {
  rule: number;
  mode: CAMode;
  onRuleChange: (rule: number) => void;
  onModeChange: (mode: CAMode) => void;
  onSpeedChange: (speed: string) => void;
  onZoomChange: (zoom: string) => void;
  speed: string;
  zoom: string;
  running: boolean;
  onToggleRunning: () => void;
}

export function RuleConfig({
  rule,
  mode,
  onRuleChange,
  onModeChange,
  onSpeedChange,
  onZoomChange,
  speed,
  zoom,
  running,
  onToggleRunning
}: RuleConfigProps) {
  const [isClient, setIsClient] = useState(false);
  const [patterns, setPatterns] = useState<RulePattern[]>([]);

  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate ruleset patterns based on the current rule
  useEffect(() => {
    if (!isClient) return;

    // Generate patterns based on the rule number
    const newPatterns: RulePattern[] = [];

    if (mode === CAMode.ELEMENTARY) {
      // Elementary CA has 8 possible patterns (2^3)
      for (let i = 7; i >= 0; i--) {
        // Convert i to binary pattern
        const a = !!(i & 4);
        const b = !!(i & 2);
        const c = !!(i & 1);

        // Calculate if the result is true based on the rule
        const result = !!((rule >> i) & 1);

        newPatterns.push({
          pattern: [a, b, c],
          result
        });
      }
    } else {
      // Totalistic CA has 7 possible patterns (0-6 total)
      for (let i = 6; i >= 0; i--) {
        // Calculate if the result is true based on the rule
        const result = !!((rule >> i) & 1);

        newPatterns.push({
          pattern: Array(3).fill(false).map((_, idx) => idx < i), // Visual representation
          result
        });
      }
    }

    setPatterns(newPatterns);
  }, [rule, mode, isClient]);

  // Handle mode change
  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = e.target.value as CAMode;
    onModeChange(newMode);

    // Reset rule to default based on mode
    if (newMode === CAMode.ELEMENTARY) {
      onRuleChange(30); // Rule 30 by default
    } else {
      onRuleChange(1935); // Code 1935 by default
    }
  };

  // Handle preset change
  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onRuleChange(Number(e.target.value));
  };

  if (!isClient) {
    return (
      <div className="controls absolute top-0 left-0 right-0 p-2 flex flex-wrap gap-2 bg-black border-b border-zinc-800 z-10">
        <div className="flex-1 h-16"></div>
      </div>
    );
  }

  return (
    <div className="controls absolute top-0 left-0 right-0 p-2 flex flex-wrap gap-2 bg-black border-b border-zinc-800 z-10">
      <div className="flex items-center gap-2">
        <label className="text-sm text-zinc-400">MODE:</label>
        <select
          className="bg-black text-white border border-zinc-700 px-2 py-1 text-sm"
          onChange={handleModeChange}
          value={mode}
        >
          <option value={CAMode.ELEMENTARY}>ELEMENTARY</option>
          <option value={CAMode.TOTALISTIC}>TOTALISTIC</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-zinc-400">PRESET:</label>
        <select
          className="bg-black text-white border border-zinc-700 px-2 py-1 text-sm"
          onChange={handlePresetChange}
          value={rule}
        >
          {PRESET_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-zinc-400">ZOOM:</label>
        <select
          className="bg-black text-white border border-zinc-700 px-2 py-1 text-sm"
          onChange={(e) => onZoomChange(e.target.value)}
          value={zoom}
        >
          <option value="1x">1x</option>
          <option value="2x">2x</option>
          <option value="3x">3x</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-zinc-400">SPEED:</label>
        <select
          className="bg-black text-white border border-zinc-700 px-2 py-1 text-sm"
          onChange={(e) => onSpeedChange(e.target.value)}
          value={speed}
        >
          <option value="SLOW">SLOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="FAST">FAST</option>
          <option value="MAX">MAX</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="bg-black text-white border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800"
          onClick={onToggleRunning}
        >
          {running ? 'PAUSE' : 'START'}
        </button>
      </div>

      <div className="flex-1"></div>

      <div className="pattern-grid flex gap-1">
        {patterns.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="grid grid-cols-3 w-12 border border-zinc-700">
              {item.pattern.map((cell, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 flex items-center justify-center ${cell ? 'bg-white' : 'bg-black'}`}
                >
                  {cell && <div className="w-2 h-2 bg-black"></div>}
                </div>
              ))}
            </div>
            <div
              className={`w-12 h-4 mt-1 border border-zinc-700 ${item.result ? 'bg-white' : 'bg-black'}`}
            >
              {item.result && <div className="w-2 h-2 mx-auto bg-black"></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
