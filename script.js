import { process } from "./tic-tac-toe-v2.js";
import { checkForTheWinner } from "./tic-tac-toe-v2.js";
import { getUiLineForTheWinner } from "./tic-tac-toe-v2.js";

let board = [null, null, null, null, null, null, null, null, null];
let playersSide = 'X';
let difficultyLevel = 1;
let gameHasBeenStarted = false;

window.onload = () => {
    if (localStorage.getItem("difficultyLevel") !== null) {
        difficultyLevel = localStorage.getItem("difficultyLevel");
        let selectIndex = "1";
        if (difficultyLevel == 0) selectIndex = 0;
        if (difficultyLevel == 1) selectIndex = 2;
        document.querySelector("select#difficulty").selectedIndex = selectIndex;
    };
};

var imgIconsGallery = document.querySelector(".image-gallery");
document.querySelector("#text-to-change-bg").addEventListener('click', () => {
    imgIconsGallery.style.display = imgIconsGallery.style.display === "block" ? "none" : "block";
});
document.querySelector(".close-thik").addEventListener('click', () => {
    imgIconsGallery.style.display = "none";
});


document.querySelector("#play-link").addEventListener('click', () => {
    gameHasBeenStarted = !gameHasBeenStarted;
    if (gameHasBeenStarted) {
        if (playersSide === 'O') {
            computersTurn();
        }
        document.querySelector("#play-link").firstChild.textContent = "Reload";
        document.querySelector("select#difficulty").setAttribute('disabled', '');
    } else {
        document.querySelectorAll("[class*='wining-lines']").forEach(e => e.style = '');
        document.querySelectorAll("[class*='wining-lines']").forEach(e => { e.classList.remove('wining-lines-show'); e.classList.add('wining-lines-hidden'); });
        const divForPaintLine = document.querySelectorAll("[class*='wining-lines']")[0];
        divForPaintLine.className = divForPaintLine.className.replace(new RegExp('cross-line-.', 'g'), '').replace(/  +/g, ' ').trim();
        board = [null, null, null, null, null, null, null, null, null];
        updateBoardView();
        document.querySelector("#play-link").firstChild.textContent = "  Play  ";
        document.querySelector("select#difficulty").removeAttribute('disabled');
    }
});


document.querySelector("#x-side").addEventListener('click', () => {
    if (!gameHasBeenStarted) {
        if (!document.querySelector("#x-side").classList.contains("selected-text")) {
            document.querySelector("#x-side").classList.add("selected-text");
            document.querySelector("#o-side").classList.remove("selected-text");
            playersSide = 'X';
        }
    }
});

document.querySelector("#o-side").addEventListener('click', () => {
    if (!gameHasBeenStarted) {
        if (!document.querySelector("#o-side").classList.contains("selected-text")) {
            document.querySelector("#o-side").classList.add("selected-text");
            document.querySelector("#x-side").classList.remove("selected-text");
            playersSide = 'O';
        }
    }
});

document.querySelectorAll(".board li>div").forEach((e, indx) => {
    e.setAttribute('id', 'cell-' + indx);
    e.addEventListener('click', () => {
        if ((gameHasBeenStarted) && (!e.childNodes[1].textContent)) {
            e.childNodes[1].textContent = playersSide;
            board[e.getAttribute('id').replace('cell-', '')] = playersSide === 'X' ? 1 : 0;
            computersTurn();
            updateBoardView();
        }
    })
});

document.querySelector("select#difficulty").addEventListener('change', event => {
    difficultyLevel = event.target.value;
    localStorage.setItem("difficultyLevel", difficultyLevel);
});

document.querySelectorAll("#background_preview_gallery div").forEach((e, indx) => e.addEventListener('click', () => {
    document.body.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('./images/background-" + (indx + 1) + ".jpg')";
}));

function updateBoardView() {
    document.querySelectorAll(".board li>div").forEach((e, indx) => {
        switch (board[indx]) {
            case 0:
                e.childNodes[1].textContent = 'O';
                break;
            case 1:
                e.childNodes[1].textContent = 'X';
                break;
            default:
                e.childNodes[1].textContent = '';
        }
    })
}

function computersTurn() {
    let winnerIfExists = checkForTheWinner(board);
    if ((board.includes(null)) && (!winnerIfExists)) {
        board = process(board, playersSide, difficultyLevel);
        winnerIfExists = checkForTheWinner(board);
    }
    updateBoardView();
    if ((winnerIfExists === 'X') || (winnerIfExists === 'O')) {
        const divForPaintLine = document.querySelectorAll("[class*= 'wining-lines']")[0];
        divForPaintLine.classList.remove("wining-lines-hidden");
        divForPaintLine.style = "background-color: " + (winnerIfExists === 'X' ? 'red' : 'blue') + ';';
        divForPaintLine.classList.add("wining-lines-show");
        divForPaintLine.classList.add("cross-line-" + getUiLineForTheWinner(board, winnerIfExists));
    } else if (winnerIfExists === 'Draw') {
        document.querySelector(".cross-line").classList.remove('wining-lines-hidden');
        document.querySelector(".cross-line").classList.add('wining-lines-show');
    }
}

