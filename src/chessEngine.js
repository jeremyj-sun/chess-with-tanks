/*
This files is responsible for storing all the information about the current state of a chess game.
It will also be responsible for determining the valid moves at the current state. It will also keep a move log.
*/

//NOTES: Remember to use the 'this' keyword to refer to a class prop.

export default class GameState {
    constructor() {
        // the board is an 8x8 2D list and each element has 2 chars.
        //the first char represent the colour of the piece, ('b', 'w')
        //the second char represents the type of piece. ('K', 'Q', 'R', 'B', 'N', or 'P')
        //"--" represent an empty space with no piece
        this.board = [
            ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
            ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
            ["--", "--", "--", "--", "--", "--", "--", "--"],
            ["--", "--", "--", "--", "--", "--", "--", "--"],
            ["--", "--", "--", "--", "--", "--", "--", "--"],
            ["--", "--", "--", "--", "--", "--", "--", "--"],
            ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
            ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"]
        ];
        this.whiteToMove = true;
        this.moveLog = []; //push() new moves. this is a move log that will need to be parsed and printed
        //valid move checker
        this.selected = null; //The coordinates of the selected piece (e.g. (0,0))

    }

    //Validate the move here! 
    //Add helper functions for rules eventually. 
    makeMove(move) { 

        //Enforce pawn

        //Enforce bishop

        //Enforce knight

        //Enforce Rook

        //Enforce king

        //Enforce Queen
        
        //Enforce castle 

        //Enforce turns
        if (this.board[move.startRow][move.startCol].charAt(0) === 'w' && !this.whiteToMove) {
            alert("It is Black's move!");
            return;
        } else if (this.board[move.startRow][move.startCol].charAt(0) === 'b' && this.whiteToMove) {
            alert("It is White's move!");
            return;
        }

        //Enforce valid captures
        if (this.board[move.startRow][move.startCol] != "--" && this.board[move.startRow][move.startCol].charAt(0) === this.board[move.endRow][move.endCol].charAt(0)) {
            alert("Cannot capture own piece!");
            return;

        }

        //Enforce piece selected
        if (this.board[move.startRow][move.startCol] != "--") {
            this.board[move.startRow][move.startCol] = "--";
            this.board[move.endRow][move.endCol] = move.pieceMoved;
            this.moveLog.push(move); //log the move so it can be undoed / displayed
            this.whiteToMove = !this.whiteToMove; //switch turns
        } 
    }
}

export class Move {
    //chess notation mappings: (chess notation uses strings)
    //function that inverts dictionary mappings
    invertKeyValues = (map) => {
        var newMap = {};
        for (let key in map) {
            newMap[map[key]] = key;
        }
        return newMap;
    }
    ranksToRows = {
        "1": 7,
        "2": 6,
        "3": 5,
        "4": 4,
        "5": 3,
        "6": 2,
        "7": 1,
        "8": 0
    }
    rowsToRanks = this.invertKeyValues(this.ranksToRows);
    filesToCols = {
        "a": 0,
        "b": 1,
        "c": 2,
        "d": 3,
        "e": 4,
        "f": 5,
        "g": 6,
        "h": 7
    }
    colsToFiles = this.invertKeyValues(this.filesToCols);

    
    constructor(startSq, endSq, board) { //takes two square objects and a board state 2D array
        this.startRow = startSq.row; //avoid off by 1 error
        this.startCol = startSq.col; //avoid off by 1 error
        this.endRow = endSq.row;
        this.endCol = endSq.col;
        this.pieceMoved = board[this.startRow][this.startCol];
        this.pieceCaptured = board[this.endRow][this.endCol]; //could be no piece captured
    }
    
    getRankFile(r, c) {
        return this.colsToFiles[c] + this.rowsToRanks[r];
    }
    getChessNotation() {
        //This uses rankFile instead of standard chess notation for now. 
        return this.getRankFile(this.startRow, this.startCol) + this.getRankFile(this.endRow, this.endCol);
        
    }
}