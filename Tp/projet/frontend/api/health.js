/**
 * Vercel Serverless Function : GET /api/health (optionnel, pour vérifier la config).
 */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") {
    return res.status(405).json({ detail: "Method Not Allowed" });
  }
  const modelUrl = process.env.MODEL_API_URL ? "configured" : "missing";
  res.status(200).json({ status: "ok", modelUrl });
}
