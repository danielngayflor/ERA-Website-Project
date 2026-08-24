// Vercel serverless function — GitHub OAuth: callback
// Exchanges the temporary code for an access token, then posts it back
// to the Decap CMS window via postMessage and closes the popup.

const https = require('https');

module.exports = async function handler(req, res) {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
  const { code, error, error_description } = req.query;

  if (error) {
    return res.status(400).send(renderScript('error', error_description || error));
  }

  if (!code) {
    return res.status(400).send(renderScript('error', 'Missing OAuth code.'));
  }

  try {
    const data = await postJSON('https://github.com/login/oauth/access_token', {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    });

    if (data.error) {
      return res.status(400).send(renderScript('error', data.error_description || data.error));
    }

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(renderScript('success', data.access_token));
  } catch (err) {
    return res.status(500).send(renderScript('error', 'Token exchange failed: ' + err.message));
  }
};

// Simple https POST that returns parsed JSON
function postJSON(url, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Invalid JSON: ' + data)); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// Posts the result back to the opener (Decap CMS) and closes this popup.
function renderScript(status, content) {
  const message = JSON.stringify({ provider: 'github', status, content });
  return `<!DOCTYPE html>
<html>
<head><title>Authenticating...</title></head>
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
