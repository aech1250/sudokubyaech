"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverArrow } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import SudokuGrid from "@/components/SudokuGrid";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { createSudokuGrid } from "@/lib/sudoku";

export default function Home() {
  const [level, setLevel] = useState<
    "Expert" | "Hard" | "Medium" | "Easy" | "None"
  >("None");
  const [mistakes, setMistakes] = useState<0 | 1 | 2 | 3>(0);
  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [timeObj, setTimeObj] = useState<{
    hour: number;
    minute: number;
    second: number;
  }>({ hour: 0, minute: 0, second: 0 });
  const [playMenuOpen, setPlayMenuOpen] = useState<boolean>(false);
  const [re_render, setRe_Render] = useState<number>(0);

  const { completeGrid: solutionGrid, board: puzzleGrid } = useMemo(
    () => createSudokuGrid(level),
    [level, re_render]
  );

  useEffect(() => {
    if (level !== "None") {
      setTimeout(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
  }, [time, level]);

  useEffect(() => {
    if (level !== "None" && time !== 0) {
      const hour = Math.floor(time / 3600);
      const minute = Math.floor((time % 3600) / 60);
      const second = time % 60;
      setTimeObj({ hour, minute, second });
    }
  }, [time]);

  return (
    <div className="w-full h-screen grid place-items-center">
      <div>
        <h1 className="mb-5 pl-41.5 font-sans text-[1.45rem]">
          Difficulty: <span className="text-primary">{level}</span>
        </h1>
        <div className="flex flex-row">
          <SudokuGrid
            solution={solutionGrid}
            puzzle={puzzleGrid}
            score={score}
            setScore={setScore}
            setMistakes={setMistakes}
          ></SudokuGrid>
          <div className="pl-10.75">
            <div className="flex flex-row justify-center text-center">
              <div className="py-6 pr-2 flex flex-col  gap-1.75 font-sans text-xl">
                <div>Mistake: </div>
                <div>Score: </div>
                <div>Time: </div>
              </div>
              <div className="py-6 w-23.75 flex flex-col  gap-1.75 font-sans text-xl">
                <div className="text-primary">{`${mistakes}/3`}</div>
                <div className="text-primary">
                  {score < 10
                    ? `000${score}`
                    : score < 100
                    ? `00${score}`
                    : score < 1000
                    ? `0${score}`
                    : score}
                </div>
                <div className="text-primary">
                  {`${timeObj.hour.toString().padStart(2, "0")}:${timeObj.minute
                    .toString()
                    .padStart(2, "0")}:${timeObj.second
                    .toString()
                    .padStart(2, "0")}`}
                </div>
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
                    onClick={() => {
                      setLevel("Easy");
                      setRe_Render((prev) => prev + 1);
                      setPlayMenuOpen((prev) => !prev);
                    }}
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
                    onClick={() => {
                      setLevel("Medium");
                      setRe_Render((prev) => prev + 1);
                      setPlayMenuOpen((prev) => !prev);
                    }}
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
                    onClick={() => {
                      setLevel("Hard");
                      setRe_Render((prev) => prev + 1);
                      setPlayMenuOpen((prev) => !prev);
                    }}
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
                    onClick={() => {
                      setLevel("Expert");
                      setRe_Render((prev) => prev + 1);
                      setPlayMenuOpen((prev) => !prev);
                    }}
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
