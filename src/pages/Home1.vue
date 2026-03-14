<template>
  <div class="home-page">
    <keep-alive>
      <CarouselPage v-once />
    </keep-alive>

    <!-- CATEGORY QUICK -->
    <CategoryQuick :items="categories" />
    <!-- HERO -->
    <HeroBanner v-if="trending.length" :movie="trending" />

    <!-- MOVIE SECTIONS -->
    <SectionWrapper
      v-for="(section, index) in sections"
      :key="section.title"
      :ref="'section' + index"
      :title="section.title"
      :type="section.type"
      :movies="section.movies"
      :link="section.link"
    />
  </div>
</template>

<script>
import SectionWrapper from "@/pages/LayoutPageHome/SectionWrapper.vue";
import CarouselPage from "@/pages/Carousel.vue";
import HeroBanner from "@/pages/LayoutPageHome/HeroBanner.vue";
import CategoryQuick from "@/pages/LayoutPageHome/CategoryQuick.vue";

import { NewUpdate } from "@/model/api";

export default {
  name: "Home1Page",
  components: {
    SectionWrapper,
    HeroBanner,
    CategoryQuick,
    CarouselPage,
  },

  data() {
    return {
      trending: [],

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
          title: "🎬 PHIM ĐỀ CỬ",
          type: "slider",
          url: "https://phimapi.com/v1/api/danh-sach/hoat-hinh?page=1&limit=12",
          movies: [],
          link: {
            name: "HoatHinh",
            params: { path: "hoat-hinh" },
          },
          loaded: false,
        },

        {
          title: "🔥 PHIM THỊNH HÀNH",
          type: "slider",
          url: "https://phimapi.com/danh-sach/phim-moi-cap-nhat-v3?page=1",
          movies: [],
          link: {
            name: "PhimNew",
            params: { path: "phim-moi-cap-nhat-v3" },
          },
          loaded: false,
        },

        {
          title: "🇻🇳 PHIM VIỆT NAM",
          type: "grid",
          url: "https://phimapi.com/v1/api/quoc-gia/viet-nam?page=1&limit=12",
          movies: [],
          link: {
            name: "QuocGia",
            params: { path: "viet-nam" },
          },
          loaded: false,
        },
        {
          title: "Anime Mới Cập Nhật – Thế Giới Hoạt Hình Đỉnh Cao",
          type: "large",
          url: "https://phimapi.com/v1/api/quoc-gia/viet-nam?page=1&limit=12",
          movies: [],
          link: {
            name: "",
            params: { path: "" },
          },
          loaded: false,
        },
        {
          title: "🇨🇳 PHIM TRUNG QUỐC",
          type: "grid",
          url: "https://phimapi.com/v1/api/quoc-gia/trung-quoc?page=1&limit=12",
          movies: [],
          link: {
            name: "QuocGia",
            params: { path: "trung-quoc" },
          },
          loaded: false,
        },
        {
          title: "📊 BẢNG XẾP HẠNG PHIM",
          type: "dashboard",
          url: "https://phimapi.com/v1/api/quoc-gia/trung-quoc?page=1&limit=12",
          movies: [],
          link: {
            name: "QuocGia",
            params: { path: "trung-quoc" },
          },
          loaded: false,
        },
        {
          title: "🇰🇷 PHIM HÀN QUỐC",
          type: "grid",
          url: "https://phimapi.com/v1/api/quoc-gia/han-quoc?page=1&limit=12",
          movies: [],
          link: {
            name: "QuocGia",
            params: { path: "han-quoc" },
          },
          loaded: false,
        },
      ],
    };
  },

  mounted() {
    this.ListNewUpdate();
    // this.sections.forEach((section) => {
    //   this.loadSection(section);
    // });
    this.initLazyLoad();
  },

  methods: {
    async ListNewUpdate() {
      NewUpdate(
        `?action=getTrending`,
        (dat) => {
          if (dat.success == true) {
            console.log(dat);
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
        const res = await fetch(section.url);

        const data = await res.json();

        section.movies = data.items || data.data?.items || [];
      } catch (err) {
        console.log(err);
      }
    },
    initLazyLoad() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = entry.target.dataset.index;
              const section = this.sections[index];

              if (!section.loaded) {
                this.loadSection(section);

                section.loaded = true;
              }
            }
          });
        },
        {
          rootMargin: "200px",
        },
      );

      this.$nextTick(() => {
        this.sections.forEach((section, index) => {
          const comp = this.$refs["section" + index];

          const el = Array.isArray(comp) ? comp[0].$el : comp?.$el;

          if (el) {
            el.dataset.index = index;

            observer.observe(el);
          }
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
