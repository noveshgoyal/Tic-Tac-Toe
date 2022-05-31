var origBoard;
var human = 'X';
var ai = 'O';
var winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame(){
    document.querySelector('.endgame').style.display = 'none';
    origBoard = Array.from(Array(9).keys());
    for(let i=0; i<cells.length; i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square){
   if(typeof origBoard[square.target.id] == 'number'){
    turn(square.target.id, human);
    if(!checkTie()) turn(bestSpot(), ai);
   }
}

function turn(id, player){
    origBoard[id] = player;
    document.getElementById(id).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if(gameWon) gameOver(gameWon);
}

function checkWin(board, player){
    let plays = board.reduce((a, e, i) => (e===player)? a.concat(i) : a, []);
    let gameWon =null;
    for(let [index, win] of winCombos.entries()){
        if(win.every(elem => plays.indexOf(elem) > -1)){
            gameWon = {index, player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){

    // Highlighting the squares which are the part of the winning combinaton
    for(let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = gameWon.player == human ? 'blue' : 'red';
    }

    // Removing the click event so that the user cannot click any square as the game is over
    for(let i=0; i<cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false);
    }

    declareWinner(gameWon.player == human ? "You win!" : "You Lose!");
}

function declareWinner(who){
    document.querySelector('.endgame').style.display = 'block';
    document.querySelector('.endgame .text').innerText = who;
}

function emptySquares(){
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot(){
    return emptySquares()[0];
}

function checkTie(){
    if(emptySquares().length == 0){
        for(let i=0; i<cells.length; i++){
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}
