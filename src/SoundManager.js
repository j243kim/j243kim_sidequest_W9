// src/SoundManager.js
// Audio playback (SYSTEM layer).
//
// Responsibilities:
// - Load sound assets during preload() (via loadSound)
// - Play sounds by key (SFX/music)
// - Support looping background music with volume control
// - Provide a simple abstraction so gameplay code never touches audio directly
//
// Non-goals:
// - Does NOT subscribe to EventBus directly (Game wires events → play())
// - Does NOT decide when events happen (WORLD logic emits events)
// - Does NOT manage UI

export class SoundManager {
  constructor() {
    this.sfx = {};
    this.music = null;
    this._musicStarted = false;
  }

  load(name, path) {
    this.sfx[name] = loadSound(path);
  }

  play(name) {
    const s = this.sfx[name];
    if (!s) return;
    // Prevent overlapping the same sound (restart it)
    if (s.isPlaying()) s.stop();
    s.play();
  }

  loadMusic(path, volume = 0.3) {
    this.music = loadSound(path, () => {
      if (this.music) this.music.setVolume(volume);
    });
  }

  startMusic() {
    if (this._musicStarted || !this.music) return;
    this._musicStarted = true;
    this.music.loop();
  }

  stopMusic() {
    this._musicStarted = false;
    if (this.music?.isPlaying()) this.music.stop();
  }
}
