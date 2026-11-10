-- ============================================================================
-- AGROCONTROL - ESQUEMAS DE BASE DE DATOS EN SUPABASE
-- Convivencia segura con proyectos existentes mediante esquemas independientes.
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS agrocontrol_app;
CREATE SCHEMA IF NOT EXISTS agrocontrol_audit;

-- ----------------------------------------------------------------------------
-- 1. TABLA DE PERFILES (Vinculada a auth.users de Supabase)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS agrocontrol_app.profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    institution TEXT DEFAULT 'ESPOCH',
    role TEXT DEFAULT 'investigador' CHECK (role IN ('superadmin', 'investigador', 'agronomo', 'operador')),
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para crear automáticamente el perfil al registrarse un usuario en auth.users
CREATE OR REPLACE FUNCTION agrocontrol_app.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO agrocontrol_app.profiles (user_id, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION agrocontrol_app.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. TABLA DE INVERNADEROS (Greenhouses)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS agrocontrol_app.greenhouses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT DEFAULT 'Campus ESPOCH, Riobamba',
    model_3d_config JSONB DEFAULT '{"camera": {"yaw": -0.84, "pitch": 0.56, "radius": 13.4}}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. TABLA DE NODOS SENSORES (3D Hotspots y Telemetría)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS agrocontrol_app.sensor_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    greenhouse_id UUID REFERENCES agrocontrol_app.greenhouses(id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE,       -- 'sensor-01', 'sensor-02', etc.
    name TEXT NOT NULL,              -- 'Temperatura Canopia', etc.
    sensor_type TEXT NOT NULL,       -- 'temperatura', 'humedad', 'luz', 'suelo'
    position_3d JSONB NOT NULL,      -- Coordenadas {x, y, z} para el Gemelo 3D
    unit TEXT NOT NULL,              -- '°C', '%', 'W/m²', '% VWC'
    status TEXT DEFAULT 'operativo' CHECK (status IN ('operativo', 'alerta', 'desconectado')),
    last_value NUMERIC(6,2),
    last_reading_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar datos iniciales de la demo
INSERT INTO agrocontrol_app.sensor_nodes (code, name, sensor_type, position_3d, unit, status, last_value)
VALUES 
    ('sensor-01', 'Temperatura Canopia', 'temperatura', '{"x": -2.65, "y": 1.8, "z": -1.4}', '°C', 'operativo', 23.80),
    ('sensor-02', 'Humedad Relativa', 'humedad', '{"x": 2.3, "y": 1.9, "z": 1.8}', '%', 'operativo', 68.00),
    ('sensor-03', 'Radiación Solar PAR', 'luz', '{"x": 0.2, "y": 3.4, "z": 0.2}', 'W/m²', 'operativo', 850.00),
    ('sensor-04', 'Humedad de Sustrato', 'suelo', '{"x": -0.9, "y": 0.55, "z": 3.0}', '% VWC', 'operativo', 34.00)
ON CONFLICT (code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. TABLA DE AUDITORÍA Y SEGURIDAD
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS agrocontrol_audit.access_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID,
    event_type TEXT NOT NULL,        -- 'login_google', 'login_otp', 'login_passkey'
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. HABILITACIÓN DE ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE agrocontrol_app.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrocontrol_app.greenhouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrocontrol_app.sensor_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrocontrol_audit.access_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para datos del gemelo digital de demostración
CREATE POLICY "Lectura pública de nodos sensores"
    ON agrocontrol_app.sensor_nodes
    FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Lectura pública de invernaderos"
    ON agrocontrol_app.greenhouses
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Política de perfiles: cada usuario solo edita su propio perfil
CREATE POLICY "Usuarios gestionan su propio perfil"
    ON agrocontrol_app.profiles
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
