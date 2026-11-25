/** App-lock PIN, stored only as a salted SHA-256 hash. */

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hashPin(pin: string): Promise<string> {
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
  return `${salt}:${await sha256(salt + pin)}`;
}

export async function checkPin(pin: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  return !!salt && !!hash && (await sha256(salt + pin)) === hash;
}
