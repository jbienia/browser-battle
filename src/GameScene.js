// ─── Shared constants (gameplay, not level-specific) ─────────────────────────
const WORLD_H       = 270;
const TILE          = 16;
const GROUND_Y      = WORLD_H - TILE;   // 254
const PLAYER_SPEED  = 150;
const JUMP_VEL      = -400;
const BULLET_SPEED  = 550;
const FIRE_COOLDOWN = 350;

// Per-type enemy config: texture key, walk frames, scale, body [w,h,offX,offY], speed
const ENEMY_CONFIG = {
  soldier: { key: 'soldier', walk: { start: 36, end: 41 }, scale: 0.5, body: [38, 52, 13, 6], speed: 45 },
  fox:     { key: 'fox',     walk: { start:  0, end:  7 }, scale: 0.5, body: [58, 34, 11, 8], speed: 85 },
  ghoul:   { key: 'ghoul',   walk: { start:  0, end:  7 }, scale: 0.5, body: [32, 52, 12, 6], speed: 60 },
};

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  // init() runs before create() and receives data passed via scene.start()
  init(data) {
    this.levelIndex  = (data && data.levelIndex != null) ? data.levelIndex : 0;
    this.levelConfig = LEVELS[this.levelIndex];
  }

  create() {
    const { worldW } = this.levelConfig;

    // Reset per-run state
    this.hp         = 3;
    this.score      = 0;
    this.invincible = false;
    this.gameOver   = false;
    this.levelWon   = false;
    this.lastFire   = 0;
    this.facing     = 1;   // 1 = right, -1 = left

    this.physics.world.setBounds(0, 0, worldW, WORLD_H);
    this.cameras.main.setBounds(0, 0, worldW, WORLD_H);

    this.createAnims();
    this.createBackground();
    this.createPlatforms();
    this.createPickups();
    this.createExit();
    this.createPlayer();
    this.createEnemies();
    this.createBullets();
    this.setupColliders();
    this.setupInput();

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // Launch HUD (stop any stale instance first)
    if (this.scene.isActive('UIScene')) this.scene.stop('UIScene');
    this.scene.launch('UIScene');
  }

  update(time) {
    if (this.gameOver || this.levelWon) return;

    this.handleMovement();
    this.handleFiring(time);
    this.updateEnemies();
    this.updateParallax();
  }

  // ── Animations ─────────────────────────────────────────────────────────────
  createAnims() {
    const add = (key, sprite, frames, rate, repeat = 0) => {
      if (!this.anims.exists(key)) {
        this.anims.create({
          key,
          frames: this.anims.generateFrameNumbers(sprite, frames),
          frameRate: rate,
          repeat
        });
      }
    };

    // Player — Warped City individual-image animations
    const imgFrames = (state, count) =>
      Array.from({ length: count }, (_, i) => ({ key: `p-${state}-${i + 1}` }));

    if (!this.anims.exists('p-idle')) {
      this.anims.create({ key: 'p-idle',  frames: imgFrames('Idle',  4), frameRate:  6, repeat: -1 });
      this.anims.create({ key: 'p-run',   frames: imgFrames('Run',   8), frameRate: 12, repeat: -1 });
      this.anims.create({ key: 'p-jump',  frames: imgFrames('Jump',  7), frameRate: 10, repeat:  0 });
      this.anims.create({ key: 'p-shoot', frames: imgFrames('Shoot', 3), frameRate: 12, repeat:  0 });
      this.anims.create({ key: 'p-hurt',  frames: [{ key: 'p-Hurt-1' }], frameRate:  1, repeat:  0 });
    }

    // Enemies — one walk anim per type
    add('e-soldier-walk', 'soldier', { start: 36, end: 41 }, 8,  -1);
    add('e-fox-walk',     'fox',     { start:  0, end:  7 }, 10, -1);
    add('e-ghoul-walk',   'ghoul',   { start:  0, end:  7 }, 8,  -1);

    // Explosion
    add('explode', 'explosion', { start: 0, end: 7 }, 18, 0);
  }

  // ── Background ─────────────────────────────────────────────────────────────
  createBackground() {
    // Build TileSprite layers from level config — fixed to camera, tilePositionX updated for parallax
    this.bgLayers = this.levelConfig.bgLayers.map(({ key }) =>
      this.add.tileSprite(0, 0, 480, WORLD_H, key).setOrigin(0).setScrollFactor(0)
    );
  }

  updateParallax() {
    const cx = this.cameras.main.scrollX;
    this.bgLayers.forEach((layer, i) => {
      layer.tilePositionX = cx * this.levelConfig.bgLayers[i].scrollFactor;
    });
  }

  // ── Platforms ──────────────────────────────────────────────────────────────
  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    const addRow = (left, top, count, frame = 0) => {
      for (let i = 0; i < count; i++) {
        this.platforms.create(left + i * TILE + TILE / 2, top + TILE / 2, 'tiles', frame);
      }
    };

    // Ground — full level width
    addRow(0, GROUND_Y, this.levelConfig.worldW / TILE, 8);

    // Floating platforms from level config
    this.levelConfig.platforms.forEach(([x, y, n]) => addRow(x, y, n, 0));
  }

  // ── Pickups ────────────────────────────────────────────────────────────────
  createPickups() {
    this.pickups = this.physics.add.staticGroup();
    this.levelConfig.pickups.forEach(([x, y]) => {
      this.pickups.create(x, y, 'items', 0);
    });
  }

  // ── Exit ───────────────────────────────────────────────────────────────────
  createExit() {
    const x = this.levelConfig.worldW - 24;
    const y = GROUND_Y - 20;

    const gfx = this.add.graphics();
    gfx.fillStyle(0x00ff88, 1);
    gfx.fillRect(x - 10, y - 12, 20, 24);
    gfx.fillStyle(0xffffff, 0.5);
    gfx.fillRect(x - 4, y - 8, 8, 16);

    this.add.text(x, y - 22, 'EXIT', { fontSize: '6px', color: '#00ff88' }).setOrigin(0.5);
    this.tweens.add({ targets: gfx, alpha: 0.5, duration: 600, yoyo: true, repeat: -1 });

    this.exitZone = this.add.zone(x, y, 24, 28);
    this.physics.world.enable(this.exitZone, Phaser.Physics.Arcade.STATIC_BODY);
  }

  // ── Player ─────────────────────────────────────────────────────────────────
  createPlayer() {
    // Warped City frames are 80×80; scale 0.5 → ~40px tall in game units
    this.player = this.physics.add.sprite(40, GROUND_Y - 20, 'p-Idle-1');
    this.player.setScale(0.5);
    this.player.setCollideWorldBounds(true);
    // Body in texture-space (pre-scale): 50×65 → 25×32 game units
    this.player.body.setSize(40, 65).setOffset(16, 15);
    this.player.play('p-idle');
  }

  // ── Enemies ────────────────────────────────────────────────────────────────
  createEnemies() {
    this.enemies = this.physics.add.group();

    this.levelConfig.enemies.forEach(({ x, y, minX, maxX, type }) => {
      const cfg = ENEMY_CONFIG[type];
      const e = this.enemies.create(x, y, cfg.key, cfg.walk.start);
      e.setScale(cfg.scale);
      e.setCollideWorldBounds(true);
      const [bw, bh, box, boy] = cfg.body;
      e.body.setSize(bw, bh).setOffset(box, boy);
      e.patrolMin  = minX;
      e.patrolMax  = maxX;
      e.enemySpeed = cfg.speed;
      e.dir = 1;
      e.play(`e-${type}-walk`);
    });
  }

  updateEnemies() {
    this.enemies.getChildren().forEach(e => {
      e.setVelocityX(e.dir * e.enemySpeed);

      if (e.x >= e.patrolMax) {
        e.dir = -1;
        e.setFlipX(true);
      } else if (e.x <= e.patrolMin) {
        e.dir = 1;
        e.setFlipX(false);
      }
    });
  }

  // ── Bullets ────────────────────────────────────────────────────────────────
  createBullets() {
    this.bullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 10,
      runChildUpdate: false
    });
  }

  fireBullet() {
    const b = this.bullets.get(
      this.player.x + this.facing * 12,
      this.player.y - 1,
      'laser', 0
    );
    if (!b) return;

    b.setActive(true).setVisible(true);
    b.body.reset(this.player.x + this.facing * 12, this.player.y - 1);
    b.body.setAllowGravity(false);
    b.setFlipX(this.facing < 0);
    b.setVelocityX(this.facing * BULLET_SPEED);
    b.setVelocityY(0);

    this.player.play('p-shoot', true);
    this.player.once('animationcomplete-p-shoot', () => {
      if (!this.player.body.blocked.down) this.player.play('p-jump', true);
      else this.player.play('p-idle', true);
    });
    this.sound.play('sfx-laser', { volume: 0.5 });

    this.time.delayedCall(300, () => this.killBullet(b));
  }

  killBullet(b) {
    if (!b.active) return;
    b.setActive(false).setVisible(false);
    if (b.body) b.body.reset(-100, -100);
  }

  // ── Colliders ──────────────────────────────────────────────────────────────
  setupColliders() {
    const { player, platforms, enemies, bullets, pickups, exitZone } = this;

    this.physics.add.collider(player,  platforms);
    this.physics.add.collider(enemies, platforms);

    this.physics.add.overlap(bullets, enemies, (bullet, enemy) => {
      this.killBullet(bullet);
      this.killEnemy(enemy);
    });

    this.physics.add.collider(bullets, platforms, (bullet) => {
      this.killBullet(bullet);
    });

    this.physics.add.overlap(player, enemies, () => {
      this.hurtPlayer();
    });

    this.physics.add.overlap(player, pickups, (_, pickup) => {
      pickup.destroy();
      this.hp = Math.min(3, this.hp + 1);
      this.events.emit('hpChange', this.hp);
      this.sound.play('sfx-pickup', { volume: 0.7 });
    });

    this.physics.add.overlap(player, exitZone, () => {
      if (!this.levelWon) this.triggerWin();
    });
  }

  // ── Input ──────────────────────────────────────────────────────────────────
  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      z: Phaser.Input.Keyboard.KeyCodes.Z,
      x: Phaser.Input.Keyboard.KeyCodes.X,
    });
    this.input.on('pointerdown', () => {
      if (!this.gameOver && !this.levelWon) this.fireBullet();
    });
  }

  // ── Player movement ────────────────────────────────────────────────────────
  handleMovement() {
    const left  = this.cursors.left.isDown  || this.keys.a.isDown;
    const right = this.cursors.right.isDown || this.keys.d.isDown;
    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up)    ||
      Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
      Phaser.Input.Keyboard.JustDown(this.keys.w);

    const onGround = this.player.body.blocked.down;
    const shooting = this.player.anims.currentAnim?.key === 'p-shoot';

    if (left) {
      this.player.setVelocityX(-PLAYER_SPEED);
      this.facing = -1;
      this.player.setFlipX(true);
      this.player.body.setOffset(24, 15);
      if (onGround && !shooting) this.player.play('p-run', true);
    } else if (right) {
      this.player.setVelocityX(PLAYER_SPEED);
      this.facing = 1;
      this.player.setFlipX(false);
      this.player.body.setOffset(16, 15);
      if (onGround && !shooting) this.player.play('p-run', true);
    } else {
      this.player.setVelocityX(0);
      if (onGround && !shooting) this.player.play('p-idle', true);
    }

    if (jumpPressed && onGround) {
      this.player.setVelocityY(JUMP_VEL);
      this.sound.play('sfx-jump', { volume: 0.6 });
    }

    if (!onGround && !shooting) this.player.play('p-jump', true);
  }

  // ── Firing ─────────────────────────────────────────────────────────────────
  handleFiring(time) {
    const wantsShoot = this.keys.z.isDown || this.keys.x.isDown;
    if (wantsShoot && time > this.lastFire) {
      this.fireBullet();
      this.lastFire = time + FIRE_COOLDOWN;
    }
  }

  // ── Combat helpers ─────────────────────────────────────────────────────────
  killEnemy(enemy) {
    const exp = this.add.sprite(enemy.x, enemy.y, 'explosion');
    exp.play('explode');
    exp.once('animationcomplete', () => exp.destroy());
    enemy.destroy();

    this.score += 100;
    this.events.emit('scoreChange', this.score);
  }

  hurtPlayer() {
    if (this.invincible) return;

    this.hp--;
    this.events.emit('hpChange', this.hp);

    if (this.hp <= 0) {
      this.triggerDeath();
      return;
    }

    this.player.play('p-hurt', true);

    this.invincible = true;
    this.tweens.add({
      targets: this.player,
      alpha: 0,
      duration: 80,
      repeat: 6,
      yoyo: true,
      onComplete: () => {
        this.player.setAlpha(1);
        this.invincible = false;
      }
    });
  }

  // ── Win / Lose ─────────────────────────────────────────────────────────────
  triggerWin() {
    this.levelWon = true;
    this.player.setVelocity(0);
    this.player.body.enable = false;
    this.events.emit('win', { score: this.score, levelIndex: this.levelIndex });
  }

  triggerDeath() {
    this.gameOver = true;
    this.player.setTint(0xff4444);
    this.player.setVelocity(0);
    this.player.body.enable = false;
    this.events.emit('gameOver', { levelIndex: this.levelIndex });
  }

  // Called by UIScene to move to the next level or restart the current one
  goToLevel(levelIndex) {
    this.scene.stop('UIScene');
    this.scene.stop();
    this.scene.start('GameScene', { levelIndex });
  }
}
