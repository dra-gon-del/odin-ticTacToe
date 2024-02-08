const displayController = (() => {
    const renderMessage = (message) => {
        document.querySelector("#message").innerHTML = message;
    }
    return{
        renderMessage,
    }
})();

const gameboard = (()=> {
    let gameboard = ["", "", "", "", "", "", "", "", ""]

    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) =>{
            boardHTML += `<div class="square" id=square-${index}">${square}</div>`
        })
        document.querySelector("#gameboard").innerHTML = boardHTML;
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
        })
    }

    const update = (index, value) => {

        gameboard[index] = value;
        render();
    }

    const getGameboard = () => gameboard;
    
    return {
        render,
        update,
        getGameboard
    }
})();

const createPlayer = (name, mark) => {
    return {
        name,
        mark
    }
}

const Game = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;
    
    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value, "x"),
            createPlayer(document.querySelector("#player2").value, "o")
        ]
        currentPlayerIndex = 0;
        gameOver = false;
        gameboard.render();
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
        })
    }
    
    const handleClick = (event) => {
        let index = parseInt(event.target.id.split("-")[1]);
        
        if(gameboard.getGameboard()[index] !== "")
            return;
        
        gameboard.update(index, players[currentPlayerIndex].mark)

        if(checkForWin(gameboard.getGameboard(), players[currentPlayerIndex].mark)){
            gameOver = true; 
            displayController.renderMessage(`${players[currentPlayerIndex].name} wins`)
        } else if (checkForTie(gameboard.getGameboard())) {
            gameOver = true;
            displayController.renderMessage("It's a tie!");
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        }

        const restart = () => {
            for (let i = 0; i < 9; i++) {
                gameboard.update(i, "");
            }
            gameboard.render();
            gameOver = false; 
            document.querySelector("#message").innerHTML = "";
        }

    return {
        start,
        restart,   
        handleClick
    }
})();

function checkForWin(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [2,4,6],
        [0,4,6]
    ]
    for (let i=0; i < winningCombinations.length; i++){
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function checkForTie(board) {
    return board.every(cell => cell != "")
}

const restartButton = document.querySelector("#restartButton"); 
restartButton.addEventListener("click", () => {
    Game.restart();
})

const startButton = document.querySelector("#startButton");
startButton.addEventListener("click", () => {
    Game.start();
})