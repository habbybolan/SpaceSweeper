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
        while (tempNumMines > 0) {
            let randRow = Math.floor(Math.random() * this.numRows);
            let randCol = Math.floor(Math.random() * this.numCols);
            // dont set first selected cell as a mine, an already selected mine, or its adjacent cells
            if (this.field[randRow][randCol].isMine ||
                (selectedCell.col == randCol && Math.abs(selectedCell.row - randRow) < 2)  ||
                (selectedCell.row == randRow && Math.abs(selectedCell.col - randCol) < 2) ||
                (Math.abs(selectedCell.row - randRow) == 1 && Math.abs(selectedCell.col - randCol) == 1)) continue;
            
            this.field[randRow][randCol].isMine = true;
            tempNumMines--;
        }
    }

    uncoverCells(row, col) {
        let stack = [];  
        stack.push(this.field[row][col]);
        while (stack.length != 0) {
            let cell = stack.pop();
            row = cell.row;
            col = cell.col;
            // if not a mine, then display number adjacent mines and pop adjacent to stack
            if (!cell.isMine) {
                cell.state = CellState[2];
                document.querySelector(`#cell-${row}${col}`).classList.remove("not-selected");
                document.querySelector(`#cell-${row}${col}`).classList.remove("empty");
                document.querySelector(`#cell-${row}${col}`).innerHTML = this.numAdjacentMines(row, col);
                // if the cell has no adjacent mines, then pop children to stack
                if (this.numAdjacentMines(row, col) == 0) {
                    // push adjacent cells if they are not mines and unselected to stack
                    // Up cell
                    if (cell.row > 0 && !this.field[row-1][col].isMine && this.field[row-1][col].state == CellState[0]) 
                        stack.push(this.field[row-1][col]);
                    // down cell
                    if (cell.row < this.numRows-1 && !this.field[row+1][col].isMine && this.field[row+1][col].state == CellState[0]) 
                        stack.push(this.field[row+1][col]);
                    // left cell
                    if (cell.col > 0 && !this.field[row][col-1].isMine && this.field[row][col-1].state == CellState[0]) 
                        stack.push(this.field[row][col-1]);
                    // right cell
                    if (cell.col < this.numCols-1 && !this.field[row][col+1].isMine && this.field[row][col+1].state == CellState[0])
                        stack.push(this.field[row][col+1]);
                }
            }
        }
    }

    numAdjacentMines(row, col) {
        let numAdjacentMines = 0;
        // cells above
        if (row > 0) {
            // cell down
            if (this.field[row-1][col].isMine) numAdjacentMines++;
            // cell down, left
            if (col > 0 && this.field[row-1][col-1].isMine) numAdjacentMines++; 
            // cell down, right
            if (col < this.numCols - 1 && this.field[row-1][col+1].isMine) numAdjacentMines++;
        }
        // cells below
        if (row < this.numRows - 1) {
            // cell up
            if (this.field[row+1][col].isMine) numAdjacentMines++;
            // cell up, left
            if (col > 0 && this.field[row+1][col-1].isMine) numAdjacentMines++;
            // cel up, right
            if (col < this.numCols-1 && this.field[row+1][col+1].isMine) numAdjacentMines++;
        }
        // cell right
        if (col > 0 && this.field[row][col-1].isMine) numAdjacentMines++;
        // cell left
        if (col < this.numCols-1 && this.field[row][col+1].isMine) numAdjacentMines++
        return numAdjacentMines;
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
        this.minefield = new Minefield(0);      // create minefield
        this.numFlags = 0;               // Number of mines currently flagged
        this.difficulty = difficulty;           // The difficulty of the game, regarding size of board and number of mines
        this.isFirstSelected = false;           // If the player has done their first selected

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
                numFlags++;
            // if the cell has a flag
            } else if (cell.state == CellState[1]) {
                // remove flag
                elClicked.classList.remove("flag");
                elClicked.classList.add("not-selected");
                cell.state = CellState[0]
                numFlags--;
            }            
        });

        // when the user left clicks
            // check for mines
            // no mines, start clearing
            // do we have a loser?
            // do we have a winner?

        document.querySelector("#mine-table")
        .addEventListener("click", event => {
            event.preventDefault();
            let elClicked = event.target;
            let row = 1 * elClicked.getAttribute("data-row");
            let col = 1 * elClicked.getAttribute("data-col");
            let cell = this.minefield.getCell( row, col );
            // only interact if cell not selected
            if (cell.state == CellState[0]) {
                // TODO: 
                // if a mine, end game
                // otherwise, 
                //      uncover the empty space
                //      find all empty spaces around it
                //      if the cell has a bomb adjacent to it, display the number of bombs adjacent
                if (!this.isFirstSelected) this.minefield.randomize(cell);
                this.isFirstSelected = true;
                if (cell.isMine) {
                    console.log("Mine Hit!");
                }
                else {
                    this.minefield.uncoverCells(row, col);
                }
                
            }
        });
    }


    createTableMarkup() {
        let markup = this.generateMarkupRows();
        return markup
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

// Execute main app
const app = new App();
app.run()
