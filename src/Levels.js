// ─── Level Configs ────────────────────────────────────────────────────────────
// All Y positions use game-world coordinates (WORLD_H = 270, TILE = 16).
// Ground top is always at y = 222 (WORLD_H - TILE * 3).
// Spawn Y for ground enemies: soldiers/ghouls = 192 (222-30), foxes = 198 (222-24).
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
      [150,  163, 6],
      [330,  138, 5],
      [510,  163, 6],
      [700,  136, 5],
      [870,  158, 6],
      [1080, 136, 6],
      [1290, 158, 5],
    ],

    // Enemies: { x, y, minX, maxX, type }
    enemies: [
      { x: 310,  y: 192, minX: 240,  maxX: 430,  type: 'soldier' },
      { x: 540,  y: 192, minX: 430,  maxX: 670,  type: 'soldier' },
      { x: 528,  y: 139, minX: 510,  maxX: 606,  type: 'fox'     }, // platform y=163
      { x: 920,  y: 198, minX: 750,  maxX: 1050, type: 'fox'     },
      { x: 1100, y: 106, minX: 1080, maxX: 1175, type: 'ghoul'   }, // platform y=136
      { x: 1350, y: 192, minX: 1290, maxX: 1430, type: 'ghoul'   },
    ],

    // Health pickups: [x, y]
    pickups: [
      [350,  128],
      [900,  148],
      [1110, 126],
    ],
  },

  // ── Level 2: Industrial District ─────────────────────────────────────────
  {
    name:   'Level 2 — Industrial District',
    worldW: 1600,

    bgLayers: [
      // { key: 'bg2-sky',       scrollFactor: 0.10 },
      // { key: 'bg2-buildings', scrollFactor: 0.35 },
      { key: 'bg2-country-back',   scrollFactor: 0.10 },
      { key: 'bg2-country-forest', scrollFactor: 0.35 },
    ],

    // Tighter, more vertical layout — more platforms, shorter gaps
    platforms: [
      [120,  168, 4],
      [260,  143, 4],
      [400,  118, 4],
      [550,  143, 5],
      [720,  123, 4],
      [880,  168, 4],
      [1020, 133, 5],
      [1200, 153, 4],
      [1380, 138, 5],
    ],

    // 8 enemies — foxes open, soldiers mid, ghouls at the end
    enemies: [
      { x: 200,  y: 198, minX: 130,  maxX: 380,  type: 'fox'     },
      { x: 580,  y: 198, minX: 480,  maxX: 700,  type: 'fox'     },
      { x: 270,  y: 113, minX: 260,  maxX: 340,  type: 'soldier' }, // platform y=143
      { x: 800,  y: 192, minX: 700,  maxX: 960,  type: 'soldier' },
      { x: 1030, y: 103, minX: 1020, maxX: 1095, type: 'soldier' }, // platform y=133
      { x: 1050, y: 192, minX: 980,  maxX: 1180, type: 'ghoul'   },
      { x: 1210, y: 123, minX: 1200, maxX: 1275, type: 'ghoul'   }, // platform y=153
      { x: 1450, y: 192, minX: 1380, maxX: 1580, type: 'ghoul'   },
    ],

    // Fewer pickups — harder level
    pickups: [
      [410, 108],
      [890, 158],
    ],
  },

];
