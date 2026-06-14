let stones = 15;
let gameOver = false;
let nodeCount = 0;

function initializeGame() {

    stones = Math.floor(Math.random() * 11) + 10;

    gameOver = false;
    nodeCount = 0;

    updateUI();

    const firstTurn =
        document.getElementById("firstTurn").value;

    if (firstTurn === "ai") {

        document.getElementById("status").innerText =
            "AI Starts";

        setTimeout(aiMove, 1000);
    }

    else if (firstTurn === "human") {

        document.getElementById("status").innerText =
            "Your Turn";
    }

    else {

        if (Math.random() < 0.5) {

            document.getElementById("status").innerText =
                "Your Turn";
        }

        else {

            document.getElementById("status").innerText =
                "AI Starts";

            setTimeout(aiMove, 1000);
        }
    }
}

function updateUI() {

    document.getElementById("stoneCount").innerText =
        stones;

    document.getElementById("currentAlgo").innerText =
        document.getElementById("algorithm").value;

    document.getElementById("nodes").innerText =
        nodeCount;

    generateTree();
}

function playerMove(amount) {

    if (gameOver) return;

    if (amount > stones) return;

    stones -= amount;

    updateUI();

    if (stones <= 0) {

        document.getElementById("status").innerText =
            "You Win!";

        gameOver = true;
        return;
    }

    document.getElementById("status").innerText =
        "AI Thinking...";

    setTimeout(aiMove, 700);
}

function randomLegalMove() {

    return Math.min(
        stones,
        Math.floor(Math.random() * 3) + 1
    );
}

function aiMove() {

    if (gameOver) return;

    nodeCount = 0;

    const algorithm =
        document.getElementById("algorithm").value;

    const depth =
        parseInt(
            document.getElementById("depth").value
        );

    const difficulty =
        document.getElementById("difficulty").value;

    let bestMove = 1;
    let bestValue = -Infinity;

    for (let move = 1; move <= 3; move++) {

        if (stones - move < 0) continue;

        let value;

        if (algorithm === "minimax") {

            value = minimax(
                stones - move,
                depth,
                false
            );
        }

        else {

            value = alphaBeta(
                stones - move,
                depth,
                -Infinity,
                Infinity,
                false
            );
        }

        if (value > bestValue) {

            bestValue = value;
            bestMove = move;
        }
    }

    if (difficulty === "easy") {

        if (Math.random() < 0.40) {

            bestMove = randomLegalMove();
        }
    }

    if (difficulty === "medium") {

        if (Math.random() < 0.15) {

            bestMove = randomLegalMove();
        }
    }

    stones -= bestMove;

    updateUI();

    if (stones <= 0) {

        document.getElementById("status").innerText =
            "AI Wins!";

        gameOver = true;
        return;
    }

    document.getElementById("status").innerText =
        `AI took ${bestMove} stone(s). Your Turn`;
}

function minimax(stonesLeft, depth, maximizing) {

    nodeCount++;

    if (stonesLeft <= 0) {

        return maximizing ? -100 : 100;
    }

    if (depth === 0) {

        return evaluate(stonesLeft);
    }

    if (maximizing) {

        let best = -Infinity;

        for (let move = 1; move <= 3; move++) {

            if (stonesLeft - move < 0) continue;

            best = Math.max(
                best,
                minimax(
                    stonesLeft - move,
                    depth - 1,
                    false
                )
            );
        }

        return best;
    }

    let best = Infinity;

    for (let move = 1; move <= 3; move++) {

        if (stonesLeft - move < 0) continue;

        best = Math.min(
            best,
            minimax(
                stonesLeft - move,
                depth - 1,
                true
            )
        );
    }

    return best;
}

function alphaBeta(
    stonesLeft,
    depth,
    alpha,
    beta,
    maximizing
) {

    nodeCount++;

    if (stonesLeft <= 0) {

        return maximizing ? -100 : 100;
    }

    if (depth === 0) {

        return evaluate(stonesLeft);
    }

    if (maximizing) {

        let value = -Infinity;

        for (let move = 1; move <= 3; move++) {

            if (stonesLeft - move < 0) continue;

            value = Math.max(
                value,
                alphaBeta(
                    stonesLeft - move,
                    depth - 1,
                    alpha,
                    beta,
                    false
                )
            );

            alpha = Math.max(alpha, value);

            if (beta <= alpha) break;
        }

        return value;
    }

    let value = Infinity;

    for (let move = 1; move <= 3; move++) {

        if (stonesLeft - move < 0) continue;

        value = Math.min(
            value,
            alphaBeta(
                stonesLeft - move,
                depth - 1,
                alpha,
                beta,
                true
            )
        );

        beta = Math.min(beta, value);

        if (beta <= alpha) break;
    }

    return value;
}

function evaluate(stonesLeft) {

    return stonesLeft % 4 === 0
        ? -10
        : 10;
}

function restartGame() {

    initializeGame();
}

function generateTree() {

    const s = stones;

    document.getElementById("tree").innerText =
`${s}
├── ${s-1}
│   ├── ${s-2}
│   ├── ${s-3}
│   └── ${s-4}
├── ${s-2}
│   ├── ${s-3}
│   ├── ${s-4}
│   └── ${s-5}
└── ${s-3}
    ├── ${s-4}
    ├── ${s-5}
    └── ${s-6}`;
}

initializeGame();