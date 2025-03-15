'use client';

import { useEffect, useRef, useState } from 'react';
import { CAMode, PRESET_RULES } from '@/lib/cellular-automaton';

// Cell size in pixels
const CELL_SIZE = 8;

export default function SimpleVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rule, setRule] = useState(30); // Rule 30 by default
  const [running, setRunning] = useState(false);
  const [grid, setGrid] = useState<boolean[][]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize the grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    const cols = Math.floor(width / CELL_SIZE);
    const rows = Math.floor(height / CELL_SIZE);

    // Create a new grid
    const newGrid: boolean[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: boolean[] = [];
      for (let j = 0; j < cols; j++) {
        row.push(false);
      }
      newGrid.push(row);
    }

    // Set up initial pattern in the middle of the bottom row
    const middleCol = Math.floor(cols / 2);
    // Create a larger initial pattern
    for (let i = -3; i <= 3; i++) {
      const col = middleCol + i;
      if (col >= 0 && col < cols) {
        newGrid[rows - 1][col] = true;
      }
    }

    setGrid(newGrid);
    setRunning(true);
  }, []);

  // Update function for the animation
  const update = () => {
    if (!grid.length) return;

    setGrid(prevGrid => {
      const rows = prevGrid.length;
      const cols = prevGrid[0].length;
      const newGrid = JSON.parse(JSON.stringify(prevGrid)) as boolean[][];

      // Apply cellular automaton rule to the bottom row
      const bottomRow = newGrid[rows - 1];
      const newBottomRow = Array(cols).fill(false);

      for (let i = 0; i < cols; i++) {
        const left = i > 0 ? bottomRow[i - 1] : false;
        const center = bottomRow[i];
        const right = i < cols - 1 ? bottomRow[i + 1] : false;

        // Apply Rule 30
        newBottomRow[i] = (left && !center && !right) ||
                          (!left && center && !right) ||
                          (!left && center && right) ||
                          (!left && !center && right);
      }

      // Shift rows up
      for (let i = 0; i < rows - 1; i++) {
        newGrid[i] = newGrid[i + 1];
      }

      // Set new bottom row
      newGrid[rows - 1] = newBottomRow;

      // Apply Conway's Game of Life rules to the entire grid
      const gameOfLifeGrid = JSON.parse(JSON.stringify(newGrid)) as boolean[][];

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const cell = newGrid[i][j];
          const neighbors = countNeighbors(newGrid, i, j);

          if (cell && (neighbors < 2 || neighbors > 3)) {
            gameOfLifeGrid[i][j] = false;
          } else if (!cell && neighbors === 3) {
            gameOfLifeGrid[i][j] = true;
          }
        }
      }

      return gameOfLifeGrid;
    });
  };

  // Count neighbors for Conway's Game of Life
  const countNeighbors = (grid: boolean[][], row: number, col: number): number => {
    let count = 0;
    const rows = grid.length;
    const cols = grid[0].length;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;

        const r = row + i;
        const c = col + j;

        if (r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c]) {
          count++;
        }
      }
    }

    return count;
  };

  // Draw the grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !grid.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the cells
    ctx.fillStyle = '#22aba1';
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j]) {
          ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
        }
      }
    }
  }, [grid]);

  // Animation loop
  useEffect(() => {
    if (!running) return;

    const animate = () => {
      update();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [running]);

  // Handle rule changes
  const handleRuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRule(Number(e.target.value));
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 left-0 right-0 p-2 flex flex-wrap gap-2 bg-black border-b border-zinc-800 z-10">
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-400">RULE:</label>
          <select
            className="bg-black text-white border border-zinc-700 px-2 py-1 text-sm"
            onChange={handleRuleChange}
            value={rule}
          >
            <option value={30}>Rule 30</option>
            <option value={90}>Rule 90</option>
            <option value={110}>Rule 110</option>
            <option value={184}>Rule 184</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="bg-black text-white border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800"
            onClick={() => setRunning(!running)}
          >
            {running ? 'PAUSE' : 'START'}
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 mt-12 bg-black"
        width={600}
        height={500}
      />
    </div>
  );
}
