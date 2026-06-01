
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

async function fetchAllMovies() {
  const movies = [];

  for (let page = 1; page <= 300; page++) {
    try {
      const url =
        `https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page}`;

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

function buildSitemap(staticUrls, movies) {
  const urls = [];

  const now = new Date().toISOString();

  staticUrls.forEach((url) => {
    urls.push({
      loc: `${BASE_URL}${url}`,
      lastmod: now,
      changefreq: "daily",
      priority: "0.8"
    });
  });

  movies.forEach((movie) => {
    if (!movie.slug) return;

    urls.push({
      loc: `${BASE_URL}/movies/${movie.slug}`,
      lastmod:
        movie.modified?.time ||
        movie.updatedAt ||
        now,
      changefreq: "daily",
      priority: "0.9"
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls
  .map(
    (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("")}

</urlset>`;
}

async function generate() {
  console.log("Generating sitemap...");

  const movies = await fetchAllMovies();

  console.log(
    `Total movies: ${movies.length}`
  );

  const sitemap = buildSitemap(
    STATIC_URLS,
    movies
  );

  const publicDir = path.join(
    __dirname,
    "public"
  );

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  fs.writeFileSync(
    path.join(publicDir, "sitemap.xml"),
    sitemap,
    "utf8"
  );

  console.log(
    "sitemap.xml generated successfully"
  );
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});

