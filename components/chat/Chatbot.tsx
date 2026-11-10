'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, Bot, User, ChevronDown } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const QUICK_QUESTIONS = [
  '¿Qué es AgroControl?',
  '¿Qué sensores incluye?',
  '¿Cómo funciona el gemelo digital?',
  '¿Cómo empezar?',
];

const BOT_KNOWLEDGE_BASE: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['que es', 'qué es', 'agrocontrol', 'plataforma', 'proyecto', 'de que trata'],
    answer:
      '🌱 **AgroControl** es una plataforma de agricultura inteligente de última generación basada en IoT. Integra **gemelos digitales en 3D** para la monitorización, visualización y gestión en tiempo real de invernaderos de alta precisión, desarrollada en el marco de investigación aplicada de la ESPOCH.',
  },
  {
    keywords: ['sensores', 'variables', 'temperatura', 'humedad', 'luz', 'suelo', 'lecturas', 'mediciones'],
    answer:
      '📊 La plataforma monitorea cuatro variables microclimáticas y agronómicas críticas:\n\n' +
      '• **Sensor 01 (Temperatura Canopia):** 23.8 °C (óptimo para evitar estrés térmico).\n' +
      '• **Sensor 02 (Humedad Relativa):** 68% (previene botrytis y regula transpiración).\n' +
      '• **Sensor 03 (Luminosidad PAR):** Alta con cobertura uniforme para fotosíntesis activa.\n' +
      '• **Sensor 04 (Humedad de Suelo):** Sonda de inserción radicular para optimizar fertirriego.',
  },
  {
    keywords: ['gemelo', 'digital', '3d', 'interactivo', 'girar', 'techo', 'modelo', 'camara', 'orbita'],
    answer:
      '🎮 El **Gemelo Digital 3D** es una réplica virtual e interactiva del invernadero:\n\n' +
      '• **Arrastra con el ratón:** Rota la vista en 360° para inspeccionar cualquier ángulo.\n' +
      '• **Clic en nodos (01 al 04):** Despliega el inspector isométrico con detalles técnicos.\n' +
      '• **Ocultar techo:** Desmonta la cubierta translúcida para ver las camas de cultivo y los tomates.\n' +
      '• **Girar:** Activa o pausa la rotación automática suave.',
  },
  {
    keywords: ['empezar', 'iniciar', 'login', 'acceso', 'cuenta', 'passkey', 'google', 'correo', 'otp', 'registro'],
    answer:
      '🔐 Para acceder al sistema, haz clic en **"Iniciar sesión →"** en la barra superior. No necesitas recordar contraseñas:\n\n' +
      '1. **Google OAuth:** Acceso con tu cuenta institucional en un clic.\n' +
      '2. **Correo OTP:** Te enviamos un código temporal de 6 dígitos a tu bandeja.\n' +
      '3. **Passkeys (WebAuthn):** Entra con la biometría de tu dispositivo (Windows Hello, Face ID o huella).',
  },
  {
    keywords: ['impacto', 'objetivo', 'beneficio', 'rendimiento', 'agua', 'plagas', 'sostenibilidad'],
    answer:
      '🎯 **Impacto y Objetivos Agronómicos:**\n\n' +
      '• **Eficiencia Hídrica:** Reduce hasta un 30% el consumo de agua mediante sensores radiculares.\n' +
      '• **Prevención Fitosanitaria:** Detecta condiciones propicias para hongos antes de su propagación.\n' +
      '• **Maximización de Cosecha:** Asegura que los cultivos permanezcan siempre en su ventana fisiológica ideal.',
  },
  {
    keywords: ['espoch', 'investigacion', 'universidad', 'academico', 'quienes'],
    answer:
      '🏛️ AgroControl nace de la colaboración de investigación aplicada de la **ESPOCH (Escuela Superior Politécnica de Chimborazo)** para transferir tecnología digital de punta al sector agrícola ecuatoriano.',
  },
];

function getBotReply(userText: string): string {
  const normalized = userText
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  for (const item of BOT_KNOWLEDGE_BASE) {
    const match = item.keywords.some((kw) => {
      const normalizedKw = kw
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return normalized.includes(normalizedKw);
    });
    if (match) return item.answer;
  }

  return (
    'Entendido. Como asistente de **AgroControl**, puedo orientarte sobre:\n\n' +
    '• ¿Qué sensores y variables monitorea la plataforma?\n' +
    '• Cómo explorar e interactuar con el **Gemelo Digital 3D**.\n' +
    '• Cómo autenticarte con Google, código OTP o Passkeys.\n' +
    '• Los objetivos de sostenibilidad e impacto agronómico.\n\n' +
    '¿Te gustaría consultar alguna de estas opciones?'
  );
}

export function Chatbot() {
  const messageSequence = useRef(0);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: '¡Hola! Soy tu asistente de **AgroControl** 🌱. ¿En qué puedo ayudarte hoy?',
      timestamp: 'Ahora',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: String(++messageSequence.current),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Respuesta simulada inmediata
    setTimeout(() => {
      const botReplyText = getBotReply(text);
      const botMessage: ChatMessage = {
        id: String(++messageSequence.current),
        sender: 'bot',
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botón Flotante Circular (Esquina inferior derecha) */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            type="button"
            aria-label="Abrir asistente AgroControl · Ayuda"
            className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-[#23d196] to-[#0da972] text-white shadow-[0_10px_35px_rgba(4,37,31,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 border border-[#56f3bd]/40"
          >
            {/* Efecto de pulso luminoso */}
            <span className="absolute -inset-1 rounded-full bg-[#56f3bd]/30 blur-sm group-hover:bg-[#56f3bd]/50 animate-pulse pointer-events-none" />
            <MessageSquare className="w-6 h-6 relative z-10 transition-transform group-hover:scale-110" />
            <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#56f3bd] border-2 border-[#071A12] shadow-[0_0_8px_#56f3bd]" />
          </button>
        )}
      </div>

      {/* Ventana de Chat Flotante (Glassmorphism Dark #071A12) */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Ventana de chat AgroControl · Ayuda"
          className="fixed bottom-6 right-4 sm:right-6 z-50 w-[min(410px,calc(100vw-32px))] h-[580px] max-h-[85vh] flex flex-col rounded-3xl bg-[#071A12]/92 border border-[#56f3bd]/25 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.65)] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Encabezado */}
          <div className="px-5 py-4 bg-[#0a2920]/90 border-b border-[#56f3bd]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#13795b] to-[#23d196] flex items-center justify-center text-white shadow">
                <Sparkles className="w-5 h-5 text-[#eafff4]" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#56f3bd] border-2 border-[#071A12]" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
                  <span>AgroControl · Ayuda</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#56f3bd]/20 text-[#56f3bd]">
                    IoT
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#a0c7b9]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#56f3bd] shadow-[0_0_6px_#56f3bd] animate-pulse" />
                  <span>Respuestas predefinidas · demo</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              type="button"
              aria-label="Minimizar chat"
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#d7eee2] transition-colors"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Área de Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                      isUser
                        ? 'bg-[#23d196] text-[#071A12]'
                        : 'bg-[#13795b]/50 text-[#56f3bd] border border-[#56f3bd]/30'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Burbuja de Texto */}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-[#13795b] text-white rounded-br-xs'
                        : 'bg-white/[0.08] text-[#e7f8ef] border border-[#56f3bd]/15 rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                    <div
                      className={`text-[9px] mt-1 text-right ${
                        isUser ? 'text-white/70' : 'text-[#a0c7b9]/60'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Indicador de escritura */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-[#a0c7b9] pl-9">
                <span className="w-1.5 h-1.5 rounded-full bg-[#56f3bd] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#56f3bd] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#56f3bd] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sugerencias Rápidas (Chips de Preguntas Frecuentes) */}
          <div className="px-4 py-2 bg-[#061811]/90 border-t border-[#56f3bd]/15 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                type="button"
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/[0.07] hover:bg-[#56f3bd]/20 border border-[#56f3bd]/25 text-[11px] text-[#e1ffef] font-medium transition-all hover:border-[#56f3bd]/50 flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Formulario de Entrada */}
          <div className="p-3 bg-[#0a2920]/90 border-t border-[#56f3bd]/20 flex items-center gap-2">
            <input
              type="text"
              placeholder="Pregunta sobre el invernadero..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-white/[0.08] border border-white/15 focus:border-[#56f3bd] text-white text-xs sm:text-sm placeholder:text-[#a0c7b9]/60 focus:outline-none focus:ring-2 focus:ring-[#56f3bd]/20 transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              type="button"
              aria-label="Enviar mensaje"
              className="p-2.5 rounded-2xl bg-[#23d196] hover:bg-[#1db884] disabled:opacity-40 text-white font-bold transition-all shadow-md flex items-center justify-center flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
