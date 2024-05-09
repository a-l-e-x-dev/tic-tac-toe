const winingPositionsMask =
    [
        [
            [1, 1, 1],
            [0, 0, 0],
            [0, 0, 0]
        ],
        [
            [0, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        [
            [0, 0, 0],
            [0, 0, 0],
            [1, 1, 1]
        ],
        [
            [1, 0, 0],
            [1, 0, 0],
            [1, 0, 0]
        ],
        [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0]
        ],
        [
            [0, 0, 1],
            [0, 0, 1],
            [0, 0, 1]
        ],
        [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ],
        [
            [0, 0, 1],
            [0, 1, 0],
            [1, 0, 0]
        ]
    ];

export function process(currentBoard, playersSide, difficultyLevel) {
    const computerSide = playersSide === 'X' ? 'O' : 'X';
    let nextBoard = [];
    //reducing the difficulty level
    if ((difficultyLevel !== 1) && (Math.floor(Math.random() * 101) >= difficultyLevel * 100)) {
        nextBoard = makeARandomMove(currentBoard, computerSide);
    }
    //highest mode(but with a chance to win)
    if (nextBoard.length == 0) {
        nextBoard = winTheGame(currentBoard, computerSide);
    }
    if (nextBoard.length == 0) {
        nextBoard = preventTheRivalsWinning(currentBoard, computerSide);
    }
    if (nextBoard.length == 0) {
        nextBoard = makeAStrategicMove(currentBoard, computerSide);
    }
    if (nextBoard.length == 0) {
        nextBoard = makeARandomMove(currentBoard, computerSide);
    }
    return nextBoard;
}

function winTheGame(currentBoard, xOrO) {
    const numXorO = xOrO === 'X' ? 1 : 0;
    const indexesOfEmptyCell = [];
    currentBoard.forEach((e, indx) => {
        if (e == null) {
            indexesOfEmptyCell.push(indx);
        }
    })
    for (let i = 0; i < indexesOfEmptyCell.length; i++) {
        const hypotheticalBoard = [...currentBoard];
        hypotheticalBoard[indexesOfEmptyCell[i]] = numXorO;
        if (checkForTheWinner(hypotheticalBoard) === xOrO) {
            currentBoard[indexesOfEmptyCell[i]] = numXorO;
            return currentBoard;
        }
    }
    return [];
}

function preventTheRivalsWinning(currentBoard, xOrO) {
    const numXorO = xOrO === 'X' ? 1 : 0;
    const numRivalsSide = xOrO === 'X' ? 0 : 1;
    const indexesOfEmptyCell = [];
    currentBoard.forEach((e, indx) => {
        if (e == null) {
            indexesOfEmptyCell.push(indx);
        }
    })
    for (let i = 0; i < indexesOfEmptyCell.length; i++) {
        const hypotheticalBoard = [...currentBoard];
        hypotheticalBoard[indexesOfEmptyCell[i]] = numRivalsSide;
        if (checkForTheWinner(hypotheticalBoard) === (xOrO === 'X' ? 'O' : 'X')) {
            currentBoard[indexesOfEmptyCell[i]] = numXorO;
            return currentBoard;
        }
    }
    return [];
}

function makeAStrategicMove(currentBoard, xOrO) {
    const nextMoveChoices = new Set();
    winingPositionsMask.forEach(e => {
        let maskToCompare = [...e[0], ...e[1], ...e[2]];
        let maskPointsWhichNotCupturedByRival = 0;
        let maskPointsWhichHaveOurFlag = 0;
        let positionsToAddTemp = [];

        for (let i = 0; i < maskToCompare.length; i++) {
            //check if the considered line is not captured by the enemy
            if ((maskToCompare[i] === 1) && (currentBoard[i] !== (xOrO === 'X' ? 0 : 1))) {
                maskPointsWhichNotCupturedByRival++;
                if (currentBoard[i] === (xOrO === 'X' ? 1 : 0)) {
                    maskPointsWhichHaveOurFlag++;
                }
                if (currentBoard[i] !== (xOrO === 'X' ? 1 : 0)) {
                    positionsToAddTemp.push(i);
                }
            }
        }
        if ((maskPointsWhichNotCupturedByRival === 3) && (maskPointsWhichHaveOurFlag === 1)) {
            positionsToAddTemp.forEach(e => nextMoveChoices.add(e));
        }
    })
    if (nextMoveChoices.size === 0) return [];
    const randomSuitableMoveIndex = Math.floor(Math.random() * Array.from(nextMoveChoices).length);
    const nextMove = Array.from(nextMoveChoices)[randomSuitableMoveIndex];
    currentBoard[nextMove] = xOrO === 'X' ? 1 : 0;
    return currentBoard;
}

function makeARandomMove(currentBoard, xOrO) {
    const possibleMoveIndx = [];
    for (let [index, val] of currentBoard.entries()) {
        if (val === null) {
            possibleMoveIndx.push(index);
        }
    }
    if (possibleMoveIndx.length > 0) {
        let nextMove = possibleMoveIndx[Math.floor(Math.random() * possibleMoveIndx.length)];
        currentBoard[nextMove] = xOrO === 'X' ? 1 : 0;
    }
    return currentBoard;
}

export function checkForTheWinner(currentBoard) {
    let answer = '';

    winingPositionsMask.forEach(e => {
        let maskToCompare = [...e[0], ...e[1], ...e[2]];
        let maskMatchesForX = 0;
        let maskMatchesForO = 0;
        for (let i = 0; i < 9; i++) {
            if ((maskToCompare[i] === 1) && (currentBoard[i] === 1)) maskMatchesForX++;
            if ((maskToCompare[i] === 1) && (currentBoard[i] === 0)) maskMatchesForO++;
        }
        if (maskMatchesForX === 3) answer = 'X';
        if (maskMatchesForO === 3) answer = 'O';
    })

    if (!currentBoard.includes(null) && answer !== 'X' && answer !== 'O') {
        answer = 'Draw';
    }

    return answer;
}

export function getUiLineForTheWinner(currentBoard, xOrO) {
    for (let i = 0; i < winingPositionsMask.length; i++) {
        let maskToCompare = [...winingPositionsMask[i][0], ...winingPositionsMask[i][1], ...winingPositionsMask[i][2]];
        let matches = 0;
        for (let n = 0; n < 9; n++) {
            if ((maskToCompare[n] === 1) && (currentBoard[n] === (xOrO === 'X' ? 1 : 0))) matches++;
            if (matches === 3) return i;
        }
    }
}
