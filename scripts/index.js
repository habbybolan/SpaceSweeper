// Main start Minesweeper

let CellState = ["NOT_SELECTED", "FLAGGED", "SELECTED"];

class Cell {

    constructor(row, col, isMine = false) {
        this._state = CellState[0];
        this._isMine = isMine; 
        this._row = row;
        this._col = col;
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
}

class Minefield {

    constructor( difficulty ) {

        this.setBoardSize(difficulty)
        
        this.field = [];
        for (let i = 0; i < this._numRows; i++) {
            // create each row inside the minefield
            let row = [];
            for (let j = 0; j < this._numCols; j++) {

                row[j] = new Cell(i, j);
            }
            this.field[i] = row;
        }

        this.randomize(this.field[1][1]);
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
        } else if (difficulty == 1)
        {
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

    addMine( row, col ) {
        // Some way to add a a mine to the field
        field[row][col] = new Cell(true);
    }

    /*
    * Place mines randomly, not placing it on selectedSell
    * param selectedCell    The first cell selected by player
    */
    randomize(selectedCell) {
        let tempNumMines = this.numMines;
        while (tempNumMines > 0) {
            let randRow = Math.floor(Math.random() * this.numRows);
            let randCol = Math.floor(Math.random() * this.numCols);
            // dont set first selected cell as a mine
            if (selectedCell.row == randRow && selectedCell.col == randCol) continue;

            // if already a mine, try again
            let randCell = this.field[randRow][randCol];
            if (randCell.isMine) continue;
            
            randCell.isMine = true;
            tempNumMines--;
        }
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

class App {

    constructor(difficulty) {
        this.minefield = new Minefield(0);    // create minefield
        this.numFlaggedMines = 0;                       // Number of mines currently flagged
        this.difficulty = difficulty;                   // The difficulty of the game, regarding size of board and number of mines

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
                // if the cell is a mine, increment number of mines flagged
                if (cell.isMine) {
                    this.numFlaggedMines++;
                    if (this.numFlaggedMines == this.minefield.numMines) {
                        // TODO: End game
                    }
                }
            // if the cell has a flag
            } else if (cell.state == CellState[1]) {
                // remove flag
                elClicked.classList.remove("flag");
                elClicked.classList.add("not-selected");
                cell.state = CellState[0]
                // if cell is a mine, the decrement number of mines flagged
                if (cell.isMine) this.numFlaggedMines--;
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

// Execute main app
const app = new App();
app.run()
