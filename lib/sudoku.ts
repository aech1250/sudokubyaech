export function createSudokuGrid(level: string) {
  if (level === "None") {
    return {
      completeGrid: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
      board: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
    };
  }

  const size = 9;
  const board = Array(size)
    .fill(null)
    .map(() => Array(size).fill(0));

  function makePuzzle(board: number[][]) {
    let cellsToRemove = 0;
    if (level === "Easy") {
      cellsToRemove = 10;
    } else if (level === "Medium") {
      cellsToRemove = 43;
    } else if (level === "Hard") {
      cellsToRemove = 45;
    } else if (level === "Expert") {
      cellsToRemove = 53;
    }

    while (cellsToRemove > 0) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      if (board[row][col] !== 0) {
        board[row][col] = 0;
        cellsToRemove--;
      }
    }
  }

  solve(board, size);
  const completeGrid = board.map((row) => [...row]);

  makePuzzle(board);
  return { completeGrid, board };
}

function shuffle(array: number[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function solve(board: number[][], size: number) {
  const emptyCells = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }

  let i = 0;
  while (i >= 0 && i < emptyCells.length) {
    const { row, col } = emptyCells[i];

    const numbersToTry = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const lastTriedNum = board[row][col];
    const startIndex =
      lastTriedNum === 0 ? 0 : numbersToTry.indexOf(lastTriedNum) + 1;

    let foundValidNumber = false;

    for (let k = startIndex; k < numbersToTry.length; k++) {
      const num = numbersToTry[k];
      if (isValidPlacement(board, row, col, num)) {
        board[row][col] = num;
        foundValidNumber = true;
        break;
      }
    }

    if (foundValidNumber) {
      i++;
    } else {
      board[row][col] = 0;
      i--;
    }
  }
  return i === emptyCells.length;
}

export function isValidPlacement(
  grid: number[][],
  row: number,
  col: number,
  num: number
) {
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num || grid[i][col] === num) {
      return false;
    }
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }
  return true;
}
