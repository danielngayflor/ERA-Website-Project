const crypto = require('crypto');

const REPO_PREFIX = '/repos/danielngayflor/ERA-Website-Project/';

function verifyJwt(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET env var not set');
  const parts = (token || '').split('.');
  if (parts.length !== 3) throw new Error('Malformed token');
  const [header, body, sig] = parts;
  const expected = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  const expBuf = Buffer.from(expected);
  const sigBuf = Buffer.from(sig);
  if (expBuf.length !== sigBuf.length || !crypto.timingSafeEqual(expBuf, sigBuf)) {
    throw new Error('Invalid token signature');
  }
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (payload.exp < Date.now()) throw new Error('Session expired');
  return payload;
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  // Auth
  const auth  = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  try { verifyJwt(token); }
  catch (e) { return res.status(401).json({ error: e.message }); }

  // Method allowlist
  if (req.method !== 'GET' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Path validation — must be /user or start with the repo prefix
  const rawPath = decodeURIComponent(req.query.path || '');
  if (rawPath !== '/user' && !rawPath.startsWith(REPO_PREFIX)) {
    return res.status(403).json({ error: 'Forbidden path' });
  }

  // Build GitHub URL, forwarding any extra query params (e.g. ref=main)
  const extraQuery = { ...req.query };
  delete extraQuery.path;
  const qs = new URLSearchParams(extraQuery).toString();
  const ghUrl = `https://api.github.com${rawPath}${qs ? '?' + qs : ''}`;

  const ghToken = process.env.GITHUB_TOKEN;
  if (!ghToken) return res.status(500).json({ error: 'GITHUB_TOKEN env var not set' });

  const ghRes = await fetch(ghUrl, {
    method: req.method,
    headers: {
      Authorization:          `Bearer ${ghToken}`,
      Accept:                 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type':         'application/json',
    },
    body: req.method === 'PUT' ? JSON.stringify(req.body) : undefined,
  });

  const data = await ghRes.json();
  return res.status(ghRes.status).json(data);
};
