'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AgroControlLogo } from '@/components/ui/AgroControlLogo';
import { Menu, X, ArrowRight } from 'lucide-react';

export function Navbar({ onOpenLogin }: { onOpenLogin: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <header className="relative z-30 px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6 pb-2 flex items-center justify-between gap-3 sm:gap-6 max-w-[1540px] mx-auto">
      <Link href="#inicio" className="transition-opacity hover:opacity-90 flex items-center" aria-label="Inicio AgroControl">
        <AgroControlLogo variant="light" className="h-8 sm:h-10 w-auto" width={175} height={42} />
      </Link>

      {/* Navegación Desktop */}
      <nav className="hidden md:flex items-center gap-9 text-[15px] font-medium text-[#edf6f0]/90">
        <a
          href="#informacion"
          onClick={(e) => handleScrollTo(e, 'informacion')}
          className="transition-colors hover:text-white cursor-pointer"
        >
          Información
        </a>
        <a
          href="#tecnologia"
          onClick={(e) => handleScrollTo(e, 'tecnologia')}
          className="transition-colors hover:text-white cursor-pointer"
        >
          Tecnología
        </a>
        <a
          href="#impacto"
          onClick={(e) => handleScrollTo(e, 'impacto')}
          className="transition-colors hover:text-white cursor-pointer"
        >
          Impacto
        </a>
        <a
          href="#quienes"
          onClick={(e) => handleScrollTo(e, 'quienes')}
          className="transition-colors hover:text-white cursor-pointer"
        >
          Quiénes somos
        </a>
      </nav>

      {/* Acciones */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenLogin}
          type="button"
          className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/20 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-md backdrop-blur-sm cursor-pointer"
        >
          <span>Iniciar sesión</span>
          <ArrowRight className="w-4 h-4 text-[#56f3bd]" />
        </button>

        {/* Botón Móvil */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          type="button"
          className="md:hidden min-h-11 min-w-11 p-2.5 rounded-xl bg-white/10 text-white border border-white/15 cursor-pointer"
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-4 right-4 bg-[#062923]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 z-50">
          <a
            href="#informacion"
            onClick={(e) => handleScrollTo(e, 'informacion')}
            className="text-base text-[#edf6f0] py-2 border-b border-white/10 cursor-pointer"
          >
            Información
          </a>
          <a
            href="#tecnologia"
            onClick={(e) => handleScrollTo(e, 'tecnologia')}
            className="text-base text-[#edf6f0] py-2 border-b border-white/10 cursor-pointer"
          >
            Tecnología
          </a>
          <a
            href="#impacto"
            onClick={(e) => handleScrollTo(e, 'impacto')}
            className="text-base text-[#edf6f0] py-2 border-b border-white/10 cursor-pointer"
          >
            Impacto
          </a>
          <a
            href="#quienes"
            onClick={(e) => handleScrollTo(e, 'quienes')}
            className="text-base text-[#edf6f0] py-2 border-b border-white/10 cursor-pointer"
          >
            Quiénes somos
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenLogin();
            }}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-[#23d196] to-[#0da972] text-white font-bold text-sm shadow-lg cursor-pointer"
          >
            <span>Iniciar sesión</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
}
