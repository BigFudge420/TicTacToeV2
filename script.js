//To prevent functions running before DOM loads
document.addEventListener('DOMContentLoaded', function(){ 
    let MarkerBtns = document.querySelectorAll('.marker-button')
    let resetBtn = document.querySelector('.reset-button')
    let currentMarker = document.querySelector('.marker-status')
    let buttons = document.querySelectorAll('.cell-button')
    let closeButton = document.querySelector('.closeButton')
    let overlay = document.getElementById('overlay')
    let resultPopup = document.querySelector('.resultPopup')
    let popupTitle = document.querySelector('.popupTitle')
    let popupBody = document.querySelector('.popupBody')
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
                console.log('yeaa')
                Gameboard.updateBoard(computerCell, computerMarker)
                GameboardDisplay.updateBoardDisplay(computerCell, computerMarker)

                // Checks for tie or win
                if (checkWin(computerMarker)){
                    gameOver = true
                    Popup.revealPopup()
                    popupTitle.textContent = "The Specter's Triumph"
                    popupBody.textContent = "Yeehaw! The Specter done wrangled ya good, partner! With its slick moves and cunning algorithms, it outwitted ya quicker than a jackrabbit in a dust storm. Looks like victory's gone and danced off into the neon horizon without ya. But don't you fret none, there's always another round on the digital prairie."
                }
                else if(board.every((cell) => cell !== '')){
                    gameOver = true
                    Popup.revealPopup()
                    popupTitle.textContent = "Stalemate"
                    popupBody.textContent = "Well, ain't this a pickle? You and The Specter done got yourselves in a right proper deadlock, like two gunslingers staring each other down at high noon. With neither one of ya budging an inch, the game ended in a stalemate, leaving both of ya biting the cyber dust. Guess sometimes in this neon-lit saga, there ain't no winners, just two souls fading into the digital abyss together."
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

                // Checks for tie or win
                if (checkWin(humanMarker)){
                    gameOver = true
                    Popup.revealPopup()
                    popupTitle.textContent = "Outwitting The Specter"
                    popupBody.textContent = "Well, slap me silly and call me a glitch! You done gone and outsmarted The Specter, partner! With your sharp wit and quick reflexes, you danced circles 'round that digital varmint like a tumbleweed in a cyclone. Victory's yours, shining brighter than a neon sign at midnight. You've shown that even in this dystopian frontier, there's still room for a little triumph and glory."
                }
                else if(board.every((cell) => cell !== '')){
                    gameOver = true
                    Popup.revealPopup()
                    popupTitle.textContent = "Stalemate"
                    popupBody.textContent = "Well, ain't this a pickle? You and The Specter done got yourselves in a right proper deadlock, like two gunslingers staring each other down at high noon. With neither one of ya budging an inch, the game ended in a stalemate, leaving both of ya biting the cyber dust. Guess sometimes in this neon-lit saga, there ain't no winners, just two souls fading into the digital abyss together."
                }
                else{
                    computerPlay()
                }
            }
            else{
                return
            }
        }

        // Starts the game and applies event listeners
        const start = () => {
            GameboardDisplay.setMarker()
            buttons.forEach(btn => {
                btn.addEventListener('click', humanPlay)
            })            
            resetBtn.addEventListener('click', () => {
                reset()
            })
            closeButton.addEventListener('click', () => {
                Popup.closePopup()
            })
        }

        // Resets the game
        const reset = () => {
            GameboardDisplay.clearBoardDisplay()
            Gameboard.resetBoard()
            gameOver = false
            if (humanMarker === 'O'){
                computerPlay()
            }
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
                    if (btn.textContent !== humanMarker){
                        humanMarker = btn.textContent
                        computerMarker = humanMarker === 'X' ? 'O' : 'X';
                        Gamecontroller.reset()
                        if (computerMarker === 'X'){
                            currentMarker.textContent = 'Your marker : O'
                        }
                        else{
                            currentMarker.textContent = 'Your marker : X'                        
                        }
                    }
                })
            })
        }

        return {clearBoardDisplay, updateBoardDisplay, setMarker}

    })()

    // Deals with the popups
    const Popup = (() => {

        // Closes the popup by removing the 'active' class
        const closePopup = () => {
            resultPopup.classList.remove('active')
            overlay.classList.remove('active')
        }
        
        const revealPopup = () => {
            resultPopup.classList.add('active')
            overlay.classList.add('active')
        }

        return {closePopup, revealPopup}
    })()

    Gamecontroller.start()
})


