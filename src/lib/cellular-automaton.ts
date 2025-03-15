// Constants
export const CELL_SIZE = 5;

export const PRESET_RULES = {
  RULE_30: 30,
  RULE_90: 90,
  RULE_110: 110,
  RULE_184: 184,
  CODE_1935: 1935 // Totalistic rule
};

export const PRESET_OPTIONS = [
  { label: "Rule 30", value: PRESET_RULES.RULE_30 },
  { label: "Rule 90", value: PRESET_RULES.RULE_90 },
  { label: "Rule 110", value: PRESET_RULES.RULE_110 },
  { label: "Rule 184", value: PRESET_RULES.RULE_184 },
  { label: "Code 1935", value: PRESET_RULES.CODE_1935 }
];

export enum CAMode {
  ELEMENTARY = "ELEMENTARY",
  TOTALISTIC = "TOTALISTIC"
}

// Generate Wolfram's Elementary CA ruleset
export function generateElementaryRuleset(rule: number): boolean[] {
  const ruleset: boolean[] = [];

  for (let i = 0; i < 8; i++) {
    ruleset[i] = ((rule >> i) & 1) === 1;
  }

  return ruleset.reverse();
}

// Generate Totalistic CA ruleset (0-6 total possible values)
export function generateTotalisticRuleset(code: number): boolean[] {
  const ruleset: boolean[] = [];

  for (let i = 0; i < 7; i++) {
    ruleset[i] = ((code >> i) & 1) === 1;
  }

  return ruleset.reverse();
}

// Apply Wolfram's Elementary CA rules
export function applyElementaryRule(a: boolean, b: boolean, c: boolean, ruleset: boolean[]): boolean {
  const idx = (a ? 4 : 0) + (b ? 2 : 0) + (c ? 1 : 0);
  return ruleset[idx];
}

// Apply Totalistic CA rules
export function applyTotalisticRule(cells: boolean[], ruleset: boolean[]): boolean {
  // Count the number of true values in a 3-cell neighborhood
  const sum = cells.filter(cell => cell).length;
  return ruleset[sum];
}

// Apply Conway's Game of Life rules
export function applyConwayRules(cell: boolean, neighbors: number): boolean {
  if (cell) {
    // A living cell stays alive if it has 2 or 3 neighbors
    return neighbors === 2 || neighbors === 3;
  } else {
    // A dead cell becomes alive if it has exactly 3 neighbors
    return neighbors === 3;
  }
}

// Count number of living neighbors in Conway's Game of Life
export function countLivingNeighbors(grid: boolean[][], x: number, y: number): number {
  let count = 0;

  // Check all 8 surrounding cells
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      // Skip the center cell
      if (i === 0 && j === 0) continue;

      const nx = x + i;
      const ny = y + j;

      // Check boundaries
      if (nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length) {
        if (grid[ny][nx]) count++;
      }
    }
  }

  return count;
}

// Generate the next generation of Conway's Game of Life
export function generateNextConwayGeneration(grid: boolean[][]): boolean[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid = Array(rows).fill(null).map(() => Array(cols).fill(false));

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const neighbors = countLivingNeighbors(grid, x, y);
      newGrid[y][x] = applyConwayRules(grid[y][x], neighbors);
    }
  }

  return newGrid;
}

// Generate the next row of Wolfram CA based on current row
export function generateNextWolframRow(
  currentRow: boolean[],
  ruleset: boolean[],
  mode: CAMode
): boolean[] {
  const newRow = Array(currentRow.length).fill(false);

  for (let i = 0; i < currentRow.length; i++) {
    // Get the three cells to check (with wrapping)
    const left = currentRow[(i - 1 + currentRow.length) % currentRow.length];
    const center = currentRow[i];
    const right = currentRow[(i + 1) % currentRow.length];

    if (mode === CAMode.ELEMENTARY) {
      newRow[i] = applyElementaryRule(left, center, right, ruleset);
    } else {
      newRow[i] = applyTotalisticRule([left, center, right], ruleset);
    }
  }

  return newRow;
}
