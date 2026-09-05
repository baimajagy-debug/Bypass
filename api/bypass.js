// api/bypass.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL diperlukan' });

    // API BYPASS YANG BENER (METHOD POST + FALLBACK)
    const apis = [
        // 1. BYPASS.VIP pake POST (bukan GET)
        {
            url: 'https://api.bypass.vip/',
            options: {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            }
        },
        // 2. BYPASS.BOT.NU (GET)
        {
            url: `https://bypass.bot.nu/api/?url=${encodeURIComponent(url)}`,
            options: { headers: { 'User-Agent': 'Mozilla/5.0' } }
        },
        // 3. BYPASS-API.COM (GET)
        {
            url: `https://bypass-api.com/api/bypass?url=${encodeURIComponent(url)}`,
            options: { headers: { 'User-Agent': 'Mozilla/5.0' } }
        }
    ];

    for (const api of apis) {
        try {
            const response = await fetch(api.url, api.options);
            if (!response.ok) continue;
            const data = await response.json();
            if (data && data.destination) {
                return res.status(200).json({ destination: data.destination });
            }
        } catch (e) {
            continue;
        }
    }

    return res.status(500).json({ error: 'Semua API bypass gagal, coba link lain' });
}
