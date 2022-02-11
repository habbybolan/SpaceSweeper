// Copyright (C) Nicholas johnson 2022
'use strict'

export const CellState = ["NOT_SELECTED", "FLAGGED", "SELECTED"];

export default class Cell {

    constructor(row, col, isMine = false) {
        // initialize mine to not selected
        this._state = CellState[0];
        this._isMine = isMine; 
        this._row = row;            // row of mine
        this._col = col;            // col of mine
        this._numAdjacentMines = 0;
    }

    get state() {
        return this._state;
    }

    set state(state) {
        this._state = state;
    }

    get isMine() {
        return this._isMine;
    }
    set isMine(isMine) {
        return this._isMine = isMine;
    }
    
    get row() {
        return this._row;
    }
    get col() {
        return this._col;
    }
    get numAdjacentMines () {
        return this._numAdjacentMines;
    }
    
    incrNumAdjacentMines() {
        this._numAdjacentMines++;
    }
}