'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle2, ShieldCheck, Mail, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast';

interface OtpVerificationProps {
  email: string;
  onBack: () => void;
  onSuccess: () => void;
}

export function OtpVerification({ email, onBack, onSuccess }: OtpVerificationProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();

  // Temporizador regresivo para reenvío (60 segundos)
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Enfocar automáticamente el primer input al montar
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const char = value.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setErrorMsg(null);

    // Mover foco automáticamente a la siguiente casilla al escribir
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Si ya completó los 6 dígitos, verificar automáticamente con Supabase
    if (char && index === 5 && newDigits.every((d) => d !== '')) {
      verifyCode(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const splitDigits = pastedData.split('');
      setDigits(splitDigits);
      inputRefs.current[5]?.focus();
      verifyCode(pastedData);
    }
  };

  const verifyCode = async (otpCode: string) => {
    if (otpCode.length !== 6) {
      setErrorMsg('Por favor escribe el código de 6 dígitos completo.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      // Verificación estricta y real con Supabase Auth
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode.trim(),
        type: 'email',
      });

      if (error) {
        setLoading(false);
        setErrorMsg('El código no es válido o ha expirado.');
        return;
      }

      if (data?.session) {
        toast('¡Identidad verificada con éxito!');
        setLoading(false);
        setTimeout(() => {
          onSuccess();
        }, 300);
      } else {
        setLoading(false);
        setErrorMsg('No se pudo establecer la sesión con Supabase. Intenta reenviar el código.');
      }
    } catch (err: unknown) {
      setLoading(false);
      const message = err instanceof Error ? err.message : 'Error de conexión';
      setErrorMsg(`Error al validar con Supabase: ${message}`);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
        },
      });

      setLoading(false);
      if (error) {
        if (error.message.includes('rate limit') || (error as { status?: number }).status === 429) {
          setErrorMsg(
            'Se alcanzó el límite de envíos. Inténtalo más tarde.'
          );
        } else {
          setErrorMsg(error.message || 'Error al solicitar el reenvío del código.');
        }
      } else {
        setResendCooldown(60);
        setDigits(['', '', '', '', '', '']);
        toast("Nuevo código enviado.");
        inputRefs.current[0]?.focus();
      }
    } catch {
      setLoading(false);
      setErrorMsg('Error de red al conectar con Supabase.');
    }
  };

  return (
    <div className="flex flex-col h-full justify-between animate-in fade-in duration-200">
      <div>
        <button
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#527068] hover:text-[#093f33] transition-colors mb-5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cambiar de correo</span>
        </button>

        <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#13795b] mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Código de acceso</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#093f33] mb-2">
          Revisa tu correo personal
        </h2>
        <p className="text-sm text-[#527068] leading-relaxed mb-6">
          Hemos enviado un código de seguridad de 6 dígitos a:
          <br />
          <strong className="text-[#093f33] font-bold text-base">Correo indicado</strong>
        </p>

        {/* Tarjeta de recordatorio seguro */}
        <div className="p-4 rounded-2xl bg-[#f0f6f3] border border-[#cce3d8] flex items-start gap-3 mb-6">
          <Mail className="w-5 h-5 text-[#13795b] shrink-0 mt-0.5" />
          <div className="text-xs text-[#33564d] leading-relaxed">
            Busca en tu bandeja de entrada un correo emitido por el servicio de autenticación. Si no lo ves en 1 minuto, revisa también tu carpeta de <strong>Correo no deseado (Spam)</strong>.
          </div>
        </div>

        {/* 6 Casillas de Código independientes para escribirlo manualmente */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-[#093f33] uppercase tracking-wider mb-2.5">
            Escribe el código de 6 dígitos recibido:
          </label>
          <div className="flex items-center justify-between gap-2 sm:gap-3 mb-4">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className="w-11 h-14 sm:w-13 sm:h-16 text-center text-2xl font-black text-[#093f33] bg-[#f2f7f4] border border-[#cbe0d6] rounded-2xl focus:border-[#13795b] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#13795b]/15 transition-all"
              />
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium mb-4 leading-relaxed flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          onClick={() => verifyCode(digits.join(''))}
          disabled={loading || digits.some((d) => !d)}
          type="button"
          className="w-full py-4 rounded-2xl bg-[#093f33] hover:bg-[#0c4e40] disabled:opacity-50 text-white font-bold text-sm sm:text-base transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 text-[#56f3bd]" />
              <span>Verificar código y entrar</span>
            </>
          )}
        </button>
      </div>

      <div className="pt-6 border-t border-[#e2ece7] text-center text-xs text-[#527068]">
        ¿No recibiste el correo?{' '}
        {resendCooldown > 0 ? (
          <span className="font-semibold text-[#093f33]">Reenviar en {resendCooldown}s</span>
        ) : (
          <button
            onClick={handleResend}
            type="button"
            className="font-bold text-[#13795b] hover:underline cursor-pointer"
          >
            Reenviar código al correo
          </button>
        )}
      </div>
    </div>
  );
}
