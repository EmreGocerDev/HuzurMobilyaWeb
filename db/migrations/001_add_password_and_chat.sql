-- ============================================================
-- Huzur Mobilya - Migrasyon: Şifre + Canlı Chat Sistemi
-- ============================================================

-- ──────────────────────────────────────────────
-- 1) customers tablosuna şifre alanı ekleme
-- ──────────────────────────────────────────────
ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- ──────────────────────────────────────────────
-- 2) Chat Sessions (Sohbet Oturumları)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_sessions (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id   UUID        REFERENCES customers(id) ON DELETE SET NULL,
  customer_name TEXT        NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  status        TEXT        NOT NULL DEFAULT 'open'
                            CHECK (status IN ('open', 'closed', 'waiting')),
  unread_admin  INTEGER     NOT NULL DEFAULT 0,  -- okunmamış mesaj sayısı (admin için)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 3) Chat Messages (Sohbet Mesajları)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_messages (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  UUID        NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender_type TEXT        NOT NULL CHECK (sender_type IN ('customer', 'admin')),
  sender_name TEXT        NOT NULL,
  message     TEXT        NOT NULL,
  is_read     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 4) updated_at otomatik güncelleme fonksiyonu
-- ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ──────────────────────────────────────────────
-- 5) İndeksler
-- ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id
  ON chat_messages(session_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at
  ON chat_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_status
  ON chat_sessions(status);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_customer_id
  ON chat_sessions(customer_id);

-- ──────────────────────────────────────────────
-- 6) Row Level Security (RLS)
-- ──────────────────────────────────────────────
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Herkese açık okuma/yazma (anon key ile çalışsın)
-- NOT: Üretim ortamında daha kısıtlı politikalar uygulayın.
DROP POLICY IF EXISTS "chat_sessions_all" ON chat_sessions;
CREATE POLICY "chat_sessions_all" ON chat_sessions
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "chat_messages_all" ON chat_messages;
CREATE POLICY "chat_messages_all" ON chat_messages
  FOR ALL USING (true) WITH CHECK (true);

-- ──────────────────────────────────────────────
-- 7) Realtime yayınını aktif et
-- ──────────────────────────────────────────────
-- Supabase Dashboard → Database → Replication sekmesinden
-- chat_sessions ve chat_messages tablolarını "supabase_realtime" yayın grubuna ekleyin.
-- Ya da aşağıdaki komutu çalıştırın:
ALTER PUBLICATION supabase_realtime ADD TABLE chat_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
