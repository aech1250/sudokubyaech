"use client";

import SudokuGrid from "@/components/SudokuGrid";
import { useEffect, useMemo, useState } from "react";
import { createSudokuGrid } from "@/lib/sudoku";
import MiniGrid from "@/components/MiniGrid";
import PlayGame from "@/components/PlayGame";
import { Signal, Star, Timer } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Home() {
  const [level, setLevel] = useState<
    "Expert" | "Hard" | "Medium" | "Easy" | "None"
  >("None");
  const [mistakes, setMistakes] = useState<0 | 1 | 2 | 3>(0);
  const [hints, setHints] = useState<0 | 1 | 2 | 3>(0);
  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [timeObj, setTimeObj] = useState<{
    hour: number;
    minute: number;
    second: number;
  }>({ hour: 0, minute: 0, second: 0 });
  const [playMenuOpen, setPlayMenuOpen] = useState<boolean>(false);
  const [re_render, setRe_Render] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean | null>(null);
  const [isLose, setIsLose] = useState<boolean>();
  const [currentPuzzleGrid, setCurrentPuzzleGrid] = useState<SudokuGrid>([
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

  const { completeGrid: solutionGrid, board: globalPuzzleGrid } = useMemo(
    () => createSudokuGrid(level),
    [re_render]
  );

  useGSAP(() => {
    if (isComplete) {
      gsap.fromTo(
        ".victoryScreen",
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power1.inOut" }
      );
    } else if (isComplete === false) {
      gsap.fromTo(
        ".game",
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power1.inOut" }
      );
    }
  }, [isComplete]);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout> | undefined;

    if (level !== "None" && !isComplete) {
      id = setTimeout(() => setTime((prev) => prev + 1), 1000);
    }

    return () => clearTimeout(id);
  }, [time, level, isComplete]);

  useEffect(() => {
    if (level !== "None" && time !== 0) {
      const hour = Math.floor(time / 3600);
      const minute = Math.floor((time % 3600) / 60);
      const second = time % 60;
      setTimeObj({ hour, minute, second });
    }
  }, [time]);

  useEffect(() => {
    if (mistakes === 3) {
      setIsComplete(true);
      setIsLose(true);
    }
  }, [mistakes]);

  return (
    <div className="classicPage opacity-0 w-full h-screen grid place-items-center">
      <div>
        <h1 className="mb-5 pl-41.5 font-sans text-[1.45rem]">
          {isComplete ? (
            ""
          ) : (
            <span>
              Difficulty: <span className="text-primary">{level}</span>
            </span>
          )}
        </h1>
        {isComplete ? (
          <div
            className={`victoryScreen h-[435px] w-[754px] ${
              isLose ? "bg-red-700" : "bg-primary"
            } rounded-2xl relative`}
          >
            <div className="flex items-center justify-center h-full w-full relative overflow-hidden ">
              <div className="relative flex items-center justify-center h-full w-1/2">
                <div className="absolute inset-0 sunburst mix-blend-overlay pointer-events-none [mask-image:radial-gradient(circle,white_0%,transparent_80%)]"></div>
                <MiniGrid
                  globalPuzzleGrid={globalPuzzleGrid}
                  solutionGrid={solutionGrid}
                  puzzleGrid={currentPuzzleGrid}
                />
              </div>
              <div className="flex flex-col">
                <span className="mb-15 self-center font-sans font-bold text-white text-3xl">
                  {isLose ? "You Lose!" : "Victory"}
                </span>
                <div>
                  <span></span>
                  <div className="mb-6 px-2 bg-white/15 backdrop-blur-xs rounded-md border-white/20 shadow-md text-white font-sans font-bold">
                    <div className="flex flex-row py-2 leading-none">
                      <Signal size={24} />
                      <span className="pl-2 pt-1.25">Difficulty</span>
                      <span className="ml-auto pt-1.25">{level}</span>
                    </div>
                    <div className="flex flex-row py-2 leading-none">
                      <Timer size={24} />
                      <span className="pl-2 pt-1.25">Time</span>
                      <span className="ml-auto pt-1.25">{`${timeObj.hour
                        .toString()
                        .padStart(2, "0")}:${timeObj.minute
                        .toString()
                        .padStart(2, "0")}:${timeObj.second
                        .toString()
                        .padStart(2, "0")}`}</span>
                    </div>
                    <div className="flex flex-row py-2 leading-none">
                      <Star size={24} />
                      <span className="pl-2 pt-1.25">Score</span>
                      <span className="ml-auto pt-1.25">{score}</span>
                    </div>
                  </div>
                </div>
                <PlayGame
                  playMenuOpen={playMenuOpen}
                  setPlayMenuOpen={setPlayMenuOpen}
                  setLevel={setLevel}
                  setRe_Render={setRe_Render}
                  isVictoryScreen={true}
                  setIsComplete={setIsComplete}
                  setScore={setScore}
                  setTime={setTime}
                  setTimeObj={setTimeObj}
                  setHints={setHints}
                  setMistakes={setMistakes}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="game flex flex-row">
            <SudokuGrid
              solution={solutionGrid}
              puzzle={globalPuzzleGrid}
              score={score}
              setScore={setScore}
              setMistakes={setMistakes}
              setIsComplete={setIsComplete}
              level={level}
              hints={hints}
              setHints={setHints}
              mistakes={mistakes}
              setCurrentPuzzleGrid={setCurrentPuzzleGrid}
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
                    {`${timeObj.hour
                      .toString()
                      .padStart(2, "0")}:${timeObj.minute
                      .toString()
                      .padStart(2, "0")}:${timeObj.second
                      .toString()
                      .padStart(2, "0")}`}
                  </div>
                </div>
              </div>
              <PlayGame
                playMenuOpen={playMenuOpen}
                setPlayMenuOpen={setPlayMenuOpen}
                setLevel={setLevel}
                setRe_Render={setRe_Render}
                isVictoryScreen={false}
                setIsComplete={setIsComplete}
                setScore={setScore}
                setTime={setTime}
                setTimeObj={setTimeObj}
                setHints={setHints}
                setMistakes={setMistakes}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
