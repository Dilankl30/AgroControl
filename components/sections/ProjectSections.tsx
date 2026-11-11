'use client';

import React from 'react';
import { Database, Award, Users, Bell, LineChart, Sprout, Wifi } from 'lucide-react';

export function ProjectSections() {
  return (
    <div className="bg-[#f8fbf9] text-[#16332e] transition-colors">
      {/* 1. SECCIÓN: INFORMACIÓN DEL PROYECTO */}
      <section id="proyecto" className="scroll-mt-20 py-16 sm:py-24 px-4 sm:px-8 lg:px-12 border-b border-[#e2ece7]">
        <div className="max-w-[1520px] mx-auto">
          <div id="informacion" className="max-w-3xl mb-16 scroll-mt-20">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#13795b] mb-3">
              <span>Información General</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#093f33] mb-4">
              ¿Qué es AgroControl?
            </h2>
            <p className="text-lg text-[#4a6b62] leading-relaxed">
              AgroControl es una plataforma web inteligente de monitoreo agrícola para supervisar microclimas en invernaderos. Registra variables ambientales, presenta tendencias y genera alertas y recomendaciones cuando las condiciones se alejan de los rangos de cultivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-[#e2ece7] shadow-[0_10px_35px_rgba(18,56,47,0.06)] hover:shadow-[0_15px_45px_rgba(18,56,47,0.12)] transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#093f33]/10 text-[#093f33] flex items-center justify-center mb-6">
                <Bell className="w-6 h-6 text-[#13795b]" />
              </div>
              <h3 className="text-2xl font-bold text-[#093f33] mb-3">Alertas y Control Automático</h3>
              <p className="text-sm text-[#527068] leading-relaxed">
                Detecta anomalías ambientales y genera recomendaciones o acciones cuando la humedad, temperatura o luz superan los rangos configurados.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#e2ece7] shadow-[0_10px_35px_rgba(18,56,47,0.06)] hover:shadow-[0_15px_45px_rgba(18,56,47,0.12)] transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#093f33]/10 text-[#093f33] flex items-center justify-center mb-6">
                <Wifi className="w-6 h-6 text-[#13795b]" />
              </div>
              <h3 className="text-2xl font-bold text-[#093f33] mb-3">Telemetría y Gráficas en Tiempo Real</h3>
              <p className="text-sm text-[#527068] leading-relaxed">
                Captura continua de variables del invernadero y visualización dinámica en gráficas e indicadores para analizar el comportamiento del cultivo.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#e2ece7] shadow-[0_10px_35px_rgba(18,56,47,0.06)] hover:shadow-[0_15px_45px_rgba(18,56,47,0.12)] transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[#093f33]/10 text-[#093f33] flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-[#13795b]" />
              </div>
              <h3 className="text-2xl font-bold text-[#093f33] mb-3">Registro Histórico y Base de Datos</h3>
              <p className="text-sm text-[#527068] leading-relaxed">
                Almacena las lecturas de sensores para consultar históricos, revisar eventos y respaldar decisiones con datos acumulados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN: TECNOLOGÍA */}
      <section id="tecnologia" className="scroll-mt-20 py-16 sm:py-24 px-4 sm:px-8 lg:px-12 border-b border-[#e2ece7] bg-white">
        <div className="max-w-[1520px] mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#13795b] mb-3">
              <span>Nodos de Monitoreo</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#093f33] mb-4">
              Sensores del Invernadero
            </h2>
            <p className="text-lg text-[#4a6b62] leading-relaxed">
              Seis nodos registran las variables ambientales que ayudan a comprender las condiciones del cultivo y orientar las acciones en el invernadero.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#f2f7f4] border border-[#cbe0d6]">
              <div className="text-xs font-black text-[#13795b] uppercase mb-2">Nodo Sensor 01</div>
              <h4 className="font-bold text-lg text-[#093f33] mb-1">Humedad del Suelo</h4>
              <p className="text-xs text-[#527068] leading-relaxed mb-3">
                Mide el agua en el sustrato para orientar el riego y mantener niveles hídricos adecuados.
              </p>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#13795b]/10 text-[#13795b]">
                Monitoreo Radicular
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#f2f7f4] border border-[#cbe0d6]">
              <div className="text-xs font-black text-[#13795b] uppercase mb-2">Nodo Sensor 02</div>
              <h4 className="font-bold text-lg text-[#093f33] mb-1">Temperatura del Aire</h4>
              <p className="text-xs text-[#527068] leading-relaxed mb-3">
                Supervisa el confort térmico para detectar picos de calor o frío en el invernadero.
              </p>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#13795b]/10 text-[#13795b]">
                Control Ambiental
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#f2f7f4] border border-[#cbe0d6]">
              <div className="text-xs font-black text-[#13795b] uppercase mb-2">Nodo Sensor 03</div>
              <h4 className="font-bold text-lg text-[#093f33] mb-1">Humedad del Aire</h4>
              <p className="text-xs text-[#527068] leading-relaxed mb-3">
                Registra la humedad relativa para ayudar a prevenir ambientes propicios a hongos.
              </p>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#13795b]/10 text-[#13795b]">
                Humedad Relativa
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#f2f7f4] border border-[#cbe0d6]">
              <div className="text-xs font-black text-[#13795b] uppercase mb-2">Nodo Sensor 04</div>
              <h4 className="font-bold text-lg text-[#093f33] mb-1">Intensidad de la Luz</h4>
              <p className="text-xs text-[#527068] leading-relaxed mb-3">
                Monitorea la luminosidad disponible para la fotosíntesis y el uso de mallas de sombra.
              </p>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#13795b]/10 text-[#13795b]">
                Sensor Lumínico
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#f2f7f4] border border-[#cbe0d6]">
              <div className="text-xs font-black text-[#13795b] uppercase mb-2">Nodo Sensor 05</div>
              <h4 className="font-bold text-lg text-[#093f33] mb-1">Concentración de CO₂</h4>
              <p className="text-xs text-[#527068] leading-relaxed mb-3">
                Registra dióxido de carbono para conocer la renovación del aire y las condiciones para la fotosíntesis.
              </p>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#13795b]/10 text-[#13795b]">
                Calidad del Aire
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-[#f2f7f4] border border-[#cbe0d6]">
              <div className="text-xs font-black text-[#13795b] uppercase mb-2">Nodo Sensor 06</div>
              <h4 className="font-bold text-lg text-[#093f33] mb-1">Temperatura del Suelo</h4>
              <p className="text-xs text-[#527068] leading-relaxed mb-3">
                Sigue la temperatura de la zona radicular para valorar las condiciones de germinación y absorción de nutrientes.
              </p>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#13795b]/10 text-[#13795b]">
                Zona Radicular
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN: IMPACTO */}
      <section id="impacto" className="scroll-mt-20 py-16 sm:py-24 px-4 sm:px-8 lg:px-12 border-b border-[#e2ece7]">
        <div className="max-w-[1520px] mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#13795b] mb-3">
              <span>Valor del Sistema</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#093f33] mb-4">
              Beneficios de la Automatización
            </h2>
            <p className="text-lg text-[#4a6b62] leading-relaxed">
              La supervisión continua y el registro de datos ayudan a mantener condiciones ambientales estables y tomar decisiones oportunas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-[#e2ece7] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#13795b]/10 flex items-center justify-center mb-5"><Sprout className="w-6 h-6 text-[#13795b]" /></div>
              <h4 className="text-xl font-bold text-[#093f33] mb-2">Riego y Ventilación Oportuna</h4>
              <p className="text-sm text-[#527068] leading-relaxed">
                Respuestas oportunas según los umbrales configurados de humedad del sustrato y temperatura del aire.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#e2ece7] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#13795b]/10 flex items-center justify-center mb-5"><Bell className="w-6 h-6 text-[#13795b]" /></div>
              <h4 className="text-xl font-bold text-[#093f33] mb-2">Alertas y Recomendaciones</h4>
              <p className="text-sm text-[#527068] leading-relaxed">
                Notificaciones ante cambios de CO₂, calor o radiación, con sugerencias para orientar acciones correctivas.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#e2ece7] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#13795b]/10 flex items-center justify-center mb-5"><LineChart className="w-6 h-6 text-[#13795b]" /></div>
              <h4 className="text-xl font-bold text-[#093f33] mb-2">Historial y Análisis de Datos</h4>
              <p className="text-sm text-[#527068] leading-relaxed">
                Consulta la evolución del microclima, identifica tendencias y compara ciclos de producción con los registros almacenados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN: QUIÉNES SOMOS */}
      <section id="quienes" className="scroll-mt-20 py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-[1520px] mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#13795b] mb-3">
              <span>Equipo de Investigación</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#093f33] mb-4">
              Vínculo Académico ESPOCH
            </h2>
            <p className="text-lg text-[#4a6b62] leading-relaxed">
              AgroControl nace en la Escuela Superior Politécnica de Chimborazo (Sede Orellana) como una iniciativa interdisciplinaria entre Tecnologías de la Información y Agronomía, que integra IoT, desarrollo web y ciencia agrícola.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#fbfdfc] border border-[#e2ece7] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#093f33]/10 text-[#093f33] flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-[#13795b]" />
              </div>
              <h3 className="text-xl font-bold text-[#093f33] mb-1">Tecnologías de la Información</h3>
              <div className="text-xs text-[#13795b] font-bold mb-3">Desarrollo Web y Datos</div>
              <p className="text-sm text-[#527068] leading-relaxed">
                Arquitectura de software y base de datos para telemetría, gráficas, alertas y recomendaciones en tiempo real.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#fbfdfc] border border-[#e2ece7] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#093f33]/10 text-[#093f33] flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-[#13795b]" />
              </div>
              <h3 className="text-xl font-bold text-[#093f33] mb-1">Agronomía</h3>
              <div className="text-xs text-[#13795b] font-bold mb-3">Parámetros Agronómicos y Validación</div>
              <p className="text-sm text-[#527068] leading-relaxed">
                Definición y validación de rangos de temperatura, humedad, CO₂ y luminosidad para las necesidades del cultivo.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#fbfdfc] border border-[#e2ece7] shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#093f33]/10 text-[#093f33] flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-[#13795b]" />
              </div>
              <h3 className="text-xl font-bold text-[#093f33] mb-1">Integración IoT y Campo</h3>
              <div className="text-xs text-[#13795b] font-bold mb-3">Vinculación Tecnológica y Práctica</div>
              <p className="text-sm text-[#527068] leading-relaxed">
                Implementación y pruebas de sensores en el invernadero, conectando la captura digital con el manejo agronómico.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
