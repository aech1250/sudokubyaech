"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverArrow } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import SudokuGrid from "@/components/SudokuGrid";
import { useMemo, useState } from "react";
import Image from "next/image";
import { createSudokuGrid } from "@/lib/sudoku";

export default function Home() {
  const [level, setLevel] = useState<"Hard" | "Medium" | "Easy">("Easy");
  const [mistakes, setMistakes] = useState<"0/3">("0/3");
  const [score, setScore] = useState<"0000">("0000");
  const [time, setTime] = useState<"00:00:00">("00:00:00");
  const [playMenuOpen, setPlayMenuOpen] = useState<boolean>(false);

  const { completeGrid: solutionGrid, board: puzzleGrid } = useMemo(
    () => createSudokuGrid(level),
    [level]
  );

  return (
    <div className="w-full h-screen grid place-items-center">
      <div>
        <h1 className="mb-5 pl-41.5 font-sans text-[1.45rem]">
          Difficulty: <span className="text-primary">{level}</span>
        </h1>
        <div className="flex flex-row">
          <SudokuGrid solution={solutionGrid} puzzle={puzzleGrid}></SudokuGrid>
          <div className="pl-10.75">
            <div className="flex flex-row justify-center text-center gap-3">
              <div className="py-6 flex flex-col  gap-1.75 font-sans text-xl">
                <div>Mistake: </div>
                <div>Score: </div>
                <div>Time: </div>
              </div>
              <div className="py-6 flex flex-col  gap-1.75 font-sans text-xl">
                <div className="text-primary">{mistakes}</div>
                <div className="text-primary">{score}</div>
                <div className="text-primary">{time}</div>
              </div>
            </div>
            <Popover
              open={playMenuOpen}
              onOpenChange={() => setPlayMenuOpen((prev) => !prev)}
            >
              <PopoverTrigger asChild>
                <Button className="px-20.25 pt-5.5 pb-6.75 font-display font-extralight bg-primary text-background text-2xl">
                  Play Game
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="center"
                className="w-69 h-44.5 p-3 bg-secondary border-none"
              >
                <PopoverArrow className="text-secondary fill-current" />
                <div className="h-full w-full rounded bg-background">
                  <div
                    className="flex flex-row h-9.5 content-center border-b-1 border-foreground"
                    onClick={() => setPlayMenuOpen((prev) => !prev)}
                  >
                    <Image
                      src={"/sudoku-active.svg"}
                      alt="Sudoku Icon"
                      width={24}
                      height={24}
                      className="my-auto ml-2 mr-2.5 !w-8.25 !h-7"
                    />
                    <label
                      htmlFor="Easy"
                      className="font-inter text-md text-foreground leading-none pt-2.5"
                    >
                      Easy
                    </label>
                  </div>
                  <div
                    className="flex flex-row h-9.5 content-center border-b-1 border-foreground"
                    onClick={() => setPlayMenuOpen((prev) => !prev)}
                  >
                    <Image
                      src={"/sudoku-active.svg"}
                      alt="Sudoku Icon"
                      width={24}
                      height={24}
                      className="my-auto ml-2 mr-2.5 !w-8.25 !h-7"
                    />
                    <label
                      htmlFor="Medium"
                      className="font-inter text-md text-foreground leading-none pt-2.5"
                    >
                      Medium
                    </label>
                  </div>
                  <div
                    className="flex flex-row h-9.5 content-center border-b-1 border-foreground"
                    onClick={() => setPlayMenuOpen((prev) => !prev)}
                  >
                    <Image
                      src={"/sudoku-active.svg"}
                      alt="Sudoku Icon"
                      width={24}
                      height={24}
                      className="my-auto ml-2 mr-2.5 !w-8.25 !h-7"
                    />
                    <label
                      htmlFor="Hard"
                      className="font-inter text-md text-foreground leading-none pt-2.5"
                    >
                      Hard
                    </label>
                  </div>
                  <div
                    className="flex flex-row h-9.75 content-center"
                    onClick={() => setPlayMenuOpen((prev) => !prev)}
                  >
                    <Image
                      src={"/sudoku-active.svg"}
                      alt="Sudoku Icon"
                      width={24}
                      height={24}
                      className="my-auto ml-2 mr-2.5 !w-8.25 !h-7"
                    />
                    <label
                      htmlFor="Expert"
                      className="font-inter text-md text-foreground leading-none pt-2.5"
                    >
                      Expert
                    </label>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
