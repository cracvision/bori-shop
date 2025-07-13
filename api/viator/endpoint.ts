import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { endpoint } = req.query;
  const path = Array.isArray(endpoint) ? endpoint.join('/') : endpoint || '';
  const method = req.method || 'GET';
  const apiKey = process.env.VIATOR_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: 'API key is not configured' });
    return;
  }

  let body: string | undefined = undefined;
  if (req.body && Object.keys(req.body).length > 0) {
    body = JSON.stringify(req.body);
  }

  try {
    const viatorRes = await fetch(`https://api.viator.com/partner/${path}`, {
      method,
      headers: {
        'Accept': 'application/json;version=2.0',
        'Accept-Language': 'es',
        'exp-api-key': apiKey,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body,
    });

    const data = await viatorRes.json();
    res.status(viatorRes.status).json(data);
  } catch (err: any) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Failed to proxy request', details: String(err) });
  }
}
