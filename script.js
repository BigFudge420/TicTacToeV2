 document.addEventListener('DOMContentLoaded', function(){
    let playerMarker = 'O'
    let computerMarker = 'X'
    const buttons = document.querySelectorAll('.button')

    currentPlayer = 'player'

    function gameBoardDisplay(){
        buttons.forEach(button => {
            console.log('hii')   
            button.addEventListener('click', () =>{
                if (button.textContent.trim() === ''){
                    button.textContent = playerMarker
                }
            })
        });
    }

    function startGame(){
        gameBoardDisplay()
    }
    
    startGame()
})


