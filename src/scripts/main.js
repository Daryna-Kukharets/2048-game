'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const buttonStart = document.querySelector('.button.start');

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const keyToDirectionMap = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
  };

  const direction = keyToDirectionMap[e.key];

  if (!direction) {
    return;
  }

  const moved = game.move(direction);

  if (moved) {
    const newTile = game.addRandomTile();

    game.lastNewTiles = [newTile];
    game.checkGameState();
    updateView();
  }
});

function updateView() {
  let i = 0;
  const state = game.getState();
  const newTiles = game.lastNewTiles || [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cell = cells[i];

      cell.className = 'field-cell';
      cell.style.transform = '';

      if (state[row][col]) {
        cell.textContent = state[row][col];
        cell.classList.add(`field-cell--${state[row][col]}`);

        const isNewTile = newTiles.some(
          (t) => t && t.row === row && t.col === col,
        );

        if (isNewTile) {
          cell.classList.add('new-tile');

          // Щоб клас не залишався після анімації
          cell.addEventListener(
            'animationend',
            () => {
              cell.classList.remove('new-tile');
            },
            { once: true },
          );
        }
      } else {
        cell.textContent = '';
      }
      i++;
    }
  }

  document.querySelector('.game-score').textContent = game.getScore();

  const statusGame = game.getStatus();

  if (statusGame === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (statusGame === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}

buttonStart.addEventListener('click', () => {
  if (buttonStart.className === 'button restart') {
    game.restart();
  }

  game.start();
  updateView();
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-start').classList.add('hidden');
  buttonStart.textContent = 'Restart';
  buttonStart.className = 'button restart';
});
