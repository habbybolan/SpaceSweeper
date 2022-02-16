// Copyright (C) Nicholas johnson 2022
'use strict'

import Cell from "./Cell.js";
import { CellState } from "./Cell.js"

export default class Minefield {

    constructor( difficulty ) {

        this.setBoardSize(difficulty)
        
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
    * Called from constructor to set the board size and number of mines based in difficulty 
    * param difficulty  The difficulty of the game
    */
    setBoardSize(difficulty)
    {
        // easy difficulty
        if (difficulty == 0) {
            this._numRows = 10;
            this._numCols = 10;
            this._numMines = 10;
        // medium difficulty 
        } else if (difficulty == 1) {
            this._numRows = 16;
            this._numCols = 16;
            this._numMines = 40;
        // hardest difficulty
        } else {
            this._numRows = 16;
            this._numCols = 30;
            this._numMines = 99;
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
            // dont set first selected cell as a mine, an already selected mine, or its adjacent cells
            if (this.field[randRow][randCol].isMine ||
                (selectedCell.col == randCol && Math.abs(selectedCell.row - randRow) < 2)  ||
                (selectedCell.row == randRow && Math.abs(selectedCell.col - randCol) < 2) ||
                (Math.abs(selectedCell.row - randRow) == 1 && Math.abs(selectedCell.col - randCol) == 1)) continue;
            // set as mine
            this.field[randRow][randCol].isMine = true;
            this.incrementAdjacentMineCount(randRow, randCol);
            tempNumMines--;
        }
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
                if (cell.state == CellState[1]) numFlagsUncovered++;
                numCellsUncovered++;
                cell.state = CellState[2];

                // if the cell has no adjacent mines, then push children to stack if not mines and unselected
                if (this.field[row][col].numAdjacentMines == 0) {
                    // Up cell
                    if (cell.row > 0 && !this.field[row-1][col].isMine && this.field[row-1][col].state != CellState[2]) 
                        stack.push(this.field[row-1][col]);
                    // down cell
                    if (cell.row < this.numRows-1 && !this.field[row+1][col].isMine && this.field[row+1][col].state != CellState[2]) 
                        stack.push(this.field[row+1][col]);
                    // left cell
                    if (cell.col > 0 && !this.field[row][col-1].isMine && this.field[row][col-1].state != CellState[2]) 
                        stack.push(this.field[row][col-1]);
                    // right cell
                    if (cell.col < this.numCols-1 && !this.field[row][col+1].isMine && this.field[row][col+1].state != CellState[2])
                        stack.push(this.field[row][col+1]);
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