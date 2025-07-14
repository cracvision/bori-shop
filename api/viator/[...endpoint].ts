import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { endpoint } = req.query;
  const path = Array.isArray(endpoint) ? endpoint.join('/') : endpoint || '';
  const method = req.method || 'GET';
  const apiKey = process.env.VIATOR_API_KEY;

  console.log(`[PROXY INICIO] Petición recibida para: ${method} /api/viator/${path}`);

  if (!apiKey) {
    console.error('[PROXY ERROR] VIATOR_API_KEY no está configurada.');
    return res.status(500).json({ error: 'API key del servidor no configurada.' });
  }

  const viatorApiUrl = `https://api.viator.com/partner/${path}`;
  
  const headersToViator: HeadersInit = {
    'Accept': 'application/json;version=2.0',
    'Accept-Language': 'es',
    'exp-api-key': apiKey,
  };

  let bodyToViator: string | undefined = undefined;
  if (method === 'POST' && req.body) {
    headersToViator['Content-Type'] = 'application/json';
    bodyToViator = JSON.stringify(req.body);
  }

  // --- LOGGING DE DIAGNÓSTICO ---
  // Imprimimos exactamente lo que estamos a punto de enviar a Viator.
  console.log('--- INICIO DE DATOS PARA VIATOR ---');
  console.log(`[PROXY DEBUG] URL Destino: ${viatorApiUrl}`);
  console.log(`[PROXY DEBUG] Método: ${method}`);
  console.log('[PROXY DEBUG] Headers Enviados:', JSON.stringify(headersToViator, null, 2));
  console.log('[PROXY DEBUG] Body Enviado:', bodyToViator);
  console.log('--- FIN DE DATOS PARA VIATOR ---');
  // --- FIN DE LOGGING ---

  try {
    const viatorRes = await fetch(viatorApiUrl, {
      method,
      headers: headersToViator,
      body: bodyToViator,
    });

    // También es útil ver la respuesta que nos da Viator
    const responseData = await viatorRes.json();
    console.log(`[PROXY FIN] Respuesta de Viator recibida con status: ${viatorRes.status}`);
    console.log('[PROXY FIN] Body de Respuesta de Viator:', JSON.stringify(responseData, null, 2).slice(0, 500) + '...'); // Mostramos solo los primeros 500 caracteres

    res.status(viatorRes.status).json(responseData);

  } catch (err: any) {
    console.error('[PROXY ERROR] Fallo en el fetch a Viator:', err);
    res.status(500).json({ error: 'Fallo en la comunicación con el servicio de Viator.', details: err.message });
  }
}
