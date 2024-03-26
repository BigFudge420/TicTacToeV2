//To prevent functions running before DOM loads
document.addEventListener('DOMContentLoaded', function(){ 
    let MarkerBtns = document.querySelectorAll('.marker-button')
    let resetBtn = document.querySelector('.reset-button')
    let buttons = document.querySelectorAll('.cell-button')
    let closeButton = document.querySelector('.closeButton')
    let overlay = document.getElementById('overlay')
    let resultPopup = document.querySelector('.resultPopup')
    let popupTitle = document.querySelector('.popupTitle')
    let popupBody = document.querySelector('.popupBody')
    let markerX = document.querySelector('.X')
    let markerO = document.querySelector('.O')
    let difficultyMenu = document.getElementById('difficulty-menu')
    let board = ['','','','','','','','','']        
    let gameOver = false
    let humanMarker = 'X'
    let computerMarker = 'O'
    let aiPrecision

    // Gameboard contains methods to modify the board
    const Gameboard = (() => { 


        // Updates board 
        const updateBoard = (state, index, marker) => {
            if (index >= 0 && state[index] === '' && state.length > index && !gameOver){
                state[index] = marker
                return true
            }
            else {
                return false
            }
        }

        // Find available moves
        const getAvailMoves = (state) => {
            let boardIndex = [0,1,2,3,4,5,6,7,8]
            let availMoves = boardIndex.filter((index) => {
                if (state[index] === ''){
                    return true                }
            })
            return availMoves
        }

        // Resets board 
        const resetBoard = () => {
            board = ['','','','','','','','','']
        }

        // Returns the methods 
        return {updateBoard, resetBoard, getAvailMoves}
    })()

    //Gamecontroller controls gameflow 
    const Gamecontroller = (() => {
        gameOver = false

        //Checks if win conditions are met
        const checkWin = (marker, state) => {

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
                    if (state[index] === marker){
                        return true
                    }
                })
            })
        }
        
        // Minimax function to play available moves and return array of moves and scores
        const minimax = (state, isMaximizing, playerMarker) => {
            let emptyCells = Gameboard.getAvailMoves(state)

            // Checks for and evaluates any terminal state in the current state of the game and returns a score
            if (checkWin('O',state) || checkWin('X', state)){

                // If the game is at a terminal state, it returns an array with the index and score associated with the move that leads to this state
                // Returns +1 if the previous player (player that made the move), was AI and vice versa
                if (isMaximizing){
                    return {
                        score: -1
                    }
                }
                else{
                    return {
                        score: 1
                    }
                }
            }

            // If the game ends in a tie, returns array with index and score of 0
            else if(state.every((cell) => cell !== '')){
                return {
                    score: 0
                }
            }

            // Plays all the possible moves available for the player, recursively calls minimax for the opposing player and returns an array of moves and scores
            let moves = []

            for (let i = 0; i < emptyCells.length; i++){
                let move = {}
                move.index = emptyCells[i]

                let newState = [...state]

                // Temporarily updates the gameboard 
                Gameboard.updateBoard(newState, emptyCells[i], playerMarker)

                // Call minimax for opposing player
                if (isMaximizing){
                    let result = minimax(newState, false, humanMarker)
                    move.score = result.score
                }
                else{
                    let result = minimax(newState, true, computerMarker)
                    move.score = result.score
                }

                // Adds the current processing move to the moves array
                moves.push(move)
            }

            // Returns the best move in the moves array 
            return findBestValue(moves, isMaximizing)
            
        }

        // Finds the best move in the moves array created by the minimax function 
        const findBestValue = (moves, isMaximising) => {
            let bestMove
            // Chooses a best score based on the player for which the minimax function was called for
            let bestScore = isMaximising ? -Infinity : Infinity
            
            // Goes through all moves in the array, and chooses the best move based on the player for which the function was called for
            for (let i = 0; i < moves.length; i++) {
                if (isMaximising && moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                } else if (!isMaximising && moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }

            // Returns the best move object
            return moves[bestMove]
        }

        // Controls the computer choice and turn
        const computerPlay = () => {
            let choice
            // Chooses if the move to make will be random or the best available move
            if (aiPrecision >= Math.random()){
                // Returns the index of the best available move
                choice = minimax(board, true, computerMarker).index
            }
            else{
                // Returns a random whole number from 0 to 8
                let play = false
                do {
                    choice = Math.floor(Math.random() * 9)
                    if (board[choice] === ''){
                        play = true
                    }                    
                }while (!play)
            }

            // Updates board and display, and checks win for computer
            if (!gameOver){
                Gameboard.updateBoard(board, choice, computerMarker)
                GameboardDisplay.updateBoardDisplay(choice, computerMarker)

                // Checks for tie or win
                if (checkWin(computerMarker, board)){
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
                Gameboard.updateBoard(board, humanCell, humanMarker)

                // Checks for tie or win
                if (checkWin(humanMarker,board)){
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

        // Sets game difficulty
        const setDifficulty = () => {
            let difficulty
            difficulty = difficultyMenu.value
            difficultyMenu.addEventListener('click', () => {
                // stores the previously chosen difficulty
                let previousDifficulty = difficulty
                difficulty = difficultyMenu.value

                // Sets ai precision based on the difficulty
                if (difficulty === 'easy'){
                    aiPrecision = 0.5
                }
                else if (difficulty === 'medium' ){
                    aiPrecision = 0.7
                
                }
                else if (difficulty === 'hard'){
                    aiPrecision = 0.85
                }
                else if (difficulty === 'unbeatable'){
                    aiPrecision = 1
                }

                // Checks to make sure previous difficulty is not the same as current difficulty and then resets the game
                if(difficulty !== previousDifficulty){
                    Gameboard.resetBoard()
                    GameboardDisplay.clearBoardDisplay()
                    gameOver = false
                }
            })
        }

        // Starts the game and applies event listeners
        const start = () => {
            GameboardDisplay.setMarker()
            setDifficulty()
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

        return {start, reset, humanPlay, computerPlay, checkWin, minimax, findBestValue, setDifficulty}

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
                        if (btn.textContent === 'X'){
                            markerX.classList.add('active')
                            markerO.classList.remove('active')
                        }
                        else {
                            markerO.classList.add('active')
                            markerX.classList.remove('active')
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
        
        // Reveals the popup by adding the 'active' class
        const revealPopup = () => {
            resultPopup.classList.add('active')
            overlay.classList.add('active')
        }

        return {closePopup, revealPopup}
    })()

    Gamecontroller.start()
})


