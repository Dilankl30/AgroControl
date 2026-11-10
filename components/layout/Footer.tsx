import React from 'react';
import { AgroControlLogo } from '@/components/ui/AgroControlLogo';

export function Footer() {
  return (
    <footer className="bg-[#051a17] text-[#b8d5cb] border-t border-white/10 py-8 sm:py-10 px-4 sm:px-10">
      <div className="max-w-[1520px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-sm">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <AgroControlLogo variant="light" className="h-6 sm:h-7 w-auto shrink-0" />
          <span className="text-xs text-white/50 border-l border-white/20 pl-3">
            Gemelo Digital 3D & Monitoreo Agrícola
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-6 text-xs text-white/60">
          <span>ESPOCH · Investigación Aplicada</span>
          <span>Facultad de Recursos Naturales</span>
          <span>© 2026 AgroControl</span>
        </div>
      </div>
    </footer>
  );
}
