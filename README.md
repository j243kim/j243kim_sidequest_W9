# Fox Rescue - Side Quest Week 6

## Group Members
- Jimin Kim, j243kim, 21062367

## Description
Fox Rescue is a pixel-art platformer where you play as a fox rescuing leaves scattered across a dangerous forest filled with boars and fire hazards. This Week 6 build refines the previous sketch by adding **sound** and **simple physics-driven visual effects** inspired by *Papers, Please* — where every player action receives clear, reactive feedback.

**Week 6 additions (sound + physics combined for bonus):**
- **Sound effects** triggered by gameplay actions: jump, leaf collection, taking damage, and hitting boars. Background music loops during play.
- **Screen shake** on player damage and boar hits — the camera shakes with decaying intensity tied to the physics knockback already present in the game.
- **Particle effects** on leaf collection (green/gold sparkles), boar hits (red impact burst), and player damage (red damage burst). These are purely visual and reinforce the physics interactions.
- **Combined multi-sensory feedback**: hitting a boar triggers knockback physics + hit sound + impact particles + camera shake simultaneously, creating one connected reactive moment.

## Setup and Interaction Instructions
1. Open the GitHub Pages link in Google Chrome.
2. Click or press any key to unlock audio.
3. **Arrow keys / WASD**: Move and jump.
4. **Space**: Attack (melee, must be grounded).
5. **R**: Restart (available on win/lose screens).
6. **T**: Toggle debug overlay.
7. Collect all 15 leaves to win. Avoid boars and fire — you have 3 hearts.

## Iteration Notes

### Post-Playtest
1. Added screen shake intensity decay so it feels impactful but not disorienting.
2. Reduced fire hazard collider size (from 18x16 to 12x6) after testing showed the player could not jump over fires without taking damage, making the game too difficult to complete.
3. Fixed boar-fire interaction so boars properly play their death animation and disappear instead of freezing in place when walking into fire.

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
