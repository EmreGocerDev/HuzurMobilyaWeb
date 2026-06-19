import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// PBKDF2 ile şifre hashleme (Node.js Web Crypto)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const toHex = (buf: ArrayBuffer | Uint8Array) =>
    Array.from(buf instanceof Uint8Array ? buf : new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  return `pbkdf2:${toHex(salt)}:${toHex(derivedBits)}`;
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Supabase env değişkenleri eksik' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Zaten var mı?
  const { data: existing } = await supabase
    .from('customers')
    .select('id, email')
    .eq('email', 'admin@huzurmobilya.com')
    .maybeSingle();

  if (existing) {
    return NextResponse.json({
      message: 'Admin kullanıcısı zaten mevcut.',
      email: existing.email,
      id: existing.id,
    });
  }

  const password_hash = await hashPassword('admin');

  const { data, error } = await supabase
    .from('customers')
    .insert({
      full_name: 'Admin',
      email: 'admin@huzurmobilya.com',
      phone: '05000000000',
      password_hash,
      city: 'Samsun',
    })
    .select('id, email, full_name')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message: '✅ Admin kullanıcısı başarıyla oluşturuldu!',
    user: data,
    credentials: {
      email: 'admin@huzurmobilya.com',
      password: 'admin',
    },
  });
}
