'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SensorComponent, SensorHotspot, Vector3D } from '@/lib/types/agrocontrol';
import { SensorInspectorModal } from '@/components/hero/SensorInspectorModal';
import { Eye, EyeOff, RotateCcw, RotateCw, Thermometer, Droplets, Sun, Sprout, Sparkles, Wind } from 'lucide-react';

const SENSOR_COMPONENTS: Record<string, SensorComponent> = {
  sensor1: {
    id: 'sensor1',
    key: 'sensor1',
    title: 'Sensor 01 · Temperatura del aire',
    badge: '23.8 °C · DEMO',
    text: 'Mide la temperatura del aire sobre el cultivo para identificar cambios térmicos en el invernadero.',
    stats: ['Variable: Temperatura del aire', 'Lectura demostrativa: 23.8 °C', 'Ubicación: Sobre el cultivo'],
    kind: 'sensor',
    value: '23.8 °C',
  },
  sensor2: {
    id: 'sensor2',
    key: 'sensor2',
    title: 'Sensor 02 · Humedad del aire',
    badge: '68% · DEMO',
    text: 'Registra la humedad relativa del aire para seguir las condiciones ambientales alrededor de las plantas.',
    stats: ['Variable: Humedad relativa', 'Lectura demostrativa: 68%', 'Ubicación: Zona media del cultivo'],
    kind: 'sensor',
    value: '68%',
  },
  sensor3: {
    id: 'sensor3',
    key: 'sensor3',
    title: 'Sensor 03 · Humedad del suelo',
    badge: '42% · DEMO',
    text: 'Mide el contenido de humedad del sustrato en la zona radicular para orientar el manejo del riego.',
    stats: ['Variable: Humedad del suelo', 'Lectura demostrativa: 42%', 'Ubicación: Zona de raíces'],
    kind: 'sensor',
    value: '42%',
  },
  sensor4: {
    id: 'sensor4',
    key: 'sensor4',
    title: 'Sensor 04 · Intensidad de luz',
    badge: '850 W/m² · DEMO',
    text: 'Registra la intensidad de luz disponible sobre el cultivo para observar sus variaciones durante el día.',
    stats: ['Variable: Intensidad de luz', 'Lectura demostrativa: 850 W/m²', 'Ubicación: Parte alta del invernadero'],
    kind: 'sensor',
    value: '850 W/m²',
  },
  sensor5: {
    id: 'sensor5',
    key: 'sensor5',
    title: 'Sensor 05 · Concentración de CO₂',
    badge: '420 ppm · DEMO',
    text: 'Mide la concentración de dióxido de carbono en el aire del invernadero.',
    stats: ['Variable: Concentración de CO₂', 'Lectura demostrativa: 420 ppm', 'Ubicación: Zona de cultivo'],
    kind: 'sensor',
    value: '420 ppm',
  },
  sensor6: {
    id: 'sensor6',
    key: 'sensor6',
    title: 'Sensor 06 · Temperatura del suelo',
    badge: '18.6 °C · DEMO',
    text: 'Registra la temperatura del sustrato en la zona radicular para observar las condiciones térmicas del suelo.',
    stats: ['Variable: Temperatura del suelo', 'Lectura demostrativa: 18.6 °C', 'Ubicación: Zona de raíces'],
    kind: 'probe',
    value: '18.6 °C',
  },
};

// Seis nodos distribuidos en zonas distintas para evitar que sus marcadores se monten.
const SENSOR_HOTSPOTS: SensorHotspot[] = [
  { key: 'sensor1', world: { x: -2.2, y: 2.0, z: 2.8 }, label: '01' },
  { key: 'sensor2', world: { x: 2.2, y: 2.1, z: -2.8 }, label: '02' },
  { key: 'sensor3', world: { x: -2.2, y: 0.45, z: -2.8 }, label: '03' },
  { key: 'sensor4', world: { x: 0, y: 3.7, z: 0 }, label: '04' },
  { key: 'sensor5', world: { x: 2.2, y: 2.0, z: 2.8 }, label: '05' },
  { key: 'sensor6', world: { x: -2.2, y: 0.45, z: 2.8 }, label: '06' },
];

export function Greenhouse3D({ onOpenLogin }: { onOpenLogin: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [activeComponent, setActiveComponent] = useState<SensorComponent | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [hideRoof, setHideRoof] = useState(false);

  const stateRef = useRef({
    yaw: -0.84,
    pitch: 0.56,
    radius: 13.4,
    auto: true,
    hideRoof: false,
    dragging: false,
    startX: 0,
    startY: 0,
    moved: false,
    t: 0,
    width: 0,
    height: 0,
  });

  const hitsRef = useRef<{ x: number; y: number; r: number; key: string }[]>([]);

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  const openComponent = useCallback((key: string) => {
    const comp = SENSOR_COMPONENTS[key] || SENSOR_COMPONENTS.sensor1;
    setActiveComponent(comp);
  }, []);

  const nextComponent = useCallback(() => {
    const keys = SENSOR_HOTSPOTS.map(({ key }) => key);
    const currentKey = activeComponent?.key || 'sensor1';
    const nextIdx = (keys.indexOf(currentKey) + 1) % keys.length;
    openComponent(keys[nextIdx]);
  }, [activeComponent, openComponent]);

  useEffect(() => {
    stateRef.current.auto = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    stateRef.current.hideRoof = hideRoof;
  }, [hideRoof]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      stateRef.current.width = w;
      stateRef.current.height = h;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const V = (x: number, y: number, z: number): Vector3D => ({ x, y, z });
    const sub = (a: Vector3D, b: Vector3D): Vector3D => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
    const dot = (a: Vector3D, b: Vector3D): number => a.x * b.x + a.y * b.y + a.z * b.z;
    const cross = (a: Vector3D, b: Vector3D): Vector3D => ({
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x,
    });
    const norm = (a: Vector3D): Vector3D => {
      const l = Math.hypot(a.x, a.y, a.z) || 1;
      return { x: a.x / l, y: a.y / l, z: a.z / l };
    };

    const camera = () => {
      const s = stateRef.current;
      const cp = Math.cos(s.pitch);
      const sp = Math.sin(s.pitch);
      const pos = {
        x: Math.sin(s.yaw) * cp * s.radius,
        y: sp * s.radius,
        z: Math.cos(s.yaw) * cp * s.radius,
      };
      const target = { x: 0, y: 1.85, z: 0 };
      const forward = norm(sub(target, pos));
      const right = norm(cross(forward, { x: 0, y: 1, z: 0 }));
      const up = norm(cross(right, forward));
      return { pos, right, up, forward };
    };

    const project = (p: Vector3D): { x: number; y: number; z: number } => {
      const cam = camera();
      const rel = sub(p, cam.pos);
      const x = dot(rel, cam.right);
      const y = dot(rel, cam.up);
      const z = dot(rel, cam.forward);
      const W = stateRef.current.width;
      const H = stateRef.current.height;
      const f = Math.min(W / 12.5, H / 8.8) * 5.8;
      return {
        x: W / 2 + (x * f) / Math.max(z, 0.1),
        y: H / 2 - (y * f) / Math.max(z, 0.1),
        z,
      };
    };

    interface DrawQueueItem {
      depth: number;
      draw: () => void;
    }

    const queue: DrawQueueItem[] = [];

    const qline = (a: Vector3D, b: Vector3D, color: string, w = 1.4, glow = 0) => {
      const pa = project(a);
      const pb = project(b);
      const depth = (pa.z + pb.z) / 2;
      queue.push({
        depth,
        draw() {
          ctx.save();
          ctx.strokeStyle = color;
          ctx.lineWidth = w;
          ctx.lineCap = 'round';
          if (glow) {
            ctx.shadowColor = color;
            ctx.shadowBlur = glow;
          }
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
          ctx.restore();
        },
      });
    };

    const qpoly = (points: Vector3D[], fill: string, stroke: string | null = null, w = 1) => {
      const pts = points.map(project);
      const depth = pts.reduce((s, p) => s + p.z, 0) / pts.length;
      queue.push({
        depth,
        draw() {
          ctx.save();
          ctx.beginPath();
          pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
          ctx.closePath();
          ctx.fillStyle = fill;
          ctx.fill();
          if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = w;
            ctx.stroke();
          }
          ctx.restore();
        },
      });
    };

    const qleaf = (p: Vector3D, size: number, ang: number, hue: number) => {
      const pt = project(p);
      queue.push({
        depth: pt.z,
        draw() {
          const s = Math.max(2, (size * 12) / (pt.z * 0.14 + 1.2));
          ctx.save();
          ctx.translate(pt.x, pt.y);
          ctx.rotate(ang);
          ctx.fillStyle =
            hue === 0
              ? 'rgba(95, 238, 142, 0.90)'
              : hue === 1
              ? 'rgba(55, 210, 125, 0.92)'
              : 'rgba(170, 255, 120, 0.90)';
          ctx.beginPath();
          ctx.ellipse(0, 0, s * 0.45, s, 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        },
      });
    };

    const qfruit = (p: Vector3D, rad: number) => {
      const pt = project(p);
      queue.push({
        depth: pt.z,
        draw() {
          const r = Math.max(1.4, (rad * 18) / (pt.z * 0.18 + 1.3));
          ctx.save();
          const g = ctx.createRadialGradient(pt.x - r * 0.25, pt.y - r * 0.3, r * 0.2, pt.x, pt.y, r * 1.15);
          g.addColorStop(0, '#ffd089');
          g.addColorStop(0.45, '#ff7036');
          g.addColorStop(1, 'rgba(185, 45, 22, 0.95)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        },
      });
    };

    const buildScene = () => {
      queue.length = 0;
      const s = stateRef.current;

      // ======================================================================
      // ESTÉTICA FIGMA: Invernadero de Vidrio Blanco Translúcido Arquitectónico
      // ======================================================================
      const frameWhite = 'rgba(255, 255, 255, 0.95)';
      const glassWallFill = 'rgba(240, 255, 248, 0.32)';
      const glassRoofFill = 'rgba(250, 255, 252, 0.48)';
      const glassGlow = 'rgba(255, 255, 255, 0.45)';

      // 1. Suelo general del invernadero
      qpoly(
        [V(-3.7, 0.02, -4.8), V(3.7, 0.02, -4.8), V(3.7, 0.02, 4.8), V(-3.7, 0.02, 4.8)],
        'rgba(8, 55, 42, 0.35)',
        'rgba(255, 255, 255, 0.35)',
        1.2
      );

      // Pasillo central embaldosado (como la foto real)
      qpoly(
        [V(-0.7, 0.03, -4.75), V(0.7, 0.03, -4.75), V(0.7, 0.03, 4.75), V(-0.7, 0.03, 4.75)],
        'rgba(185, 215, 200, 0.22)',
        'rgba(255, 255, 255, 0.25)',
        0.8
      );

      // 2. Surcos de cultivo con plantas y tomates
      for (const x of [-2.45, -1.35, 1.35, 2.45]) {
        qpoly(
          [V(x - 0.4, 0.1, -4.2), V(x + 0.4, 0.1, -4.2), V(x + 0.4, 0.1, 4.2), V(x - 0.4, 0.1, 4.2)],
          'rgba(50, 85, 30, 0.65)',
          'rgba(155, 216, 90, 0.3)',
          0.6
        );
        for (let z = -3.9; z <= 3.9; z += 0.74) {
          const h = 0.82 + 0.18 * Math.cos(z * 1.8 + x * 1.2);
          qline(V(x, 0.14, z), V(x, h, z), 'rgba(74, 215, 125, 0.88)', 1.5);
          for (let k = 0; k < 4; k++) {
            const yy = 0.37 + k * 0.14;
            const dx = k % 2 ? -0.34 : 0.34;
            const dz = k % 2 ? 0.11 : -0.11;
            qline(V(x, yy, z), V(x + dx, yy + 0.12, z + dz), 'rgba(85, 205, 125, 0.65)', 0.9);
            qleaf(V(x + dx, yy + 0.16, z + dz), 0.26, dx > 0 ? -0.95 : 0.95, k % 3);
            qleaf(V(x - dx * 0.76, yy + 0.08, z - dz), 0.21, dx > 0 ? 0.9 : -0.85, (k + 1) % 3);
          }
          qleaf(V(x, h, z), 0.22, -0.16, 2);
          if (Math.sin((x + z) * 5.2) > 0.45) {
            qfruit(V(x + 0.11, 0.38, z + 0.11), 0.065);
          }
        }
      }

      // 3. Paredes de vidrio translúcido blanco (Pared izquierda, derecha, fondo y frontal)
      // Pared lateral izquierda
      qpoly(
        [V(-3.7, 0, -4.8), V(-3.7, 2.45, -4.8), V(-3.7, 2.45, 4.8), V(-3.7, 0, 4.8)],
        glassWallFill,
        'rgba(255, 255, 255, 0.65)',
        1
      );
      // Pared lateral derecha
      qpoly(
        [V(3.7, 0, -4.8), V(3.7, 2.45, -4.8), V(3.7, 2.45, 4.8), V(3.7, 0, 4.8)],
        glassWallFill,
        'rgba(255, 255, 255, 0.65)',
        1
      );
      // Pared trasera
      qpoly(
        [V(-3.7, 0, -4.8), V(-3.7, 2.45, -4.8), V(3.7, 2.45, -4.8), V(3.7, 0, -4.8)],
        glassWallFill,
        'rgba(255, 255, 255, 0.65)',
        1
      );
      // Pared delantera
      qpoly(
        [V(-3.7, 0, 4.8), V(-3.7, 2.45, 4.8), V(3.7, 2.45, 4.8), V(3.7, 0, 4.8)],
        glassWallFill,
        'rgba(255, 255, 255, 0.65)',
        1
      );

      // Frontón triangular frontal y trasero
      qpoly(
        [V(-3.7, 2.45, -4.8), V(0, 4.2, -4.8), V(3.7, 2.45, -4.8)],
        glassRoofFill,
        'rgba(255, 255, 255, 0.75)',
        1.2
      );
      qpoly(
        [V(-3.7, 2.45, 4.8), V(0, 4.2, 4.8), V(3.7, 2.45, 4.8)],
        glassRoofFill,
        'rgba(255, 255, 255, 0.75)',
        1.2
      );

      // 4. Techo de vidrio translúcido blanco a dos aguas (Gable Roof)
      if (!s.hideRoof) {
        // Pendiente izquierda
        qpoly(
          [V(-3.7, 2.45, -4.8), V(0, 4.2, -4.8), V(0, 4.2, 4.8), V(-3.7, 2.45, 4.8)],
          glassRoofFill,
          'rgba(255, 255, 255, 0.85)',
          1.2
        );
        // Pendiente derecha
        qpoly(
          [V(3.7, 2.45, -4.8), V(0, 4.2, -4.8), V(0, 4.2, 4.8), V(3.7, 2.45, 4.8)],
          glassRoofFill,
          'rgba(255, 255, 255, 0.85)',
          1.2
        );
      }

      // 5. Postes y vigas estructurales blancos nítidos
      for (let z = -4.8; z <= 4.81; z += 2.4) {
        for (const x of [-3.7, 3.7]) {
          qline(V(x, 0, z), V(x, 2.45, z), frameWhite, 2.0, 2);
        }
        if (!s.hideRoof) {
          // Cerchas del techo a cumbrera central
          qline(V(-3.7, 2.45, z), V(0, 4.2, z), frameWhite, 1.8, 2);
          qline(V(0, 4.2, z), V(3.7, 2.45, z), frameWhite, 1.8, 2);
        }
      }

      // Vigas perimetrales de base y aleros
      for (const z of [-4.8, 4.8]) {
        qline(V(-3.7, 0, z), V(3.7, 0, z), frameWhite, 1.8);
        if (!s.hideRoof) {
          qline(V(-3.7, 2.45, z), V(3.7, 2.45, z), glassGlow, 1.5);
        }
      }

      if (!s.hideRoof) {
        // Viga cumbrera superior central y soleras
        for (const x of [-3.7, 0, 3.7]) {
          const y = x === 0 ? 4.2 : 2.45;
          qline(V(x, y, -4.8), V(x, y, 4.8), frameWhite, 2.0, 3);
        }
      }
    };

    const drawSensors = () => {
      hitsRef.current = [];
      const s = stateRef.current;
      SENSOR_HOTSPOTS.forEach((node) => {
        const p = project(node.world);
        if (p.z <= 0) return;

        const pulse = 0.55 + 0.45 * Math.sin(s.t * 2.2 + Number(node.label));
        const r = 12 + pulse * 5;

        ctx.save();
        // Anillo exterior de radar pulsante
        ctx.strokeStyle = `rgba(86, 243, 189, ${0.25 + pulse * 0.4})`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 7, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(86, 243, 189, 0.12)';
        ctx.stroke();

        // Botón circular verde oscuro con texto blanco nítido (idéntico a Figma)
        ctx.shadowColor = '#56f3bd';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#062923';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#56f3bd';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 10.5px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, p.x, p.y + 0.5);

        ctx.restore();

        hitsRef.current.push({ x: p.x, y: p.y, r: 24, key: node.key });
      });
    };

    const render = () => {
      animId = requestAnimationFrame(render);
      const s = stateRef.current;
      s.t += 0.016;
      if (s.auto && !s.dragging) {
        s.yaw += 0.003;
      }

      ctx.clearRect(0, 0, s.width, s.height);

      // Sutil brillo radial en la base de la escena
      const g = ctx.createRadialGradient(
        s.width * 0.53,
        s.height * 0.56,
        15,
        s.width * 0.53,
        s.height * 0.56,
        s.height * 0.55
      );
      g.addColorStop(0, 'rgba(86, 243, 189, 0.10)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s.width, s.height);

      buildScene();
      queue.sort((a, b) => b.depth - a.depth);
      queue.forEach((it) => it.draw());
      drawSensors();
    };

    render();

    const onPointerDown = (e: PointerEvent) => {
      const s = stateRef.current;
      s.dragging = true;
      s.moved = false;
      s.startX = e.clientX;
      s.startY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const s = stateRef.current;
      if (!s.dragging) return;
      const dx = e.clientX - s.startX;
      const dy = e.clientY - s.startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) {
        s.moved = true;
      }
      s.yaw += dx * 0.008;
      s.pitch = clamp(s.pitch - dy * 0.006, 0.18, 1.05);
      s.startX = e.clientX;
      s.startY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      const s = stateRef.current;
      if (!s.dragging) return;
      s.dragging = false;

      if (!s.moved) {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const hit = hitsRef.current.find((h) => Math.hypot(h.x - clickX, h.y - clickY) < h.r);
        if (hit) {
          openComponent(hit.key);
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const s = stateRef.current;
      s.radius = clamp(s.radius + (e.deltaY > 0 ? 0.55 : -0.55), 9.4, 18.2);
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [openComponent]);

  const resetCamera = () => {
    stateRef.current.yaw = -0.84;
    stateRef.current.pitch = 0.56;
    stateRef.current.radius = 13.4;
    setAutoRotate(true);
    setHideRoof(false);
    openComponent('sensor1');
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] min-[420px]:h-[520px] sm:h-[620px] xl:h-[680px] rounded-2xl sm:rounded-[34px] overflow-hidden bg-[#0a352c]/80 border border-[#56f3bd]/25 shadow-[0_30px_90px_rgba(2,26,23,0.55)] backdrop-blur-xl select-none"
    >
      {/* Sutil overlay de luz ambiental */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#56f3bd]/10 via-transparent to-black/30" />

      {/* Cabecera interna del Gemelo Digital */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-7 right-4 sm:right-7 flex items-start justify-between gap-2 text-[#edf6f0] pointer-events-none z-20">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#d9fff0]">
            GEMELO DIGITAL - 3D
          </div>
          <div className="text-xs text-[#d0f2e2]/80 mt-0.5 font-normal">
            Invernadero interactivo / concepto
          </div>
        </div>

        {/* Badge Sistema Conectado y Vista */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-[#062923]/90 border border-[#56f3bd]/30 text-[9px] sm:text-[11px] text-[#edf6f0] backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#56f3bd] shadow-[0_0_8px_#56f3bd] animate-pulse" />
            <span className="font-bold tracking-wider uppercase text-[10px] text-[#b8d5cb]">
              SISTEMA CONECTADO
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#56f3bd]/20 text-[#56f3bd]">
              DEMO
            </span>
          </div>
          <div className="hidden sm:block text-[11px] font-bold uppercase tracking-[0.2em] text-[#d9fff0]/80">
            VISTA 03
          </div>
        </div>
      </div>

      {/* Canvas 3D Interactivo */}
      <canvas
        ref={canvasRef}
        tabIndex={0}
        aria-label="Modelo 3D interactivo del invernadero"
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing outline-none"
      />

      {/* Inspector Isométrico Flotante (al hacer clic en cualquier sensor o tarjeta) */}
      <SensorInspectorModal
        component={activeComponent}
        onClose={() => setActiveComponent(null)}
        onNext={nextComponent}
        onOpenLogin={onOpenLogin}
      />

      {/* Zona Inferior: Instrucción, Chips de Sensores y Controles de Cámara */}
      <div className="absolute inset-x-3 sm:inset-x-7 bottom-3 sm:bottom-5 z-20 flex flex-col gap-2 sm:gap-2.5 pointer-events-none">
        {/* Instrucción */}
        <div className="hidden sm:flex text-xs text-[#caeadc]/85 items-center gap-1.5 font-normal">
          <Sparkles className="w-3.5 h-3.5 text-[#56f3bd] shrink-0" />
          <span>Arrastra para girar · Haz clic en los sensores o tarjetas para abrir el detalle 3D</span>
        </div>

        {/* Fila de Chips de Sensores con Íconos Elegantes */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {SENSOR_HOTSPOTS.map((s) => {
            const Icon = s.key === 'sensor2' || s.key === 'sensor3'
              ? Droplets
              : s.key === 'sensor4'
                ? Sun
                : s.key === 'sensor5'
                  ? Wind
                  : s.key === 'sensor6'
                    ? Thermometer
                    : Thermometer;
            const label = s.key === 'sensor1'
              ? 'Temp. aire'
              : s.key === 'sensor2'
                ? 'Hum. aire'
                : s.key === 'sensor3'
                  ? 'Hum. suelo'
                  : s.key === 'sensor4'
                    ? 'Luz'
                    : s.key === 'sensor5'
                      ? 'CO₂'
                      : 'Temp. suelo';

            return (
              <button
                key={s.key}
                onClick={() => openComponent(s.key)}
                type="button"
                className="px-3.5 py-1.5 rounded-full bg-[#083027]/90 hover:bg-[#0e483b] border border-[#56f3bd]/25 hover:border-[#56f3bd]/50 text-xs text-[#edf6f0] hover:text-white transition-all shadow-sm flex items-center gap-2 cursor-pointer group"
              >
                <Icon className="w-3.5 h-3.5 text-[#56f3bd] group-hover:scale-110 transition-transform" />
                <span>Sensor {s.label} · {label}</span>
              </button>
            );
          })}
        </div>

        {/* Fila Inferior: "EXPLORA EL ENTORNO" y Botones de Acción (SIN caracteres repetidos) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 pointer-events-auto">
          <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#b8d5cb]/70 hidden sm:block">
            EXPLORA EL ENTORNO
          </div>

          <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 ml-auto w-full sm:w-auto">
            <button
              onClick={() => setHideRoof(!hideRoof)}
              type="button"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-xl bg-[#082d25]/90 hover:bg-[#0c4438] text-white border border-[#56f3bd]/25 hover:border-[#56f3bd]/50 text-[10px] sm:text-xs font-medium shadow-md backdrop-blur-md transition-all cursor-pointer"
            >
              {hideRoof ? (
                <Eye className="w-3.5 h-3.5 text-[#56f3bd]" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-[#56f3bd]" />
              )}
              <span>{hideRoof ? 'Mostrar techo' : 'Ocultar techo'}</span>
            </button>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              type="button"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-xl bg-[#082d25]/90 hover:bg-[#0c4438] text-white border border-[#56f3bd]/25 hover:border-[#56f3bd]/50 text-[10px] sm:text-xs font-medium shadow-md backdrop-blur-md transition-all cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 text-[#56f3bd] ${autoRotate ? 'animate-spin' : ''}`} />
              <span>Girar: {autoRotate ? 'sí' : 'no'}</span>
            </button>

            <button
              onClick={resetCamera}
              type="button"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-xl bg-[#082d25]/90 hover:bg-[#0c4438] text-white border border-[#56f3bd]/25 hover:border-[#56f3bd]/50 text-[10px] sm:text-xs font-medium shadow-md backdrop-blur-md transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#56f3bd]" />
              <span>Reiniciar vista</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
