'use client';

import React, { useEffect, useRef } from 'react';
import { SensorComponent } from '@/lib/types/agrocontrol';
import { X, ArrowRight, Layers } from 'lucide-react';

interface SensorInspectorModalProps {
  component: SensorComponent | null;
  onClose: () => void;
  onNext: () => void;
  onOpenLogin: () => void;
}

export function SensorInspectorModal({
  component,
  onClose,
  onNext,
  onOpenLogin,
}: SensorInspectorModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!component || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      t += 0.02;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Fondo y rejilla sutil
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, 'rgba(39, 112, 91, 0.18)');
      bg.addColorStop(1, 'rgba(3, 20, 17, 0.4)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(163, 255, 217, 0.08)';
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 25 + i * 28);
        ctx.lineTo(w, 25 + i * 28);
        ctx.stroke();
      }

      function iso(x: number, y: number, z: number): [number, number] {
        const px = w * 0.5 + (x - z) * 32;
        const py = h * 0.65 - y * 38 + (x + z) * 16;
        return [px, py];
      }

      function poly(pts: [number, number][], fill: string, stroke = 'rgba(165,255,222,0.3)') {
        if (!ctx) return;
        ctx.beginPath();
        pts.forEach(([px, py], idx) => (idx === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)));
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      function glowPoint(x: number, y: number, r: number, color: string) {
        if (!ctx) return;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.25, color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (component.kind === 'card') {
        const a = iso(-1.8, 1.4, -0.6);
        const b = iso(1.8, 1.4, -0.6);
        const c = iso(1.8, 1.4, 1);
        const d = iso(-1.8, 1.4, 1);
        const a2 = iso(-1.8, 0.1, -0.6);
        const b2 = iso(1.8, 0.1, -0.6);
        const c2 = iso(1.8, 0.1, 1);
        const d2 = iso(-1.8, 0.1, 1);
        poly([a, b, c, d], 'rgba(83,255,196,0.14)');
        poly([a2, b2, c2, d2], 'rgba(25,76,63,0.32)');
        poly([a, d, d2, a2], 'rgba(38,101,83,0.34)');
        poly([b, c, c2, b2], 'rgba(31,86,71,0.34)');

        const bars = [0.72, 0.5, 0.88];
        bars.forEach((m, idx) => {
          const x = 70 + idx * 46;
          ctx.fillStyle = 'rgba(92,255,191,0.85)';
          ctx.fillRect(x, 110 + (1 - m) * 38, 14, m * 38);
        });
      } else if (component.kind === 'probe') {
        // Sonda de suelo
        const top = [iso(-0.35, 2.1, -0.35), iso(0.35, 2.1, -0.35), iso(0.35, 2.1, 0.35), iso(-0.35, 2.1, 0.35)];
        const bottom = [iso(-0.35, 0.4, -0.35), iso(0.35, 0.4, -0.35), iso(0.35, 0.4, 0.35), iso(-0.35, 0.4, 0.35)];
        poly(top, 'rgba(116,255,194,0.22)');
        poly(bottom, 'rgba(16,61,50,0.5)');
        poly([top[0], top[1], bottom[1], bottom[0]], 'rgba(35,97,80,0.4)');
        poly([top[1], top[2], bottom[2], bottom[1]], 'rgba(43,115,95,0.36)');
        poly([top[2], top[3], bottom[3], bottom[2]], 'rgba(33,88,73,0.34)');
        poly([top[3], top[0], bottom[0], bottom[3]], 'rgba(30,80,66,0.36)');

        for (let i = 0; i < 3; i++) {
          const [gx, gy] = iso(0, 0.4 + i * 0.5, 0);
          glowPoint(gx, gy, 8 + i * 2, 'rgba(111,255,186,0.86)');
        }
        const [sx, sy] = iso(0, 0.1, 0);
        ctx.strokeStyle = 'rgba(166,255,212,0.6)';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx, sy + 38);
        ctx.stroke();
      } else {
        // Sensor cilíndrico / nodo ambiental
        const top = [iso(-0.8, 2.0, -0.8), iso(0.8, 2.0, -0.8), iso(0.8, 2.0, 0.8), iso(-0.8, 2.0, 0.8)];
        const bottom = [iso(-0.8, 0.6, -0.8), iso(0.8, 0.6, -0.8), iso(0.8, 0.6, 0.8), iso(-0.8, 0.6, 0.8)];
        poly(top, 'rgba(96,255,202,0.24)');
        poly(bottom, 'rgba(15,58,49,0.5)');
        poly([top[0], top[1], bottom[1], bottom[0]], 'rgba(35,97,80,0.42)');
        poly([top[1], top[2], bottom[2], bottom[1]], 'rgba(48,122,101,0.4)');
        poly([top[2], top[3], bottom[3], bottom[2]], 'rgba(30,86,70,0.38)');
        poly([top[3], top[0], bottom[0], bottom[3]], 'rgba(38,98,81,0.4)');

        const [cx, cy] = iso(0, 1.35, 0);
        glowPoint(cx, cy, 22 + Math.sin(t) * 3, 'rgba(100,255,200,0.85)');

        ctx.strokeStyle = 'rgba(161,255,220,0.4)';
        ctx.lineWidth = 1.5;
        [[-1.5, 1.0, 0], [1.5, 1.0, 0], [0, 1.0, -1.5], [0, 1.0, 1.5]].forEach((v) => {
          const [vx, vy] = iso(v[0], v[1], v[2]);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(vx, vy);
          ctx.stroke();
          glowPoint(vx, vy, 6, 'rgba(118,255,188,0.7)');
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [component]);

  if (!component) return null;

  return (
    <div
      role="region"
      aria-label="Detalle del sensor"
      className="absolute top-24 left-6 z-30 w-[min(380px,calc(100%-48px))] rounded-3xl bg-[#06241e]/90 border border-[#56f3bd]/25 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-[#56f3bd]/15">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#94ffb1]">
          <Layers className="w-3.5 h-3.5 text-[#56f3bd]" />
          <span>Nodo Interactivo</span>
        </div>
        <button
          onClick={onClose}
          type="button"
          aria-label="Cerrar detalle"
          className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body: Metadata + Canvas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#56f3bd]/15">
        <div className="p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2 leading-tight">{component.title}</h3>
            <p className="text-xs text-[#d0e8dd] leading-relaxed mb-3">{component.text}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-[#e7fff1] border border-[#56f3bd]/20 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#56f3bd] animate-pulse" />
              {component.badge}
            </div>
            <div className="space-y-1.5 text-xs text-[#b8d5cb]">
              {component.stats.map((s, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="text-[#56f3bd]">▸</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visualizador 3D Mini Isométrico */}
        <div className="p-2 bg-[#041a15]/60 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={280}
            height={200}
            className="w-full h-auto max-w-[280px] rounded-xl"
            aria-label="Representación isométrica del sensor"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3.5 bg-black/25 flex items-center justify-between gap-2 border-t border-[#56f3bd]/15">
        <button
          onClick={onNext}
          type="button"
          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
        >
          Siguiente componente
        </button>
        <button
          onClick={onOpenLogin}
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#23d196] to-[#0da972] text-xs font-bold text-white shadow-md hover:brightness-110 transition-all"
        >
          <span>Acceder</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
