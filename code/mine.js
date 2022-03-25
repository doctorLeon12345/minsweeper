'use strict'


var gMines = [];
var MINE = '&#xf1e2;';

function createMine(){
    var mine = {
        location:{
            i: getNums()[0],
            j: getNums()[1]
        },

        type: MINE
    }

    return mine;
}

function createMines(num){
    for(var i=0; i<num; i++){
        var mine = createMine();
        gMines.push(mine);
    }
}

function getNums(){
    var nums = [];
    var row = getRandomIntInclusive(0, ROWS-1);
    nums.push(row);
    var col = getRandomIntInclusive(0, COLS-1);
    nums.push(col);
    
    return nums;
}

function setMines(){
    for(var i=0; i<gMines.length; i++){
        gBoard[gMines[i].location.i][gMines[i].location.j].type = gMines[i].type;
        gBoard[gMines[i].location.i][gMines[i].location.j].state = 'open';
    }
}

function revillMines(){
    for(var i=0; i<gMines.length; i++){
      gBoard[gMines[i].location.i][gMines[i].location.j].type = MINE;
    }
}

function hideMines(){
    for(var i=0; i<gMines.length; i++){
        gBoard[gMines[i].location.i][gMines[i].location.j].type = '';
      }
}