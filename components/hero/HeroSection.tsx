'use client';

import React from 'react';
import Link from 'next/link';
import { Greenhouse3D } from '@/components/hero/Greenhouse3D';
import { Play, ArrowUpRight, ArrowDown } from 'lucide-react';

export function HeroSection({ onOpenLogin }: { onOpenLogin: () => void }) {
  const scrollTo3D = () => {
    const el = document.getElementById('sceneContainer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section id="inicio" className="relative text-[#edf6f0] flex flex-col justify-between pt-2 sm:pt-4 pb-3">
      {/* Contenido Principal: 2 Columnas idéntico a Figma */}
      <div className="max-w-[1540px] mx-auto w-full px-6 sm:px-12 py-4 lg:py-6 grid grid-cols-1 lg:grid-cols-[1fr_1.18fr] gap-10 xl:gap-14 items-center min-h-[calc(100vh-170px)]">
        {/* Columna Izquierda: Mensaje y Titular */}
        <div className="flex flex-col items-start max-w-xl">
          {/* Kicker */}
          <div className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] font-bold uppercase tracking-[0.22em] text-[#dcf5ea] mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-[#56f3bd] shadow-[0_0_12px_#56f3bd]" />
            <span>INNOVACIÓN IOT · AGRICULTURA INTELIGENTE</span>
          </div>

          {/* Titular Principal dividido en 3 líneas exactas como en Figma */}
          <h1 className="text-6xl sm:text-7xl xl:text-[96px] font-black text-white leading-[0.93] tracking-tight mb-7">
            <span>Inteligencia</span>
            <span className="block">que hace</span>
            <span className="font-serif italic font-normal text-[#efc369] block mt-1">
              crecer.
            </span>
          </h1>

          {/* Subtítulo / Lead */}
          <p className="text-base sm:text-lg text-[#d7eee2] leading-relaxed mb-8 font-normal opacity-90 max-w-lg">
            Monitorea, comprende y transforma cada variable de tu invernadero desde una experiencia
            digital diseñada para el futuro.
          </p>

          {/* Fila de Acciones */}
          <div className="flex flex-wrap items-center gap-4 mb-7 w-full sm:w-auto">
            <Link
              href="#proyecto"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#23d196] hover:bg-[#1db884] text-white font-extrabold text-[15px] shadow-[0_15px_40px_rgba(4,37,31,0.45)] transition-all duration-200 hover:-translate-y-0.5"
            >
              <span>Explorar el proyecto</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </Link>

            <button
              onClick={scrollTo3D}
              type="button"
              className="inline-flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] text-white font-semibold text-[15px] border border-white/15 transition-all duration-200 hover:-translate-y-0.5"
            >
              <span className="w-8 h-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </span>
              <span>Ver experiencia 3D</span>
            </button>
          </div>

          {/* Nota al pie del CTA */}
          <div className="flex items-center gap-2 text-xs text-[#a0c7b9]/85 font-normal">
            <span className="text-[10px] opacity-70">○</span>
            <span>Escena interactiva de demostración · no son lecturas reales</span>
          </div>
        </div>

        {/* Columna Derecha: Contenedor Gemelo Digital 3D */}
        <div id="sceneContainer" className="w-full">
          <Greenhouse3D onOpenLogin={onOpenLogin} />
        </div>
      </div>

      {/* Sub-Footer del Hero */}
      <div className="max-w-[1540px] mx-auto w-full px-6 sm:px-12 pt-6 pb-2 border-t border-white/10 flex items-center justify-between text-xs text-[#b8d5cb]/75">
        <div className="tracking-[0.22em] uppercase font-bold text-[10px] hidden sm:block">
          TECNOLOGÍA QUE CONECTA. NATURALEZA QUE CRECE.
        </div>
        <Link
          href="#proyecto"
          className="mx-auto sm:mx-0 inline-flex items-center gap-2 font-semibold text-white/90 hover:text-white transition-colors"
        >
          <span>Descubre AgroControl</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#56f3bd]" />
        </Link>
        <div className="font-mono text-[11px] text-[#b8d5cb]/75 hidden sm:block">
          01 — 05
        </div>
      </div>
    </section>
  );
}
