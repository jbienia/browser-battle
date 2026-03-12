class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: false });
  }

  create() {
    const game = this.scene.get('GameScene');

    // ── Level name banner (fades after 3 s) ─────────────────────────────────
    const levelName = LEVELS[game.levelIndex].name;
    const banner = this.add.text(240, 20, levelName, {
      fontSize: '8px',
      color: '#00ff88',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);
    this.tweens.add({ targets: banner, alpha: 0, delay: 3000, duration: 800 });

    // ── Hearts ──────────────────────────────────────────────────────────────
    this.hearts = [];
    for (let i = 0; i < 3; i++) {
      this.hearts.push(
        this.add.text(8 + i * 14, 6, '♥', { fontSize: '10px', color: '#ff4466' })
      );
    }

    // ── Score ───────────────────────────────────────────────────────────────
    this.scoreText = this.add.text(472, 6, 'Score: 0', {
      fontSize: '8px',
      color: '#ffffff'
    }).setOrigin(1, 0);

    // ── Controls hint (fades after 4 s) ─────────────────────────────────────
    const hint = this.add.text(240, 262,
      'WASD/Arrows: Move   Space/W: Jump   Z/X/Click: Shoot', {
        fontSize: '5px', color: '#888888'
      }).setOrigin(0.5, 1);
    this.tweens.add({ targets: hint, alpha: 0, delay: 4000, duration: 1000 });

    // ── Event listeners ─────────────────────────────────────────────────────
    game.events.on('hpChange', (hp) => {
      this.hearts.forEach((h, i) => h.setAlpha(i < hp ? 1 : 0.2));
    }, this);

    game.events.on('scoreChange', (score) => {
      this.scoreText.setText('Score: ' + score);
    }, this);

    game.events.on('win', ({ score, levelIndex }) => {
      const nextIndex = levelIndex + 1;
      const hasNextLevel = nextIndex < LEVELS.length;

      if (hasNextLevel) {
        this.showOverlay(
          `LEVEL ${levelIndex + 1} COMPLETE`,
          `Score: ${score}\n\nPress R for ${LEVELS[nextIndex].name}`,
          '#00ff88'
        );
        this.input.keyboard.once('keydown-R', () => {
          game.goToLevel(nextIndex);
        });
      } else {
        this.showOverlay(
          'YOU WIN!',
          `Final Score: ${score}\n\nPress R to play again`,
          '#ffdd00'
        );
        this.input.keyboard.once('keydown-R', () => {
          game.goToLevel(0);
        });
      }
    }, this);

    game.events.on('gameOver', ({ levelIndex }) => {
      this.showOverlay(
        'GAME OVER',
        'Press R to try again',
        '#ff4444'
      );
      this.input.keyboard.once('keydown-R', () => {
        game.goToLevel(levelIndex);
      });
    }, this);
  }

  showOverlay(title, body, color) {
    this.add.rectangle(240, 135, 480, 270, 0x000000, 0.6);
    this.add.text(240, 110, title, {
      fontSize: '20px',
      color,
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);
    this.add.text(240, 150, body, {
      fontSize: '9px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5);
  }
}
