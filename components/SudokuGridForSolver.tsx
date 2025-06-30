"use client";

import { Label } from "./ui/label";
import { Button } from "./ui/button";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { gridMap } from "@/lib/classicMethods";

type SudokuGridProps = {
  puzzleGrid: number[][];
  setPuzzleGrid: Dispatch<SetStateAction<number[][]>>;
  disable: boolean;
};

type UndoMove = {
  ri: number;
  ci: number;
  prevValue: number;
  newValue: number;
};

const SudokuGridForSolver: React.FC<SudokuGridProps> = ({
  puzzleGrid,
  setPuzzleGrid,
  disable,
}) => {
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const [selectedDiv, setSelectedDiv] = useState<HTMLDivElement | null>(null);
  const [undoHistory, setUndoHistory] = useState<UndoMove[]>([]);

  const setPuzzleGridValue = (newValue: number, ri: number, ci: number) => {
    const newGrid = puzzleGrid.map((row, rowIdx) =>
      rowIdx === ri
        ? row.map((cell, colIdx) => (colIdx === ci ? newValue : cell))
        : row
    );
    setPuzzleGrid(newGrid);
  };

  const recordMove = (num: number, ri: number, ci: number) => {
    const prevValue = puzzleGrid[ri][ci];
    if (prevValue !== num) {
      const move: UndoMove = {
        ri: ri,
        ci: ci,
        prevValue: prevValue,
        newValue: num,
      };
      setUndoHistory((prev) => [...prev, move]);
    }
  };

  const handleNumberInput = (num: number) => {
    if (selectedCell) {
      const [ri, ci] = selectedCell;
      if (selectedDiv && selectedDiv.id === "editable") {
        recordMove(num, ri, ci);
        setPuzzleGridValue(num, ri, ci);
      }
    }
  };

  function handleHighlight(ri: number, ci: number): string {
    if (!selectedCell) {
      return "bg-background";
    }

    const [selectedRi, selectedCi] = selectedCell;

    const isCellSelected = ri === selectedRi && ci === selectedCi;

    if (isCellSelected) {
      return "bg-primary text-background";
    }

    const selectedValue = puzzleGrid[selectedRi][selectedCi];
    const hasSameValue =
      selectedValue !== 0 && puzzleGrid[ri][ci] === selectedValue;

    if (hasSameValue) {
      return "bg-primary/60 text-secondary";
    }

    const isInSameRow = ri === selectedRi;
    const isInSameCol = ci === selectedCi;
    const isInSameSubgrid =
      Math.floor(ri / 3) === Math.floor(selectedRi / 3) &&
      Math.floor(ci / 3) === Math.floor(selectedCi / 3);

    if (isInSameRow || isInSameCol || isInSameSubgrid) {
      return "bg-slate-300";
    }

    return "bg-background";
  }

  const handleUndo = () => {
    if (undoHistory.length > 0) {
      const lastMove = undoHistory[undoHistory.length - 1];
      setPuzzleGridValue(lastMove.prevValue, lastMove.ri, lastMove.ci);
      setUndoHistory((prev) => prev.slice(0, -1));
      setSelectedCell([lastMove.ri, lastMove.ci]);
      const prevDiv = document.getElementsByClassName(
        `[${lastMove.ri}][${lastMove.ci}]`
      )[0] as HTMLDivElement;
      setSelectedDiv(prevDiv);
    }
  };

  const handleErase = () => {
    if (selectedCell && selectedDiv && selectedDiv?.id === "editable") {
      recordMove(0, selectedCell[0], selectedCell[1]);
      setPuzzleGridValue(0, selectedCell[0], selectedCell?.[1]);
    }
  };

  const handleClearAll = () => {
    setPuzzleGrid([
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  };

  return (
    <div className="flex flex-row">
      <div className="flex flex-col mr-2">
        <div className="flex flex-col mb-3.25 place-items-center">
          <div
            className="grid w-12.5 h-12.5 bg-secondary hover:bg-secondary/75 rounded-full"
            style={{ cursor: "pointer" }}
            onClick={handleUndo}
          >
            <Image
              src={`/undo-light.svg`}
              alt="Undo Icon"
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
            onClick={handleErase}
          >
            <Image
              src={`/erase-light.svg`}
              alt="Erase Icon"
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
            onClick={handleClearAll}
          >
            <Image
              src={`/clear-light.svg`}
              alt="Clear Icon"
              width={24}
              height={24}
              className="!w-7.5 !h-7.5 place-self-center"
            ></Image>
          </div>
          <Label className="mt-0.5 font-sans text-foreground">Clear All</Label>
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
                const [ri, ci] = gridMap[`${i},${j}`];
                return (
                  <div
                    id={"editable"}
                    key={`[${ri}][${ci}]`}
                    className={`[${ri}][${ci}] relative m-0 p-0 border-1 border-foreground h-10 w-10.25 font-inter text-2xl/0 text-center leading-none pt-1.5 
                      ${handleHighlight(ri, ci)} `}
                    onClick={(e) => {
                      const cell: [number, number] = [ri, ci];
                      const div = e.currentTarget;

                      const isCurrentlySelected =
                        selectedCell &&
                        selectedCell[0] === cell[0] &&
                        selectedCell[1] === cell[1];

                      if (isCurrentlySelected) {
                        setSelectedCell(null);
                        setSelectedDiv(null);
                      } else {
                        setSelectedCell(cell);
                        setSelectedDiv(div);
                      }
                    }}
                  >
                    {puzzleGrid[ri][ci] === 0 ? " " : puzzleGrid[ri][ci]}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex flex-row mt-5.5 gap-2.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            return (
              <Button
                key={num}
                className={`h-10.75 w-8.25 bg-secondary text-foreground hover:bg-primary hover:text-background rounded-lg font-inter text-2xl/0 leading-none pt-1`}
                onClick={() => handleNumberInput(num)}
                disabled={disable}
              >
                {num}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SudokuGridForSolver;
