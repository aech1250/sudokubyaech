"use client";

import { gridMap } from "@/lib/classicMethods";

type MiniGrid = number[][];

type MiniGridProps = {
  globalPuzzleGrid: number[][];
  solutionGrid: number[][];
  puzzleGrid: number[][];
};

const MiniGrid: React.FC<MiniGridProps> = ({
  globalPuzzleGrid,
  solutionGrid,
  puzzleGrid,
}) => {
  console.log("GlobalPuzzleGrid: ", globalPuzzleGrid);
  console.log("SolutionGrid: ", solutionGrid);
  console.log("PuzzleGrid: ", puzzleGrid);
  return (
    <div className="h-60 w-60 bg-background rounded-xl flex items-center justify-center">
      <div className="m-0 p-0 grid grid-cols-3 grid-rows-3 h-55 w-55 bg-background border-2 border-foreground gap-0">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, i) => (
          <div
            key={i}
            className="m-0 p-0 grid grid-cols-3 grid-rows-3 h-18 w-18 border-1 border-foreground gap-0"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, j) => {
              const [ri, ci] = gridMap[`${i},${j}`];
              const isEditable = globalPuzzleGrid[ri][ci] === 0;
              const isMistake =
                puzzleGrid[ri][ci] !== 0 &&
                solutionGrid[ri][ci] !== puzzleGrid[ri][ci];
              return (
                <div
                  key={`[${ri}][${ci}]`}
                  className={`[${ri}][${ci}] cell relative m-0 p-0 border-1 border-foreground h-5.8 w-5.8 font-inter text-sm/0 text-center leading-none pt-1
                             ${isEditable ? "text-primary" : "text-foreground"} 
                             ${
                               isEditable && isMistake ? " !text-red-600 " : ""
                             } `}
                >
                  {" "}
                  <span className="cellText">
                    {puzzleGrid[ri][ci] === 0 ? " " : puzzleGrid[ri][ci]}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniGrid;
