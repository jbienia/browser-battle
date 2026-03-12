# Space Marine: Bulkhead Breach — Game Spec

## Overview
A short 2D side-scrolling platformer. You are the Space Marine, clearing a dark industrial bulkhead of alien critters to reach the exit.

---

## Assets Used

| Role | File |
|---|---|
| Player spritesheet | `grotto_escape_pack/Base pack/Spritesheets/player.png` |
| Enemy spritesheet | `grotto_escape_pack/Base pack/Spritesheets/enemies.png` |
| Tiles | `grotto_escape_pack/Base pack/Spritesheets/tiles.png` |
| Items / pickups | `grotto_escape_pack/Base pack/Spritesheets/items.png` |
| Background (bg layer) | `bulkhead-walls/v1/layers/bulkhead-walls-back.png` |
| Background (pipes) | `bulkhead-walls/v1/layers/bulkhead-walls-pipes.png` |
| Platform props | `bulkhead-walls/v1/layers/bulkhead-walls-platform.png` |
| Laser bolt | `SpaceShipShooter/spritesheets/laser-bolts.png` |
| Explosion | `Explosions pack/explosion-1-a/spritesheet.png` |
| SFX — shoot | `grotto_escape_pack/Base pack/sounds/laser.wav` |
| SFX — jump | `grotto_escape_pack/Base pack/sounds/jump.wav` |
| SFX — pickup | `grotto_escape_pack/Base pack/sounds/pickup.wav` |

---

## Player — Space Marine

### Sprite Frames (player.png — single row spritesheet)
Parse as 16×16 px frames (verify against actual image dimensions).

| State | Frames |
|---|---|
| Idle | frame 0 |
| Run | frames 1–3 (loop) |
| Jump | frame 4 |
| Shoot | frame 5 (overlay, resets after 0.1 s) |
| Death | frame 6–7 (play once) |

### Stats
- **Health**: 3 HP
- **Move speed**: 150 px/s
- **Jump velocity**: −400 px/s (upward)
- **Gravity**: 800 px/s²
- **Fire rate**: 1 shot every 0.35 s

### Controls
| Action | Key |
|---|---|
| Move left | A / Left Arrow |
| Move right | D / Right Arrow |
| Jump | Space / Up Arrow / W |
| Shoot | Z / X / Left Mouse Button |

### Shooting
- Fires a laser bolt horizontally in the direction the player is facing.
- Bolt travels at 500 px/s.
- Bolt is destroyed on contact with an enemy or a solid tile.
- Plays `laser.wav`.

---

## Enemies — Alien Critters

Use the teal bird-like creatures from `enemies.png`.

### Sprite Frames (enemies.png)
Parse the first enemy type (rows 1): 16×16 px frames.

| State | Frames |
|---|---|
| Walk | frames 0–1 (loop, 0.3 s each) |
| Death | frames 2–3 (play once, then remove) |

### Stats
- **Health**: 1 HP (dies in one shot)
- **Move speed**: 60 px/s
- **Behavior**: Patrol — walks in one direction, reverses at a platform edge or wall.
- **Contact damage**: Deals 1 HP to the player on touch.
- **On death**: Plays explosion animation + `laser.wav` at reduced pitch.

---

## Level Design

### Canvas
- **Viewport**: 480 × 270 px (scaled up ×2 or ×3 for display)
- **Level width**: 3 screens wide (~1440 px total)
- **Camera**: Follows player horizontally; clamped to level bounds.

### Background Layers (parallax)
| Layer | Scroll factor |
|---|---|
| `bulkhead-walls-back.png` | 0.2 (slowest) |
| `bulkhead-walls-pipes.png` | 0.5 |
| Platforms / tiles | 1.0 (foreground) |

### Platform Layout (approximate, left → right)

```
[START]                                              [EXIT]
 ═══════════       ════        ════════
                        ════                  ════
 ════════════════════════════════════════════════════  ← ground floor
```

- Ground floor runs the full width.
- 4–6 floating platforms at varying heights (80–130 px above ground).
- Platforms are built from `tiles.png` tile sprites (16×16 grid).
- Use `bulkhead-walls-platform.png` as a decorative prop overlaid on platform tops.

### Enemy Placement
Place 6 enemies total:
1. Ground, x ≈ 300 — patrolling
2. Ground, x ≈ 600 — patrolling
3. Platform 1 (mid-left), x ≈ 450
4. Ground, x ≈ 900 — patrolling
5. Platform 2 (mid-right), x ≈ 1100
6. Ground, x ≈ 1300 — guarding the exit

### Items
Scatter 2–3 health pickups (from `items.png`, the heart/star sprites) on platforms. Collecting restores 1 HP (capped at 3). Plays `pickup.wav`.

### Exit
A glowing door / portal at the far right end of the level (can be a simple animated rectangle or a tile from the tileset). Reaching it triggers the win state.

---

## Game States

| State | Description |
|---|---|
| **Start Screen** | Title text + "Press any key to start" |
| **Playing** | Normal gameplay loop |
| **Paused** | Overlay with "PAUSED" — press Esc to toggle |
| **Win** | "MISSION COMPLETE" text + score |
| **Game Over** | "GAME OVER" text + restart prompt |

---

## HUD
- **Health**: 3 heart icons top-left.
- **Score**: Top-right (100 pts per enemy killed).

---

## Physics Summary
- Gravity: 800 px/s² applied every frame.
- Entities rest on solid tile tops; no slopes needed for v1.
- Bullets have no gravity.

---

## Tech Notes
- Recommended library: **Phaser 3** (browser, canvas renderer) or **Pygame** (Python).
- Sprite scaling: render at 2× or 3× native resolution for a crisp pixel-art look.
- Tilemap: define as a simple 2D array; no external Tiled editor required for this short level.
- All asset paths are relative to `Legacy Collection/Assets/`.
