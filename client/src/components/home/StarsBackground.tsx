"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  twinkle: boolean;
  twinkleSpeed: number;
  twinkleDir: number;
}

interface Meteor {
  x: number;
  y: number;
  len: number;
  speed: number;
  opacity: number;
  active: boolean;
}

const STAR_COUNT_DESKTOP = 140;
const STAR_COUNT_MOBILE  = 60;
const METEOR_COUNT       = 3;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function makeStar(w: number, h: number, isMobile: boolean): Star {
  const twinkle = Math.random() < 0.2; // ~20% twinkle
  return {
    x:            Math.random() * w,
    y:            Math.random() * h,
    r:            randomBetween(0.4, isMobile ? 1.2 : 1.8),
    opacity:      randomBetween(0.2, 0.7),
    twinkle,
    twinkleSpeed: randomBetween(0.004, 0.012),
    twinkleDir:   Math.random() < 0.5 ? 1 : -1,
  };
}

function spawnMeteor(w: number, h: number): Meteor {
  // Start anywhere along the top edge or right edge
  const fromTop = Math.random() < 0.6;
  return {
    x:       fromTop ? randomBetween(w * 0.3, w) : w,
    y:       fromTop ? randomBetween(-20, h * 0.3) : randomBetween(0, h * 0.4),
    len:     randomBetween(100, 160),
    speed:   randomBetween(6, 10),
    opacity: 1,
    active:  true,
  };
}

export function StarsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let stars: Star[]   = [];
    let meteors: Meteor[] = [];
    let resizeTimer: ReturnType<typeof setTimeout>;

    const isMobile = () => window.innerWidth < 768;

    function resize() {
      canvas!.width  = window.innerWidth;
      canvas!.height = window.innerHeight;
      // Regenerate stars on resize
      const count = isMobile() ? STAR_COUNT_MOBILE : STAR_COUNT_DESKTOP;
      stars = Array.from({ length: count }, () =>
        makeStar(canvas!.width, canvas!.height, isMobile())
      );
    }

    function initMeteors() {
      const count = isMobile() ? 0 : METEOR_COUNT;
      meteors = Array.from({ length: count }, () =>
        spawnMeteor(canvas!.width, canvas!.height)
      );
    }

    // Angle: ~225° (top-right → bottom-left), cosine/sine for -45deg
    const ANGLE = (225 * Math.PI) / 180;
    const dx = Math.cos(ANGLE);
    const dy = Math.sin(ANGLE);

    function drawMeteor(m: Meteor) {
      const tailX = m.x - dx * m.len;
      const tailY = m.y - dy * m.len;

      const grad = ctx!.createLinearGradient(tailX, tailY, m.x, m.y);
      grad.addColorStop(0, "rgba(255,255,255,0)");
      grad.addColorStop(0.7, `rgba(180,180,255,${m.opacity * 0.4})`);
      grad.addColorStop(1, `rgba(255,255,255,${m.opacity})`);

      ctx!.save();
      ctx!.beginPath();
      ctx!.moveTo(tailX, tailY);
      ctx!.lineTo(m.x, m.y);
      ctx!.strokeStyle = grad;
      ctx!.lineWidth   = 1.5;
      ctx!.shadowColor = "rgba(200,200,255,0.8)";
      ctx!.shadowBlur  = 6;
      ctx!.stroke();

      // Bright head dot
      ctx!.beginPath();
      ctx!.arc(m.x, m.y, 1.5, 0, Math.PI * 2);
      ctx!.fillStyle   = `rgba(255,255,255,${m.opacity})`;
      ctx!.shadowBlur  = 12;
      ctx!.shadowColor = "rgba(255,255,255,1)";
      ctx!.fill();
      ctx!.restore();
    }

    function draw() {
      const w = canvas!.width;
      const h = canvas!.height;

      ctx!.clearRect(0, 0, w, h);

      // Stars
      for (const s of stars) {
        // Twinkle update
        if (s.twinkle) {
          s.opacity += s.twinkleSpeed * s.twinkleDir;
          if (s.opacity >= 0.8) { s.opacity = 0.8; s.twinkleDir = -1; }
          if (s.opacity <= 0.1) { s.opacity = 0.1; s.twinkleDir =  1; }
        }

        ctx!.save();
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle   = `rgba(255,255,255,${s.opacity})`;
        if (s.twinkle) {
          ctx!.shadowColor = "rgba(200,220,255,0.8)";
          ctx!.shadowBlur  = 4;
        }
        ctx!.fill();
        ctx!.restore();
      }

      // Meteors
      for (const m of meteors) {
        if (!m.active) continue;

        drawMeteor(m);

        // Move
        m.x += dx * m.speed;
        m.y += dy * m.speed;

        // Fade out near edges
        const margin = m.len + 20;
        if (m.x < -margin || m.y > h + margin || m.x > w + margin) {
          // Respawn after short delay
          m.active = false;
          setTimeout(() => {
            Object.assign(m, spawnMeteor(w, h));
            m.active = true;
          }, randomBetween(800, 3000));
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    // Page visibility — pause when tab hidden
    function onVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(draw);
      }
    }

    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        initMeteors();
      }, 150);
    }

    resize();
    initMeteors();
    rafId = requestAnimationFrame(draw);

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        background: "linear-gradient(135deg, #0f0c29 0%, #1a0533 40%, #0d0d0d 100%)",
      }}
    />
  );
}
