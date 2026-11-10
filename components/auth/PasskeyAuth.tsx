'use client';

import React, { useState } from 'react';
import { ArrowLeft, Fingerprint, RefreshCw, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast';

export function PasskeyAuth({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePasskeyLogin = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPasskey();
      if (error) throw error;

      toast('¡Acceso con Passkey exitoso! 🌱');
      setTimeout(() => onSuccess(), 300);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'No se pudo iniciar sesión con Passkey.';
      const normalized = message.toLowerCase();
      if (normalized.includes('not allowed') || normalized.includes('cancel')) {
        setErrorMsg('Operación cancelada o no permitida por el dispositivo.');
      } else if (normalized.includes('credential_not_found') || normalized.includes('no credentials')) {
        setErrorMsg('No se encontró una Passkey para AgroControl en este dispositivo o administrador de contraseñas.');
      } else if (normalized.includes('passkey_disabled')) {
        setErrorMsg('El acceso con Passkey todavía no está activado en Supabase.');
      } else {
        setErrorMsg(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between animate-in fade-in duration-200">
      <div>
        <button
          onClick={onBack}
          type="button"
          className="text-xs font-semibold text-[#527068] hover:text-[#093f33] transition-colors mb-6 cursor-pointer"
        >
          ← Volver a opciones
        </button>

        <div className="text-xs font-extrabold uppercase tracking-widest text-[#13795b] mb-2">
          Acceso con Passkey
        </div>
        <h2 className="text-3xl font-black text-[#093f33] mb-2">Biometría del dispositivo</h2>
        <p className="text-sm text-[#527068] leading-relaxed mb-6">
          Elige tu cuenta en la ventana del dispositivo. Podrás verificar con rostro, huella o el método de desbloqueo que tengas configurado.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium leading-relaxed flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handlePasskeyLogin}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#072f28] to-[#041d18] hover:from-[#0a3f36] hover:to-[#072f28] disabled:opacity-50 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
          <span>{loading ? 'Verificando...' : 'Continuar con Passkey'}</span>
        </button>
      </div>

      <div className="pt-6 border-t border-[#e2ece7] text-xs text-[#527068]">
        Debes registrar una Passkey después de iniciar sesión con correo y contraseña. La biometría permanece en tu dispositivo.
      </div>
    </div>
  );
}
