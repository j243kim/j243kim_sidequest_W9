// src/ParticleSystem.js
// Simple particle effects (VIEW layer).
//
// Responsibilities:
// - Spawn short-lived particles at a world position
// - Update particle positions with velocity + gravity + fade
// - Draw particles in world-space (before camera.off)
//
// Non-goals:
// - Does NOT affect gameplay or physics
// - Does NOT interact with sprites or colliders

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  // Burst of particles at (x, y) with a given color and count
  burst(x, y, { color = "#ffdc00", count = 8, speed = 1.5, gravity = 0.06, life = 30, size = 2 } = {}) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const spd = speed * (0.5 + Math.random() * 0.8);
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 0.5,
        gravity,
        life,
        maxLife: life,
        size,
        color,
      });
    }
  }

  // Upward sparkle burst (for leaf collection)
  sparkle(x, y) {
    this.burst(x, y, {
      color: "#80ff80",
      count: 10,
      speed: 1.2,
      gravity: 0.04,
      life: 24,
      size: 2,
    });
    // Add a few golden sparkles
    this.burst(x, y, {
      color: "#ffdc00",
      count: 5,
      speed: 0.8,
      gravity: 0.02,
      life: 20,
      size: 1,
    });
  }

  // Impact burst (for hitting boar)
  impact(x, y) {
    this.burst(x, y, {
      color: "#ff5050",
      count: 6,
      speed: 1.8,
      gravity: 0.08,
      life: 18,
      size: 2,
    });
    this.burst(x, y, {
      color: "#ffffff",
      count: 4,
      speed: 1.0,
      gravity: 0.05,
      life: 14,
      size: 1,
    });
  }

  // Damage burst (when player takes damage)
  damageBurst(x, y) {
    this.burst(x, y, {
      color: "#ff3030",
      count: 8,
      speed: 2.0,
      gravity: 0.1,
      life: 20,
      size: 2,
    });
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw() {
    // Draw in world-space (camera is still on)
    push();
    noStroke();
    for (const p of this.particles) {
      const alpha = Math.floor(255 * (p.life / p.maxLife));
      const c = color(p.color);
      c.setAlpha(alpha);
      fill(c);
      rect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    }
    pop();
  }

  clear() {
    this.particles = [];
  }
}
