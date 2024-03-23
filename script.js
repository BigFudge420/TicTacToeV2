//To prevent functions running before DOM loads
document.addEventListener('DOMContentLoaded', function(){ 
    let MarkerBtns = document.querySelectorAll('.marker-button')
    let playerMarker = 'X'
    let computerMarker = 'O'
    let currentPlayer = 'player'
    const buttons = document.querySelectorAll('.cell-button')

// Displays markers when a cell is clicked on by player
    function playerSelectAndDisplayCell(){
        let playerCell
        buttons.forEach(button => {
            console.log('hii')   
            button.addEventListener('click', () =>{
                playerCell = button.getAttribute('data-field')
                if (button.textContent === '' && board[playerCell] === ''){
                    button.textContent = playerMarker
                    board[playerCell] = playerMarker
                    computerSelectAndDisplayCell()
                }
                else{
                    return
                }
            })
        });
    }

// MAKE A RANDOM BOT
// 1)Setup cell selection system
// 2)Display marker on selected cell
// 3)Set marker selection system
// 4)Check wins

let board = ['','','','','','','','','']

// Select computer choice and display marker
function computerSelectAndDisplayCell(){
    let computerCell = Math.floor(Math.random() * 9)
    let cellDOM = document.getElementById(`${computerCell}`)
    if(board[computerCell] === '' && cellDOM.textContent === ''){
        board[computerCell] = computerMarker
        cellDOM.textContent = computerMarker
        console.log(board)
    }
    else{
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

//Starts game and sets up board display 
    function startGame(){
        playerSelectAndDisplayCell()
        setMarker()
    }
    
    startGame()
})


