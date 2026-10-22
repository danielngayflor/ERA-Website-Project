const crypto = require('crypto');

const ITERATIONS = 100000;
const KEY_LEN    = 64;
const DIGEST     = 'sha512';
const SESSION_MS = 8 * 60 * 60 * 1000; // 8 hours

function signJwt(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET env var not set');
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body   = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig    = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email = '', password = '' } = req.body || {};
  const inputEmail = email.trim().toLowerCase();

  const expectedEmail = (process.env.CMS_ADMIN_EMAIL || '').toLowerCase();
  const storedHash    = process.env.CMS_ADMIN_HASH || '';
  const storedSalt    = process.env.CMS_ADMIN_SALT || '';

  let valid = false;
  try {
    const computedHash = crypto.pbkdf2Sync(
      String(password), storedSalt, ITERATIONS, KEY_LEN, DIGEST
    ).toString('hex');

    const hashBuf   = Buffer.from(computedHash, 'hex');
    const storedBuf = Buffer.from(storedHash,   'hex');

    if (hashBuf.length === storedBuf.length && storedBuf.length > 0) {
      valid = crypto.timingSafeEqual(hashBuf, storedBuf) && (inputEmail === expectedEmail);
    }
  } catch (_) {
    valid = false;
  }

  // Small delay on every login attempt to slow brute force
  await new Promise(r => setTimeout(r, 400));

  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const now       = Date.now();
  const expiresAt = now + SESSION_MS;
  const token     = signJwt({ email: inputEmail, iat: now, exp: expiresAt });

  return res.status(200).json({ token, expiresAt });
};
