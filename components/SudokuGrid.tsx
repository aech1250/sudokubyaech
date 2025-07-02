"use client";

import { Label } from "./ui/label";
import { Button } from "./ui/button";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { gridMap } from "@/lib/classicMethods";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useSettings } from "@/app/contexts/settings";

type SudokuGrid = number[][];
type Level = "Expert" | "Hard" | "Medium" | "Easy" | "None";
type Hints = 0 | 1 | 2 | 3;
type Mistakes = 0 | 1 | 2 | 3;

type SudokuGridProps = {
  solution: number[][];
  puzzle: number[][];
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
  setMistakes: Dispatch<SetStateAction<Mistakes>>;
  setIsComplete: Dispatch<SetStateAction<boolean | null>>;
  level: Level;
  hints: Hints;
  mistakes: Mistakes;
  setHints: Dispatch<SetStateAction<Hints>>;
  setCurrentPuzzleGrid: Dispatch<SetStateAction<SudokuGrid>>;
};

type UndoMove = {
  ri: number;
  ci: number;
  prevScore: number;
  prevValue: number;
  newValue: number;
};

const SudokuGrid: React.FC<SudokuGridProps> = ({
  solution: solutionGrid,
  puzzle,
  score,
  setScore,
  setMistakes,
  setIsComplete,
  level,
  hints,
  setHints,
  setCurrentPuzzleGrid,
}) => {
  const initialPuzzleGrid = puzzle;
  const [puzzleGrid, setPuzzleGrid] = useState<SudokuGrid>(puzzle);

  useEffect(() => {
    setPuzzleGrid(puzzle);
  }, [puzzle]);

  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const [selectedDiv, setSelectedDiv] = useState<HTMLDivElement | null>(null);
  const [undoHistory, setUndoHistory] = useState<UndoMove[]>([]);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [numberToEnter, setNumberToEnter] = useState<number | null>(null);

  const scoreRef = useRef<HTMLSpanElement>(null);
  const { settings } = useSettings();

  useGSAP(() => {
    if (showScore && scoreRef.current) {
      gsap.fromTo(
        scoreRef.current,
        { opacity: 1 },
        { opacity: 0, y: -10, duration: 1, ease: "power1" }
      );
    }
  }, [showScore, selectedCell]);

  useEffect(() => {
    setPuzzleGrid(puzzle);
    setCurrentPuzzleGrid(puzzle);
  }, [puzzle]);

  useEffect(() => {
    if (!settings.lighteningMode) {
      setNumberToEnter(null);
    } else {
      if (numberToEnter === null) {
        for (let i = 1; i < 10; i++) {
          if (9 - puzzleGrid.flat().filter((cell) => cell === i).length > 0) {
            setNumberToEnter(i);
            break;
          }
        }
      }
    }
  }, [puzzleGrid]);

  const animatedRowNeighbours = (row: number, col: number) => {
    const cells = Array.from(document.querySelectorAll(`[data-row="${row}"]`));

    cells.sort(
      (a, b) =>
        Number(a.getAttribute("data-col")) - Number(b.getAttribute("data-col"))
    );

    const leftCells: HTMLDivElement[] = [];
    const rightCells: HTMLDivElement[] = [];
    for (let offset = 1; offset < 9; offset++) {
      const left = cells.find(
        (cell) => Number(cell.getAttribute("data-col")) === col - offset
      );
      const right = cells.find(
        (cell) => Number(cell.getAttribute("data-col")) === col + offset
      );
      if (left) leftCells.push(left as HTMLDivElement);
      if (right) rightCells.push(right as HTMLDivElement);
    }

    const maxPairs = Math.max(leftCells.length, rightCells.length);
    for (let i = 0; i < maxPairs; i++) {
      setTimeout(() => {
        const pair: HTMLDivElement[] = [];
        if (leftCells[i]) pair.push(leftCells[i]);
        if (rightCells[i]) pair.push(rightCells[i]);
        if (pair.length > 0) {
          const originalBgs = pair.map(
            (cell) => window.getComputedStyle(cell).backgroundColor
          );
          const origninalClr = pair.map(
            (cell) => window.getComputedStyle(cell).color
          );

          const tl = gsap.timeline({
            onComplete: () => {
              gsap.set(pair, { clearProps: "all" });
            },
          });

          tl.to(pair, {
            scale: 0.6,
            borderRadius: "25%",
            backgroundColor: "var(--primary)",
            color: "var(--background)",
            duration: 0.4,
            ease: "power1.inOut",
            onUpdate: function () {
              pair.forEach((cell) => {
                const text = cell.querySelector(".cellText");
                if (text) {
                  const parentScale = gsap.getProperty(cell, "scale") as number;
                  gsap.set(text, { scale: 1 / (parentScale || 1) });
                }
              });
            },
          });
          tl.to(pair, {
            scale: 1,
            borderRadius: "0%",
            backgroundColor: originalBgs,
            color: origninalClr,
            duration: 0.4,
            ease: "power1.inOut",
            onUpdate: function () {
              pair.forEach((cell) => {
                const text = cell.querySelector(".cellText");
                if (text) {
                  gsap.set(text, { scale: 1 });
                }
              });
            },
          });
        }
      }, i * 120);
    }
  };

  const animatedColNeighbours = (row: number, col: number) => {
    const cells = Array.from(document.querySelectorAll(`[data-col="${col}"]`));
    cells.sort(
      (a, b) =>
        Number(a.getAttribute("data-row")) - Number(b.getAttribute("data-row"))
    );

    const upperCells: HTMLDivElement[] = [];
    const lowerCells: HTMLDivElement[] = [];
    for (let offset = 1; offset < 9; offset++) {
      const upper = cells.find(
        (cell) => Number(cell.getAttribute("data-row")) === row - offset
      );
      const lower = cells.find(
        (cell) => Number(cell.getAttribute("data-row")) === row + offset
      );
      if (upper) upperCells.push(upper as HTMLDivElement);
      if (lower) lowerCells.push(lower as HTMLDivElement);
    }
    const maxPairs = Math.max(upperCells.length, lowerCells.length);
    for (let i = 0; i < maxPairs; i++) {
      setTimeout(() => {
        const pair: HTMLDivElement[] = [];
        if (upperCells[i]) pair.push(upperCells[i]);
        if (lowerCells[i]) pair.push(lowerCells[i]);
        if (pair.length > 0) {
          const originalBgs = pair.map(
            (cell) => window.getComputedStyle(cell).backgroundColor
          );
          const origninalClr = pair.map(
            (cell) => window.getComputedStyle(cell).color
          );

          const tl = gsap.timeline({
            onComplete: () => {
              gsap.set(pair, { clearProps: "all" });
            },
          });

          tl.to(pair, {
            scale: 0.6,
            borderRadius: "25%",
            backgroundColor: "var(--primary)",
            color: "var(--background)",
            duration: 0.4,
            ease: "power1.inOut",
            onUpdate: function () {
              pair.forEach((cell) => {
                const text = cell.querySelector(".cellText");
                if (text) {
                  const parentScale = gsap.getProperty(cell, "scale") as number;
                  gsap.set(text, { scale: 1 / (parentScale || 1) });
                }
              });
            },
          });
          tl.to(pair, {
            scale: 1,
            borderRadius: "0%",
            backgroundColor: originalBgs,
            color: origninalClr,
            duration: 0.4,
            ease: "power1.inOut",
            onUpdate: function () {
              pair.forEach((cell) => {
                const text = cell.querySelector(".cellText");
                if (text) {
                  gsap.set(text, { scale: 1 });
                }
              });
            },
          });
        }
      }, i * 120);
    }
  };

  const animateSubgridNeighbours = (row: number, col: number) => {
    const subgridRow = Math.floor(row / 3) * 3;
    const subgridCol = Math.floor(col / 3) * 3;

    const cells: HTMLDivElement[] = [];
    for (let r = subgridRow; r < subgridRow + 3; r++) {
      for (let c = subgridCol; c < subgridCol + 3; c++) {
        if (r === row && c === col) continue;
        const cell = document.querySelector(
          `[data-row="${r}"][data-col="${c}"]`
        );
        if (cell) cells.push(cell as HTMLDivElement);
      }
    }

    cells.sort((a, b) => {
      const ar = Number(a.getAttribute("data-row"));
      const ac = Number(a.getAttribute("data-col"));
      const br = Number(b.getAttribute("data-row"));
      const bc = Number(b.getAttribute("data-col"));
      const da = Math.abs(ar - row) + Math.abs(ac - col);
      const db = Math.abs(br - row) + Math.abs(bc - col);
      return da - db;
    });

    for (let dist = 1; dist <= 4; dist++) {
      const waveCells = cells.filter((cell) => {
        const r = Number(cell.getAttribute("data-row"));
        const c = Number(cell.getAttribute("data-col"));
        return Math.abs(r - row) + Math.abs(c - col) === dist;
      });
      if (waveCells.length > 0) {
        setTimeout(() => {
          const originalBgs = waveCells.map(
            (cell) => window.getComputedStyle(cell).backgroundColor
          );
          const originalClr = waveCells.map(
            (cell) => window.getComputedStyle(cell).color
          );
          const tl = gsap.timeline({
            onComplete: () => {
              gsap.set(waveCells, { clearProps: "all" });
            },
          });
          tl.to(waveCells, {
            scale: 0.6,
            borderRadius: "25%",
            backgroundColor: "var(--primary)",
            color: "var(--background)",
            duration: 0.4,
            ease: "power1.inOut",
            onUpdate: function () {
              waveCells.forEach((cell) => {
                const text = cell.querySelector(".cellText");
                if (text) {
                  const parentScale = gsap.getProperty(cell, "scale") as number;
                  gsap.set(text, { scale: 1 / (parentScale || 1) });
                }
              });
            },
          });
          tl.to(waveCells, {
            scale: 1,
            borderRadius: "0%",
            backgroundColor: originalBgs,
            color: originalClr,
            duration: 0.4,
            ease: "power1.inOut",
            onUpdate: function () {
              waveCells.forEach((cell) => {
                const text = cell.querySelector(".cellText");
                if (text) {
                  gsap.set(text, { scale: 1 });
                }
              });
            },
          });
        }, dist * 120);
      }
    }
  };

  const animateEntireGrid = (row: number, col: number) => {
    const cells: HTMLDivElement[] = Array.from(
      document.querySelectorAll(".cell")
    );

    for (let dist = 1; dist <= 16; dist++) {
      const waveCells = cells.filter((cell) => {
        const r = Number(cell.getAttribute("data-row"));
        const c = Number(cell.getAttribute("data-col"));
        return Math.abs(r - row) + Math.abs(c - col) === dist;
      });
      if (waveCells.length > 0) {
        setTimeout(() => {
          const originalBgs = waveCells.map(
            (cell) => window.getComputedStyle(cell).backgroundColor
          );
          const originalClr = waveCells.map(
            (cell) => window.getComputedStyle(cell).color
          );
          const tl = gsap.timeline({
            onComplete: () => {
              gsap.set(waveCells, { clearProps: "all" });
              gsap.delayedCall(5, () => {
                setIsComplete(true);
              });
            },
          });
          tl.to(waveCells, {
            scale: 0.6,
            borderRadius: "25%",
            backgroundColor: "var(--primary)",
            color: "var(--background)",
            duration: 0.4,
            ease: "power1.inOut",
            onUpdate: function () {
              waveCells.forEach((cell) => {
                const text = cell.querySelector(".cellText");
                if (text) {
                  const parentScale = gsap.getProperty(cell, "scale") as number;
                  gsap.set(text, { scale: 1 / (parentScale || 1) });
                }
              });
            },
          });
          tl.to(waveCells, {
            scale: 1,
            borderRadius: "0%",
            backgroundColor: originalBgs,
            color: originalClr,
            duration: 0.4,
            ease: "power1.inOut",
            onUpdate: function () {
              waveCells.forEach((cell) => {
                const text = cell.querySelector(".cellText");
                if (text) {
                  gsap.set(text, { scale: 1 });
                }
              });
            },
          });
        }, dist * 120);
      }
    }
  };

  const setPuzzleGridValue = (newValue: number, ri: number, ci: number) => {
    const newGrid = puzzleGrid.map((row, rowIdx) =>
      rowIdx === ri
        ? row.map((cell, colIdx) => (colIdx === ci ? newValue : cell))
        : row
    );
    setPuzzleGrid(newGrid);
    setCurrentPuzzleGrid(newGrid); // Add this line to update the parent state
  };

  const recordMove = (num: number, ri: number, ci: number) => {
    const prevValue = puzzleGrid[ri][ci];
    const prevScore = score;
    if (prevValue !== num) {
      const move: UndoMove = {
        ri: ri,
        ci: ci,
        prevScore: prevScore,
        prevValue: prevValue,
        newValue: num,
      };
      setUndoHistory((prev) => [...prev, move]);
    }
  };

  const handleNumberInput = (
    num: number,
    cell: number[],
    div: HTMLDivElement,
    ri: number,
    ci: number
  ) => {
    if (cell) {
      const newGrid = puzzleGrid.map((row, rowIdx) =>
        rowIdx === ri
          ? row.map((cell, colIdx) => (colIdx === ci ? num : cell))
          : row
      );

      if (
        document.getElementsByClassName(`[${ri}][${ci}]`)[0].id ===
          "uneditable" &&
        puzzleGrid[ri][ci] === 0
      ) {
        document.getElementsByClassName(`[${ri}][${ci}]`)[0].id = "editable";
      }

      if (div && div.id === "editable") {
        recordMove(num, ri, ci);
        setPuzzleGridValue(num, ri, ci);

        if (solutionGrid[ri][ci] === num) {
          const isRowComplete = newGrid[ri].every((cell) => cell !== 0);
          const isColComplete = newGrid.every((row) => row[ci] !== 0);
          const startRow = Math.floor(ri / 3) * 3;
          const startCol = Math.floor(ci / 3) * 3;
          const isSubgridComplete = [0, 1, 2].every((r) =>
            [0, 1, 2].every((c) => newGrid[startRow + r][startCol + c] !== 0)
          );
          const isPuzzleDone = newGrid.every((row) =>
            row.every((cell) => cell !== 0)
          );
          document.getElementsByClassName(`[${ri}][${ci}]`)[0].id =
            "uneditable";
          setShowScore(true);

          if (level === "Easy") {
            setScore((prev: number) => prev + 120);
          } else if (level === "Medium") {
            setScore((prev: number) => prev + 240);
          } else if (level === "Hard") {
            setScore((prev: number) => prev + 360);
          } else if (level === "Expert") {
            setScore((prev: number) => prev + 480);
          }

          setGlobalPuzzleGrid(newGrid);

          if (isPuzzleDone) {
            animateEntireGrid(ri, ci);
          } else {
            if (isRowComplete) {
              animatedRowNeighbours(ri, ci);
            }
            if (isColComplete) {
              animatedColNeighbours(ri, ci);
            }
            if (isSubgridComplete) {
              animateSubgridNeighbours(ri, ci);
            }
          }
          setTimeout(() => {
            setShowScore(false);
          }, 1000);

          if (settings.lighteningMode) {
            const isNumberComplete =
              newGrid.flat().filter((cellVal) => cellVal === num).length === 9;

            if (isNumberComplete) {
              for (let i = 1; i <= 9; i++) {
                if (
                  newGrid.flat().filter((cellVal) => cellVal === i).length < 9
                ) {
                  setSelectedCell(null);
                  setNumberToEnter(i);
                  break;
                }
              }
            } else {
              setNumberToEnter(num);
            }
          }
        } else {
          setMistakes((prev) => (prev + 1) as Mistakes);
          setNumberToEnter(num);
        }
      }
    }
  };

  function handleHighlight(ri: number, ci: number): string {
    if (selectedCell) {
      const [selectedRi, selectedCi] = selectedCell;
      if (ri === selectedRi && ci === selectedCi) {
        return "bg-primary !text-background";
      }
    }

    if (
      settings.lighteningMode &&
      numberToEnter !== null &&
      puzzleGrid[ri][ci] === numberToEnter &&
      puzzleGrid[ri][ci] !== 0
    ) {
      return "bg-primary/60 text-secondary";
    }

    if (selectedCell) {
      const [selectedRi, selectedCi] = selectedCell;

      const selectedNumber = puzzleGrid[selectedRi][selectedCi];
      if (
        !settings.lighteningMode &&
        settings.highlightSameNumber &&
        selectedNumber !== 0 &&
        puzzleGrid[ri][ci] === selectedNumber
      ) {
        return "bg-primary/60 text-secondary";
      }

      const isInSameRow = ri === selectedRi;
      const isInSameCol = ci === selectedCi;
      const isInSameSubgrid =
        Math.floor(ri / 3) === Math.floor(selectedRi / 3) &&
        Math.floor(ci / 3) === Math.floor(selectedCi / 3);

      if (
        (isInSameRow || isInSameCol || isInSameSubgrid) &&
        settings.highlightPeers
      ) {
        return "bg-slate-300";
      }
    }

    return "bg-background";
  }

  const handleUndo = () => {
    if (undoHistory.length > 0) {
      const lastMove = undoHistory[undoHistory.length - 1];
      setPuzzleGridValue(lastMove.prevValue, lastMove.ri, lastMove.ci);
      setUndoHistory((prev) => prev.slice(0, -1));
      setScore(lastMove.prevScore);
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

  const handleHint = () => {
    if (hints > 0) {
      if (selectedCell && selectedDiv && selectedDiv?.id === "editable") {
        recordMove(
          solutionGrid[selectedCell[0]][selectedCell[1]],
          selectedCell[0],
          selectedCell[1]
        );
        setPuzzleGridValue(
          solutionGrid[selectedCell[0]][selectedCell[1]],
          selectedCell[0],
          selectedCell[1]
        );
      }
      setHints((prev: Hints) => (prev - 1) as Hints);
    }
  };

  return (
    <div className="flex flex-row">
      <div className="flex flex-col mr-2.75">
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
        <div className="relative flex flex-col place-items-center">
          {level !== "None" ? (
            <div className="absolute -top-1.5 left-8.5 h-5 w-5 rounded-full bg-primary font-sans text-xs text-background text-center leading-none pt-1">
              {hints}
            </div>
          ) : (
            ""
          )}
          <div
            className="grid w-12.5 h-12.5 bg-secondary hover:bg-secondary/75 rounded-full"
            style={{ cursor: "pointer" }}
            onClick={handleHint}
          >
            <Image
              src={`/hint-light.svg`}
              alt="Hint Icon"
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
                const [ri, ci] = gridMap[`${i},${j}`];
                const isEditable = initialPuzzleGrid[ri][ci] === 0;
                const isMistake =
                  puzzleGrid[ri][ci] !== 0 &&
                  solutionGrid[ri][ci] !== puzzleGrid[ri][ci];
                const isSelected =
                  selectedCell?.[0] === ri && selectedCell?.[1] === ci;
                return (
                  <div
                    id={isEditable ? "editable" : "uneditable"}
                    data-row={ri}
                    data-col={ci}
                    key={`[${ri}][${ci}]`}
                    className={`[${ri}][${ci}] cell relative m-0 p-0 border-1 border-foreground h-10 w-10.25 font-inter text-2xl/0 text-center leading-none pt-1.5 
                      ${
                        isEditable
                          ? " text-primary "
                          : isSelected
                          ? "text-background"
                          : "text-foreground"
                      }
                      ${handleHighlight(ri, ci)} 
                      ${isEditable && isMistake ? " !text-red-600 " : ""} `}
                    onClick={(e) => {
                      if (level !== "None") {
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

                        if (settings.lighteningMode) {
                          setNumberToEnter(puzzleGrid[ri][ci]);
                        }

                        if (
                          settings.lighteningMode &&
                          numberToEnter !== null &&
                          isEditable
                        ) {
                          console.log("Cell: ", cell);
                          console.log("Div: ", div);
                          console.log(
                            "input click. numberToEnter given: ",
                            numberToEnter
                          );
                          handleNumberInput(numberToEnter, cell, div, ri, ci);
                        }
                      }
                    }}
                  >
                    {" "}
                    <span className="cellText">
                      {puzzleGrid[ri][ci] === 0 ? " " : puzzleGrid[ri][ci]}
                      {showScore && isSelected && (
                        <span ref={scoreRef} className="score scoreStyle">
                          {level === "Easy"
                            ? "+120"
                            : level === "Medium"
                            ? "+240"
                            : level === "Hard"
                            ? "+360"
                            : level === "Expert"
                            ? "+480"
                            : ""}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex flex-row mt-5.5 gap-2.5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            const remaining =
              9 - puzzleGrid.flat().filter((cell) => cell === num).length;

            return (
              <Button
                key={num}
                className={`flex flex-col gap-0 h-10.75 w-8.25 ${
                  settings.lighteningMode &&
                  numberToEnter !== null &&
                  num === numberToEnter
                    ? "bg-primary text-background [&>span]:text-foreground"
                    : "bg-secondary text-foreground"
                }  hover:bg-primary hover:text-background hover:[&>span]:text-foreground rounded-lg font-inter text-2xl/0 leading-none pt-1.5`}
                onClick={() => {
                  if (!settings.lighteningMode && selectedCell && selectedDiv) {
                    handleNumberInput(
                      num,
                      selectedCell,
                      selectedDiv,
                      selectedCell?.[0],
                      selectedCell?.[1]
                    );
                  } else {
                    setSelectedCell(null);
                    setNumberToEnter(num);
                  }
                }}
                disabled={level === "None" || remaining === 0}
              >
                {num}
                {level !== "None" ? (
                  <span className="font-sans text-xs text-primary pt-0.1">
                    {remaining !== 0 ? remaining : ""}
                  </span>
                ) : (
                  ""
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SudokuGrid;
