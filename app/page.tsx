'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/hero/HeroSection';
import { ProjectSections } from '@/components/sections/ProjectSections';
import { Footer } from '@/components/layout/Footer';
import { LoginModal } from '@/components/auth/LoginModal';
import { Chatbot } from '@/components/chat/Chatbot';

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#071A12] text-[#edf6f0] flex flex-col selection:bg-[#56f3bd] selection:text-[#041f1b]">
      {/* 
        1. FONDO GENERAL DE LA PÁGINA (HERO SECTION):
        - Imagen fotográfica realista y oscura del invernadero (greenhouse-bg.jpg) a pantalla completa.
        - Superposición degradada verde oscuro profundo (#071A12 con 75%-85% de opacidad).
      */}
      <div className="relative w-full overflow-hidden min-h-screen flex flex-col justify-between">
        {/* Capa de fondo: Fotografía realista que cubre toda la pantalla */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: `url('/images/greenhouse-bg.jpg')`,
          }}
        />

        {/* Capa de superposición (overlay): Verde oscuro profundo #071A12 (75% a 85% de opacidad) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 75% 25%, rgba(255, 223, 158, 0.14), transparent 38%),
              linear-gradient(90deg, rgba(7, 26, 18, 0.85) 0%, rgba(7, 26, 18, 0.80) 40%, rgba(7, 26, 18, 0.72) 70%, rgba(7, 26, 18, 0.78) 100%)
            `,
          }}
        />

        {/* Malla sutil de coordenadas agronómicas */}
        <div className="grid-noise pointer-events-none" />

        {/* Capa de contenido interactivo (Navbar + Hero) */}
        <div className="relative z-10 flex flex-col justify-between flex-1">
          <Navbar onOpenLogin={() => setIsLoginOpen(true)} />
          <HeroSection onOpenLogin={() => setIsLoginOpen(true)} />
        </div>
      </div>

      {/* Secciones Institucionales */}
      <ProjectSections />

      {/* Pie de Página */}
      <Footer />

      {/* Chatbot Interactivo Flotante AgroControl AI */}
      <Chatbot />

      {/* Modal de acceso con correo y Passkey */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
