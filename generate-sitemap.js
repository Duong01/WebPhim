
const fs = require("fs");
const path = require("path");

const BASE_URL = process.env.BASE_URL || "https://web-phim-one.vercel.app"; // đổi thành domain của bạn

// Optional: provide an API endpoint that returns movie list JSON. Example response format expected:
// [{ slug: 'ten-phim', episodes: 125, updatedAt: '2024-01-01' }, ...]
const MOVIES_API = process.env.MOVIES_API || null;

async function fetchMovies() {
  if (!MOVIES_API) return null;
  try {
    const https = require('https');
    return await new Promise((resolve, reject) => {
      https.get(MOVIES_API, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  } catch (e) {
    console.error('Failed to fetch movies from API', e);
    return null;
  }
}

function buildUrlEntries(staticUrls, movies) {
  const entries = [];
  const now = new Date().toISOString();

  staticUrls.forEach((u) => {
    entries.push({ loc: `${BASE_URL}${u}`, lastmod: now, changefreq: 'weekly', priority: 0.8 });
  });

  if (movies && Array.isArray(movies)) {
    movies.forEach((m) => {
      const slug = m.slug || m._id || m.name || null;
      const episodes = m.episodes || m.episode_count || m.episode || 1;
      const updated = m.updatedAt || m.lastmod || now;
      if (!slug) return;
      // add canonical movie main page
      entries.push({ loc: `${BASE_URL}/movie/${slug}`, lastmod: updated, changefreq: 'weekly', priority: 0.9 });
      // add per-episode URLs (limit to reasonable count to avoid huge sitemap)
      const max = Math.min(Number(episodes) || 1, 200);
      for (let i = 1; i <= max; i++) {
        const page = i === 1 ? 'tap01' : `tap${i}`;
        entries.push({ loc: `${BASE_URL}/movie/${slug}?page=${page}`, lastmod: updated, changefreq: 'weekly', priority: 0.7 });
      }
    });
  }

  return entries;
}

async function generate() {
  const staticUrls = [
    '/',
    '/home',
    '/phim-bo',
    '/phim-le',
    '/tv-shows',
    '/hoat-hinh',
    '/phim-moi',
    '/phim-hot',
    '/quoc-gia/viet-nam?page=1&limit=20'
  ];

  const movies = await fetchMovies();
  const entries = buildUrlEntries(staticUrls, movies);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map(
      (e) => `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
    )
    .join('\n')}
</urlset>`;

  // Đường dẫn tới thư mục public
  const publicDir = path.join(__dirname, 'public');

  // Nếu chưa có thì tạo thư mục public
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  // Ghi file sitemap.xml vào public
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');

  console.log('✅ Sitemap generated at public/sitemap.xml');
}

generate().catch((e) => {
  console.error('Sitemap generation failed', e);
  process.exit(1);
});
