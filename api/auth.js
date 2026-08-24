// Vercel serverless function — GitHub OAuth: start
// Redirects the browser to GitHub's OAuth authorization page.
// Decap CMS calls /api/auth?provider=github when login is initiated.

export default function handler(req, res) {
  const { GITHUB_CLIENT_ID } = process.env;

  if (!GITHUB_CLIENT_ID) {
    return res.status(500).send('Missing GITHUB_CLIENT_ID environment variable.');
  }

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    scope: 'repo,user',
    redirect_uri: `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/api/callback`,
  });

  res.redirect(302, `https://github.com/login/oauth/authorize?${params}`);
}
