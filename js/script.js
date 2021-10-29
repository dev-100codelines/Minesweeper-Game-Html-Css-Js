const board = document.getElementById('board')
const boxes = 6;
let time = 0, timeInterval = null, isGameStarted = false;

function start() {
    document.getElementById('mines').innerText = String(boxes)
    timeInterval = setInterval(function () {
        document.getElementById('time').innerText = String(++time);
    }, 1000);
    for (let i = 0; i < boxes; i++) {
        let row = board.insertRow(i);
        for (let j = 0; j < boxes; j++) {
            let cell = row.insertCell(j);
            cell.onclick = function () {
                onCellClick(this);
            };
            let mine = document.createAttribute('data-mine');
            mine.value = "false";
            cell.setAttributeNode(mine);
        }
    }
}

function onCellClick(cell) {
    cell.onclick = undefined
    cell.style.cursor = 'default'
    cell.className = 'clicked'
    if (!isGameStarted) {
        isGameStarted = true
        generateMines()
        cell.innerHTML = '<span></span>'
    } else {
        if (cell.getAttribute("data-mine") === "true") {
            gameOver(false);
        } else {
            let mines = 0;
            let row = cell.parentNode.rowIndex;
            let col = cell.cellIndex;
            for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, boxes - 1); i++) {
                for (let j = Math.max(col - 1, 0); j <= Math.min(col + 1, boxes - 1); j++) {
                    if (board.rows[i].cells[j].getAttribute("data-mine") === "true") mines++;
                }
            }
            if (mines !== 0) {
                cell.innerHTML = '<span>' + mines + '</span>';
            } else {
                cell.innerHTML = '<span></span>';
            }
            isFinished()
        }
    }
}

function isFinished() {
    let isFinished = true;
    for (let i = 0; i < boxes; i++) {
        for (let j = 0; j < boxes; j++) {
            if ((board.rows[i].cells[j].getAttribute("data-mine") === 'false') && (board.rows[i].cells[j].innerHTML === '')) isFinished = false;
        }
    }
    if (isFinished) gameOver(true)
}

function generateMines() {
    for (let i = 0; i < boxes; i++) {
        let row = Math.floor(Math.random() * boxes);
        let col = Math.floor(Math.random() * boxes);
        let cell = board.rows[row].cells[col];
        cell.setAttribute('data-mine', 'true')
        cell.innerHTML = '<span><img src="assets/img/bomb.svg" alt="bomb"></span>'
    }
}

function gameOver(isWin) {
    for (let i = 0; i < boxes; i++) {
        for (let j = 0; j < boxes; j++) {
            let cell = board.rows[i].cells[j];
            if (cell.getAttribute('data-mine') === 'true') {
                cell.children[0].style.display = 'block'
            }
        }
    }
    clearInterval(timeInterval)
    let msg = 'You Win...!';
    if (!isWin) msg = 'You lose...!'
    alert(msg);
    if (confirm('Do you want to play again?')) {
        window.location.reload();
    } else {
        for (let i = 0; i < boxes; i++) {
            for (let j = 0; j < boxes; j++) {
                let cell = board.rows[i].cells[j];
                cell.onclick = undefined
            }
        }
    }
}
