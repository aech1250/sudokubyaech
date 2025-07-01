import React, { Dispatch, SetStateAction } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { PopoverArrow } from "@radix-ui/react-popover";
import Image from "next/image";

type Level = "Expert" | "Hard" | "Medium" | "Easy" | "None";
type TimeOjb = { hour: number; minute: number; second: number };

type PlayGameProps = {
  playMenuOpen: boolean;
  setPlayMenuOpen: Dispatch<SetStateAction<boolean>>;
  setLevel: Dispatch<SetStateAction<Level>>;
  setRe_Render: Dispatch<SetStateAction<number>>;
  isVictoryScreen: boolean;
  setIsComplete: Dispatch<SetStateAction<boolean | null>>;
  setScore: Dispatch<SetStateAction<number>>;
  setTime: Dispatch<SetStateAction<number>>;
  setTimeObj: Dispatch<SetStateAction<TimeOjb>>;
};

const PlayGame = ({
  playMenuOpen,
  setPlayMenuOpen,
  setLevel,
  setRe_Render,
  isVictoryScreen,
  setIsComplete,
  setScore,
  setTime,
  setTimeObj,
}: PlayGameProps) => {
  const handleMenuItemClick = (level: Level) => {
    setLevel(level);
    setRe_Render((prev) => prev + 1);
    setPlayMenuOpen((prev) => !prev);
    setIsComplete(false);
    setScore(0);
    setTime(0);
    setTimeObj({ hour: 0, minute: 0, second: 0 });
  };

  return (
    <Popover
      open={playMenuOpen}
      onOpenChange={() => setPlayMenuOpen((prev) => !prev)}
    >
      <PopoverTrigger asChild>
        <Button
          className={`px-20.25 pt-5.5 pb-6.75 font-display font-extralight ${
            isVictoryScreen
              ? "bg-background hover:bg-background"
              : "bg-primary hover:bg-primary"
          } ${
            isVictoryScreen
              ? "text-primary hover:text-primary"
              : "text-background hover:text-background"
          } text-2xl`}
          onClick={() => {}}
        >
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
            onClick={() => handleMenuItemClick("Easy")}
          >
            <Image
              src={"/sudoku-active.svg"}
              alt="Sudoku Icon"
              width={24}
              height={24}
              className="my-auto ml-2 mr-2.5 !w-8.25 !h-7"
              priority
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
            onClick={() => handleMenuItemClick("Medium")}
          >
            <Image
              src={"/sudoku-active.svg"}
              alt="Sudoku Icon"
              width={24}
              height={24}
              className="my-auto ml-2 mr-2.5 !w-8.25 !h-7"
              priority
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
            onClick={() => handleMenuItemClick("Hard")}
          >
            <Image
              src={"/sudoku-active.svg"}
              alt="Sudoku Icon"
              width={24}
              height={24}
              className="my-auto ml-2 mr-2.5 !w-8.25 !h-7"
              priority
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
            onClick={() => handleMenuItemClick("Expert")}
          >
            <Image
              src={"/sudoku-active.svg"}
              alt="Sudoku Icon"
              width={24}
              height={24}
              className="my-auto ml-2 mr-2.5 !w-8.25 !h-7"
              priority
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
  );
};

export default PlayGame;
