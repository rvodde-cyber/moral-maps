/**
 * Houdt het Supabase free-tier project actief (pauze na ~7 dagen inactiviteit).
 * Wordt dagelijks aangeroepen via Vercel Cron (zie vercel.json).
 * Handmatig testen: GET /api/keep-alive (met CRON_SECRET in Authorization header indien gezet).
 */
export default async function handler(req, res) {
  if (process.env.CRON_SECRET) {
    const auth = req.headers.authorization
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' })
    }
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ ok: false, error: 'Missing Supabase credentials' })
  }

  const baseUrl = supabaseUrl.replace(/\/$/, '')
  const response = await fetch(
    `${baseUrl}/rest/v1/moralmaps_results?select=id&limit=1`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  )

  if (!response.ok) {
    const body = await response.text()
    return res.status(502).json({ ok: false, error: body })
  }

  return res.status(200).json({
    ok: true,
    project: 'moral-maps',
    pinged_at: new Date().toISOString(),
  })
}
