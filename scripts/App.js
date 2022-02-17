// Copyright (C) Nicholas johnson 2022
'use strict'

import Minefield from "./Minefield.js";
import Cell, { CellState } from "./Cell.js"

export default class App {

    constructor() {
        this.mySound = new buzz.sound("../sound/hit.mp3");      // Sound played when hitting a mine
        this.timeCurrGame = 0;                                  // Seconds of current length of minesweeper game
        this.bShowingInstructions = false;                       // If instructions on main menu being shown
    }

    run() {
        // Set up event handlers and minefield
        this.initMenuEventHandlers()
    }
    
    /**
     * Initialize menu event handlers
     */
    initMenuEventHandlers() {

        // Start a game from the main menu
        document.querySelector("#play-button")
            .addEventListener('click', this.PlayGameEvent);

        document.querySelector("#play-button")
            .addEventListener('mouseenter', event => {
                let elHovered = event.target;
                elHovered.classList.remove("play-button-static");
                elHovered.classList.add("play-button-animated");
            })

        document.querySelector("#play-button")
            .addEventListener('mouseleave', event => {
                let elUnhovered = event.target;
                elUnhovered.classList.add("play-button-static");
            })
        
        // display/i
        document.querySelector("#instruction-button")
            .addEventListener('click', event => {
                let elClicked = document.querySelector("#floating-instructions-container");
                // if showing instructions, close it
                if (this.bShowingInstructions) {
                    elClicked.classList.remove("show");
                    elClicked.classList.add("hide");
                    this.bShowingInstructions = false;
                }
                // otherwise, open instructions
                else {
                    elClicked.classList.remove("hide");
                    elClicked.classList.add("show");
                    this.bShowingInstructions = true;
                }
            })
    }

    /**
     * Initialize Game event handlers
     */
    initializeGameEventHandlers() {
        
        document.querySelector("#menu-button")
            .addEventListener('mouseenter', event => {
                let elHovered = event.target;
                elHovered.classList.remove("menu-button-static")
                elHovered.classList.add("menu-button-animated")
            });

        document.querySelector("#menu-button")
            .addEventListener('mouseleave', event => {
                let elUnHover = event.target;
                elUnHover.classList.remove("menu-button-animated")
                elUnHover.classList.add("menu-button-static")
        });

        document.querySelector("#menu-button")
            .addEventListener('click', this.BackToMenuEvent);
        
        // Create new game and set up Minefield click events
        document.querySelector("#new-game-button")
            .addEventListener('click', this.NewGameEvent);
    }

    /** 
     * Event to start the game from the main menu
     */
    PlayGameEvent = () => {
        document.querySelector('#main-menu-page').classList.remove("show");
        document.querySelector('#main-menu-page').classList.add("hide");
        document.querySelector('#main-game-page').classList.add("show");
        this.initializeGameEventHandlers();
        this.NewGameEvent();
    }

    /*
    * Event to go back to main menu
    */
    BackToMenuEvent = () => {
        document.querySelector('#main-game-page').classList.remove("show");
        document.querySelector('#main-game-page').classList.add("hide");
        document.querySelector('#main-menu-page').classList.add("show");
        this.leaveGame();
    }
    
    // Creates a new game and (re-)initializes ability to click minefield cells.
    NewGameEvent = () => {

        // When the user right clicks a cell
        document.querySelector("#mine-table")
            .addEventListener("contextmenu", this.flagEvent);

        // when the user left clicks a cell
        document.querySelector("#mine-table")
            .addEventListener("click", this.selectCellEvent);

        this.setupNewGame();
    }

    /**
     * start game visuals, starting values, and timers
     */
    setupNewGame() {
        // (Re-)start the timer
        this.stopLoopingTimer(); 
        this.timeCurrGame = 0;
        this.updateGameTimer();

        // create the minefield
        this.createNewMinefield();
        
    }

    /**
     * Helper for leaving the game
     */
    leaveGame() {
        this.stopLoopingTimer();
        document.querySelector("#mine-table")
            .removeEventListener("click", this.selectCellEvent);

        document.querySelector("#mine-table")
            .removeEventListener("contextmenu", this.flagEvent);
    }

    /*
    * Creates a new Minefield and sets all beginning values.
    */
    createNewMinefield() {
        this.minefield = new Minefield(
            document.querySelector('#difficulty-selection').value); // create minefield
        this.numFlagsRemaining = this.minefield.numMines;           // Number of flags remaining                         
        this.isFirstSelected = false;                               // If the player has done their first selected
        this.numCellsSelected = 0;                                  // Number of cells currently uncovered

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
    * Start the looping timer, updating the game time by seconds
    */
    startLoopingTimer = () => {
        this.minesweeperTimer = setInterval(() => {
            this.timeCurrGame++;
            this.updateGameTimer();
          }, 1000);
    }

    /*
    * Update the game timer using the current seconds of game time
    */
    updateGameTimer() {
        let minutes = Math.floor(this.timeCurrGame / 60);
        let seconds = this.timeCurrGame % 60;
        document.querySelector("#time-text")
            .textContent = `${this.formatTime(minutes)}:${this.formatTime(seconds)}`
    }

    // Helper to Keep a string of time in 00:00 format
    // param num    The seconds or minutes value to format
    formatTime(num) {
        return num <= 9 ? `0${num}` : num;
    }

    /*
    * Stop the looping timer.
    */
    stopLoopingTimer() {
        if (this.minesweeperTimer)
            clearInterval(this.minesweeperTimer);
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

            // randomize mines if first click and start the timer
            if (!this.isFirstSelected) {
                this.minefield.randomize(cell);
                this.startLoopingTimer();
            }
            this.isFirstSelected = true;

            // if mine hit, lose
            if (cell.isMine) {
                this.loseGame(row, col);
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
                // if the number of selected cells equals number of non-mines, player wins
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

    /**
     * Lose the game, displaying all mines and going to lose screen.
     * @param {int} row     Row of mine selected
     * @param {int} col     col of mine selected
     */
    loseGame(row, col) {
        this.leaveGame();
        this.displayAllMines(row, col);
        console.log("You lose");
        // TODO: goto lose screen 
    }

    /**
     * Goto win screen.
     */
    winGame() {
        this.leaveGame();
        console.log("You win");
    }

    /**
     * Display all mines on the board.
     * @param {int} row   Row of mine selected
     * @param {int} col   Col of mine selected
     */
    displayAllMines(row, col) {
        for (let i = 0; i < this.minefield.numRows; i++) {
            for (let j = 0; j < this.minefield.numCols; j++) {
                if (i == row && j == col) {
                    document.querySelector(`#cell-${i}-${j}`).classList.remove("not-selected");
                    document.querySelector(`#cell-${i}-${j}`).classList.add("bomb-selected");
                }
                else if (this.minefield.field[i][j].isMine) {
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
