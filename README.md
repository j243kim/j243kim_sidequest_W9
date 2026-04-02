# Fox Rescue - Side Quest Week 9

## Group Members
- Jimin Kim, j243kim, 21062367

## Description
Fox Rescue is a pixel-art platformer where you play as a fox rescuing leaves scattered across a dangerous forest filled with boars and fire hazards. This Week 9 build adds a **full debug screen** with toggleable gameplay modifiers and playtest stat tracking, built on top of the Week 6 platformer with sound and physics feedback.

**Week 9 additions (debug screen + bonus level):**
- **Debug screen** (press T to open/close) with three toggleable features:
  - **Moon gravity** (G key): Reduces gravity to 30% of normal, allowing floaty jumps for testing level layouts and reaching hard-to-access areas.
  - **Invincibility** (I key): Prevents all player damage and death, useful for exploring levels and testing mechanics without penalty.
  - **Slow motion** (M key): Runs physics at half speed, helpful for observing collision timing, animation frames, and debugging tricky platforming sequences.
- **Real-time runtime stats**: FPS, player position, score, health, gravity value, entity counts, and current level name.
- **Cumulative playtest stats**: Tracks deaths, damage taken, leaves collected, boars killed, jumps, and session time. Stats are also logged to the browser console every 5 seconds while the debug screen is open.
- **Event log feed**: Shows the most recent gameplay events (jumps, damage, kills, etc.) in real time.
- **Bonus: Second level ("The Deep Woods")** that loads automatically when pressing N after completing Level 1. Features a different layout with new platform arrangements and a darker color palette while keeping the same canvas resolution, integer scaling, and control feel as Level 1.

## Setup and Interaction Instructions
1. Open the GitHub Pages link in Google Chrome.
2. Click or press any key to unlock audio.
3. **Arrow keys / WASD**: Move and jump.
4. **Space**: Attack (melee, must be grounded).
5. **R**: Restart (available on win/lose screens).
6. **T**: Toggle debug screen.
7. **G**: Toggle moon gravity (debug feature).
8. **I**: Toggle invincibility (debug feature).
9. **M**: Toggle slow motion (debug feature).
10. **N**: Advance to next level (on win screen, when a next level exists).
11. Collect enough leaves to win (15 in Level 1, 12 in Level 2). Avoid boars and fire — you have 3 hearts.

## Iteration Notes

### Post-Playtest
1. Added screen shake intensity decay so it feels impactful but not disorienting.
2. Reduced fire hazard collider size (from 18x16 to 12x6) after testing showed the player could not jump over fires without taking damage, making the game too difficult to complete.
3. Fixed boar-fire interaction so boars properly play their death animation and disappear instead of freezing in place when walking into fire.
4. Refactored the level transition path so level 2 rebuilds through the same runtime setup structure as level 1, reusing the shared view/runtime setup helper and recreating fresh runtime systems after pressing N.
5. Continued debugging the remaining level 2 control bug. Even after matching the level 2 starting geometry to level 1 and forcing the transition path to reuse the same runtime setup, the fox still would not jump or switch into its run animation in level 2.
6. Simplified `transitionToLevel()` to delegate directly to `initRuntime()`, eliminating ~60 lines of duplicated setup logic. When the bug persisted, traced through `src/world/TileBuilder.js` and identified the root cause: stale p5play Group objects from level 1 persist with their `.tile` property after sprite removal, so `new Tiles()` spawns level 2 tiles into the old empty groups instead of the newly created ones. This leaves the new Level's solid groups empty, causing `isGrounded()` to always return false — preventing jumping and run animation. The fix is to call `group.remove()` on each old Level group during the transition cleanup phase before building new groups.

### Post-Showcase
1. Add a win jingle sound effect for level completion.
2. Add dust trail particles when running on the ground for more satisfying movement feel.

## Assets

- Background layers: Oak Woods tileset [1]
- Fox and Boar sprites: Mini FF Animals [2]
- Leaf sprites: 2D Pixel Art Leaf Elemental [3]
- Fire sprites: Fire Animation Pixel Art [4]
- Ground/platform/wall tiles: Oak Woods tileset [1]
- Bitmap font: Font2Bitmap [5]
- Background music (music.wav): Cozy Tunes [6]
- Sound effects (jump.wav, leafCollect.wav, receiveDamage.wav, hitEnemy.wav): Brackeys Platformer Bundle [7] and 8-bit/16-bit Sound Effects Pack [8]
- p5.js library [9]
- p5play v3 library [10]
- Planck.js physics engine [11]

## References

[1] Brullov. Oak Woods. itch.io. Retrieved from https://brullov.itch.io/oak-woods

[2] LYASeeK. Mini FF Animals. itch.io. Retrieved from https://lyaseek.itch.io/miniffanimals

[3] Elthen. 2D Pixel Art Leaf Elemental Sprites. itch.io. Retrieved from https://elthen.itch.io/2d-pixel-art-leaf-elemental-sprites

[4] Captain Skolot. 9 Fire Animation Pixel Art. itch.io. Retrieved from https://captainskolot.itch.io/9-fire-animation-pixelart-pixel-art-sprite-fire-spells-pack-rpg

[5] STMN. Font2Bitmap. itch.io. Retrieved from https://stmn.itch.io/font2bitmap

[6] PizzaDoggy. Cozy Tunes. itch.io. Retrieved from https://pizzadoggy.itch.io/cozy-tunes

[7] Brackeys. Brackeys Platformer Bundle. itch.io. Retrieved from https://brackeysgames.itch.io/brackeys-platformer-bundle

[8] JDWasabi. 8-bit 16-bit Sound Effects Pack. itch.io. Retrieved from https://jdwasabi.itch.io/8-bit-16-bit-sound-effects-pack

[9] p5.js. The Processing Foundation. Retrieved from https://p5js.org/

[10] p5play. Quinton Ashley. Retrieved from https://p5play.org/

[11] Planck.js. Ali Shakiba. Retrieved from https://github.com/shakiba/planck.js
