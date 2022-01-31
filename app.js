const board = document.querySelector('#board')
const DIMENSION = 20
const SQUARES_NUMBER = Math.pow(DIMENSION, 2)
const colors = ['#DAA520', '#9370DB', '#00E5EE', '#B3EE3A', '#FF7F24', '#8B0000']
const SQUARES = []

let isMouseDown = false
let state = false
let intervalId
let conditions = Array(SQUARES_NUMBER).fill(0).map(() => Math.random() > 0.5 ? 1 : 0)
let speed




function checkSquare(index, array) {
    const isCellInLeftColumn = index % DIMENSION === 0;
    const isCellInRightColumn = (index + 1) % DIMENSION === 0;

    const leftNeighbours = [
        index - DIMENSION -1,
        index - 1,
        index + DIMENSION -1
    ];

    const rightNeighbours = [
        index - DIMENSION + 1,
        index + 1,
        index + DIMENSION + 1
    ];

    const neighbourIndexes = [index - DIMENSION, index + DIMENSION];

    if (!isCellInLeftColumn) {
        neighbourIndexes.push(...leftNeighbours);
    }

    if (!isCellInRightColumn) {
        neighbourIndexes.push(...rightNeighbours);
    }

    const dimCount = neighbourIndexes
        .filter((value) => value >= 0 && value <= SQUARES_NUMBER)
        .map((index) => conditions[index])
        .reduce((acc, value) => acc + value)

    if (conditions[index] && (dimCount != 2 && dimCount != 3)){
        array[index] = 0
    }
    if (!conditions[index] && (dimCount === 3)){
        array[index] = 1
    }

}

function initBoard(){
    board.style.width = `${20 * DIMENSION }px`

    for (let i = 0; i < SQUARES_NUMBER; i++) {
        const square = document.createElement('div')
        square.classList.add('square')
        square.draggable = false
        square.dataset.cellIndex = i;
        square.addEventListener('mouseover', (event) => {
            if (isMouseDown) {
                switchActive(event.target)
            }

        })
        board.append(square)
    }
    SQUARES.push(...board.getElementsByClassName('square'))

}


function renderBoard(array){
    for (let i = 0; i < SQUARES_NUMBER; i++){
        if (array[i]){
            setColor(SQUARES[i])
        } else {
            removeColor(SQUARES[i])
        }
    }
}

function tick(){
    const array = [...conditions]
    for (let i = 0; i < conditions.length; i++){
        checkSquare(i, array);
    }
    conditions = [...array]
    renderBoard(conditions)
}

function switchActive(element){
    conditions[element.dataset.cellIndex] = !conditions[element.dataset.cellIndex]
    renderBoard(conditions)
}

function setColor(element) {
    const color = getRandomColor()
    element.style.backgroundColor = color
    element.style.boxShadow = `0 0 2px ${color}, 0 0 10px ${color}`
}

function removeColor(element) {
    element.style.backgroundColor = '#1d1d1d'
    element.style.boxShadow = `0 0 2px #000`
}

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)]
}


function startGame(){
    if (!state){
        intervalId = setInterval(tick, speed)
        state = true
    }
}

function stopGame(){
    if (state){
        clearInterval(intervalId)
        state = false
    }
}

function toggleStatus(){
    if (!state){
        startGame()
    } else {
        stopGame()
    }
}

function main(){

    document.addEventListener('mousedown', () => {
        if (!isMouseDown){
            isMouseDown = true
        }
    })

    document.addEventListener('mouseup', () => {
        if (isMouseDown){
            isMouseDown = false
        }
    })

    const startStopButton = document.querySelector('.startStopButton')
    startStopButton.addEventListener('click', toggleStatus)
    const delayInput = document.querySelector('.delayInput')
    delayInput.addEventListener('input', (event) => {
        speed = event.target.value
        toggleStatus()
        toggleStatus()
    })

    speed = delayInput.value
    initBoard()

}

main()