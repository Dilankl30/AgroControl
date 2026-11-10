'use client';
export function PasskeyAuth({ onBack }: { onBack: () => void; onSuccess: () => void }) {
  return <div className="text-[#093f33] space-y-5"><button type="button" onClick={onBack}>← Volver a métodos</button><h2 className="text-2xl font-bold">Passkeys pendientes</h2><p>Este método todavía no está implementado. Selecciona otro método de acceso.</p></div>;
}
