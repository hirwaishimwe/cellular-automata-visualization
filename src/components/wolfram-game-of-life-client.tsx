'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { RuleConfig } from "./rule-config";
import {
  CAMode,
  CELL_SIZE,
  PRESET_RULES,
  generateElementaryRuleset,
  generateNextConwayGeneration,
  generateNextWolframRow,
  generateTotalisticRuleset
} from "@/lib/cellular-automaton";

// Animation speed settings in milliseconds
const ANIMATION_SPEEDS = {
  SLOW: 300,
  MEDIUM: 150,
  FAST: 60,
  MAX: 0
};

// Zoom scale factors
const ZOOM_SCALES = {
  "1x": 1,
  "2x": 2,
  "3x": 3
};

export function WolframGameOfLifeClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rule, setRule] = useState(PRESET_RULES.RULE_30);
  const [mode, setMode] = useState<CAMode>(CAMode.ELEMENTARY);
  const [speed, setSpeed] = useState<string>("MEDIUM");
  const [zoom, setZoom] = useState<string>("1x");
  const [running, setRunning] = useState(true);

  // Grid state stored in a ref to avoid re-renders
  const gridRef = useRef<boolean[][]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  // Generate ruleset based on current rule and mode
  const getRuleset = useCallback(() => {
    if (mode === CAMode.ELEMENTARY) {
      return generateElementaryRuleset(rule);
    } else {
      return generateTotalisticRuleset(rule);
    }
  }, [rule, mode]);

  // Initialize grid
  const initGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    const cols = Math.floor(width / CELL_SIZE);
    const rows = Math.floor(height / CELL_SIZE);

    // Create empty grid
    const grid = Array(rows).fill(null).map(() => Array(cols).fill(false));

    // Create initial pattern in the middle of the bottom row
    const middleCol = Math.floor(cols / 2);
    for (let i = -3; i <= 3; i++) {
      const col = middleCol + i;
      if (col >= 0 && col < cols) {
        // Alternating pattern for visibility
        grid[rows - 1][col] = i % 2 === 0;
      }
    }

    gridRef.current = grid;

    // Run a few initial generations to make it immediately visible
    const ruleset = getRuleset();
    for (let i = 0; i < 10; i++) {
      updateGrid();
    }

    renderGrid();
  }, [getRuleset]);

  // Render grid on canvas
  const renderGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grid = gridRef.current;
    if (!grid.length) return;

    const zoomFactor = ZOOM_SCALES[zoom as keyof typeof ZOOM_SCALES] || 1;

    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw cells
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x]) {
          ctx.fillStyle = '#22aba1'; // Teal living cells
          ctx.fillRect(
            x * CELL_SIZE * zoomFactor,
            y * CELL_SIZE * zoomFactor,
            CELL_SIZE * zoomFactor - 1,
            CELL_SIZE * zoomFactor - 1
          );
        }
      }
    }
  }, [zoom]);

  // Update grid for next generation
  const updateGrid = useCallback(() => {
    const grid = gridRef.current;
    if (!grid.length || !grid[0].length) return;

    const ruleset = getRuleset();

    // Number of rows and columns
    const rows = grid.length;

    // Step 1: Calculate the next row of the Wolfram CA
    if (rows > 1) {
      const lastCARow = grid[rows - 1];
      const newCARow = generateNextWolframRow(lastCARow, ruleset, mode);

      // Shift all rows up by one
      for (let i = 0; i < rows - 1; i++) {
        grid[i] = grid[i + 1];
      }

      // Add the new CA row at the bottom
      grid[rows - 1] = newCARow;
    }

    // Step 2: Apply Conway's Game of Life rules to the entire grid
    gridRef.current = generateNextConwayGeneration(grid);
  }, [getRuleset, mode]);

  // Initialize canvas on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions explicitly
    canvas.width = 600;
    canvas.height = 500;

    initGrid();

    // Handle window resize
    const handleResize = () => {
      initGrid();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameIdRef.current || 0);
    };
  }, [initGrid]);

  // Reset grid when mode or rule changes
  useEffect(() => {
    if (canvasRef.current) {
      initGrid();
    }
  }, [rule, mode, initGrid]);

  // Animation loop
  useEffect(() => {
    if (!running) {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      return;
    }

    const animate = (timestamp: number) => {
      const animSpeed = ANIMATION_SPEEDS[speed as keyof typeof ANIMATION_SPEEDS] || ANIMATION_SPEEDS.MEDIUM;

      // Only update if enough time has passed (or if speed is MAX)
      if (speed === 'MAX' || timestamp - lastUpdateTimeRef.current > animSpeed) {
        updateGrid();
        renderGrid();
        lastUpdateTimeRef.current = timestamp;
      }

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [updateGrid, renderGrid, speed, running]);

  return (
    <div className="relative w-full h-full">
      <RuleConfig
        rule={rule}
        mode={mode}
        onRuleChange={setRule}
        onModeChange={setMode}
        onSpeedChange={setSpeed}
        onZoomChange={setZoom}
        speed={speed}
        zoom={zoom}
        running={running}
        onToggleRunning={() => setRunning(!running)}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 mt-20 bg-black"
        width={600}
        height={500}
      />
    </div>
  );
}
