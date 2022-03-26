'use strict'

var find = false;

function renderGame(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
      strHTML += '<tr>';
      for (var j = 0; j < mat[0].length; j++) {
          var cell = mat[i][j].type;
          var row = mat[i][j].location.i;
          var col = mat[i][j].location.j;
          var className = mat[i][j].state;
          var color = mat[i][j].color;
          if(mat[i][j].type === FLAG){
            color = 'white';
          }
        strHTML += `<td style="font-style: italic; color: ${color}; "class="${className}" data-row="${row}" data-col="${col}" onclick="gameOn(this)" onmousedown=rightclick(this);><i style="font-size:24px;color:${color}" class="fa">${cell}</i></td>`
      }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
  }

function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
          var cell = createCell(i, j);
            row.push(cell);
        }
        mat.push(row);
    }

    for(var i=0; i<gMines.length; i++){
        mat[gMines[i].location.i][gMines[i].location.j].type = MINE;
    }
    
    return mat
  }

  function copyMat(){

    var board = [];
      for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
          var cell = createCell(i, j);
            row.push(cell);
        }
        board.push(row);
    }
    return board;
  }

  function printMat(someBoard){
    var board = [];
    for (var i = 0; i < ROWS; i++) {
      var row = []
      for (var j = 0; j < COLS; j++) {
        var type = someBoard[i][j].type;
          row.push(type);
      }
      board.push(row);
    }
    console.table(board);
  }

function renderTimer(){
    var elCell = document.querySelector('.timer');
    gTimer++;
    elCell.innerHTML = gTimer;
}

function renderStepsCounter(){
  var elCell = document.querySelector('.steps');
    gStepsCounter++;
    elCell.innerHTML = gStepsCounter;
}

function neibours(rIdx, cIdx){
  var gNeiboursOfMines = [];
  var cell;
    for(var i=rIdx-1; i<rIdx+2; i++){
        for(var j=cIdx-1; j<cIdx+2; j++){
            if(!(i<0 || i>memoryBoard.length-1 || j<0 || j>memoryBoard[0].length-1 || memoryBoard[i][j].type === MINE)){
              cell = memoryBoard[i][j];
              gNeiboursOfMines.push(cell);
              
            }
        }
    }
    return gNeiboursOfMines;
}

function numerateCells(rIdx, cIdx){
  var counterMines = 0;
  for(var i=rIdx-1; i<rIdx+2; i++){
      for(var j=cIdx-1; j<cIdx+2; j++){
          if(!(i<0 || i>memoryBoard.length-1 || j<0 || j>memoryBoard[0].length-1)){
            if(memoryBoard[i][j].type === MINE){
              counterMines++;
              console.log(counterMines);
            }
          }
      }
  }
  return counterMines;
}

function expandBoard(niebours){
  var currNeibours = [];
  console.log("shhenim " + niebours.length);
  for(var i=0; i<niebours.length; i++){
    currNeibours = checkNiebours(niebours[i], currNeibours);
  }
  if(find === true) return;
  expandBoard(currNeibours);
}

function checkNiebours(cell, newNeibours){
  for(var i=cell.location.i-1; i<cell.location.i+2; i++){
    for(var j=cell.location.j-1; j<cell.location.j+2; j++){
        if(!(i<0 || i>memoryBoard.length-1 || j<0 || j>memoryBoard[0].length-1)){
          findBomb(memoryBoard[i][j]);
          if(gBoard[i][j].state === 'close' && memoryBoard[i][j].type !== MINE){
              sumOfOpenCells--;
              gBoard[i][j].state = 'open';
              console.log(gBoard[i][j].location.i + "-" + gBoard[i][j].location.j);
              gBoard[i][j].type = memoryBoard[i][j].type;
              gBoard[i][j].color = memoryBoard[i][j].color;
              newNeibours.push(gBoard[i][j]);
          }

        }
    }
  }
  return newNeibours;
}

function findBomb(field){
  if(field.type === MINE){
    find = true;
  }
}
  

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function renderHTML(num, iIdx, jIdx){
  var strHTML = '';
  strHTML += `[data-row="${iIdx}"][data-col="${jIdx}"]`
  var elCell = document.querySelector(strHTML);
  elCell.innerHTML = num;

}

function playSound(row, col){
  if(gBoard[row][col].type === MINE){
    var audio = new Audio("audio/wrong.mp3");
    audio.play();
  }
  else{
    var audio = new Audio("audio/win.mp3");
    audio.play();
  }
}

