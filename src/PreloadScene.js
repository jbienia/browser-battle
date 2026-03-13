const ASSETS = 'Legacy Collection/Assets';

class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // Loading bar
    const bar = this.add.graphics();
    this.load.on('progress', (v) => {
      bar.clear();
      bar.fillStyle(0x00ff88);
      bar.fillRect(40, 125, 400 * v, 20);
    });
    this.add.text(240, 110, 'Loading...', { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5);

    // Backgrounds — Level 1: Bulkhead
    this.load.image('bg-back',  `${ASSETS}/Environments/bulkhead-walls/v1/layers/bulkhead-walls-back.png`);
    this.load.image('bg-pipes', `${ASSETS}/Environments/bulkhead-walls/v1/layers/bulkhead-walls-pipes.png`);

    // Backgrounds — Level 2: Industrial
    this.load.image('bg2-sky',       `${ASSETS}/Environments/parallax-industrial-web/Layers/bg.png`);
    this.load.image('bg2-buildings', `${ASSETS}/Environments/parallax-industrial-web/Layers/buildings.png`);

    // Player — Warped City individual PNGs (80×80 each), loaded as separate images
    const PLAYER = `${ASSETS}/Packs/Warped City/V2/Sprites/Player`;
    const loadFrames = (state, count) => {
      for (let i = 1; i <= count; i++)
        this.load.image(`p-${state}-${i}`, `${PLAYER}/${state}/${state}${i}.png`);
    };
    loadFrames('Idle',  4);
    loadFrames('Run',   8);
    loadFrames('Jump',  7);
    loadFrames('Shoot', 3);
    this.load.image('p-Hurt-1', `${PLAYER}/Hurt/Hurt2.png`);

    // Enemies — three types
    // soldier: 384×420 → 64×60 frames (6 cols × 7 rows); walk cycle = last row (frames 36–41)
    this.load.spritesheet('soldier', `${ASSETS}/Packs/Sewers pack files/Spritesheets/soldier.png`,
      { frameWidth: 64, frameHeight: 60 });
    // fox: 640×48 → 80×48 frames (8 frames, single row)
    this.load.spritesheet('fox', `${ASSETS}/Packs/Magic Cliffs/Enemies Files/spritesheets/fox-sword.png`,
      { frameWidth: 80, frameHeight: 48 });
    // ghoul: 456×60 → 57×60 frames (8 frames, single row)
    this.load.spritesheet('ghoul', `${ASSETS}/Packs/Gothicvania Church/SPRITES/burning-ghoul/spritesheet/v1/burning-ghoul.png`,
      { frameWidth: 57, frameHeight: 60 });

    // tiles.png: 128×80 → 8 cols × 5 rows of 16×16
    this.load.spritesheet('tiles', `${ASSETS}/Packs/grotto_escape_pack/Base pack/Spritesheets/tiles.png`,
      { frameWidth: 16, frameHeight: 16 });

    // items.png: 64×64 → 4 cols × 4 rows of 16×16
    this.load.spritesheet('items', `${ASSETS}/Packs/grotto_escape_pack/Base pack/Spritesheets/items.png`,
      { frameWidth: 16, frameHeight: 16 });

    // laser-bolts.png: 32×32 → 2 cols × 2 rows of 16×16
    this.load.spritesheet('laser', `${ASSETS}/Packs/SpaceShipShooter/spritesheets/laser-bolts.png`,
      { frameWidth: 16, frameHeight: 16 });

    // explosion: 256×32 → 8 frames of 32×32
    this.load.spritesheet('explosion', `${ASSETS}/Misc/Explosions pack/explosion-1-a/spritesheet.png`,
      { frameWidth: 32, frameHeight: 32 });

    // Audio
    this.load.audio('sfx-laser',  `${ASSETS}/Packs/grotto_escape_pack/Base pack/sounds/laser.wav`);
    this.load.audio('sfx-jump',   `${ASSETS}/Packs/grotto_escape_pack/Base pack/sounds/jump.wav`);
    this.load.audio('sfx-pickup', `${ASSETS}/Packs/grotto_escape_pack/Base pack/sounds/pickup.wav`);
  }

  create() {
    this.scene.start('GameScene');
  }
}
