'use strict'

var gBoard;
var memoryBoard;
var ROWS = 4;
var COLS = 4;
var NUM_OF_MINES = 2;
var sumOfOpenCells = 0;
var gIntervalId = null;
var gTimer = 0;
var gStepsCounter = 0;
var isTimerOn = true;
var isGameOn = true;
var padding = 0;
var pointerId = 0;
var FLAG = '&#xf024';
var isRevill = true;
var navigateNumberColors = ['blue', 'green', 'brown', 'magenta', 'yello', 'orange', 'red'];


function createCell(i_idx, j_idx){
    var cell = {
        location:{
            i:i_idx,
            j:j_idx
        },
    
        type: '',
    
        color: 'black',

        state: 'close',

        flag: false
    
    }

    return cell;
}

function init(){
    //first model initialization
    createMines(NUM_OF_MINES);
    memoryBoard = createMat(ROWS, COLS);
    gBoard = copyMat();
    courseOfTheGame();
    printMat(memoryBoard);
    sumOfOpenCells = ROWS*COLS-NUM_OF_MINES;

    //first DOM initialization
    renderGame(gBoard, ".board-container");
       
}

function startGame(elBtn){
    if(parseInt(elBtn.id) === 1){
        ROWS = 4;
        COLS = 4;
        NUM_OF_MINES = 2;
        gIntervalId = null;
        gTimer = 0;
        gStepsCounter = 0;
        isTimerOn = true;
        isGameOn = true;
        gMines = [];
        sumOfOpenCells = 0;
        padding = 0;
        pointerId = 0;
        isRevill = true;
        init();
    }
    else if(parseInt(elBtn.id) === 2){
        ROWS = 8;
        COLS = 8;
        NUM_OF_MINES = 4;
        gIntervalId = null;
        gTimer = 0;
        gStepsCounter = 0;
        isTimerOn = true;
        isGameOn = true;
        gMines = [];
        sumOfOpenCells = 0;
        padding = 0;
        pointerId = 0;
        isRevill = true;
        init();
    }
    else if(parseInt(elBtn.id) === 3){
        ROWS = 12;
        COLS = 12;
        NUM_OF_MINES = 6;
        gIntervalId = null;
        gTimer = 0;
        gStepsCounter = 0;
        isTimerOn = true;
        isGameOn = true;
        gMines = [];
        sumOfOpenCells = 0;
        padding = 0;
        pointerId = 0;
        isRevill = true;
        init();
    }
}


function gameOn(elem){
    if(!(isGameOn)) return;

    var row = elem.dataset.row;
    var col = elem.dataset.col;

    //if(gBoard[row][col].flag === true) return;

    if(memoryBoard[row][col].type === MINE && gBoard[row][col].flag !== true){
        console.log("game over");
        isGameOn = false;
        clearInterval(gIntervalId);
        setMines();
        markMineBlob(row, col);
        var elImage = document.querySelector("img");
        elImage.src = "imeges/cry.jpg";
        playSound(row, col);
        renderGame(gBoard, ".board-container");
        return;
    }

    if(isTimerOn && isGameOn){
        gIntervalId = setInterval(renderTimer, 1000);
        isTimerOn = false;
    }

    renderStepsCounter();
    if(gBoard[row][col].flag !== true && gBoard[row][col].state !== 'open'){
        revillData(row, col);
        printMat(gBoard);
        console.log(sumOfOpenCells);
    }
    

    if(sumOfOpenCells <= 0 && gBoard[row][col].flag !== true){
        console.log("you win!");
        clearInterval(gIntervalId);
        revillMines();
        isGameOn = false;
        playSound(row, col);
        renderGame(gBoard, ".board-container");
        return;
    }

    if(gBoard[row][col].flag === false){
        renderGame(gBoard, ".board-container");
    }
    
}


function rightclick(elem) {
    var rightclick;
    var e = window.event;
    if (e.which) rightclick = (e.which == 3);
    else if (e.button) rightclick = (e.button == 2);
     // true or false, you can trap right click here by if comparison

     if(rightclick){
         console.log("clicked");
        var row = elem.dataset.row;
        var col = elem.dataset.col;

        if(gBoard[row][col].flag === false){
            gBoard[row][col].type = FLAG;
            gBoard[row][col].flag = true;
        }
        else{
            gBoard[row][col].type = '';
            gBoard[row][col].flag = false;
        }
         
        renderGame(gBoard, ".board-container");
     }
     
}


function courseOfTheGame(){
    for(var i=0; i<gMines.length; i++){
        var row = gMines[i].location.i;
        var col = gMines[i].location.j;
        var navigateNiebours = neibours(row, col);
        
        for(var x=0 ; x<navigateNiebours.length ; x++){
            var count = 0;
            count = numerateCells(navigateNiebours[x].location.i, navigateNiebours[x].location.j);
            upDateBoard(count, navigateNiebours[x].location.i, navigateNiebours[x].location.j);
        }
    }
    
}

function markMineBlob(row, col){
    var len = navigateNumberColors.length;
    gBoard[row][col].color = navigateNumberColors[len-1];
}

function revillData(row, col){
    if(gBoard[row][col].flag === true) return;
    var state = isCleanNeibours(row, col);
    if(state){
        for(var i=row-1; i<row+2; i++){
            for(var j=col-1; j<col+2; j++){
                if(!(i<0 || i>memoryBoard.length-1 || j<0 || j>memoryBoard[0].length-1)){
                    if(gBoard[i][j].state !== 'open'){
                        sumOfOpenCells--
                    }
                    gBoard[i][j].type = memoryBoard[i][j].type;
                    gBoard[i][j].state = 'open';
                    gBoard[i][j].color = memoryBoard[i][j].color;
                }
            }
        }
    }
    else{
        sumOfOpenCells--;
        gBoard[row][col].type = memoryBoard[row][col].type;
        gBoard[row][col].state = 'open';
        gBoard[row][col].color = memoryBoard[row][col].color;
    }
    
}

/*
//BONUS RECURSION
function revillData(row, col){
    var state = isCleanNeibours(row, col);
    console.log(state);
    if(state){
        for(var i=row-1-padding; i<row+2+padding; i++){
            for(var j=col-1-padding; j<col+2+padding; j++){
                if(!(i<0 || i>memoryBoard.length-1 || j<0 || j>memoryBoard[0].length-1)){
                    if(memoryBoard[i][j].type === MINE) return 0;
                    sumOfOpenCells--;
                    gBoard[i][j].type = memoryBoard[i][j].type;
                    gBoard[i][j].state = 'open';
                    gBoard[i][j].color = memoryBoard[i][j].color;
                }
            }
        }
    }
    else{
        sumOfOpenCells--;
        gBoard[row][col].type = memoryBoard[row][col].type;
        gBoard[row][col].state = 'open';
        gBoard[row][col].color = memoryBoard[row][col].color;
    }
    padding++;
    revillData(row, col);
}
*/

function isCleanNeibours(row, col){
    for(var i=row-1; i<row+2; i++){
        for(var j=col-1; j<col+2; j++){
            if(!(i<0 || i>memoryBoard.length-1 || j<0 || j>memoryBoard[0].length-1)){
                if(memoryBoard[i][j].type === MINE){
                    return false;
                }
            }
        }
    }
    return true;
}

//update memory board with mineNavigetorNeibours
function upDateBoard(numOfCloseMines, row, col){
    if(numOfCloseMines !== 0){
        //update model
        //update memory
        memoryBoard[row][col].type = numOfCloseMines;
        if(numOfCloseMines === 1){
            memoryBoard[row][col].color = navigateNumberColors[0];
        }
        else if(numOfCloseMines === 2){
            memoryBoard[row][col].color = navigateNumberColors[1];
        }
        else if(numOfCloseMines === 3){
            memoryBoard[row][col].color = navigateNumberColors[2];
        }
        else if(numOfCloseMines === 4){
            memoryBoard[row][col].color = navigateNumberColors[3];
        }
        else if(numOfCloseMines === 5){
            memoryBoard[row][col].color = navigateNumberColors[4];
        }
        else if(numOfCloseMines === 6){
            memoryBoard[row][col].color = navigateNumberColors[5];
        }
    }
}






