export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL diperlukan' });

    // API BYPASS YANG VALID (4 API)
    const apis = [
        // 1. BYPASS.VIP (POST) — paling reliable
        {
            url: 'https://api.bypass.vip/',
            options: {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
                },
                body: JSON.stringify({ url })
            }
        },
        // 2. BYPASS.BOT.NU (GET)
        {
            url: `https://bypass.bot.nu/api/?url=${encodeURIComponent(url)}`,
            options: {
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'Accept': 'application/json'
                }
            }
        },
        // 3. BYPASS-API.COM (GET)
        {
            url: `https://bypass-api.com/api/bypass?url=${encodeURIComponent(url)}`,
            options: {
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                    'Accept': 'application/json'
                }
            }
        },
        // 4. SHORTENER BYPASS (ALTERNATIF)
        {
            url: `https://api.bypass.vip/?url=${encodeURIComponent(url)}`, // fallback GET
            options: {
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
                }
            }
        }
    ];

    let lastError = null;
    for (const api of apis) {
        try {
            const response = await fetch(api.url, api.options);
            const text = await response.text();
            let data;
            try { data = JSON.parse(text); } catch (e) { continue; }
            
            if (data && data.destination) {
                return res.status(200).json({ destination: data.destination });
            }
        } catch (e) {
            lastError = e.message;
            continue;
        }
    }

    return res.status(500).json({ 
        error: 'Link ini tidak dapat di-bypass (mungkin proteksi captcha/cloudflare)',
        detail: lastError
    });
}
