'use client';

import React from 'react';
import { Cpu, ShieldCheck, Database, Award, Wifi, Users } from 'lucide-react';

export function ProjectSections() {
  return (
    <div className="bg-[#f8fbf9] text-[#16332e] transition-colors">
      {/* 1. SECCIÓN: INFORMACIÓN DEL PROYECTO */}
      <section id="informacion" className="scroll-mt-20 py-24 px-6 sm:px-12 border-b border-[#e2ece7]">
        <div className="max-w-[1520px] mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#13795b] mb-3">
              <span>Información General</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#093f33] mb-4">
              ¿Qué es AgroControl?
            </h2>
            <p className="text-lg text-[#4a6b62] leading-relaxed">
              AgroControl es una plataforma de agricultura protegida inteligente que combina el Internet de las Cosas (IoT) y gemelos digitales 3D para la supervisión y control microclimático de invernaderos en tiempo real.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-[#e2ece7] shadow-[0_10px_35px_rgba(18,56,47,0.06)] hover:shadow-[0_15px_45px_rgba(18,56,47,0.12)] transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#093f33]/10 text-[#093f33] flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6 text-[#13795b]" />
              </div>
              <h3 className="text-2xl font-bold text-[#093f33] mb-3">Gemelo Digital 3D</h3>
              <p className="text-sm text-[#527068] leading-relaxed">
                Representación virtual tridimensional del invernadero con renderizado acelerado por hardware. Permite rotar, inspeccionar nodos de telemetría y visualizar el estado del cultivo capa por capa.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#e2ece7] shadow-[0_10px_35px_rgba(18,56,47,0.06)] hover:shadow-[0_15px_45px_rgba(18,56,47,0.12)] transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#093f33]/10 text-[#093f33] flex items-center justify-center mb-6">
                <Wifi className="w-6 h-6 text-[#13795b]" />
              </div>
              <h3 className="text-2xl font-bold text-[#093f33] mb-3">Telemetría en Tiempo Real</h3>
              <p className="text-sm text-[#527068] leading-relaxed">
                Adquisición continua de variables agronómicas críticas: temperatura foliar, humedad relativa del aire, luminosidad fotosintética (PAR) y humedad volumétrica del suelo.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#e2ece7] shadow-[0_10px_35px_rgba(18,56,47,0.06)] hover:shadow-[0_15px_45px_rgba(18,56,47,0.12)] transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#093f33]/10 text-[#093f33] flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-[#13795b]" />
              </div>
              <h3 className="text-2xl font-bold text-[#093f33] mb-3">Seguridad y Respaldo</h3>
              <p className="text-sm text-[#527068] leading-relaxed">
                Arquitectura de base de datos relacional PostgreSQL en Supabase con Row Level Security (RLS) y autenticación multifactor biométrica mediante Passkeys / WebAuthn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN: TECNOLOGÍA */}
      <section id="tecnologia" className="scroll-mt-20 py-24 px-6 sm:px-12 border-b border-[#e2ece7] bg-white">
        <div className="max-w-[1520px] mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#13795b] mb-3">
              <span>Stack Tecnológico</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#093f33] mb-4">
              Ingeniería y Hardware IoT
            </h2>
            <p className="text-lg text-[#4a6b62] leading-relaxed">
              La infraestructura de AgroControl integra hardware de bajo consumo, protocolos de comunicación inalámbrica y microservicios en la nube.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#f2f7f4] border border-[#cbe0d6]">
              <div className="text-xs font-black text-[#13795b] uppercase mb-2">Nodo Sensor 01</div>
              <h4 className="font-bold text-lg text-[#093f33] mb-1">Temperatura Canopia</h4>
              <p className="text-xs text-[#527068] leading-relaxed mb-3">
                Sensor de precisión I2C suspendido en el dosel vegetal para medir temperatura microclimática exacta.
              </p>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#13795b]/10 text-[#13795b]">
                Rango: -10 °C a 60 °C
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#f2f7f4] border border-[#cbe0d6]">
              <div className="text-xs font-black text-[#13795b] uppercase mb-2">Nodo Sensor 02</div>
              <h4 className="font-bold text-lg text-[#093f33] mb-1">Humedad Relativa</h4>
              <p className="text-xs text-[#527068] leading-relaxed mb-3">
                Higrómetro capacitivo digital con filtro de membrana para evitar condensación por riego.
              </p>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#13795b]/10 text-[#13795b]">
                Precisión: ±2% HR
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#f2f7f4] border border-[#cbe0d6]">
              <div className="text-xs font-black text-[#13795b] uppercase mb-2">Nodo Sensor 03</div>
              <h4 className="font-bold text-lg text-[#093f33] mb-1">Radiación PAR / Luz</h4>
              <p className="text-xs text-[#527068] leading-relaxed mb-3">
                Fotodiodo calibrado espectralmente para radiación fotosintéticamente activa (400 - 700 nm).
              </p>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#13795b]/10 text-[#13795b]">
                Sensor Cenital
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#f2f7f4] border border-[#cbe0d6]">
              <div className="text-xs font-black text-[#13795b] uppercase mb-2">Nodo Sensor 04</div>
              <h4 className="font-bold text-lg text-[#093f33] mb-1">Sonda de Suelo</h4>
              <p className="text-xs text-[#527068] leading-relaxed mb-3">
                Sonda FDR de acero inoxidable para medir permitividad dieléctrica y contenido volumétrico de agua.
              </p>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#13795b]/10 text-[#13795b]">
                Monitoreo Radicular
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN: IMPACTO */}
      <section id="impacto" className="scroll-mt-20 py-24 px-6 sm:px-12 border-b border-[#e2ece7]">
        <div className="max-w-[1520px] mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#13795b] mb-3">
              <span>Sostenibilidad Agronómica</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#093f33] mb-4">
              Impacto y Resultados de Campo
            </h2>
            <p className="text-lg text-[#4a6b62] leading-relaxed">
              La toma de decisiones basada en datos directos permite maximizar el rendimiento del cultivo reduciendo costos operativos e insumos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-[#e2ece7] shadow-sm">
              <div className="text-4xl font-black text-[#13795b] mb-2">-35%</div>
              <h4 className="text-xl font-bold text-[#093f33] mb-2">Ahorro de Recurso Hídrico</h4>
              <p className="text-sm text-[#527068] leading-relaxed">
                Riego de precisión programado estrictamente según la tasa de evapotranspiración y la curva de retención de humedad del sustrato.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#e2ece7] shadow-sm">
              <div className="text-4xl font-black text-[#13795b] mb-2">99.8%</div>
              <h4 className="text-xl font-bold text-[#093f33] mb-2">Prevención Fitosanitaria</h4>
              <p className="text-sm text-[#527068] leading-relaxed">
                Alertas predictivas ante condiciones de punto de rocío y condensación prolongada, reduciendo la aparición de hongos como Botrytis.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#e2ece7] shadow-sm">
              <div className="text-4xl font-black text-[#13795b] mb-2">+28%</div>
              <h4 className="text-xl font-bold text-[#093f33] mb-2">Rendimiento por Metro Cuadrado</h4>
              <p className="text-sm text-[#527068] leading-relaxed">
                Mantenimiento del cultivo en su zona de confort térmico y lumínico, acelerando ciclos fotosintéticos y calidad del fruto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN: QUIÉNES SOMOS */}
      <section id="quienes" className="scroll-mt-20 py-24 px-6 sm:px-12 bg-white">
        <div className="max-w-[1520px] mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#13795b] mb-3">
              <span>Equipo de Investigación</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#093f33] mb-4">
              Vínculo Académico ESPOCH
            </h2>
            <p className="text-lg text-[#4a6b62] leading-relaxed">
              AgroControl nace en la Escuela Superior Politécnica de Chimborazo como iniciativa de investigación aplicada para la modernización del sector agrícola ecuatoriano.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#fbfdfc] border border-[#e2ece7] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#093f33]/10 text-[#093f33] flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-[#13795b]" />
              </div>
              <h3 className="text-xl font-bold text-[#093f33] mb-1">Facultad de Recursos Naturales</h3>
              <div className="text-xs text-[#13795b] font-bold mb-3">Ingeniería Agrícola & Agronomía</div>
              <p className="text-sm text-[#527068] leading-relaxed">
                Validación de modelos fisiológicos de cultivo, curvas de estrés hídrico y caracterización de variedades en invernadero.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#fbfdfc] border border-[#e2ece7] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#093f33]/10 text-[#093f33] flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-[#13795b]" />
              </div>
              <h3 className="text-xl font-bold text-[#093f33] mb-1">Laboratorio de IoT y Sistemas</h3>
              <div className="text-xs text-[#13795b] font-bold mb-3">Ingeniería en Software</div>
              <p className="text-sm text-[#527068] leading-relaxed">
                Desarrollo del gemelo digital 3D interactivo, pipeline de datos en tiempo real y arquitectura de microservicios en la nube.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#fbfdfc] border border-[#e2ece7] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#093f33]/10 text-[#093f33] flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-[#13795b]" />
              </div>
              <h3 className="text-xl font-bold text-[#093f33] mb-1">Transferencia Tecnológica</h3>
              <div className="text-xs text-[#13795b] font-bold mb-3">Comunidad Agrícola de Chimborazo</div>
              <p className="text-sm text-[#527068] leading-relaxed">
                Capacitación a productores locales para la adopción de herramientas digitales de precisión y agricultura climáticamente inteligente.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
