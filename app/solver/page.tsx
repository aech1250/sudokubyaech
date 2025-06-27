import SudokuGrid from "@/components/SudokuGrid";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const solver = () => {
  return (
    <div className="w-full h-screen grid place-items-center">
      <div>
        <h1 className="flex flex-row content-center mb-5.5 h-10 w-full font-sans bg-secondary rounded text-[1.05rem]">
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
        <div className="flex flex-row">
          <SudokuGrid></SudokuGrid>
          <Button className="ml-10.75 px-26.75 pt-5.75 pb-6.75 font-display font-extralight bg-primary text-background text-2xl">
            Solve
          </Button>
        </div>
      </div>
    </div>
  );
};

export default solver;
