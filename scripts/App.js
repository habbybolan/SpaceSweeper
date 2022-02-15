// Copyright (C) Nicholas johnson 2022
'use strict'

import Minefield from "./Minefield.js";
import Cell, { CellState } from "./Cell.js"

export default class App {

    constructor() {
        this.mySound = new buzz.sound("../sound/hit.mp3");      // Sound played when hitting a mine
    }

    run() {
        // Set up event handlers to wait for user input
        this.initEventHandlers()
    }
    
    initEventHandlers() {

        // Create new game and set up Minefield click events
        document.querySelector("#new-game-button")
        .addEventListener('click', this.NewGameEvent);

        // Start a game from the main menu
        document.querySelector("#play-button")
        .addEventListener('click', this.PlayGameEvent);

        document.querySelector("#menu-button")
        .addEventListener('click', this.BackToMenuEvent);
    }

    /*
    * Event to start the game from the main menu
    */
    PlayGameEvent = () => {
        document.querySelector('#main-menu-page').classList.remove("show");
        document.querySelector('#main-menu-page').classList.add("hide");
        document.querySelector('#main-game-page').classList.add("show");
        this.NewGameEvent();
    }

    /*
    * Event to go back to main menu
    */
    BackToMenuEvent = () => {
        document.querySelector('#main-game-page').classList.remove("show");
        document.querySelector('#main-game-page').classList.add("hide");
        document.querySelector('#main-menu-page').classList.add("show");
    }
    
    // Creates a new game and (re-)initializes ability to click minefield cells.
    NewGameEvent = () => {

        // When the user right clicks a cell
        document.querySelector("#mine-table")
        .addEventListener("contextmenu", this.flagEvent);
        // when the user left clicks a cell
        document.querySelector("#mine-table")
        .addEventListener("click", this.selectCellEvent);

        this.createNewMinefield();
    }

    /*
    * Creates a new Minefield and sets all beginning values.
    */
    createNewMinefield() {
        this.minefield = new Minefield(document.querySelector('#difficulty-selection').value);  // create minefield
        this.numFlagsRemaining = this.minefield.numMines;                                       // Number of flags remaining                         
        this.isFirstSelected = false;                                                           // If the player has done their first selected
        this.numCellsSelected = 0;                                                              // Number of cells currently uncovered

        // update the flag counter html
        this.updateFlagsRemaining();

        // Create the minefield HTML
        document.querySelector("#mine-table").innerHTML = this.generateMarkupRows();
    }
    
    /*
    * Event for right clickng on an unselected, or flagged cell
    * Places a flag / removed a flag from the cell, depending if there was a flag already.
    */
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

    /*
    * Updates the remaining number of flags on screen.
    */
    updateFlagsRemaining() {
        document.querySelector("#score-text").innerHTML = `<span>${this.numFlagsRemaining}</span>`;
    }

    /*
    * Event for left clicking on an unselected cell.
    * Checks if it was a mine or not, and if you lose, won, or game not over yet.
    */
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
            // if mine hit, lose
            if (cell.isMine) {
                this.loseGame();
            }   
            // otherwise, non-mine left clicked
            else {
                // uncover all cells adjacent that are not mines
                let uncoverObj = this.minefield.uncoverCells(row, col);
                this.numFlagsRemaining += uncoverObj.numFlagsUncovered;
                this.numCellsSelected += uncoverObj.numCellsUncovered;
                // update entire minefield
                this.updateMinefield();
                // update the remaining flags if flagged cells were swapped to selected
                this.updateFlagsRemaining();
                // if the number of selected cells equals number of non-mines, win
                if ((this.minefield.numCols * this.minefield.numRows) - this.minefield.numMines == this.numCellsSelected) {
                    this.winGame();
                }
            }
        }
    }

    /*
    * Performs a full visual update on the minefield give the cell's current states
    */
    updateMinefield() {
        for (let i = 0; i < this.minefield.numRows; i++) {
            for (let j = 0; j < this.minefield.numCols; j++) {
                let cell = this.minefield.field[i][j];
                if (cell.state == CellState[0]) {
                    this.resetCellState(document.querySelector(`#cell-${i}-${j}`), cell);
                } else if (cell.state == CellState[1]) {
                    this.resetCellState(document.querySelector(`#cell-${i}-${j}`), cell);
                } else {
                    this.resetCellState(document.querySelector(`#cell-${i}-${j}`), cell);
                }
            }
        }
    }

    /*
    * Update the cell's class and adjacent mines number visually
    */
    resetCellState(element, cell) {
        element.classList.remove("not-selected");
        element.classList.remove("flag");
        element.classList.remove("empty");
        if (cell.state == CellState[0]) {
            element.classList.add("not-selected");
        } else if (cell.state == CellState[1]) {
            element.classList.add("flag");
        } else {
            element.classList.add("empty");
            document.querySelector(`#cell-${cell.row}-${cell.col}`).innerHTML = cell.numAdjacentMines;
        }
    }

    /*
    * Goto lose screen.
    */ 
    loseGame() {
        document.querySelector("#mine-table").removeEventListener("click", this.selectCellEvent);
        document.querySelector("#mine-table").removeEventListener("contextmenu", this.flagEvent);
        this.displayAllMines();
        console.log("You lose");
        // TODO: goto lose screen 
    }

    /*
    * Goto win screen
    */
    winGame() {
        // goto win screen
        document.querySelector("#mine-table").removeEventListener("click", this.selectCellEvent);
        document.querySelector("#mine-table").removeEventListener("contextmenu", this.flagEvent);
        console.log("You win");
    }

    /* Display all mines on the board.
    * Called after losing the game.
    */
    displayAllMines() {
        for (let i = 0; i < this.minefield.numRows; i++) {
            for (let j = 0; j < this.minefield.numCols; j++) {
                if (this.minefield.field[i][j].isMine) {
                    document.querySelector(`#cell-${i}-${j}`).classList.remove("not-selected");
                    document.querySelector(`#cell-${i}-${j}`).classList.add("bomb");
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
                markup += `<div class="cell not-selected" id="cell-${i}-${j}" data-row="${i}" data-col="${j}"></div>`;
            }
            markup += `</div>`;
        }
        return markup
    }
}