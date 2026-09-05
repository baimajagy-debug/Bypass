export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL diperlukan' });

    const apis = [
        { url: 'https://api.bypass.vip/', options: { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) } },
        { url: `https://bypass.bot.nu/api/?url=${encodeURIComponent(url)}`, options: { headers: { 'User-Agent': 'Mozilla/5.0' } } },
        { url: `https://bypass-api.com/api/bypass?url=${encodeURIComponent(url)}`, options: { headers: { 'User-Agent': 'Mozilla/5.0' } } },
        { url: `https://api.linkvertise.net/bypass?url=${encodeURIComponent(url)}`, options: { headers: { 'User-Agent': 'Mozilla/5.0' } } },
        { url: `https://bypass.pm/api/v1/bypass?url=${encodeURIComponent(url)}`, options: { headers: { 'User-Agent': 'Mozilla/5.0' } } }
    ];

    for (const api of apis) {
        try {
            const resp = await fetch(api.url, api.options);
            const text = await resp.text();
            let data;
            try { data = JSON.parse(text); } catch { continue; }
            if (data && data.destination) return res.status(200).json({ destination: data.destination });
        } catch { continue; }
    }

    return res.status(500).json({ error: 'Link tidak dapat di-bypass (mungkin captcha/Cloudflare)' });
}
