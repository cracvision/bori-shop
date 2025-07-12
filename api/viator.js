// api/viator.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const body = req.body;

  // ← Aquí va la URL de producción:
  const response = await fetch("https://viatorapi.viator.com/partner/products/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "exp-api-key": process.env.VIATOR_API_KEY
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    return res.status(response.status).json({ error: "Error al consultar Viator" });
  }

  const data = await response.json();
  res.status(200).json(data);
}


