import GameState from '/src/chessEngine.js';
import {Move} from '/src/chessEngine.js'

/*This file handles user input and displays the current game state.*/

//NOTE: You must run the game on a web server (e.g. live server or payed host), otherwise, no modules can be imported.

//Draws the canvas
//the context creates a graphics grid with 0 (left), 0 (top) being the top left corner of the board.

var message = document.getElementById('mobile-message');
var board = document.getElementById('board');
const minLength = Math.min(window.innerHeight, window.innerWidth);
const LENGTH = minLength * 0.9; //board WIDTH AND HEIGHT
board.width = LENGTH;
board.height = LENGTH;
board.style.display = 'none';
board.style.left = (window.innerWidth / 2 - LENGTH / 2) + "px";
board.style.top = (window.innerHeight / 2 - LENGTH / 2) + "px";
board.style.border = '5px solid black';
var ctx = board.getContext('2d');

const DIMENSION = 8; // chess board dimension
const SQ_SIZE = LENGTH / 8; //size of square
var gs = new GameState();  //initialize gamestate object

//Test mappings
/*
let move = new Move();
console.table(move.ranksToRows);
console.table(move.rowsToRanks);
console.table(move.filesToCols);
console.table(move.colsToFiles);
*/

//White Pieces
var wK = document.getElementById("wKG");
var wQ = document.getElementById("wQG");
var wB = document.getElementById("wBG");
var wN = document.getElementById("wNG");
var wR = document.getElementById("wRG");
var wP = document.getElementById("wPG");

//Black Pieces
var bK = document.getElementById("bKG");
var bQ = document.getElementById("bQG");
var bB = document.getElementById("bBG");
var bN = document.getElementById("bNG");
var bR = document.getElementById("bRG");
var bP = document.getElementById("bPG");

//scalePieces(piece) adjusts the sizes of each piece to fit to square size
function scalePieces(piece) {
    piece.width = SQ_SIZE + "px";
    piece.height = SQ_SIZE + "px";
}
var pieces = [wK, wQ, wB, wN, wR, wP, bK, bQ, bB, bN, bR, bP];
pieces.forEach(scalePieces);

/*ctx syntax
ctx.fillStyle="red";
ctx.fillRect(0,0,100,100);
ctx.moveTo(0, 0);
ctx.lineTo(200, 100);
ctx.stroke();
ctx.drawImage(img, 10, 10, 100, 100)
*/

//Highlighting of pieces - CONTINUE HERE!!!
//Remark: changing CSS of the image does not get applied to the canvas :(
// May need to make new "Highlighted" assets and then mutate the piece variables
// to the ID of the highlighted asset. 
function highLight(square, gs) {
    if (gs.board[square.row][square.col] != "--") {
        gs.selected = square;
    }
}

function unHighLight(gs) {
    gs.selected = null;
}

//Sound effects
function sfxSelect () {

}
function sfxMove () {

}
function sfxCapture () {

}

//Event listeners:
board.addEventListener("mousedown", movePiece, false);

//Event handlers:
var sqSelected = {row: null, col: null}; //no square selected initially, keeps track of last square use selected, \\{row, col}
var playerClicks = []; //contains 0, 1, or 2 sqSelected, e.g. ([(6,4), (4,4)])
function movePiece(e) {
    var rect = e.target.getBoundingClientRect(); //board bounding rectangle
    var location = {x : e.clientX - rect.left, y : e.clientY - rect.top }; //calculates location on board. 
    var col = Math.floor(location.x / SQ_SIZE); //we use floor to avoid off by 1 error
    var row = Math.floor(location.y / SQ_SIZE);
    //alert("x: "+location.x+" y: "+location.y); //test

    if (sqSelected.row == row && sqSelected.col == col) { //user clicked same square twice, deselect piece
        console.log(playerClicks);
        unHighLight(gs);
        sqSelected = {row: null, col: null}; //deselect square
        playerClicks = []; //empty click log
        console.log("unhighlight reset");
        
    } else {
        sqSelected.row = row;
        sqSelected.col = col;
        let target = {row: null, col: null};
        let square = Object.assign(target, sqSelected);
        playerClicks.push(square);
    }
    if (playerClicks.length == 1) {
        highLight(sqSelected, gs);
        console.log("highlight 1");
        console.log("executed1");
    } else if (playerClicks.length == 2) {
        console.log("executed2");
        console.log("unhighlight 2");
        unHighLight(gs);
        let move = new Move(playerClicks[0], playerClicks[1], gs.board);
        console.log(move.getChessNotation());

        console.log("before move");
        console.log("Row: " + sqSelected.row);
        console.log("Column: " + sqSelected.col);
        console.log(playerClicks);
        gs.makeMove(move);
        console.log("after move");
        console.log("Row: " + sqSelected.row);
        console.log("Column: " + sqSelected.col);
        console.log(playerClicks);
        
        //reset for next move
        sqSelected = {row: null, col: null};
        playerClicks = [];
    }

    //UPDATE
    ctx.clearRect(0, 0, LENGTH, LENGTH); //clear screen
    drawGameState(ctx, gs); //draw game state

    console.log("After reset");
    console.log("Row: " + sqSelected.row);
    console.log("Column: " + sqSelected.col);
    console.log(playerClicks);
    if (gs.selected) {
        console.log("Highlight selection: " + gs.selected.row + " " + gs.selected.col);  
    }
      
}


//INIITIALIZE
function delayAsyncCall() {
    return new Promise((resolve) => setTimeout(() => resolve(), 0));
}

window.onload = function () {
    //console.log(gs.board);
    if (minLength > 475) {
        message.style.display = 'none';
    }
    board.style.display = 'block';
    delayAsyncCall().then(() => {jQuery(".loader-wrapper").fadeOut("slow")});
    drawGameState(ctx, gs); //draw game state
}

//Toggle DEBUG Mode
console.log = function () {}

/*
//ANIMATION FRAMES//
const MAX_FPS = 60; //maximum frames per second of game 
//sleep function that pauses a single function execution for the specified number of miliseconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let lastTime = 0; //initialize timeStamp
async function gameLoop(timeStamp) {
  //LOOPS THROUGH ANIMATION FRAMES
  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  //draw functions always require the ctx as an argument
  
  console.log("Game is running!");
  ctx.clearRect(0, 0, LENGTH, LENGTH); //clear screen
  drawGameState(ctx, gs); //draw game state
  await sleep(1000/MAX_FPS);
  requestAnimationFrame(gameLoop); //recursive call via animation frame
}
if (true) {
    requestAnimationFrame(gameLoop); //returns a VALID timeStamp: Toggling this line turns off all graphics
}
*/

//Draw Game Graphics
function drawGameState(ctx, gs) {
    drawBoard(ctx); //draw squares
    drawPieces(ctx, gs); //draw pieces
}

//Draw Game Board
function drawBoard(ctx) { 
    //beige - brown: ["#f5f5dc", "#964b00"]
    //white - green: ["white", "green"]
    //light blue - dark blue: ["#e8f4f8", "#00008b"]
    var colors = ["#f5f5dc", "#964b00"]
    var highlight = '#F9FA2E'
    for (let row = 0; row < DIMENSION; row++) {
        for (let col = 0; col < DIMENSION; col++){
            ctx.fillStyle = colors[(row + col) % 2];
            if(gs.selected && gs.selected.row == row && gs.selected.col == col) {
                ctx.fillStyle = highlight;
            }
            ctx.fillRect(col*SQ_SIZE, row*SQ_SIZE, SQ_SIZE, SQ_SIZE);
        }
    }
}

//Draw chess pieces (tanks)
function drawPieces(ctx, gs) { 
    //CONTINUE HERE: TO DO: 1. make assets (Germany, Russia, USA), Both white and black 
    // 2. UI: White Selects Country, Black selects country -> loads the appropriate set of pieces -> loads board colors depending on nation combinations
    // 3. implement draw pieces function that parses gs.board to generate a board
    for (let row = 0; row < DIMENSION; row++) {
        for (let col = 0; col < DIMENSION; col++) {
            if (gs.board[row][col]==="wK") {
                ctx.drawImage(wK, col*SQ_SIZE, row*SQ_SIZE, SQ_SIZE, SQ_SIZE);
            } else if (gs.board[row][col]==="bK") {
                ctx.drawImage(bK, col*SQ_SIZE, row*SQ_SIZE, SQ_SIZE, SQ_SIZE);
            } else if (gs.board[row][col]==="wQ") {
                ctx.drawImage(wQ, col*SQ_SIZE, row*SQ_SIZE, SQ_SIZE, SQ_SIZE);
            } else if (gs.board[row][col]==="bQ") {
                ctx.drawImage(bQ, col*SQ_SIZE, row*SQ_SIZE, SQ_SIZE, SQ_SIZE);
            } else if (gs.board[row][col]==="wB") {
                ctx.drawImage(wB, col*SQ_SIZE, row*SQ_SIZE, SQ_SIZE, SQ_SIZE);
            } else if (gs.board[row][col]==="bB") {
                ctx.drawImage(bB, col*SQ_SIZE, row*SQ_SIZE, SQ_SIZE, SQ_SIZE);
            } else if (gs.board[row][col]==="wN") {
                ctx.drawImage(wN, col*SQ_SIZE, row*SQ_SIZE, SQ_SIZE, SQ_SIZE);
            } else if (gs.board[row][col]==="bN") {
                ctx.drawImage(bN, col*SQ_SIZE, row*SQ_SIZE, SQ_SIZE, SQ_SIZE);
            } else if (gs.board[row][col]==="wR") {
                ctx.drawImage(wR, col*SQ_SIZE, row*SQ_SIZE, SQ_SIZE, SQ_SIZE);
            } else if (gs.board[row][col]==="bR") {
                ctx.drawImage(bR, col*SQ_SIZE, row*SQ_SIZE, SQ_SIZE, SQ_SIZE);
            } else if (gs.board[row][col]==="wP") {
                ctx.drawImage(wP, col*SQ_SIZE, row*SQ_SIZE, SQ_SIZE, SQ_SIZE);
            } else if (gs.board[row][col]==="bP") {
                ctx.drawImage(bP, col*SQ_SIZE, row*SQ_SIZE, SQ_SIZE, SQ_SIZE);
            }          
        }
    }
}

//Other controls: 
//Add piece sound effect when moving a piece. 
//Graphics to highlight valid moves when selecting a piece

