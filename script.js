//To prevent functions running before DOM loads
document.addEventListener('DOMContentLoaded', function(){ 
    let MarkerBtns = document.querySelectorAll('.marker-button')
    let playerMarker = 'X'
    let computerMarker = 'O'
    let gameOver = false
    let currentPlayer = 'player'
    const buttons = document.querySelectorAll('.cell-button')

// Displays markers when a cell is clicked on by player
    function playerSelectAndDisplayCell(){
        let playerCell
        buttons.forEach(button => {
            console.log('hii')   
            button.addEventListener('click', () =>{
                playerCell = button.getAttribute('data-field')
                if (button.textContent === '' && (board[playerCell] === '' && !gameOver)){
                    button.textContent = playerMarker
                    board[playerCell] = playerMarker
                    if (checkWin(playerMarker)){
                        console.log('PLAYER WINS')
                        gameOver = true
                    }
                    setTimeout(computerSelectAndDisplayCell(), 1000)
                }
                else{
                    return
                }
            })
        });
    }

let board = ['','','','','','','','','']

// Select computer choice and display marker
function computerSelectAndDisplayCell(){
    let computerCell = Math.floor(Math.random() * 9)
    let cellDOM = document.getElementById(`${computerCell}`)
    if((board[computerCell] === '' && !gameOver) && cellDOM.textContent === ''){
        board[computerCell] = computerMarker
        cellDOM.textContent = computerMarker
        console.log(board)
        if (checkWin(computerMarker)){
            console.log('COMPUTER WINS')
            gameOver = true
        }
    }
    else if (!gameOver){
        computerSelectAndDisplayCell()
    }
}

// Sets markers
function setMarker(){
    MarkerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('hellloo')
            playerMarker = btn.textContent
            computerMarker = playerMarker === 'X' ? 'O' : 'X';
        }) 
    })
}

// To check win
function checkWin(marker){
    let winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]
    return winningCombinations.some((combination) => {
        return combination.every((index) => {
            if (board[index] === marker){
                return true
            }
        })
    })
}

//Starts game and sets up board display 
    function startGame(){
        playerSelectAndDisplayCell()
        setMarker()
    }
    
    startGame()
})


