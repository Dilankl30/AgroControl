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
      '📊 El sistema contempla seis variables distintas para el invernadero:\n\n' +
      '• **Sensor 01 · Temperatura del aire:** lectura demostrativa de 23.8 °C.\n' +
      '• **Sensor 02 · Humedad del aire:** lectura demostrativa de 68%.\n' +
      '• **Sensor 03 · Humedad del suelo:** lectura demostrativa de 42%.\n' +
      '• **Sensor 04 · Intensidad de luz:** lectura demostrativa de 850 W/m².\n' +
      '• **Sensor 05 · Concentración de CO₂:** lectura demostrativa de 420 ppm.\n' +
      '• **Sensor 06 · Temperatura del suelo:** lectura demostrativa de 18.6 °C.\n\n' +
      'Las lecturas son de demostración; el sistema aún no está conectado a sensores físicos.',
  },
  {
    keywords: ['gemelo', 'digital', '3d', 'interactivo', 'girar', 'techo', 'modelo', 'camara', 'orbita'],
    answer:
      '🎮 El **Gemelo Digital 3D** es una réplica virtual e interactiva del invernadero:\n\n' +
      '• **Arrastra con el ratón:** Rota la vista en 360° para inspeccionar cualquier ángulo.\n' +
      '• **Clic en nodos (01 al 06):** Despliega el inspector isométrico con detalles técnicos.\n' +
      '• **Ocultar techo:** Desmonta la cubierta translúcida para ver las camas de cultivo y los tomates.\n' +
      '• **Girar:** Activa o pausa la rotación automática suave.',
  },
  {
    keywords: ['empezar', 'iniciar', 'login', 'acceso', 'cuenta', 'passkey', 'biometria', 'correo', 'contraseña', 'registro'],
    answer:
      '🔐 Para acceder al sistema, haz clic en **"Iniciar sesión →"** en la barra superior. Puedes entrar con tu correo y contraseña o con una Passkey. El dispositivo puede verificar con rostro, huella o su método local de desbloqueo.',
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

function renderInlineFormatting(text: string, keyPrefix: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${keyPrefix}-${index}`} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={`${keyPrefix}-${index}`}>{part}</React.Fragment>;
  });
}

function renderMessageText(text: string) {
  return text.split('\n').map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={`line-${index}`} className="h-2" aria-hidden="true" />;
    if (trimmed.startsWith('• ')) {
      return (
        <div key={`line-${index}`} className="flex min-w-0 items-start gap-2">
          <span className="shrink-0 text-[#56f3bd]" aria-hidden="true">•</span>
          <span className="min-w-0 break-words [overflow-wrap:anywhere]">{renderInlineFormatting(trimmed.slice(2), `bullet-${index}`)}</span>
        </div>
      );
    }
    return <p key={`line-${index}`} className="min-w-0 break-words [overflow-wrap:anywhere]">{renderInlineFormatting(trimmed, `paragraph-${index}`)}</p>;
  });
}

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
    '• Cómo autenticarte con correo y contraseña o Passkeys.\n' +
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
          className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 w-[min(410px,calc(100vw-24px))] h-[min(580px,calc(100dvh-24px))] flex min-w-0 flex-col rounded-3xl bg-[#071A12]/95 border border-[#56f3bd]/25 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.65)] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Encabezado */}
          <div className="px-3 sm:px-5 py-3 sm:py-4 bg-[#0a2920]/90 border-b border-[#56f3bd]/20 flex min-w-0 items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#13795b] to-[#23d196] flex items-center justify-center text-white shadow">
                <Sparkles className="w-5 h-5 text-[#eafff4]" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#56f3bd] border-2 border-[#071A12]" />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-sm text-white tracking-tight flex min-w-0 items-center gap-1.5">
                  <span className="truncate">AgroControl · Ayuda</span>
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
          <div className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-3.5 scroll-smooth">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex min-w-0 items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
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
                    className={`min-w-0 max-w-[calc(100%-2.5rem)] rounded-2xl px-3 sm:px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-sm break-words [overflow-wrap:anywhere] ${
                      isUser
                        ? 'bg-[#13795b] text-white rounded-br-xs'
                        : 'bg-white/[0.08] text-[#e7f8ef] border border-[#56f3bd]/15 rounded-bl-xs'
                    }`}
                  >
                    <div className="min-w-0 space-y-1 whitespace-normal">{msg.sender === 'bot' ? renderMessageText(msg.text) : msg.text}</div>
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
          <div className="min-w-0 px-4 py-2 bg-[#061811]/90 border-t border-[#56f3bd]/15 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
          <div className="min-w-0 p-3 bg-[#0a2920]/90 border-t border-[#56f3bd]/20 flex items-center gap-2">
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
