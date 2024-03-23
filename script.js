//To prevent functions running before DOM loads
document.addEventListener('DOMContentLoaded', function(){ 
    let MarkerBtns = document.querySelectorAll('.marker-button')
    let resetBtn = document.querySelector('.reset-button')
    const buttons = document.querySelectorAll('.cell-button')
    let board = ['','','','','','','','','']        
    let gameOver = false
    let humanMarker = 'X'
    let computerMarker = 'O'

    // Gameboard contains methods to modify the board
    const Gameboard = (() => { 

        // Updates board 
        const updateBoard = (index, marker) => {
            if (index >= 0 && board[index] === '' && board.length > index && !gameOver){
                board[index] = marker
                return true
            }
            else {
                return false
            }
        }

        // Resets board 
        const resetBoard = () => {
            board = ['','','','','','','','','']
        }

        // Returns the methods 
        return {updateBoard, resetBoard}
    })()

    //Gamecontroller controls gameflow 
    const Gamecontroller = (() => {
        gameOver = false

        //Checks if win conditions are met
        const checkWin = (marker) => {

            //All possible win combinations
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

            //Returns a boolean value if any win condition is met
            return winningCombinations.some((combination) => {
                return combination.every((index) => {
                    if (board[index] === marker){
                        return true
                    }
                })
            })
        }
        
        // Controls the computer choice and turn
        const computerPlay = () => {
            let computerCell
            let cellDOM
            let play = false

            // Selects and checks if selected cell is empty
            do{
                computerCell = Math.floor(Math.random() * 9)
                cellDOM = document.getElementById(`${computerCell}`)
                if (board[computerCell] === '' && cellDOM.textContent === ''){
                    play = true
                }                
            }
            while(!play)

            // Updates board and display, and checks win for computer
            if (play && !gameOver){
                Gameboard.updateBoard(computerCell, computerMarker)
                GameboardDisplay.updateBoardDisplay(computerCell, computerMarker)

                // Checks for tie or win
                if (checkWin(computerMarker)){
                    alert('COMPUTER WINS')
                    gameOver = true
                }
                else if(board.every((cell) => cell !== '')){
                    alert("IT'S A TIE")
                    gameOver = true
                }
            }
        }

        // Controls the human turn and round
        const humanPlay = (e) => {

            // Gets data-field of any target of an event
            let humanCell = e.target.getAttribute('data-field')

            // Updates textcontent and board when clicked on a cell
            if (e.target.textContent === '' && (board[humanCell] === '' && !gameOver)){
                GameboardDisplay.updateBoardDisplay(humanCell, humanMarker)
                Gameboard.updateBoard(humanCell, humanMarker)
                console.log('HIII')

                // Checks for tie or win
                if (checkWin(humanMarker)){
                    alert('PLAYER WINS')
                    gameOver = true
                }
                else if(board.every((cell) => cell !== '')){
                    alert("IT'S A TIE")
                    gameOver = true
                }
                else{
                    setTimeout(computerPlay(), 1000)
                }
            }
            else{
                return
            }
        }

        // Starts the game
        const start = () => {
            GameboardDisplay.setMarker()
            buttons.forEach(btn => {
                btn.addEventListener('click', humanPlay)
            })
            resetBtn.addEventListener('click', () => {
                GameboardDisplay.clearBoardDisplay()
                Gameboard.resetBoard()
            })
        }

        // Resets the game
        const reset = () => {
            GameboardDisplay.clearBoardDisplay()
            Gameboard.resetBoard()
            gameOver = false
        }

        return {start, reset, humanPlay, computerPlay, checkWin}

    })()

    // Board display related stuff
    const GameboardDisplay = (() => {

        // Clears the board from markers
        const clearBoardDisplay = () => {
            buttons.forEach(btn => {
                btn.textContent = ''
            })
        }

        // Updates the cell text
        const updateBoardDisplay = (index, marker) => {
            let button = document.getElementById(index) 
            button.textContent = marker
        }

        // Sets markers
        const setMarker = () => {
            MarkerBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    humanMarker = btn.textContent
                    computerMarker = humanMarker === 'X' ? 'O' : 'X';
                    if (computerMarker === 'X'){
                        Gamecontroller.computerPlay()
                    }
                })
            })
        }

        return {clearBoardDisplay, updateBoardDisplay, setMarker}

    })()

    Gamecontroller.start()
})


