let row, col, cells = [];
let numbersOrder = [];
let currentIndex = 0;
let clickEnabled = false;  // セルをクリックできるか
let s_flag = false;
let change_time = 3000; 

const grid = document.getElementById("grid");
const timerDisplay = document.getElementById("timer");

// ===== ページ読み込み時に初期表示 =====
updateTimerDisplay();

// ===== グリッド生成関数 =====
function makeGrid(rows, cols) {
    grid.innerHTML = "";
    cells = [];
    grid.style.gridTemplateColumns = `repeat(${cols}, 80px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 80px)`;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            const cell_Num = r * cols + c;
            cell.dataset.number = cell_Num;
            grid.appendChild(cell);
            cells.push(cell);

            // クリック処理
            cell.addEventListener("click", () => {
                if (!clickEnabled) return;// falseなら何もしない、処理終了

                const span = cell.querySelector("span");
                if (!span) return;// クリックしたセルに数字があるか確認

                const num = parseInt(span.textContent);// 数字を文字列から数字に変換
                span.style.visibility = "visible";// 数字を表示

                if (num === numbersOrder[currentIndex]) {
                    cell.style.background = "#66FF66";
                    currentIndex++;
                    if (currentIndex === numbersOrder.length) {
                        endGame("クリア！おめでとう！");
                    }
                } else {
                    cell.style.background = "#f03";
                    cells.forEach(c => {
                        const s = c.querySelector("span");
                        if (s) s.style.visibility = "visible";
                    });
                    endGame("間違い！残念");
                }
            });
        }
    }
}

// ==== ゲーム終了処理  =====
function endGame(message) {
    clickEnabled = false;
    setTimeout(() => {
        alert(message);
        s_flag = false;
    }, 70);
}

// ===== スタートボタン =====
document.getElementById("start").addEventListener("click", function () {
    if (s_flag) return;
    s_flag = true;

    clickEnabled = false;  // 数字が隠れるまではクリック禁止
    reset();

    const numbers = [1, 2, 3, 4, 5, 6, 7];
    numbersOrder = [...numbers]; // 正解の順番を保持する配列 [1,2,3,4,5,6,7]
    let availablesCells = cells.map(cell => cell.dataset.number);  // 数字を置けるセル番号のリスト [0,1,2,...,69]

    numbers.forEach(num => {
        const randomIndex = Math.floor(Math.random() * availablesCells.length);
        const displayNum = availablesCells[randomIndex];
        const chosenCell = cells.find(cell => cell.dataset.number == displayNum);

        const span = document.createElement("span");
        span.textContent = num;
        chosenCell.appendChild(span);

        // 数字を隠す処理
        setTimeout(() => {
            span.style.visibility = "hidden";
            chosenCell.style.background = "#ccc";
            if (num === numbers[numbers.length - 1]) {
                clickEnabled = true;
            }
        }, change_time);

        availablesCells.splice(randomIndex, 1);
    });

    // ===== タイマー処理 =====
    let remainingTime = change_time;
    timerDisplay.textContent = `残り: ${(remainingTime / 1000).toFixed(1)} 秒`;

    const intervalId = setInterval(() => {
        remainingTime -= 100;
        if (remainingTime <= 0) {
            clearInterval(intervalId);
            timerDisplay.textContent = "残り: 0.0 秒";

            // 2秒待ってからリセット表示
            setTimeout(() => {
                updateTimerDisplay();
            }, 2500);

        } else {
            timerDisplay.textContent = `残り: ${(remainingTime / 1000).toFixed(1)} 秒`;
        }
    }, 100);
});

// ===== 表示時間変更 =====
document.getElementById("hideTime").addEventListener("click", () => {
    const change = document.getElementById("hideTime");
    change_time = parseInt(hideTime.value);

    // 入力直後に表示も更新
    updateTimerDisplay();
});

// ===== 初期化 =====
function reset() {
    cells.forEach(cell => {
        cell.style.background = "#fff";
        const span = cell.querySelector("span");
        if (span) cell.removeChild(span);
    });
    currentIndex = 0;
    clickEnabled = false;
}

// ===== タイマー表示を更新する関数 =====
function updateTimerDisplay() {
    timerDisplay.textContent = `残り: ${(change_time / 1000).toFixed(1)} 秒`;
}

// ===== 行列切り替えボタン =====
document.querySelectorAll(".gyoretsu").forEach(btn => {
    btn.addEventListener("click", () => {
        if (s_flag) return; // ゲーム中は変更できない

        // 既存の選択解除
        document.querySelectorAll(".gyoretsu").forEach(b => b.classList.remove("active"));

        // 今押したボタンだけ選択状態に
        btn.classList.add("active");

        if (btn.id === "grid710") makeGrid(7, 10);
        if (btn.id === "grid57") makeGrid(5, 7);
        if (btn.id === "grid45") makeGrid(4, 5);
    });
});

// ===== 初期は 7×10 を選択済みにする =====
makeGrid(7, 10);
document.getElementById("grid710").classList.add("active");
