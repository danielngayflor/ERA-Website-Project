// Vercel serverless function — GitHub OAuth: callback
// Exchanges the temporary code for an access token, then posts it back
// to the Decap CMS window via postMessage and closes the popup.

export default async function handler(req, res) {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
  const { code, error, error_description } = req.query;

  if (error) {
    return res.status(400).send(renderScript('error', error_description || error));
  }

  if (!code) {
    return res.status(400).send(renderScript('error', 'Missing OAuth code.'));
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await tokenRes.json();

    if (data.error) {
      return res.status(400).send(renderScript('error', data.error_description || data.error));
    }

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(renderScript('success', data.access_token));
  } catch (err) {
    return res.status(500).send(renderScript('error', 'Token exchange failed: ' + err.message));
  }
}

// Posts the result back to the opener (Decap CMS) and closes this popup.
function renderScript(status, content) {
  const message = JSON.stringify({ provider: 'github', status, content });
  return `<!DOCTYPE html>
<html>
<head><title>Authenticating…</title></head>
<body>
<script>
(function() {
  function receiveMessage(e) {
    window.opener.postMessage(${JSON.stringify(message)}, e.origin);
    window.close();
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
<p>Authentication complete. You may close this window.</p>
</body>
</html>`;
}
