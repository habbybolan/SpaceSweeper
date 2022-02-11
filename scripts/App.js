// Copyright (C) Nicholas johnson 2022
'use strict'

import Minefield from "./Minefield.js";
import { CellState } from "./Cell.js"

export default class App {

    constructor(difficulty) {
        this.minefield = new Minefield(0);                      // create minefield
        this.numFlagsRemaining = this.minefield.numMines;       // Number of flags remaining
        this.difficulty = difficulty;                           // The difficulty of the game, regarding size of board and number of mines
        this.isFirstSelected = false;                           // If the player has done their first selected

        this.mySound = new buzz.sound("../sound/hit.mp3");

        // Create the minefield HTML
        document.querySelector("#mine-table").innerHTML = this.generateMarkupRows();
        this.updateFlagsRemaining();
        // Set up event handlers to wait for user input
        this.initEventHandlers()
    }


    run() {}

    flagEvent = (event) => {
        event.preventDefault();
        let elClicked = event.target;
        let row = 1 * elClicked.getAttribute("data-row");
        let col = 1 * elClicked.getAttribute("data-col");
        
        let cell = this.minefield.getCell( row, col );
        // if the cell is not selected yet
        if (cell.state == CellState[0]) {
            // add flag
            elClicked.classList.remove("not-selected")
            elClicked.classList.add("flag");
            cell.state = CellState[1];
            this.numFlagsRemaining--;
        // if the cell has a flag
        } else if (cell.state == CellState[1]) {
            // remove flag
            elClicked.classList.remove("flag");
            elClicked.classList.add("not-selected");
            cell.state = CellState[0]
            this.numFlagsRemaining++;
        }   
        this.updateFlagsRemaining();
    }

    updateFlagsRemaining() {
        document.querySelector("#score-text").innerHTML = `<span>${this.numFlagsRemaining}</span>`;
    }

    selectCellEvent = (event) => {
        event.preventDefault();
        this.mySound.play();
        let elClicked = event.target;
        let row = 1 * elClicked.getAttribute("data-row");
        let col = 1 * elClicked.getAttribute("data-col");
        let cell = this.minefield.getCell( row, col );
        // only interact if cell not selected
        if (cell.state == CellState[0]) {
            if (!this.isFirstSelected) this.minefield.randomize(cell);
            this.isFirstSelected = true;
            // if mine hit
            if (cell.isMine) {
                this.loseGame();
            }   
            else {
                this.minefield.uncoverCells(row, col);
            }
        }
    }

    initEventHandlers() {
        // When the user right clicks
        document.querySelector("#mine-table")
        .addEventListener("contextmenu", this.flagEvent);

        document.querySelector("#mine-table")
        .addEventListener("click", this.selectCellEvent);
    }

    loseGame() {
        document.querySelector("#mine-table").removeEventListener("click", this.selectCellEvent);
        document.querySelector("#mine-table").removeEventListener("contextmenu", this.flagEvent);
        this.displayAllMines();
        // TODO: 
    }

    displayAllMines() {
        for (let i = 0; i < this.minefield.numRows; i++) {
            for (let j = 0; j < this.minefield.numCols; j++) {
                if (this.minefield.field[i][j].isMine) {
                    document.querySelector(`#cell-${i}${j}`).classList.remove("not-selected");
                    document.querySelector(`#cell-${i}${j}`).classList.add("bomb");
                }
            }
        }
    }

    // All the Rows
    generateMarkupRows() {

        let markup = "";
        for (let i = 0; i < this.minefield.numRows; i++) {

            markup += `<div class="mine-row game-container"> `;
            for (let j = 0; j < this.minefield.numCols; j++) {
                markup += `<div class="cell not-selected" id="cell-${i}${j}" data-row="${i}" data-col="${j}"></div>`;
            }
            markup += `</div>`;
        }
        return markup
    }
}