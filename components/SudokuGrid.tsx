"use client";

import { Label } from "./ui/label";
import { Button } from "./ui/button";
import Image from "next/image";
import { useState } from "react";

type SudokuGrid = number[][];
type NumberToEnter = undefined | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type SudokuGridProps = {
  solution: number[][];
  puzzle: number[][];
};

const SudokuGrid: React.FC<SudokuGridProps> = ({
  solution: solutionGrid,
  puzzle,
}) => {
  // Only one state for the current grid
  const [puzzleGrid, setPuzzleGrid] = useState<SudokuGrid>(puzzle);
  const [numberToEnter, setNumberToEnter] = useState<NumberToEnter>(undefined);

  const gridMap = {
    "0,0": [0, 0],
    "0,1": [0, 1],
    "0,2": [0, 2],
    "0,3": [1, 0],
    "0,4": [1, 1],
    "0,5": [1, 2],
    "0,6": [2, 0],
    "0,7": [2, 1],
    "0,8": [2, 2],
    "1,0": [0, 3],
    "1,1": [0, 4],
    "1,2": [0, 5],
    "1,3": [1, 3],
    "1,4": [1, 4],
    "1,5": [1, 5],
    "1,6": [2, 3],
    "1,7": [2, 4],
    "1,8": [2, 5],
    "2,0": [0, 6],
    "2,1": [0, 7],
    "2,2": [0, 8],
    "2,3": [1, 6],
    "2,4": [1, 7],
    "2,5": [1, 8],
    "2,6": [2, 6],
    "2,7": [2, 7],
    "2,8": [2, 8],
    "3,0": [3, 0],
    "3,1": [3, 1],
    "3,2": [3, 2],
    "3,3": [4, 0],
    "3,4": [4, 1],
    "3,5": [4, 2],
    "3,6": [5, 0],
    "3,7": [5, 1],
    "3,8": [5, 2],
    "4,0": [3, 3],
    "4,1": [3, 4],
    "4,2": [3, 5],
    "4,3": [4, 3],
    "4,4": [4, 4],
    "4,5": [4, 5],
    "4,6": [5, 3],
    "4,7": [5, 4],
    "4,8": [5, 5],
    "5,0": [3, 6],
    "5,1": [3, 7],
    "5,2": [3, 8],
    "5,3": [4, 6],
    "5,4": [4, 7],
    "5,5": [4, 8],
    "5,6": [5, 6],
    "5,7": [5, 7],
    "5,8": [5, 8],
    "6,0": [6, 0],
    "6,1": [6, 1],
    "6,2": [6, 2],
    "6,3": [7, 0],
    "6,4": [7, 1],
    "6,5": [7, 2],
    "6,6": [8, 0],
    "6,7": [8, 1],
    "6,8": [8, 2],
    "7,0": [6, 3],
    "7,1": [6, 4],
    "7,2": [6, 5],
    "7,3": [7, 3],
    "7,4": [7, 4],
    "7,5": [7, 5],
    "7,6": [8, 3],
    "7,7": [8, 4],
    "7,8": [8, 5],
    "8,0": [6, 6],
    "8,1": [6, 7],
    "8,2": [6, 8],
    "8,4": [7, 7],
    "8,3": [7, 6],
    "8,5": [7, 8],
    "8,6": [8, 6],
    "8,7": [8, 7],
    "8,8": [8, 8],
  };

  const getMappedPuzzleGridValue = (i, j) => {
    const [destRow, destCol] = gridMap[`${i},${j}`];
    return puzzleGrid[destRow][destCol];
  };

  const setPuzzleGridValue = (newValue: number, i: number, j: number) => {
    const [destRow, destCol] = gridMap[`${i},${j}`];
    const newGrid = puzzleGrid.map((row, rowIdx) =>
      rowIdx === destRow
        ? row.map((cell, colIdx) => (colIdx === destCol ? newValue : cell))
        : row
    );
    setPuzzleGrid(newGrid);
  };

  const isGridEmpty = (grid: number[][]) =>
    grid.every((row) => row.every((cell) => cell === 0));

  const getMappedSolutionGridValue = (i, j) => {
    const [destRow, destCol] = gridMap[`${i},${j}`];
    return solutionGrid[destRow][destCol];
  };

  function gridsAreEqual(grid1: number[][], grid2: number[][]): boolean {
    return grid1.every((row, i) =>
      row.every((cell, j) => cell === grid2[i][j])
    );
  }

  return (
    <div className="flex flex-row">
      <div className="flex flex-col mr-2">
        <div className="flex flex-col mb-3.25 place-items-center">
          <div
            className="grid w-12.5 h-12.5 bg-secondary hover:bg-secondary/75 rounded-full"
            style={{ cursor: "pointer" }}
          >
            <Image
              src={`/undo-light.svg`}
              alt="Gamepad Icon"
              width={24}
              height={24}
              className="!w-5.5 !h-5.5 place-self-center"
            ></Image>
          </div>
          <Label className="mt-0.5 font-sans text-foreground">Undo</Label>
        </div>
        <div className="flex flex-col mb-3.25 place-items-center">
          <div
            className="grid w-12.5 h-12.5 bg-secondary hover:bg-secondary/75 rounded-full"
            style={{ cursor: "pointer" }}
          >
            <Image
              src={`/erase-light.svg`}
              alt="Gamepad Icon"
              width={24}
              height={24}
              className="!w-7 !h-7 place-self-center"
            ></Image>
          </div>
          <Label className="mt-0.5 font-sans text-foreground">Erase</Label>
        </div>
        <div className="flex flex-col place-items-center">
          <div
            className="grid w-12.5 h-12.5 bg-secondary hover:bg-secondary/75 rounded-full"
            style={{ cursor: "pointer" }}
          >
            <Image
              src={`/hint-light.svg`}
              alt="Gamepad Icon"
              width={24}
              height={24}
              className="!w-7.5 !h-7.5 place-self-center"
            ></Image>
          </div>
          <Label className="mt-0.5 font-sans text-foreground">Hint</Label>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="m-0 p-0 grid grid-cols-3 grid-rows-3 border-2 border-foreground gap-0">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, i) => (
            <div
              key={i}
              className="m-0 p-0 grid grid-cols-3 grid-rows-3 border-1 border-foreground gap-x-0 gap-y-0"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, j) => {
                return (
                  <div
                    key={j}
                    className={`m-0 p-0 border-1 border-foreground h-10 w-10.25 font-inter text-2xl/0 text-center leading-none pt-1.5`}
                    onClick={() => {}}
                  >
                    {getMappedPuzzleGridValue(i, j) === 0
                      ? " "
                      : getMappedPuzzleGridValue(i, j)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex flex-row mt-5.5 gap-2.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              className={`h-10.75 w-8.25 ${
                numberToEnter === num
                  ? "bg-primary text-background"
                  : "bg-secondary text-foreground"
              } hover:bg-primary hover:text-background rounded-lg font-inter text-2xl/0 leading-none pt-1`}
              onClick={() =>
                setNumberToEnter(numberToEnter === num ? undefined : num)
              }
            >
              {num}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SudokuGrid;
