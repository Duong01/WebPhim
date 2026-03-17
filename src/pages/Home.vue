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
    title: "Phim Đề Cử – Những Tác Phẩm Không Thể Bỏ Lỡ",
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
    title: "Phim Đang Thịnh Hành – Xu Hướng Xem Nhiều Nhất Hiện Nay",
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
    title: "Điện Ảnh Việt Nam – Những Câu Chuyện Gần Gũi Và Sâu Sắc",
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
    title: "Phim lẻ – Những Câu Chuyện Gần Gũi Và Sâu Sắc",
    type: "grid",
    url: "https://phimapi.com/v1/api/danh-sach/phim-le?page=1&sort_field=year&sort_type=desc&limit=12",
    movies: [],
    link: {
      name: "PhimLe",
      params: { path: "phim-le" },
    },
    loaded: false,
  },
  {
    title: "Mãn Nhãn với Phim Chiếu Rạp",
    type: "grid",
    url: "https://phimapi.com/v1/api/danh-sach/phim-chieu-rap?country=viet-nam,trung-quoc&sort_field=year&page=1&limit=12",
    movies: [],
    link: {
      name: "PhimChieuRap",
      params: { path: "phim-chieu-rap" },
    },
    loaded: false,
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
  },

  {
    title: "Bảng Xếp Hạng Phim – Những Tựa Phim Được Yêu Thích Nhất",
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
    title: "Phim bom tấn – Những Tác Phẩm Không Thể Bỏ Lỡ",
    type: "slider",
    url: "https://phimapi.com/v1/api/danh-sach/phim-thuyet-minh?page=1&category=hanh-dong&sort_field=year&sort_type=desc&&limit=12",
    movies: [],
    link: {
      name: "HoatHinh",
      params: { path: "hoat-hinh" },
    },
    loaded: false,
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