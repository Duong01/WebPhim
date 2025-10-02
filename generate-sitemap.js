
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://web-phim-one.vercel.app"; // đổi thành domain của bạn

const urls = [
  "/",
  "/home",
  "/phim-bo",
  "/phim-le",
  "/tv-shows",
  "/hoat-hinh",
  "/phim-moi",
  "/phim-hot",
  "/quoc-gia/viet-nam?page=1&limit=20"
  // thêm các route khác ở đây
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
  )
  .join("")}
</urlset>`;

// Đường dẫn tới thư mục public
const publicDir = path.join(__dirname, "public");

// Nếu chưa có thì tạo thư mục public
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Ghi file sitemap.xml vào public
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");

console.log("✅ Sitemap generated at public/sitemap.xml");
