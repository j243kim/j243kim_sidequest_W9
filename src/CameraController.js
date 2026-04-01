// src/CameraController.js
// Camera follow + clamping (VIEW layer).
//
// Responsibilities:
// - Follow a target sprite (usually the Player)
// - Apply smoothing/lerp for camera movement
// - Clamp camera position to world bounds
//
// Non-goals:
// - Does NOT modify world rules, physics, or entity state
// - Does NOT draw parallax or UI overlays
//
// Architectural notes:
// - This is pure VIEW logic.
// - It reads world bounds + target position, then sets camera.x/camera.y.
// - main.js or Game decides when/where it’s used.

export class CameraController {
  constructor(pkg) {
    this.pkg = pkg;
    this.view = pkg.view || {};
    this.bounds = pkg.bounds || {};

    this.target = null;

    this.lerp = Number(this.view.cameraLerp ?? 0.1);

    // internal camera state (so we can smooth + reset)
    this.cx = undefined;
    this.cy = undefined;

    // screen shake state
    this._shakeTimer = 0;
    this._shakeIntensity = 0;
    this._shakeOffsetX = 0;
    this._shakeOffsetY = 0;
  }

  setTarget(sprite) {
    this.target = sprite;
  }

  reset() {
    this.cx = undefined;
    this.cy = undefined;
    this._shakeTimer = 0;
    this._shakeIntensity = 0;
    this._shakeOffsetX = 0;
    this._shakeOffsetY = 0;
  }

  // Trigger screen shake (intensity in pixels, duration in frames)
  shake(intensity = 3, duration = 12) {
    this._shakeIntensity = intensity;
    this._shakeTimer = duration;
  }

  update({ viewW, viewH, levelW, levelH }) {
    if (!this.target) return;

    // match monolith clamp behavior (slight vertical bias)
    const tileW = this.pkg.tiles?.tileW ?? 24;
    const tileH = this.pkg.tiles?.tileH ?? 24;

    const tx = constrain(this.target.x, viewW / 2, levelW - viewW / 2 - tileW / 2);
    const ty = constrain(this.target.y, viewH / 2 - tileH * 2, levelH - viewH / 2 - tileH);

    const nextX = Math.round(lerp(this.cx ?? tx, tx, this.lerp));
    const nextY = Math.round(lerp(this.cy ?? ty, ty, this.lerp));

    this.cx = nextX;
    this.cy = nextY;

    // Apply screen shake offset
    if (this._shakeTimer > 0) {
      const t = this._shakeTimer / 12; // normalized decay
      const mag = this._shakeIntensity * t;
      this._shakeOffsetX = Math.round((Math.random() * 2 - 1) * mag);
      this._shakeOffsetY = Math.round((Math.random() * 2 - 1) * mag);
      this._shakeTimer--;
    } else {
      this._shakeOffsetX = 0;
      this._shakeOffsetY = 0;
    }
  }

  applyToP5Camera() {
    // p5play camera
    camera.width = this.pkg.view?.viewW ?? this.pkg.view?.w ?? 240;
    camera.height = this.pkg.view?.viewH ?? this.pkg.view?.h ?? 192;

    if (this.cx !== undefined) camera.x = this.cx + this._shakeOffsetX;
    if (this.cy !== undefined) camera.y = this.cy + this._shakeOffsetY;
  }
}