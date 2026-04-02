// src/DebugOverlay.js
// Debug screen (VIEW + SYSTEM tool).
//
// Week 9 Side Quest: full debug screen with toggleable features.
//
// Features:
// - Toggle moon gravity on/off (G key)
// - Toggle invincibility on/off (I key)
// - Toggle slow-motion on/off (M key)
// - Display real-time stats: FPS, player position, score, health, entity counts
// - Track cumulative playtest stats: deaths, leaves collected, damage taken
// - Event log feed from EventBus
//
// Responsibilities:
// - Render debug info in screen-space (camera.off())
// - Manage debug flags that Game/Level read each frame
// - Log events from EventBus (including wildcard "*")
//
// Non-goals:
// - Does NOT directly modify physics or entity state (Game/Level apply the flags)

export class DebugOverlay {
  constructor() {
    this.enabled = false;

    // --- Toggleable debug flags (read by Game/Level each frame) ---
    this.moonGravity = false;
    this.invincible = false;
    this.slowMotion = false;

    // --- Playtest stat tracking ---
    this.stats = {
      deaths: 0,
      damagesTaken: 0,
      leavesCollected: 0,
      boarsKilled: 0,
      jumps: 0,
      sessionStartMs: Date.now(),
    };

    // --- Event log ---
    this.lines = [];
    this.maxLines = 6;
  }

  toggle() {
    this.enabled = !this.enabled;
  }

  // Called by Game when G is pressed
  toggleMoonGravity() {
    this.moonGravity = !this.moonGravity;
  }

  // Called by Game when I is pressed
  toggleInvincible() {
    this.invincible = !this.invincible;
  }

  // Called by Game when M is pressed
  toggleSlowMotion() {
    this.slowMotion = !this.slowMotion;
  }

  log(evt) {
    if (!evt) return;

    // Track cumulative stats from events
    const name = evt.name ?? "";
    if (name === "player:died") this.stats.deaths++;
    if (name === "player:damaged") this.stats.damagesTaken++;
    if (name === "leaf:collected") this.stats.leavesCollected++;
    if (name === "boar:died") this.stats.boarsKilled++;
    if (name === "player:jumped") this.stats.jumps++;

    const msg = `${name}`;
    this.lines.unshift(msg);
    if (this.lines.length > this.maxLines) this.lines.length = this.maxLines;
  }

  draw({ game } = {}) {
    if (!this.enabled) return;

    camera.off();

    const viewW = game?.pkg?.view?.viewW ?? 240;
    const viewH = game?.pkg?.view?.viewH ?? 192;

    // --- Background panel ---
    push();
    noStroke();
    fill(0, 180);
    rect(4, 4, viewW - 8, viewH - 8, 4);
    pop();

    fill(255);
    textSize(8);
    textAlign(LEFT, TOP);

    let y = 10;
    const x = 10;
    const col2 = 130;
    const lineH = 10;

    // --- Title ---
    fill(0, 229, 255);
    text("DEBUG SCREEN (T to close)", x, y);
    y += lineH + 4;

    // --- Toggle section ---
    fill(255, 220, 0);
    text("TOGGLES:", x, y);
    y += lineH;

    this._drawToggleLine(x, y, "G", "Moon Gravity", this.moonGravity);
    y += lineH;
    this._drawToggleLine(x, y, "I", "Invincibility", this.invincible);
    y += lineH;
    this._drawToggleLine(x, y, "M", "Slow Motion", this.slowMotion);
    y += lineH + 4;

    // --- Runtime stats ---
    const lvl = game?.level || null;
    const score = lvl?.score ?? 0;
    const winScore = lvl?.WIN_SCORE ?? 15;
    const playerCtrl = lvl?.playerCtrl || null;
    const hp = playerCtrl?.player?.health ?? "?";
    const maxHp = playerCtrl?.player?.maxHealth ?? "?";
    const dead = playerCtrl?.player?.dead ?? false;
    const won = lvl?.won ?? false;
    const px = Math.round(playerCtrl?.sprite?.x ?? 0);
    const py = Math.round(playerCtrl?.sprite?.y ?? 0);
    const currentFps = Math.round(frameRate());
    const gravity = Math.round((world?.gravity?.y ?? 10) * 10) / 10;

    fill(0, 255, 122);
    text("RUNTIME:", x, y);
    y += lineH;

    fill(255);
    text(`FPS: ${currentFps}`, x, y);
    text(`Gravity: ${gravity}`, col2, y);
    y += lineH;

    text(`Score: ${score}/${winScore}`, x, y);
    text(`HP: ${hp}/${maxHp}`, col2, y);
    y += lineH;

    text(`Pos: (${px}, ${py})`, x, y);
    text(`Won:${won} Dead:${dead}`, col2, y);
    y += lineH;

    // Entity counts
    const boarCount = lvl?.boar?.length ?? 0;
    const leafCount = lvl?.leaf?.length ?? 0;
    const levelName = game?.pkg?.level?.name ?? game?.pkg?.level?.id ?? "?";
    text(`Boars: ${boarCount}  Leaves: ${leafCount}`, x, y);
    text(`Level: ${levelName}`, col2, y);
    y += lineH + 4;

    // --- Playtest stats ---
    fill(255, 80, 80);
    text("PLAYTEST STATS:", x, y);
    y += lineH;

    fill(255);
    const sessionSec = Math.round((Date.now() - this.stats.sessionStartMs) / 1000);
    const mins = Math.floor(sessionSec / 60);
    const secs = sessionSec % 60;
    text(`Deaths: ${this.stats.deaths}`, x, y);
    text(`Dmg taken: ${this.stats.damagesTaken}`, col2, y);
    y += lineH;
    text(`Leaves: ${this.stats.leavesCollected}`, x, y);
    text(`Jumps: ${this.stats.jumps}`, col2, y);
    y += lineH;
    text(`Boars killed: ${this.stats.boarsKilled}`, x, y);
    text(`Session: ${mins}m ${secs}s`, col2, y);
    y += lineH + 4;

    // --- Event log ---
    fill(180);
    text("EVENT LOG:", x, y);
    y += lineH;

    fill(150);
    for (const line of this.lines) {
      text(line, x, y);
      y += lineH;
    }

    // Console logging of stats (for playtest data collection)
    // This runs every draw frame when debug is open, so we throttle it
    if (frameCount % 300 === 0) {
      console.log("[DEBUG STATS]", JSON.stringify(this.stats));
    }

    camera.on();
  }

  _drawToggleLine(x, y, key, label, isOn) {
    fill(180);
    text(`[${key}]`, x, y);
    fill(isOn ? 0x00 : 255, isOn ? 255 : 255, isOn ? 0x7a : 255);
    text(`${label}: ${isOn ? "ON" : "OFF"}`, x + 22, y);
  }
}
