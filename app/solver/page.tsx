"use client";

import SudokuGridForSolver from "@/components/SudokuGridForSolver";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { solve } from "@/lib/sudoku";
import { Toaster, toast } from "sonner";
import gsap from "gsap";

type SudokuGrid = number[][];

const Solver = () => {
  const [puzzleGrid, setPuzzleGrid] = useState<SudokuGrid>([
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
  const [disable, setDisable] = useState<boolean>(false);

  useEffect(() => {
    if (puzzleGrid.every((row) => row.every((cell) => cell !== 0))) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [puzzleGrid]);

  const solvePuzzleGrid = () => {
    setDisable(true);
    const board = puzzleGrid.map((row) => [...row]);

    const promise = new Promise<{ name: string }>((resolve, reject) => {
      setTimeout(() => {
        try {
          const solved = solve(board, 9);
          if (solved) {
            setDisable(false);
            resolve({ name: "Puzzle" });
          } else {
            setDisable(false);
            reject(new Error("Puzzle could not be solved."));
          }
        } catch (err) {
          reject(err);
        }
      }, 1000);
    });

    toast.promise(
      promise.then((payload) => {
        setPuzzleGrid(board);
        const tl = gsap.timeline();
        tl.fromTo(
          ".solverGrid",
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 1, ease: "power1.inOut" }
        );
        tl.fromTo(
          ".clear",
          { x: 1, y: -157.5, opacity: 0, scale: 0 },
          {
            x: 1,
            y: 1,
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power1.inOut",
          }
        );
        tl.fromTo(
          ".erase",
          { x: 1, y: -78, opacity: 0, scale: 0 },
          {
            x: 1,
            y: 1,
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power1.inOut",
          }
        );
        tl.fromTo(
          ".undo",
          { x: 1, y: 1, opacity: 0, scale: 0 },
          {
            x: 1,
            y: 1,
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power1.inOut",
          }
        );
        tl.fromTo(
          ".numbersBar",
          { x: 1, y: 1, opacity: 0, scale: 0 },
          {
            x: 1,
            y: 1,
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power1.inOut",
          }
        );
        return payload;
      }),
      {
        loading: "Solving…",
        success: (data) => `${data.name} has been solved`,
        error: (err) => err.message ?? "Couldn't solve.",
      }
    );
  };

  return (
    <div className="relative w-full h-screen grid place-items-center [&>section]:absolute [&>section]:inset-0 [&>section]:pointer-events-none [&>section]:z-50 ">
      <div className={"solverPage opacity-0"}>
        <h1 className="flex flex-row content-center mb-5.5 h-10 w-189 font-sans bg-secondary rounded text-[1.05rem]">
          <Image
            src={"/info-light.svg"}
            alt="Info Icon"
            width={24}
            height={24}
            className="my-auto ml-1 mr-2.5 !w-8.25 !h-7"
          />
          <span className="mt-[0.425rem]">
            The input should comply with the{" "}
            <Link
              href={"/rules"}
              className="text-primary underline underline-offset-2"
            >
              Sudoku Rules
            </Link>
          </span>
        </h1>
        <div className="solver flex flex-row">
          <SudokuGridForSolver
            puzzleGrid={puzzleGrid}
            setPuzzleGrid={setPuzzleGrid}
            disable={disable}
          ></SudokuGridForSolver>
          <Button
            className="ml-10.75 px-26.75 pt-5.75 pb-6.75 font-display font-extralight bg-primary text-background text-2xl"
            onClick={solvePuzzleGrid}
            disabled={disable}
          >
            Solve
          </Button>
        </div>
      </div>
      <Toaster richColors expand position="bottom-right"></Toaster>
    </div>
  );
};

export default Solver;
