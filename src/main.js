const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 270,
  zoom: 3,
  backgroundColor: '#0a0a1a',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
      debug: false
    }
  },
  scene: [PreloadScene, GameScene, UIScene]
};

window.game = new Phaser.Game(config);
