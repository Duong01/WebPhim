<template>
  <div class="home-page">
    <CarouselPage v-once />

    <!-- CATEGORY QUICK -->
    <CategoryQuick :items="categories" />

    <!-- HERO -->
    <!-- && $vuetify.display.smAndUp -->
    <HeroBanner v-if="trending.length " :movie="trending" />

    <!-- Quảng cáo dưới phần Banner chính -->
    <!-- <v-container class="py-2">
      <GoogleAd ad-slot="ca-pub-5101049500206214" />
    </v-container> -->

    <!-- MOVIE SECTIONS -->
    <template v-for="(section, index) in sections" :key="section.title">
      <SectionWrapper
        :ref="'section' + index"
        :title="section.title"
        :type="section.type"
        :movies="section.movies"
        :link="section.link"
        :loading="!section.loaded"
        class="lazy-section"
      />

      <!-- Quảng cáo xen kẽ sau mỗi 3 danh mục phim -->
      <!-- <v-container class="py-2" v-if="(index + 1) % 3 === 0">
        <GoogleAd ad-slot="1366382121" />
      </v-container> -->
    </template>
  </div>
</template>

<script>
import SectionWrapper from "@/pages/LayoutPageHome/SectionWrapper.vue";
import CarouselPage from "@/pages/Carousel.vue";
import HeroBanner from "@/pages/LayoutPageHome/HeroBanner.vue";
import CategoryQuick from "@/pages/LayoutPageHome/CategoryQuick.vue";

import { NewUpdate } from "@/model/api";
// import GoogleAd from "@/components/GoogleAd.vue";

export default {
  name: "Home1Page",
  components: {
    SectionWrapper,
    HeroBanner,
    CategoryQuick,
    CarouselPage,
    // GoogleAd,
  },

  data() {
    return {
      trending: [],
      cache: null,
      
      categories: [
        {
          title: this.$t("PHIM MỚI"),
          name: "PhimNew",
          link: {
            name: "PhimNew",
            params: {
              path: "phim-moi-cap-nhat-v2",
            },
          },
        },
        {
          title: this.$t("PHIM BỘ"),
          name: "PhimBo",
          link: {
            name: "PhimBo",
            params: {
              path: "/phim-bo?page=1&sort_field=year&sort_type=desc&limit=12",
            },
          },
        },
        {
          title: this.$t("PHIM TRUNG QUỐC"),
          name: "QuocGia",
          link: {
            name: "QuocGia",
            params: {
              path: "trung-quoc?page=1&sort_field=year&sort_type=desc&limit=12",
            },
          },
        },
        {
          title: this.$t("PHIM LẺ"),
          name: "PhimLe",
          link: {
            name: "PhimLe",
            params: {
              path: "/phim-le?page=1&sort_field=year&sort_type=desc&limit=12",
            },
          },
        },
        {
          title: this.$t("PHIM HOẠT HÌNH"),
          name: "HoatHinh",
          link: {
            name: "HoatHinh",
            params: {
              path: "/hoat-hinh?page=1&sort_field=year&sort_type=desc&limit=20",
            },
          },
        },
        {
          title: this.$t("PHIM TÌNH CẢM"),
          name: "TheLoai",
          link: {
            name: "TheLoai",
            params: {
              path: "tinh-cam?page=1&sort_field=year&sort_type=desc&limit=12",
            },
          },
        },
      ],

      sections: [
        

        {
          title: "Phim Đang Thịnh Hành – Xu Hướng Xem Nhiều Nhất Hiện Nay",
          type: "spotlight",
          url: "https://phimapi.com/danh-sach/phim-moi-cap-nhat-v3?page=1",
          movies: [],
          link: {
            name: "PhimNew",
            params: { path: "phim-moi-cap-nhat-v3" },
          },
          loaded: false,
          loading: false
        },

        {
          title: "Điện Ảnh Việt Nam – Những Câu Chuyện Gần Gũi Và Sâu Sắc",
          type: "grid",
          url: "https://phimapi.com/v1/api/quoc-gia/viet-nam?page=1&limit=12",
          movies: [],
          link: {
            name: "QuocGia",
            params: { path: "viet-nam" },
          },
          loaded: false,
          loading: false
        },
        {
          title: "Phim lẻ – Những Câu Chuyện Gần Gũi Và Sâu Sắc",
          type: "grid",
          url: "https://phimapi.com/v1/api/danh-sach/phim-le?page=1&sort_field=year&sort_type=desc&limit=12",
          movies: [],
          link: {
            name: "PhimLe",
            params: { path: "phim-le" },
          },
          loaded: false,
          loading: false
        },
        {
          title: "Mãn Nhãn với Phim Chiếu Rạp",
          type: "spotlight",
          url: "https://phimapi.com/v1/api/danh-sach/phim-chieu-rap?country=viet-nam,trung-quoc&sort_field=year&page=1&limit=12",
          movies: [],
          link: {
            name: "PhimChieuRap",
            params: { path: "phim-chieu-rap" },
          },
          loaded: false,
          loading: false
        },

        {
          title: "Phim Đề Cử – Những Tác Phẩm Không Thể Bỏ Lỡ",
          type: "slider",
          url: "https://phimapi.com/v1/api/danh-sach/hoat-hinh?page=1&limit=12",
          movies: [],
          link: {
            name: "HoatHinh",
            params: { path: "hoat-hinh" },
          },
          loaded: false,
          loading: false
        },
        {
          title: "Anime Mới Cập Nhật – Thế Giới Hoạt Hình Đỉnh Cao",
          type: "large",
          url: "https://phimapi.com/v1/api/danh-sach/hoat-hinh?page=1&category=hai-huoc&limit=12",
          movies: [],
          link: {
            name: "",
            params: { path: "" },
          },
          loaded: false,
          loading: false
        },
        {
          title: "Phim bộ – Những Câu Chuyện Gần Gũi Và Sâu Sắc",
          type: "grid",
          url: "https://phimapi.com/v1/api/danh-sach/phim-bo?page=1&sort_field=year&sort_type=desc&limit=12",
          movies: [],
          link: {
            name: "PhimBo",
            params: { path: "phim-bo" },
          },
          loaded: false,
          loading: false
        },
        {
          title: "Phim Trung Quốc – Những Siêu Phẩm Hoa Ngữ Đáng Xem",
          type: "grid",
          url: "https://phimapi.com/v1/api/quoc-gia/trung-quoc?page=1&limit=12",
          movies: [],
          link: {
            name: "QuocGia",
            params: { path: "trung-quoc" },
          },
          loaded: false,
          loading: false
        },

        {
          title: "Bảng Xếp Hạng Phim – Những Tựa Phim Được Yêu Thích Nhất",
          type: "dashboard",
          url: "https://phimapi.com/danh-sach/phim-moi-cap-nhat-v3?page=1&limit=4",
          movies: [],
          link: {
            name: "QuocGia",
            params: { path: "trung-quoc" },
          },
          loaded: false,
          loading: false
        },
        {
          title: "Phim bom tấn – Những Tác Phẩm Không Thể Bỏ Lỡ",
          type: "slider",
          url: "https://phimapi.com/v1/api/danh-sach/phim-thuyet-minh?page=1&category=hanh-dong&sort_field=year&sort_type=desc&&limit=12",
          movies: [],
          link: {
            name: "HoatHinh",
            params: { path: "hoat-hinh" },
          },
          loaded: false,
          loading: false
        },
        {
          title: "Phim Hàn Quốc – Những Câu Chuyện Lay Động Trái Tim",
          type: "grid",
          url: "https://phimapi.com/v1/api/quoc-gia/han-quoc?page=1&limit=12",
          movies: [],
          link: {
            name: "QuocGia",
            params: { path: "han-quoc" },
          },
          loaded: false,
          loading: false
        },
        {
          title: "Hành Động Đỉnh Cao – Kịch Tính Từng Giây",
          type: "grid",
          url: "https://phimapi.com/v1/api/the-loai/hanh-dong?page=1&limit=12",
          movies: [],
          link: {
            name: "TheLoai",
            params: { path: "hanh-dong" },
          },
          loaded: false,
          loading: false
        },
        {
          title: "Cổ Trang Kiếm Hiệp – Vang Bóng Một Thời",
          type: "slider",
          url: "https://phimapi.com/v1/api/the-loai/co-trang?page=1&limit=12",
          movies: [],
          link: {
            name: "TheLoai",
            params: { path: "co-trang" },
          },
          loaded: false,
          loading: false
        },
        {
          title: "Tình Cảm Lãng Mạn – Chạm Đến Trái Tim",
          type: "grid",
          url: "https://phimapi.com/v1/api/the-loai/tinh-cam?page=1&limit=12",
          movies: [],
          link: {
            name: "TheLoai",
            params: { path: "tinh-cam" },
          },
          loaded: false,
          loading: false
        },
        {
          title: "Siêu Phẩm Âu Mỹ – Đẳng Cấp Hollywood",
          type: "spotlight",
          url: "https://phimapi.com/v1/api/quoc-gia/au-my?page=1&limit=12",
          movies: [],
          link: {
            name: "QuocGia",
            params: { path: "au-my" },
          },
          loaded: false,
          loading: false
        },
        {
          title: "Hài Hước Vui Nhộn – Xả Stress Cuối Tuần",
          type: "slider",
          url: "https://phimapi.com/v1/api/the-loai/hai-huoc?page=1&limit=12",
          movies: [],
          link: {
            name: "TheLoai",
            params: { path: "hai-huoc" },
          },
          loaded: false,
          loading: false
        },
        {
          title: "Kinh Dị Ám Ảnh – Thót Tim Từng Phút",
          type: "grid",
          url: "https://phimapi.com/v1/api/the-loai/kinh-di?page=1&limit=12",
          movies: [],
          link: {
            name: "TheLoai",
            params: { path: "kinh-di" },
          },
          loaded: false,
          loading: false
        },
        {
          title: "TV Shows & Truyền Hình Thực Tế",
          type: "slider",
          url: "https://phimapi.com/v1/api/danh-sach/tv-shows?page=1&limit=12",
          movies: [],
          link: {
            name: "TVShow",
            params: { path: "tv-shows" },
          },
          loaded: false,
          loading: false
        },
        {
          title: "Viễn Tưởng Đột Phá – Khám Phá Tương Lai",
          type: "grid",
          url: "https://phimapi.com/v1/api/the-loai/vien-tuong?page=1&limit=12",
          movies: [],
          link: {
            name: "TheLoai",
            params: { path: "vien-tuong" },
          },
          loaded: false,
          loading: false
        },
        {
          title: "Điện Ảnh Nhật Bản – Tinh Tế & Sâu Lắng",
          type: "slider",
          url: "https://phimapi.com/v1/api/quoc-gia/nhat-ban?page=1&limit=12",
          movies: [],
          link: {
            name: "QuocGia",
            params: { path: "nhat-ban" },
          },
          loaded: false,
          loading: false
        },
        {
          title: "Phim Thái Lan – Kịch Tính & Bất Ngờ",
          type: "grid",
          url: "https://phimapi.com/v1/api/quoc-gia/thai-lan?page=1&limit=12",
          movies: [],
          link: {
            name: "QuocGia",
            params: { path: "thai-lan" },
          },
          loaded: false,
          loading: false
        },
      ],
    };
  },
  created() {
  this.cache = new Map();
},
beforeUnmount() {
  if (this.observer) {
    this.observer.disconnect();
    this.observer = null;
  }
},
  async mounted() {
    this.ListNewUpdate();

    for (let i = 0; i < 2; i++) {
      await this.loadSection(this.sections[i]);
    }

    this.initLazyLoad();
  },

  methods: {
    normalizeMovies(raw) {
      return (raw || []).map((m) => ({
        id: m._id || m.id,
        name: m.name,
        origin_name: m.origin_name,
        thumb_url: this.getImage(m.thumb_url),
        poster_url: this.getImage(m.poster_url),
        rating: m.tmdb?.vote_average || 0,
        year: m.year,
        quality: m.quality || "HD",
        lang: m.lang || "Vietsub",
        episode_current: m.episode_current || "Full",
        slug: m.slug,
        time: m.time,
      }));
    },

    getImage(path) {
      if (!path) return "";
      if (path.includes("http")) return path;
      return "https://phimimg.com/" + path;
    },

    async ListNewUpdate() {
      NewUpdate(
        `?action=getTrending`,
        (dat) => {
          if (dat.success == true) {
            this.trending = dat.movies;
          }
        },
        (err) => {
          console.log(err);
        },
      );
    },

    async loadSection(section) {
      try {
        await new Promise(r => requestAnimationFrame(r));
        if (this.cache.has(section.url)) {
          section.movies = this.cache.get(section.url);
          section.loaded = true;
          return;
        }

        const res = await fetch(section.url);
        const data = await res.json();

        const raw = data.items || data.data?.items || [];
        const movies = this.normalizeMovies(raw).slice(0, 12);

        section.movies = movies;
        this.cache.set(section.url, movies);

        section.loaded = true;
      } catch (err) {
        console.log(err);
        section.loaded = true;
      }
    },
    initLazyLoad() {
  this.observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const index = Number(entry.target.dataset.index);
        const section = this.sections[index];

        if (!section) {
          this.observer.unobserve(entry.target);
          return;
        }

        if (section.loaded || section.loading) {
          this.observer.unobserve(entry.target);
          return;
        }

        section.loading = true;

        this.loadSection(section)
          .finally(() => {
            section.loaded = true;
            section.loading = false;

            // Ngừng theo dõi sau khi load xong
            this.observer.unobserve(entry.target);
          });
      });
    },
    {
      root: null,
      rootMargin: "200px 0px",
      threshold: 0.01,
    }
  );

  this.$nextTick(() => {
    this.sections.forEach((_, index) => {
      const comp = this.$refs[`section${index}`];

      const el = Array.isArray(comp)
        ? comp[0]?.$el
        : comp?.$el;

      if (!el) return;

      el.dataset.index = index;

      this.observer.observe(el);
    });
  });
},
  },
};
</script>

<style scoped>
.home-page {
  background: #0f0f0f;
  min-height: 100vh;
}
</style>