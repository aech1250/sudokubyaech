"use client";

import { gridMap } from "@/lib/classicMethods";

type MiniGrid = number[][];

type MiniGridProps = {
  solutionGrid: number[][];
  puzzleGrid: number[][];
};

const MiniGrid: React.FC<MiniGridProps> = ({ solutionGrid, puzzleGrid }) => {
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
              return (
                <div
                  key={`[${ri}][${ci}]`}
                  className={`[${ri}][${ci}] cell relative m-0 p-0 border-1 border-foreground h-5.8 w-5.8 font-inter text-sm/0 text-center leading-none pt-1
                             ${
                               puzzleGrid[ri][ci] === 0
                                 ? "text-primary"
                                 : "text-foreground"
                             } `}
                >
                  {" "}
                  <span className="cellText">
                    {solutionGrid[ri][ci] === 0 ? " " : solutionGrid[ri][ci]}
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
