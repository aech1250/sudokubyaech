import React from "react";

const rules = () => {
  return (
    <div className="rulesPage w-full mt-31.5 pl-10.5 pr-10.5">
      <h1 className="font-sans font-bold mb-4 text-4xl">
        Basic Rules of Sudoku
      </h1>
      <div className="w-245 bg-secondary border rounded-sm">
        <ul className="pl-3.25 pr-9 py-1 gap-5.25 font-sans text-[1.35rem] list-disc list-inside">
          <li>Sudoku grid consists of 9x9 spaces.</li>
          <li>You can only use numbers from 1 to 9.</li>
          <li>Each 3x3 block can only contain numbers from 1 to 9.</li>
          <li>Each vertical column can only contain numbers from 1 to 9.</li>
          <li>Each horizontal column can only contain numbers from 1 to 9.</li>
          <li>
            Each number is the 3x3 block, vertical column or horizontal row can
            be used only once.
          </li>
          <li>
            The game is over when the whole Sudoku grid is correctly filled with
            numbers.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default rules;
