//To prevent functions running before DOM loads
document.addEventListener('DOMContentLoaded', function(){ 
    let playerMarker = 'O'
    let computerMarker = 'X'
    let currentPlayer = 'player'
    const buttons = document.querySelectorAll('.button')

// Displays markers when a cell is clicked on by player
    function gameBoardDisplay(){
        buttons.forEach(button => {
            console.log('hii')   
            button.addEventListener('click', () =>{
                if (button.textContent === ''){
                    button.textContent = playerMarker
                }
            })
        });
    }

//Starts game and sets up board display 
    function startGame(){
        gameBoardDisplay()
    }
    
    startGame()
})


