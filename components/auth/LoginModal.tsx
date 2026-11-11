'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mail, Fingerprint, ShieldCheck, ArrowRight, RefreshCw, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { AgroControlLogo } from '@/components/ui/AgroControlLogo';
import { PasskeyAuth } from '@/components/auth/PasskeyAuth';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast';

type AuthStep = 'select' | 'email_password' | 'passkey' | 'recover_password' | 'reset_password';

export function LoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { toast } = useToast();

  if (!isOpen) return null;

  // Redirección exitosa garantizada
  const handleAuthSuccess = () => {
    onClose();
    router.push('/dashboard');
    router.refresh();
  };

  // Método 1: Iniciar sesión con Correo y Contraseña
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Por favor escribe un correo electrónico válido.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg('Por favor escribe tu contraseña (mínimo 4 caracteres).');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (error || !data.session) {
        setLoading(false);
        setErrorMsg('No se pudo iniciar sesión. Comprueba tus datos.');
        return;
      }
      toast('¡Inicio de sesión exitoso! Abriendo panel de control 🌱');
      setTimeout(() => {
        setLoading(false);
        handleAuthSuccess();
      }, 400);
    } catch (err: unknown) {
      setLoading(false);
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setErrorMsg(message);
    }
  };

  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Escribe un correo electrónico válido.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
      if (error) throw error;

      setEmailCode('');
      setNewPassword('');
      setConfirmNewPassword('');
      setStep('reset_password');
      toast('Si existe una cuenta con ese correo, recibirás un código para recuperar el acceso.');
    } catch {
      setErrorMsg('No se pudo solicitar el código. Espera un momento e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const token = emailCode.replace(/\D/g, '');

    if (token.length !== 6) {
      setErrorMsg('Escribe el código de 6 dígitos que enviamos a tu correo.');
      return;
    }
    if (newPassword.length < 8) {
      setErrorMsg('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const supabase = createClient();
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token,
        type: 'recovery',
      });
      if (verifyError || !data.session) {
        setErrorMsg('El código no es válido o ya venció. Solicita otro e inténtalo de nuevo.');
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;

      setEmailCode('');
      setNewPassword('');
      setConfirmNewPassword('');
      toast('Contraseña actualizada. Ya puedes entrar a AgroControl.');
      handleAuthSuccess();
    } catch {
      setErrorMsg('No se pudo cambiar la contraseña. Solicita un código nuevo e inténtalo otra vez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="loginTitle"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-2 min-[380px]:p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Contenedor Split Card */}
      <div className="relative w-full max-w-[960px] max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-3rem)] bg-white rounded-2xl sm:rounded-3xl overflow-y-auto shadow-2xl grid grid-cols-1 md:grid-cols-[1.05fr_1fr] md:min-h-[580px]">
        {/* Columna Izquierda: Identidad y Contexto Operativo con fotografía real */}
        <div
          className="relative hidden md:flex p-8 sm:p-10 flex-col justify-between text-white bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url('/images/greenhouse-bg.jpg')` }}
        >
          {/* Overlay esmeralda profundo de marca */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#072f28]/92 via-[#052b24]/90 to-[#031412]/95" />
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#56f3bd_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#13795b]/30 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <AgroControlLogo variant="light" className="h-9 w-auto mb-8" />
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#94ffb1] mb-4">
              <span>ACCESO A AGROCONTROL</span>
            </div>
            <h3 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-4">
              Conectamos lo que importa.
            </h3>
            <p className="text-sm text-[#d7eee2] leading-relaxed max-w-sm opacity-90">
              Tu identidad abre el camino a una experiencia de monitoreo personalizada con telemetría en tiempo real.
            </p>
          </div>

          <div className="relative z-10 pt-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-xs text-[#e7f8ef] backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#56f3bd] shadow-[0_0_8px_#56f3bd]" />
              <span>Vista de demostración · 4 sensores</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Formularios de Acceso */}
        <div className="min-w-0 p-5 min-[380px]:p-6 sm:p-10 flex flex-col justify-between bg-[#fbfdfc] relative">
          {/* Botón de Cierre */}
          <button
            onClick={onClose}
            type="button"
            aria-label="Cerrar modal"
            className="absolute top-6 right-6 p-2 rounded-full bg-[#f0f5f2] hover:bg-[#e2ede7] text-[#16332e] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Estado 1: Selector de Métodos */}
          {step === 'select' && (
            <div className="flex flex-col h-full justify-between animate-in fade-in duration-200">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-[#13795b] mb-2">
                  Bienvenido
                </div>
                <h2 id="loginTitle" className="text-3xl sm:text-4xl font-black text-[#093f33] mb-3">
                  Iniciar sesión
                </h2>
                <p className="text-sm text-[#527068] leading-relaxed mb-6">
                  Elige cómo deseas ingresar. Las cuentas son creadas previamente por el equipo de AgroControl.
                </p>

                {errorMsg && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium mb-4 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Métodos de Acceso */}
                <div className="space-y-3">
                  {/* Correo y Contraseña */}
                  <button
                    onClick={() => {
                      setErrorMsg(null);
                      setStep('email_password');
                    }}
                    type="button"
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-[#f6fbf8] border border-[#dce9e3] hover:border-[#13795b]/50 text-[#16352d] font-bold text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-[#13795b]/10 flex items-center justify-center text-[#13795b]">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-[#093f33] font-bold">Correo y Contraseña</div>
                        <div className="text-xs font-normal text-[#6f8f85]">Acceso directo a tu cuenta</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7e9e94]" />
                  </button>

                  {/* Passkey con la opción de verificación disponible en el dispositivo */}
                  <button
                    onClick={() => {
                      setErrorMsg(null);
                      setStep('passkey');
                    }}
                    type="button"
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#072f28] to-[#041d18] text-white hover:from-[#0a3f36] hover:to-[#072f28] border border-[#56f3bd]/30 font-bold text-sm shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-[#56f3bd]/20 flex items-center justify-center text-[#56f3bd]">
                        <Fingerprint className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-white font-extrabold flex items-center gap-2">
                          <span>Biometría / Passkey</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#56f3bd] text-[#041f1b] font-black">FIDO2</span>
                        </div>
                        <div className="text-xs font-normal text-[#94ffb1]">Biometría, PIN o llave de seguridad compatible</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#56f3bd] group-hover:translate-x-1 transition-transform" />
                  </button>

                </div>
              </div>

              <div className="pt-6 border-t border-[#e2ece7] flex items-center gap-2 text-xs text-[#527068]">
                <ShieldCheck className="w-4 h-4 text-[#13795b]" />
                <span>Autenticación protegida con sesiones cifradas.</span>
              </div>
            </div>
          )}

          {/* Estado 2: Ingresar con Correo y Contraseña */}
          {step === 'email_password' && (
            <div className="flex flex-col h-full justify-between animate-in fade-in duration-200">
              <div>
                <button
                  onClick={() => setStep('select')}
                  type="button"
                  className="text-xs font-semibold text-[#527068] hover:text-[#093f33] transition-colors mb-6 cursor-pointer"
                >
                  ← Volver a opciones
                </button>

                <div className="text-xs font-extrabold uppercase tracking-widest text-[#13795b] mb-2">
                  Acceso con Contraseña
                </div>
                <h2 className="text-3xl font-black text-[#093f33] mb-2">Bienvenido de nuevo.</h2>
                <p className="text-sm text-[#527068] leading-relaxed mb-6">
                  Ingresa con tu correo y contraseña para entrar de inmediato al panel de monitoreo.
                </p>

                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#093f33] mb-1.5 uppercase tracking-wider">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Escribe tu correo"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-[#cbe0d6] focus:border-[#13795b] text-[#093f33] font-medium text-sm focus:outline-none focus:ring-4 focus:ring-[#13795b]/15 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#093f33] mb-1.5 uppercase tracking-wider">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 rounded-2xl bg-white border border-[#cbe0d6] focus:border-[#13795b] text-[#093f33] font-medium text-sm focus:outline-none focus:ring-4 focus:ring-[#13795b]/15 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        aria-pressed={showPassword}
                        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg text-[#527068] hover:bg-[#f0f5f2] focus:outline-none focus:ring-2 focus:ring-[#13795b]"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setErrorMsg(null);
                        setStep('recover_password');
                      }}
                      type="button"
                      className="mt-2 text-xs font-bold text-[#13795b] hover:underline cursor-pointer"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium leading-relaxed flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !email.trim() || !password.trim()}
                    className="w-full py-4 rounded-2xl bg-[#093f33] hover:bg-[#0c4e40] disabled:opacity-50 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Ingresar al Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="pt-6 border-t border-[#e2ece7] text-center text-xs text-[#527068]">
                ¿Prefieres usar biometría?{' '}
                <button
                  onClick={() => setStep('passkey')}
                  type="button"
                  className="font-bold text-[#13795b] hover:underline cursor-pointer"
                >
                  Entrar con Passkey →
                </button>
              </div>
            </div>
          )}

          {step === 'recover_password' && (
            <div className="flex flex-col h-full justify-between animate-in fade-in duration-200">
              <div>
                <button
                  onClick={() => {
                    setErrorMsg(null);
                    setStep('email_password');
                  }}
                  type="button"
                  className="text-xs font-semibold text-[#527068] hover:text-[#093f33] transition-colors mb-6 cursor-pointer"
                >
                  ← Volver al inicio de sesión
                </button>
                <div className="text-xs font-extrabold uppercase tracking-widest text-[#13795b] mb-2">
                  Recuperar acceso
                </div>
                <h2 id="loginTitle" className="text-3xl sm:text-4xl font-black text-[#093f33] mb-3">
                  Restablece tu contraseña.
                </h2>
                <p className="text-sm text-[#527068] leading-relaxed mb-6">
                  Te enviaremos un código de un solo uso al correo asociado a tu cuenta.
                </p>

                <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                  <div>
                    <label htmlFor="recovery-email" className="block text-xs font-bold text-[#093f33] mb-1.5 uppercase tracking-wider">
                      Correo electrónico
                    </label>
                    <input
                      id="recovery-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="Escribe tu correo"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-[#cbe0d6] focus:border-[#13795b] text-[#093f33] font-medium text-sm focus:outline-none focus:ring-4 focus:ring-[#13795b]/15 transition-all"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium leading-relaxed flex items-start gap-2" role="alert">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="w-full min-h-12 py-3 rounded-2xl bg-[#093f33] hover:bg-[#0c4e40] disabled:opacity-50 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><span>Enviar código</span><ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              </div>
            </div>
          )}

          {step === 'reset_password' && (
            <div className="flex flex-col h-full justify-between animate-in fade-in duration-200">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#13795b]/10 flex items-center justify-center text-[#13795b] mb-5">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="text-xs font-extrabold uppercase tracking-widest text-[#13795b] mb-2">
                  Verificación de recuperación
                </div>
                <h2 id="loginTitle" className="text-3xl sm:text-4xl font-black text-[#093f33] mb-3">
                  Crea una contraseña nueva.
                </h2>
                <p className="text-sm text-[#527068] leading-relaxed mb-6">
                  Ingresa el código enviado a <span className="font-bold text-[#093f33] break-all">{email}</span> y elige una contraseña nueva.
                </p>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label htmlFor="recovery-code" className="block text-xs font-bold text-[#093f33] mb-1.5 uppercase tracking-wider">
                      Código de recuperación
                    </label>
                    <input
                      id="recovery-code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={emailCode}
                      onChange={(event) => setEmailCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-[#cbe0d6] focus:border-[#13795b] text-[#093f33] text-center font-bold text-xl tracking-[0.45em] focus:outline-none focus:ring-4 focus:ring-[#13795b]/15 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block text-xs font-bold text-[#093f33] mb-1.5 uppercase tracking-wider">
                      Nueva contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        minLength={8}
                        required
                        placeholder="Mínimo 8 caracteres"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        className="w-full px-4 py-3 pr-12 rounded-2xl bg-white border border-[#cbe0d6] focus:border-[#13795b] text-[#093f33] font-medium text-sm focus:outline-none focus:ring-4 focus:ring-[#13795b]/15 transition-all"
                      />
                      <button type="button" onClick={() => setShowNewPassword((visible) => !visible)} aria-label={showNewPassword ? 'Ocultar contraseña nueva' : 'Mostrar contraseña nueva'} aria-pressed={showNewPassword} className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg text-[#527068] hover:bg-[#f0f5f2] focus:outline-none focus:ring-2 focus:ring-[#13795b]">
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirm-new-password" className="block text-xs font-bold text-[#093f33] mb-1.5 uppercase tracking-wider">
                      Confirmar contraseña nueva
                    </label>
                    <div className="relative">
                      <input
                        id="confirm-new-password"
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        minLength={8}
                        required
                        placeholder="Repite la contraseña nueva"
                        value={confirmNewPassword}
                        onChange={(event) => setConfirmNewPassword(event.target.value)}
                        className="w-full px-4 py-3 pr-12 rounded-2xl bg-white border border-[#cbe0d6] focus:border-[#13795b] text-[#093f33] font-medium text-sm focus:outline-none focus:ring-4 focus:ring-[#13795b]/15 transition-all"
                      />
                      <button type="button" onClick={() => setShowConfirmNewPassword((visible) => !visible)} aria-label={showConfirmNewPassword ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña'} aria-pressed={showConfirmNewPassword} className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg text-[#527068] hover:bg-[#f0f5f2] focus:outline-none focus:ring-2 focus:ring-[#13795b]">
                        {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium leading-relaxed flex items-start gap-2" role="alert">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || emailCode.length !== 6 || newPassword.length < 8 || !confirmNewPassword}
                    className="w-full min-h-12 py-3 rounded-2xl bg-[#093f33] hover:bg-[#0c4e40] disabled:opacity-50 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><span>Guardar contraseña nueva</span><ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              </div>

              <div className="pt-5 mt-5 border-t border-[#e2ece7] text-center text-xs text-[#527068]">
                ¿No llegó el código?{' '}
                <button
                  onClick={() => {
                    setErrorMsg(null);
                    setStep('recover_password');
                  }}
                  type="button"
                  className="font-bold text-[#13795b] hover:underline cursor-pointer"
                >
                  Solicitar otro
                </button>
              </div>
            </div>
          )}

          {/* Estado 4: Passkeys / Biometría */}
          {step === 'passkey' && (
            <PasskeyAuth onBack={() => setStep('select')} onSuccess={handleAuthSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}
