"use client";

import { Label } from "./ui/label";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

type SudokuGrid = number[][];
type NumberToEnter = undefined | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const SudokuGrid = ({ solution: solutionGrid, puzzle }) => {
  const [puzzleGrid, setPuzzleGrid] = useState(puzzle);

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
    return sudokuGrid[destRow][destCol];
  };

  const setPuzzleGridValue = (newValue, i, j) => {
    const [destRow, destCol] = gridMap[`${i},${j}`];
    setPuzzleGrid((prev) =>
      prev.map((row, i) =>
        i === destRow
          ? row.map((cell, j) => (j === destCol ? newValue : cell))
          : row
      )
    );
  };

  const getMappedSolutionGridValue = (i, j) => {
    const [destRow, destCol] = gridMap[`${i},${j}`];
    console.log(`SolutionGrid Mapping: ${i},${j}: [${destRow}, ${destCol}]`);
    console.log(`SolutionGrid Value: ${solutionGrid[destRow][destCol]}`);
    return solutionGrid[destRow][destCol];
  };

  function gridsAreEqual(grid1: number[][], grid2: number[][]): boolean {
    return grid1.every((row, i) =>
      row.every((cell, j) => cell === grid2[i][j])
    );
  }

  const [sudokuGrid, setSudokuGrid] = useState<SudokuGrid>(puzzleGrid);
  const [numberToEnter, setNumberToEnter] = useState<NumberToEnter>(undefined);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    if (gridsAreEqual(solutionGrid, puzzleGrid)) {
      console.log("You Won!");
    }
  }, [puzzleGrid, solutionGrid]);

  return (
    <div className="flex flex-row">
      <div className="flex flex-col mr-2">
        <div className="flex flex-col mb-3.25 place-items-center">
          <div className="grid w-12.5 h-12.5 bg-secondary hover:bg-secondary/75 rounded-full">
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
          <div className="grid w-12.5 h-12.5 bg-secondary hover:bg-secondary/75 rounded-full">
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
          <div className="grid w-12.5 h-12.5 bg-secondary hover:bg-secondary/75 rounded-full">
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
                const [destRow, destCol] = gridMap[`${i},${j}`];
                const cellValue = sudokuGrid[destRow][destCol];
                const isEditable = puzzle[destRow][destCol] === 0;
                const isSameRow = selectedCell && destRow === selectedCell.row;
                const isSameCol = selectedCell && destCol === selectedCell.col;
                const isSameSubgrid =
                  selectedCell &&
                  Math.floor(destRow / 3) ===
                    Math.floor(selectedCell.row / 3) &&
                  Math.floor(destCol / 3) === Math.floor(selectedCell.col / 3);

                let cellClass =
                  "m-0 p-0 border-1 border-foreground h-10 w-10.25 font-inter text-2xl/0 text-center leading-none pt-1.5 ";
                if (isSameRow || isSameCol || isSameSubgrid)
                  cellClass += " bg-primary/15"; // highlight row/col/subgrid
                if (cellValue === numberToEnter)
                  cellClass += "bg-primary text-white"; // highlight same value

                return (
                  <div
                    key={j}
                    className={cellClass}
                    onClick={(e) => {
                      if (isEditable) {
                        setSelectedCell({ row: destRow, col: destCol });
                      }
                      setPuzzleGridValue(numberToEnter, i, j);
                      e.target.innerHTML = numberToEnter;
                    }}
                  >
                    {cellValue === 0 ? " " : cellValue}
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
              onClick={() => setNumberToEnter(num)}
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
