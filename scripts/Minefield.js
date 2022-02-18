// Copyright (C) Nicholas johnson 2022
'use strict'

import Cell from "./Cell.js";
import { CellState } from "./Cell.js"

export default class Minefield {

    constructor( numRows, numCols, numMines ) {

        this._numRows = 1 * numRows;
        this._numCols = 1 * numCols;
        this._numMines = 1 * numMines;
        
        this.field = []; // holds all mines in the minefield
        for (let i = 0; i < this._numRows; i++) {
            // create each row inside the minefield
            let row = [];
            for (let j = 0; j < this._numCols; j++) {
                row[j] = new Cell(i, j);
            }
            this.field[i] = row;
        }
    }

    /*
    * Place mines randomly, not placing it on selectedSell
    * param selectedCell    The first cell selected by player
    */
    randomize(selectedCell) {
        let tempNumMines = this.numMines;
        // loop over until a place for each mine is found
        while (tempNumMines > 0) {
            let randRow = Math.floor(Math.random() * this.numRows);
            let randCol = Math.floor(Math.random() * this.numCols);
            
            // increment the randRow and randCol until a valid mine cell is found
            while (true) {
                // dont set first selected cell as a mine, an already selected mine, or its adjacent cells
                // if valid cell location
                if (this.isValidMineLocation(randRow, randCol, selectedCell)) {
                        this.field[randRow][randCol].isMine = true;
                        this.incrementAdjacentMineCount(randRow, randCol);
                        tempNumMines--;
                        break;
                } else {
                    // If not at the end of the row, goto next cell
                    if (randCol < this._numCols - 1)  {
                        randCol++;
                    }
                    // if at end of row but not end of minefield, goto next row
                    else if (randRow < this._numRows - 1) {
                        randCol = 0;
                        randRow++;
                    }
                    // Otherwise loop back to beginning at 0,0
                    else {
                        randCol = 0;
                        randRow = 0;
                    }
                }
            }
        }
    }

    /**
     * Check if the row, col is a valid mine location
     * dont set first selected cell as a mine, an already selected mine, or its adjacent cells
     * @param {int} randRow         Row to check if valid mine location
     * @param {int} randCol         col to check if valid mine location
     * @param {int} selectedCell    The cell the user selected
     * @returns                     True if row, col is a valid mine location
     */
    isValidMineLocation(randRow, randCol, selectedCell) {
        return (!this.field[randRow][randCol].isMine &&
        !(selectedCell.col == randCol && Math.abs(selectedCell.row - randRow) < 2)  &&
        !(selectedCell.row == randRow && Math.abs(selectedCell.col - randCol) < 2) &&
        !(Math.abs(selectedCell.row - randRow) == 1 && Math.abs(selectedCell.col - randCol) == 1));
    }

    /* Increment all cells 's mine count around the mine places
    * param row     Row the mine was placed at
    * param col     Col the mine was placed at
    */ 
    incrementAdjacentMineCount(row, col) {
        // cells above
        if (row > 0) {
            // cell down
            if (this.field[row-1][col].incrNumAdjacentMines());
            // cell down, left
            if (col > 0) this.field[row-1][col-1].incrNumAdjacentMines(); 
            // cell down, right
            if (col < this.numCols - 1)this.field[row-1][col+1].incrNumAdjacentMines();
        }
        // cells below
        if (row < this.numRows - 1) {
            // cell up
            this.field[row+1][col].incrNumAdjacentMines();
            // cell up, left
            if (col > 0) this.field[row+1][col-1].incrNumAdjacentMines();
            // cel up, right
            if (col < this.numCols-1) this.field[row+1][col+1].incrNumAdjacentMines();
        }
        // cell right
        if (col > 0) this.field[row][col-1].incrNumAdjacentMines();
        // cell left
        if (col < this.numCols-1) this.field[row][col+1].incrNumAdjacentMines();
    }

    /*
    * Uncovers all cells, starting from row, col, that have no mines adjacent or a single one using DFS.
    * Continues to uncover if cell has no mines adjacent
    * param row     row to start at
    * param col     col to start at
    * returns       The number of flags it uncovered and all the cells that were uncovered
    */
    uncoverCells(row, col) {
        let stack = [];                     // stack holding all valid, adjacent cells to uncover
        let numFlagsUncovered = 0;          // number of flags uncovered, to swap to selected state 
        let numCellsUncovered = 0;          // number of cells that were uncovered
        stack.push(this.field[row][col]);   // start with first selected cell

        // pop cell off stack, and push its adjacent tiles to stack if not a mine
        while (stack.length != 0) {
            let cell = stack.pop();
            row = cell.row;
            col = cell.col;

            // if not a mine, then display number adjacent mines and pop adjacent to stack
            if (!cell.isMine && cell.state != CellState[2]) {

                // keep track of number of flags and cells uncovered
                if (cell.state == CellState[1]) 
                    numFlagsUncovered++;
                numCellsUncovered++;
                cell.state = CellState[2];

                // if the cell has no adjacent mines, then push children to stack if not mines and unselected
                if (this.field[row][col].numAdjacentMines == 0) {
                    // loop through all adjacent cell possibilities
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            // push to stack if valid cell to uncover
                            if (this.field[row+i] && this.field[row+i][col+j]) {
                                if (!this.field[row+i][col+j].isMine && this.field[row+i][col+j].state != CellState[2])
                                    stack.push(this.field[row+i][col+j]);
                            }
                        }
                    }
                }
            }
        }
        // flags and overall cells uncovered
        return {numFlagsUncovered, numCellsUncovered};
    }

    getCell( row, col ) {
        return this.field[row][col];
    }

    get numRows()
    {
        return this._numRows;
    }

    get numCols()
    {
        return this._numCols;
    }

    get numMines() {
        return this._numMines;
    }
}