-- Tabla para credenciales WebAuthn / Passkeys
CREATE TABLE IF NOT EXISTS public.passkeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  credential_id TEXT NOT NULL UNIQUE,
  public_key TEXT NOT NULL,
  counter BIGINT NOT NULL DEFAULT 0,
  transports TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para desafíos temporales de WebAuthn
CREATE TABLE IF NOT EXISTS public.webauthn_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  challenge TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('registration', 'authentication')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_passkeys_user_id ON public.passkeys(user_id);
CREATE INDEX IF NOT EXISTS idx_passkeys_credential_id ON public.passkeys(credential_id);
CREATE INDEX IF NOT EXISTS idx_webauthn_challenges_expires ON public.webauthn_challenges(expires_at);

-- RLS
ALTER TABLE public.passkeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webauthn_challenges ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (el service role ignora RLS)
CREATE POLICY "Users can view own passkeys" ON public.passkeys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own passkeys" ON public.passkeys
  FOR DELETE USING (auth.uid() = user_id);
