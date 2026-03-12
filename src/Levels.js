// ─── Level Configs ────────────────────────────────────────────────────────────
// All Y positions use game-world coordinates (WORLD_H = 270, TILE = 16).
// Ground top is always at y = 254.
// Spawn Y for ground enemies: soldiers/ghouls = 224 (254-30), foxes = 230 (254-24).
// Spawn Y for platform enemies: platform_y_top - 30 (soldiers/ghouls) or - 24 (foxes).

const LEVELS = [

  // ── Level 1: Bulkhead ────────────────────────────────────────────────────
  {
    name:   'Level 1 — Bulkhead',
    worldW: 1440,

    // Background TileSprite layers, drawn back-to-front
    bgLayers: [
      { key: 'bg-back',  scrollFactor: 0.15 },
      { key: 'bg-pipes', scrollFactor: 0.40 },
    ],

    // Platforms: [x_left, y_top, num_tiles]
    platforms: [
      [150,  195, 6],
      [330,  170, 5],
      [510,  195, 6],
      [700,  168, 5],
      [870,  190, 6],
      [1080, 168, 6],
      [1290, 190, 5],
    ],

    // Enemies: { x, y, minX, maxX, type }
    enemies: [
      { x: 310,  y: 224, minX: 240,  maxX: 430,  type: 'soldier' },
      { x: 540,  y: 224, minX: 430,  maxX: 670,  type: 'soldier' },
      { x: 528,  y: 171, minX: 510,  maxX: 606,  type: 'fox'     }, // platform y=195
      { x: 920,  y: 230, minX: 750,  maxX: 1050, type: 'fox'     },
      { x: 1100, y: 138, minX: 1080, maxX: 1175, type: 'ghoul'   }, // platform y=168
      { x: 1350, y: 224, minX: 1290, maxX: 1430, type: 'ghoul'   },
    ],

    // Health pickups: [x, y]
    pickups: [
      [350,  160],
      [900,  180],
      [1110, 158],
    ],
  },

  // ── Level 2: Industrial District ─────────────────────────────────────────
  {
    name:   'Level 2 — Industrial District',
    worldW: 1600,

    bgLayers: [
      { key: 'bg2-sky',       scrollFactor: 0.10 },
      { key: 'bg2-buildings', scrollFactor: 0.35 },
    ],

    // Tighter, more vertical layout — more platforms, shorter gaps
    platforms: [
      [120,  200, 4],
      [260,  175, 4],
      [400,  150, 4],
      [550,  175, 5],
      [720,  155, 4],
      [880,  200, 4],
      [1020, 165, 5],
      [1200, 185, 4],
      [1380, 170, 5],
    ],

    // 8 enemies — foxes open, soldiers mid, ghouls at the end
    enemies: [
      { x: 200,  y: 230, minX: 130,  maxX: 380,  type: 'fox'     },
      { x: 580,  y: 230, minX: 480,  maxX: 700,  type: 'fox'     },
      { x: 270,  y: 145, minX: 260,  maxX: 340,  type: 'soldier' }, // platform y=175
      { x: 800,  y: 224, minX: 700,  maxX: 960,  type: 'soldier' },
      { x: 1030, y: 135, minX: 1020, maxX: 1095, type: 'soldier' }, // platform y=165
      { x: 1050, y: 224, minX: 980,  maxX: 1180, type: 'ghoul'   },
      { x: 1210, y: 155, minX: 1200, maxX: 1275, type: 'ghoul'   }, // platform y=185
      { x: 1450, y: 224, minX: 1380, maxX: 1580, type: 'ghoul'   },
    ],

    // Fewer pickups — harder level
    pickups: [
      [410, 140],
      [890, 190],
    ],
  },

];
