/**
 * Web Crypto API tabanlı şifre hashleme yardımcıları.
 * Tarayıcı ve Node.js 18+ ortamlarında çalışır.
 */

/**
 * Verilen şifreyi PBKDF2 + SHA-256 ile hashler.
 * Dönen format: "pbkdf2:<salt_hex>:<hash_hex>"
 */
export async function hashPassword(password: string): Promise<string> {
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

/**
 * Düz metin şifreyi hash ile karşılaştırır.
 */
export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  if (!stored || !stored.startsWith('pbkdf2:')) return false;

  const [, saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;

  const salt = new Uint8Array(
    (saltHex.match(/.{2}/g) ?? []).map((b) => parseInt(b, 16))
  );

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    256
  );

  const newHex = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return newHex === hashHex;
}
