document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("game-board");

  // Initialize a 4x4 grid
  const gridSize = 4;
  let grid = [];

  function initializeGrid() {
    for (let i = 0; i < gridSize; i++) {
      grid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        grid[i][j] = 0;
      }
    }
  }

  function renderGrid() {
    gameBoard.innerHTML = ""; // Clear the board
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        if (grid[i][j] !== 0) {
          tile.textContent = grid[i][j];
        }
        gameBoard.appendChild(tile);
      }
    }
  }

  function addRandomTile() {
    let emptyTiles = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (grid[i][j] === 0) {
          emptyTiles.push({ x: i, y: j });
        }
      }
    }
    if (emptyTiles.length > 0) {
      const { x, y } =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      grid[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function startGame() {
    initializeGrid();
    addRandomTile();
    addRandomTile();
    renderGrid();
  }

  document
    .getElementById("restart-button")
    .addEventListener("click", startGame);

  startGame();
});

document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById('game-board');
    const restartButton = document.getElementById('restart-button');
    const gameOverModal = document.getElementById('game-over-modal');
    const closeModal = document.getElementById('close-modal');
    const modalRestartButton = document.getElementById('modal-restart-button');

    const gridSize = 4;
    let grid = [];

    function initializeGrid() {
        for (let i = 0; i < gridSize; i++) {
            grid[i] = [];
            for (let j = 0; j < gridSize; j++) {
                grid[i][j] = 0;
            }
        }
    }

    function renderGrid() {
        gameBoard.innerHTML = '';
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                if (grid[i][j] !== 0) {
                    const tileValue = document.createElement('span');
                    tileValue.textContent = grid[i][j];
                    tile.setAttribute('data-value', grid[i][j]);
                    tile.appendChild(tileValue);
                }
                gameBoard.appendChild(tile);
            }
        }
    }

    function addRandomTile() {
        let emptyTiles = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === 0) {
                    emptyTiles.push({ x: i, y: j });
                }
            }
        }
        if (emptyTiles.length > 0) {
            const { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            grid[x][y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function slide(row) {
        row = row.filter(val => val);
        let missing = gridSize - row.length;
        let zeros = Array(missing).fill(0);
        row = zeros.concat(row);
        return row;
    }

    function combine(row) {
        for (let i = gridSize - 1; i > 0; i--) {
            if (row[i] === row[i - 1]) {
                row[i] *= 2;
                row[i - 1] = 0;
            }
        }
        return row;
    }

    function moveRight() {
        for (let i = 0; i < gridSize; i++) {
            grid[i] = slide(grid[i]);
            grid[i] = combine(grid[i]);
            grid[i] = slide(grid[i]);
        }
    }

    function moveLeft() {
        for (let i = 0; i < gridSize; i++) {
            grid[i] = grid[i].reverse();
            grid[i] = slide(grid[i]);
            grid[i] = combine(grid[i]);
            grid[i] = slide(grid[i]);
            grid[i] = grid[i].reverse();
        }
    }

    function moveUp() {
        for (let j = 0; j < gridSize; j++) {
            let column = [];
            for (let i = 0; i < gridSize; i++) {
                column.push(grid[i][j]);
            }
            column = column.reverse();
            column = slide(column);
            column = combine(column);
            column = slide(column);
            column = column.reverse();
            for (let i = 0; i < gridSize; i++) {
                grid[i][j] = column[i];
            }
        }
    }

    function moveDown() {
        for (let j = 0; j < gridSize; j++) {
            let column = [];
            for (let i = 0; i < gridSize; i++) {
                column.push(grid[i][j]);
            }
            column = slide(column);
            column = combine(column);
            column = slide(column);
            for (let i = 0; i < gridSize; i++) {
                grid[i][j] = column[i];
            }
        }
    }

    function control(e) {
        if (e.keyCode === 39 || e.type === 'swiperight') {
            moveRight();
        } else if (e.keyCode === 37 || e.type === 'swipeleft') {
            moveLeft();
        } else if (e.keyCode === 38 || e.type === 'swipeup') {
            moveUp();
        } else if (e.keyCode === 40 || e.type === 'swipedown') {
            moveDown();
        }

        addRandomTile();
        renderGrid();
        if (isGameOver()) {
            showGameOverModal();
        }
    }

    function isGameOver() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === 0) {
                    return false;
                }
                if (j !== gridSize - 1 && grid[i][j] === grid[i][j + 1]) {
                    return false;
                }
                if (i !== gridSize - 1 && grid[i][j] === grid[i + 1][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    function showGameOverModal() {
        gameOverModal.style.display = "block";
    }

    function closeGameOverModal() {
        gameOverModal.style.display = "none";
    }

    function restartGame() {
        initializeGrid();
        addRandomTile();
        addRandomTile();
        renderGrid();
        closeGameOverModal();
    }

    // Event listeners
    document.addEventListener('keydown', control);

    restartButton.addEventListener('click', () => {
        restartButton.style.animation = 'restart-animation 0.5s ease-in-out';
        restartGame();
    });

    closeModal.addEventListener('click', closeGameOverModal);

    modalRestartButton.addEventListener('click', restartGame);

    window.addEventListener('click', (event) => {
        if (event.target === gameOverModal) {
            closeGameOverModal();
        }
    });

    // Initialize game
    restartGame();
});
