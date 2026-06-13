
const fs = require("fs");
const path = require("path");
const https = require("https");

const BASE_URL = "https://zcines.com";

const STATIC_URLS = [
  "/",
  "/home",

  "/the-loai/phim-bo",
  "/the-loai/phim-le",
  "/the-loai/tv-shows",
  "/the-loai/phim-vietsub",
  "/the-loai/phim-thuyet-minh",
  "/the-loai/phim-long-tieng",
  "/the-loai/hoat-hinh",
  "/the-loai/phim-moi",
  "/the-loai/phim-hot",

  "/the-loai/hanh-dong",
  "/the-loai/mien-tay",
  "/the-loai/tre-em",
  "/the-loai/lich-su",
  "/the-loai/co-trang",
  "/the-loai/chien-tranh",
  "/the-loai/vien-tuong",
  "/the-loai/kinh-di",
  "/the-loai/tai-lieu",
  "/the-loai/bi-an",
  "/the-loai/phim-18",
  "/the-loai/tinh-cam",
  "/the-loai/tam-ly",
  "/the-loai/the-thao",
  "/the-loai/phieu-luu",
  "/the-loai/am-nhac",
  "/the-loai/gia-dinh",
  "/the-loai/hoc-duong",
  "/the-loai/hai-huoc",
  "/the-loai/hinh-su",
  "/the-loai/vo-thuat",
  "/the-loai/khoa-hoc",
  "/the-loai/than-thoai",
  "/the-loai/chinh-kich",
  "/the-loai/kinh-dien",
  "/the-loai/phim-ngan",

  "/quoc-gia/viet-nam",
  "/quoc-gia/trung-quoc",
  "/quoc-gia/thai-lan",
  "/quoc-gia/hong-kong",
  "/quoc-gia/phap",
  "/quoc-gia/duc",
  "/quoc-gia/ha-lan",
  "/quoc-gia/mexico",
  "/quoc-gia/thuy-dien",
  "/quoc-gia/philippines",
  "/quoc-gia/dan-mach",
  "/quoc-gia/thuy-si",
  "/quoc-gia/ukraina",
  "/quoc-gia/han-quoc",
  "/quoc-gia/au-my",
  "/quoc-gia/an-do",
  "/quoc-gia/canada",
  "/quoc-gia/tay-ban-nha",
  "/quoc-gia/indonesia",
  "/quoc-gia/ba-lan",
  "/quoc-gia/malaysia",
  "/quoc-gia/bo-dao-nha",
  "/quoc-gia/uae",
  "/quoc-gia/chau-phi",
  "/quoc-gia/a-rap-xe-ut",
  "/quoc-gia/nhat-ban",
  "/quoc-gia/dai-loan",
  "/quoc-gia/anh",
  "/quoc-gia/quoc-gia-khac",
  "/quoc-gia/tho-nhi-ky",
  "/quoc-gia/nga",
  "/quoc-gia/uc",
  "/quoc-gia/brazil",
  "/quoc-gia/y",
  "/quoc-gia/na-uy",
  "/quoc-gia/nam-phi"
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      })
      .on("error", reject);
  });
}

async function fetchMovieDetail(slug) {
  return new Promise((resolve) => {
    const url = `https://phimapi.com/phim/${slug}`;
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
      });
    }).on("error", () => resolve(null));
  });
}

async function fetchAllMovies(maxPages = 30) {
  const movies = [];
  // Giới hạn số trang để tránh file sitemap quá lớn (>50,000 URL) và chạy quá lâu
  for (let page = 1; page <= maxPages; page++) {
    try {
      const url = `https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page}`;
      const data = await fetchJson(url);

      if (!data.items || !data.items.length) {
        break;
      }

      movies.push(...data.items);

      console.log(
        `Fetched page ${page} - ${data.items.length} movies`
      );
    } catch (err) {
      console.error(`Page ${page} error`);
      console.error(err);
      break;
    }
  }

  return movies;
}

async function generate() {
  console.log("Starting sitemap generation with episodes...");
  
  // Lấy danh sách phim mới cập nhật (mặc định lấy 30 trang đầu để tối ưu tốc độ và dung lượng file)
  const moviesList = await fetchAllMovies(30);
  console.log(`Found ${moviesList.length} movies. Fetching episodes for each...`);

  const sitemapEntries = [];
  const now = new Date().toISOString();

  // 1. URL tĩnh
  STATIC_URLS.forEach((url) => {
    sitemapEntries.push({
      loc: `${BASE_URL}${url}`,
      lastmod: now,
      changefreq: "daily",
      priority: "0.8"
    });
  });

  // 2. Duyệt qua từng phim để lấy tập phim
  const batchSize = 10; // Xử lý 10 phim cùng lúc để tăng tốc
  for (let i = 0; i < moviesList.length; i += batchSize) {
    const batch = moviesList.slice(i, i + batchSize);
    
    await Promise.all(batch.map(async (movie) => {
      if (!movie.slug) return;
      
      const lastmod = movie.modified?.time || movie.updatedAt || now;

      // Thêm URL trang thông tin phim
      sitemapEntries.push({
        loc: `${BASE_URL}/movies/${movie.slug}`,
        lastmod,
        changefreq: "daily",
        priority: "0.9"
      });

      // Lấy chi tiết để lấy danh sách tập
      const detail = await fetchMovieDetail(movie.slug);
      if (detail && detail.episodes) {
        detail.episodes.forEach(server => {
          if (server.server_data) {
            server.server_data.forEach(ep => {
              // Chuẩn hóa định dạng tập phim: Nếu là số thì thêm tiền tố "tap" (ví dụ: 12 -> tap12)
              // Điều này giúp khớp với logic normalize trong router/index.js
              let episodeQuery = ep.slug;
              if (episodeQuery && !episodeQuery.startsWith("tap")) {
                const digits = episodeQuery.match(/\d+/);
                if (digits) {
                  episodeQuery = "tap" + digits[0];
                }
              }

              sitemapEntries.push({
                loc: `${BASE_URL}/movie/${movie.slug}?page=${episodeQuery}`,
                lastmod,
                changefreq: "weekly",
                priority: "0.7"
              });
            });
          }
        });
      }
    }));
    
    console.log(`Processed ${Math.min(i + batchSize, moviesList.length)}/${moviesList.length} movies...`);
    // Nghỉ một chút để tránh bị API chặn
    await new Promise(r => setTimeout(r, 100));
  }

  // 3. Tạo nội dung XML
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(entry => `
  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join("")}
</urlset>`;

  const publicDir = path.join(
    __dirname,
    "public"
  );

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(
    path.join(publicDir, "sitemap.xml"),
    sitemapXml,
    "utf8"
  );

  console.log(`Sitemap generated with ${sitemapEntries.length} URLs.`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
