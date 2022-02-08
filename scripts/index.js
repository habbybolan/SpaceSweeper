// Main start Minesweeper
const COLUMN_SIZE = 10;

let CellState = ["NOT_SELECTED", "FLAGGED", "SELECTED"];

class Cell {

    constructor() {
        this._state = CellState[0];
        this._isMine = false; 
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
}

class Minefield {

    constructor( size = 10 ) {

        this.size = size;
        this.field = [];
        for (let i = 0; i < this.size; i++) {
            // create each row inside the minefield
            let row = [];
            for (let j = 0; j < this.size; j++) {

                row[j] = new Cell();
            }
            this.field[i] = row;
        }
    }


    addMine( row, col ) {
        // Some way to add a a mine to the field
    }

    randomize( mineCount  = 10 ) {
        // randomly place mineCount mines sowhere in the field
    }

    getCell( row, col ) {
        return this.field[row][col];
    }
}

class App {

    constructor() {
        // initialize where the mines are
        this.minefield = new Minefield(COLUMN_SIZE);
        this.message = "Clicked the button";

        // Create the minefield HTML
        document.querySelector("#mine-table").innerHTML = this.createTableMarkup();

        // Set up event handlers to wait for user input
        this.initEventHandlers()
    }


    run() {}

    initEventHandlers() {
        // When the user right clicks
        document.querySelector("#mine-table")
        .addEventListener("contextmenu", event => {

            event.preventDefault();
            // check the minefield for a mine
            // update the screeen
            // update the game game status
            // do we have a loser?
            // do we have a winner?
            let elClicked = event.target;
            let row = 1 * elClicked.getAttribute("data-row");
            let col = 1 * elClicked.getAttribute("data-col");
            
            let cell = this.minefield.getCell( row, col );
            if (cell.state == CellState[0]) {
                // add flag
                elClicked.classList.remove("not-selected")
                elClicked.classList.add("flag");
                cell.state = CellState[1];
            } else if (cell.state == CellState[1]) {
                // remove flag
                elClicked.classList.remove("flag");
                elClicked.classList.add("not-selected");
                cell.state = CellState[0]
            }            
        });

        // when the user left clicks
            // check for mines
            // no mines, start clearing
            // do we have a loser?
            // do we have a winner?
    }

    createTableMarkup() {
        let markup = this.generateMarkupRows();
        return markup
    }

    // All the ROWS
    generateMarkupRows() {

        let markup = "";
        for (let i = 0; i < COLUMN_SIZE; i++) {

            markup += `<div class="mine-row game-container"> `;
            for (let j = 0; j < COLUMN_SIZE; j++) {
                // add a td with the column header
                markup += `<div class="cell not-selected" id="cell-${i}${j}" data-row="${i}" data-col="${j}"></div>`;
            }
            markup += `</div>`;
        }
        return markup
    }
}

// Execute main app
const app = new App();
app.run()
