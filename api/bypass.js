export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL required' });

    try {
        const response = await fetch(`https://api.bypass.vip/?url=${encodeURIComponent(url)}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const data = await response.json();
        if (data && data.destination) {
            return res.status(200).json({ destination: data.destination });
        } else {
            return res.status(500).json({ error: 'Bypass failed' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
