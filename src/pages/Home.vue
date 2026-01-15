<template>
<v-fade-transition appear>
    <div class="page-enter">
      <div style="width: 100%">
    <keep-alive include="CarouselPage">
      <CarouselPage />
    </keep-alive>
    <div style="overflow-x: auto; white-space: nowrap; margin-top: 10px;">
      <v-row no-gutters class="align-center mb-2">
        <v-col cols="12">
          <h1 class="category-title d-flex align-center">
            <v-icon size="20" color="#ffcc00" class="mr-2"
              >mdi-filmstrip</v-icon
            >
            {{$t('Bạn muốn xem gì?')}}
          </h1>
        </v-col>
      </v-row>

      <div
        class="d-flex align-center justify-space-between"
  style="overflow-x: auto; white-space: nowrap; gap: 12px; padding: 10px 0; width: 100%;"
      >
      <router-link
    v-for="(item, index) in items"
    :key="index"
    :to="item.link"
    style="text-decoration: none; display: inline-block; flex: 1 0 auto;"
  >
    <v-btn
      class="btnList flex-shrink-0"
      :style="{ backgroundColor: getColor(index), color: 'white',margin:'15px' }"
      :ripple="false"
      height="120"
      min-width="200"
    >
      {{ item.title }}
    </v-btn>
  </router-link>
        
      </div>
    </div>

    <!-- PHIM MỚI CẬP NHẬT -->
<v-row no-gutters class="align-center mt-6 mb-2">
  <v-col cols="12">
    <h1 class="category-title d-flex align-center">
      <v-icon size="20" color="#ffcc00" class="mr-2">
        mdi-update
      </v-icon>
      {{ $t('Phim mới cập nhật') }}
    </h1>
  </v-col>
</v-row>

<!-- Chọn ngày trong tuần -->
<div
  class="d-flex align-center"
  style="overflow-x:auto; gap:10px; padding:10px 0"
>
  <v-btn
    v-for="day in days"
    :key="day.value"
    size="small"
    rounded="pill"
    :color="daily === day.value ? 'blue-darken-3' : 'grey-darken-3'"
    @click="changeDay(day.value)"
  >
    {{ day.label }}
  </v-btn>
</div>
<v-slide-group
  show-arrows
  class="trending-track"
  v-if="allMovies.length"
>
  <v-slide-group-item
    v-for="(item, index) in allMovies"
    :key="`${item._type}-${index}`"
    class="trending-item"
  >
    <router-link
      :to="{ name: 'Movies', params: { slug: item.permalink.split('/').pop() } }"
      class="trending-link"
    >
      <v-card class="trending-card" elevation="0">
        <!-- POSTER -->
        <v-img
          :src="item.thumbnail"
          aspect-ratio="9/16"
          cover
          class="trending-poster"
          referrerpolicy="no-referrer"
        >
          <!-- BADGE -->
          <div class="trending-rating">
            <template v-if="item._type === 'early'">
              {{ item.early_screening_time }}
            </template>
            <template v-else>
              ⭐
            </template>
          </div>

          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular indeterminate :width="5" />
            </div>
          </template>
        </v-img>

        <!-- INFO -->
        <div class="trending-info fixed-info">
          <div v-if="item._type === 'early'" class="trending-number">
            {{ item._index + 1 }}
          </div>

          <div class="trending-details">
            <div class="trending-title">
              {{ item.title }}
            </div>
            <div class="trending-original">
              📺 Tập {{ item.latest_episode }}
            </div>
          </div>
        </div>
      </v-card>
    </router-link>
  </v-slide-group-item>
</v-slide-group>



<!-- Loading -->
<v-row v-else>
  <v-col v-for="i in 12" :key="i" cols="6" sm="4" md="3">
    <v-skeleton-loader type="image" height="240" />
  </v-col>
</v-row>
    

    <div
      v-for="(section, sectionIndex) in sections"
      :key="sectionIndex"
      ref="sectionRefs"
    >
      <v-lazy
        :options="{ threshold: 0.5 }"
        min-height="300"
        transition="fade-transition"
      >
        <template #default>
          <div>
            <v-row class="category-header" align="center" no-gutters>
              <v-col cols="auto">
                <h1 class="category-title">
                  <v-icon size="20" color="#ffcc00" class="mr-1"
                    >mdi-filmstrip</v-icon
                  >
                  {{ section.title }}
                </h1>
              </v-col>
              <v-col cols="auto">
                <router-link
                  :to="section.link"
                  class="view-all"
                >
                  {{ $t("Xem tất cả") }} >>
                </router-link>
              </v-col>
            </v-row>
            <div v-if="section.state === 'loading'">
              <v-row>
                <v-col v-for="i in 12" :key="i">
                  <v-skeleton-loader type="image" height="250" />
                </v-col>
              </v-row>
            </div>


            
            <div v-if="section.loaded">
              <v-row
                no-gutters
                tag="transition-group"
                name="fade-scale"
                class="movie-list"
              >
                <v-col
                   v-for="item in section.listMovie.slice(0,12)"
                   :key="item.slug"
                  cols="6"
                  sm="6"
                  md="3"
                  style="padding: 5px"
                >
                  <!-- <v-skeleton-loader
                    v-if="section.loading"
                    type="image"
                    height="250"
                  /> -->
                  <router-link
                    :to="{ name: 'Movies', params: { slug: item.slug } }"
                    
                  >
                    <v-card
                      class="mx-auto  movie-card"
                      
                    >
                      <v-img
                        :src="getOptimizedImage(item.thumb_url, section.id)"
                        :lazy-src="
                          getOptimizedImage(item.thumb_url, section.id)
                        "
                        :alt="`Poster phim ${item.name}`"
                        class="movie-img"
                        height="250"
                        loading="lazy"
                        eager="false"
                        aspect-ratio="2/3"
                        cover
                      >
                        <template #default>
                           <div class="badge-container">
                          <!-- hiển thị bên trái -->
                          <v-btn
                            icon
                            size="small"
                            variant="flat"
                            class="badge-top-left"
                          >
                            {{item.episode_current}}
                          </v-btn>

                          <!-- hiển thị bên phải -->
                          <v-btn
                            icon
                            size="small"
                            variant="flat"
                            class="badge-top-right"
                          >
                            {{item.quality}}
                          </v-btn>
                           </div>

                          <div class="movie-overlay" aria-hidden="true"></div>

                          <div class="movie-play" aria-hidden="true">
                            <svg
                              width="64"
                              height="64"
                              viewBox="0 0 64 64"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <circle
                                cx="32"
                                cy="32"
                                r="30"
                                fill="rgba(0,0,0,0.55)"
                              />
                              <path d="M26 20 L46 32 L26 44 Z" fill="#fff" />
                            </svg>
                          </div>
                        </template>
                        <template #placeholder>
                          <div class="d-flex align-center justify-center fill-height">
                            <v-progress-circular
                              color="blue-lighten-3"
                              :width="5"
                              indeterminate
                            ></v-progress-circular>
                          </div>
                        </template>
                      </v-img>

                      <div>
                          <v-card-title class="movie-title text-left">{{ item.name }}</v-card-title>

                          <v-card-text class="movie-info text-left">
                              <!-- <div class="category-wrap" v-for="(cate, ind) in getCategoriesToShow(item.category)" :key="ind">
                                {{ cate.name }} 
                                <span  v-if="ind < getCategoriesToShow(item.category).length -1">
                                  ,
                                </span>
                              </div> -->
                              
                              <span>{{ item.lang }}</span>
                              <span> - {{ item.year }}</span>
                          </v-card-text>
                        <v-card-text class="text-grey text-truncate text-left" style="font-size: 12px; padding-bottom:10px; padding-top: 0;margin-top: 0;"> {{timeAgo(item.modified.time)}}</v-card-text>
                      </div>
                      
                    </v-card>
                  </router-link>
                </v-col>
              </v-row>
            </div>
            <div v-else style="height: 400px">
              <v-skeleton-loader type="card" height="100%" />
            </div>
          </div>
        </template>
      </v-lazy>
    </div>
  </div>
    </div>
  </v-fade-transition>
  
</template>

<script>
import {
  urlImage,
  urlImage1,
  NewUpdate
} from "@/model/api";
import CarouselPage from "./Carousel.vue";

export default {
  name: "HomePage",
  data() {
    return {
      hoverIndex: null,
      urlImage: urlImage,
      urlImage1: urlImage1,
      isLoading: true,
      loaded: false,
      favoriteMovies: [],
      isFavo: false,
      colorList: ["#e57373", "#81c784", "#64b5f6", "#ffb74d", "#ba68c8"],
      sections: [
      {
          title: this.$t("PHIM ĐỀ CỬ"),
          id: "https://phimapi.com/v1/api/danh-sach/hoat-hinh?page=1&sort_field=modified.time&sort_type=desc&country=trung-quoc&limit=12",
          name: "HoatHinh",
          listMovie: [],
          content: "",
          loaded: false,
          link: { name: "HoatHinh" },
        },
        {
          title: this.$t("PHIM THỊNH HÀNH"),
          id: "https://phimapi.com/danh-sach/phim-moi-cap-nhat-v3?page=1",
          name: "PhimNew",
          listMovie: [],
          content: "",
          loaded: false,
          link: { 
            name: "PhimNew",
            params: { path: "phim-moi-cap-nhat-v3" },
          },
        },
        
        {
          title: this.$t("PHIM VIỆT NAM"),
          id: "https://phimapi.com/v1/api/quoc-gia/viet-nam?page=1&sort_field=year&sort_type=desc&limit=12",
          name: "QuocGia",
          listMovie: [],
          content: "",
          loaded: false,
          link: {
            name: "QuocGia",
            params: { path: "viet-nam" },
          },
        },
        {
          title: this.$t("PHIM TRUNG QUỐC"),
          id: "https://phimapi.com/v1/api/quoc-gia/trung-quoc?page=1&sort_field=year&sort_type=desc&limit=12",
          name: "QuocGia",
          listMovie: [],
          content: "",
          loaded: false,
          link: {
            name: "QuocGia",
            params: { path: "trung-quoc" },
          },
        },
        {
          title: this.$t("PHIM BỘ"),
          id: "https://phimapi.com/v1/api/danh-sach/phim-bo?page=1&sort_field=year&sort_type=desc&limit=12",
          name: "PhimBo",
          listMovie: [],
          content: "",
          loaded: false,
          link: { name: "PhimBo" },
        },
        {
          title: this.$t("PHIM LẺ"),
          id: "https://phimapi.com/v1/api/danh-sach/phim-le?page=1&sort_field=year&sort_type=desc&limit=12",
          name: "PhimLe",
          listMovie: [],
          content: "",
          loaded: false,
          link: { name: "PhimLe" },
        },
        {
          title: this.$t("PHIM HÀN QUỐC"),
          id: "https://phimapi.com/v1/api/quoc-gia/han-quoc?page=1&sort_field=year&sort_type=desc&limit=12",
          name: "QuocGia",
          listMovie: [],
          content: "",
          loaded: false,
          link: {
            name: "QuocGia",
            params: { path: "han-quoc" },
          },
        },
      ],
      items: [
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
        // {
        //   title: this.$t("PHIM HOẠT HÌNH"),
        //   name: "HoatHinh",
        //   link: {
        //     name: "HoatHinh",
        //     params: {
        //       path: "/hoat-hinh?page=1&sort_field=year&sort_type=desc&limit=20",
        //     },
        //   },
        // },
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
      link: "",
      days: [
        { label: "Chủ Nhật", value: "chu-nhat" },
        { label: "Thứ Hai", value: "thu-hai" },
        { label: "Thứ Ba", value: "thu-ba" },
        { label: "Thứ Tư", value: "thu-tu" },
        { label: "Thứ Năm", value: "thu-nam" },
        { label: "Thứ Sáu", value: "thu-sau" },
        { label: "Thứ Bảy", value: "thu-bay" },
      ],
      daily: "",
      earlyMovies:[],
      regular_movies:[]

    };
  },
  components: {
    CarouselPage,
  },
  async mounted() {
    const todayIndex = new Date().getDay();
    this.daily = this.days[todayIndex].value;
    await this.ListNewUpdate()
    this.$nextTick(() => {
      this.observeSections();
    });
  },
  methods: {


    changeDay(day) {
      this.daily = day;
      this.ListNewUpdate();
    },
    getCategoriesToShow(item){
      const isMobile = this.$vuetify.display.xs;
      if (isMobile) {
        return item.slice(0, 2);  // Mobile → 2 item
      } else {
        return item.slice(0, 3);  // Desktop → 4 item
      }
    },
    timeAgo(timestamp) {
       const time = new Date(timestamp).getTime();
      const now = Date.now();

      if (time > now) {
        return 'Vừa xong';
      }
      const diff = now - time;
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return  `${minutes} phút trước`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} giờ trước`;
        const days = Math.floor(hours / 24);
        return `${days} ngày trước`;
  },

    getColor(index) {
      return this.colorList[index % this.colorList.length];
    },

    observeSections() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const index = this.$refs.sectionRefs.indexOf(entry.target);
            const section = this.sections[index];

            if (section) {
              this.ListMovie(section.id, section)
                  .then(() => {
                    section.loading = false;
                  })
                  .catch((err) => {
                    console.error(err);
                    section.loading = false;
                  });
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "200px",
          threshold: 0.3
        }
      );

      this.$refs.sectionRefs.forEach(el => el && observer.observe(el));
    },
    async ListNewUpdate(){
      NewUpdate(`?day=${this.daily}`,(dat)=>{
        console.log(dat)
        if(dat.success == true){
            this.earlyMovies = dat.early_movies
            this.regular_movies = dat.regular_movies
        }
      }, (err)=>{
        console.log(err)
      })
    },
    async ListMovie(sectionId, section) {
      section.loading = true;
      section.loaded = false;
      // this.isLoading = true
      if (section.id.includes("danh-sach/phim-moi-cap-nhat-v3")) {
        try{
            const response = await  fetch(sectionId);
            const result = await response.json();
            console.log(result);

              if (result.status === "success" || result.status == true) {
                this.link = "link1";
                section.listMovie = result.items.slice(0,12);

                // this.isLoading = false;
                section.loading = false;
                section.loaded = true;
                //resolve(true);
              } else {
                section.loading = false;
                //resolve(false);
              }
          }
          catch(error){
            console.error(error);
              section.loading = false;
              //reject(error);
          }
        // return new Promise((resolve, reject) => {
        //   ListMovieByCateHome1(
        //     sectionId,
        //     (result) => {
        //       if (result.status === "success" || result.status == true) {
        //         section.listMovie = result.data.items;
        //         this.link = "link1";
        //         if (result.data.seoOnPage) {
        //           this.updateMetaTags(result.data.seoOnPage);
        //         }
        //         section.loading = false;
        //         section.loaded = true;
        //         // this.isLoading = false;
        //         resolve(true);
        //       } else {
        //         section.loading = false;
        //         resolve(false);
        //       }
        //     },
        //     (err) => {
        //       console.error(err);
        //       section.loading = false;
        //       reject(err);
        //     }
        //   );
        // });
      } else {
        
          try{
            const response = await  fetch(sectionId);
            const result = await response.json();
            console.log(result);

              if (result.status === "success" || result.status == true) {
                this.link = "link1";
                section.listMovie = result.data.items;

                if (result.data.seoOnPage) {
                  this.updateMetaTags(result.data.seoOnPage);
                }
                // this.isLoading = false;
                section.loading = false;
                section.loaded = true;
                //resolve(true);
              } else {
                section.loading = false;
                //resolve(false);
              }
          }
          catch(error){
            console.error(error);
              section.loading = false;
              //reject(error);
          }
          
          // ListMovieByCateHome1(
          //   sectionId,
          //   (result) => {
              
          //   },
          //   (err) => {
          //     console.error(err);
          //     section.loading = false;
          //     reject(err);
          //   }
          // );
        
      }
    },
    getOptimizedImage(imagePath) {
      if(imagePath.includes("https://phimimg.com/upload")){
        return `${
          this.urlImage1 +
          encodeURIComponent(imagePath)
        }`;
      }
      else{
        return `${
          this.urlImage1 +
          "https://phimimg.com/" +
          encodeURIComponent(imagePath)
        }`;
      }
        
      
    },
    // Chuan SEO
    updateMetaTags(seo) {
      document.title = seo.titleHead || "Phim hay";

      const removeOldMeta = (key, attr = "name") => {
        const old = document.querySelectorAll(`meta[${attr}="${key}"]`);
        old.forEach((tag) => tag.remove());
      };

      const setMeta = (key, content, attr = "name") => {
        if (!content) return;
        const meta = document.createElement("meta");
        meta.setAttribute(attr, key);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      };

      // Xóa cũ
      removeOldMeta("description");
      removeOldMeta("og:title", "property");
      removeOldMeta("og:description", "property");
      removeOldMeta("og:type", "property");
      removeOldMeta("og:image", "property");

      // Thêm mới
      setMeta("description", seo.descriptionHead);
      setMeta("og:title", seo.titleHead, "property");
      setMeta("og:description", seo.descriptionHead, "property");
      setMeta("og:type", seo.og_type || "website", "property");

      if (Array.isArray(seo.og_image)) {
        seo.og_image.forEach((img) => {
          setMeta("og:image", img, "property");
        });
      }
    },
    onImageLoad(index) {
      this.$nextTick(() => {
        const imgRef = this.$refs["img_" + index];
        if (imgRef && imgRef.$el) {
          imgRef.$el.classList.add("loaded");
        }
      });
    },
    
    
    
  },
  computed: {
  allMovies() {
    return [
      ...this.earlyMovies.map((m, i) => ({
        ...m,
        _type: 'early',
        _index: i,
      })),
      ...this.regular_movies.map((m, i) => ({
        ...m,
        _type: 'regular',
        _index: i,
      })),
    ]
  },
}
};
</script>

<style scoped>
.category-header {
  margin: 20px 0;
  gap: 10px;
}

.category-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  text-transform: capitalize;
}

.view-all {
  font-size: 16px;
  font-weight: 600;
  color: #ffcc00;
  text-decoration: none;
}
.view-all:hover {
  text-decoration: underline;
  color: #ff9900;
}

.movie-title {
  font-size: 14px;
  font-weight: 600;
  color: white;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
a {
  text-decoration: none;
  list-style: none;
}
.v-card:hover {
  transform: scale(1.03);
  transition: transform 0.3s ease;
  box-shadow: 0 4px 20px rgba(255, 204, 0, 0.2);
}
.favorite-btn {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.5);
}
.episode-btn{
  position: absolute;
  top: 8px;
  left: 8px;
}
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.4s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.v-img img {
  transition: opacity 0.5s ease-in-out;
}
.v-img img[lazy="loaded"] {
  opacity: 1 !important;
}
.v-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.v-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(255, 204, 0, 0.35);
}
.movie-info {
  font-size: 13px;
  color: #ccc;
}

.episode-lang {
  color: #ffcc00;
  font-size: 13px;
  font-weight: 600;
}

.movie-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 40px;
  font-size: 14px;
  font-weight: bold;
  line-height: 1.2;
  color: white;
  margin-top: 10px;
  text-overflow: ellipsis;
  white-space: normal;
}
@media (max-width: 400px) {
  .v-img {
    height: 180px !important;
  }



  .movie-info {
    font-size: 11px;
  }

  .episode-lang {
    font-size: 11px;
  }
}
.v-img {
  width: 100%;
}
/*
@media (max-width: 600px) {
  .v-img {
    height: 180px;
  }
} */

/* container card */
.movie-card {
  position: relative;
  will-change: transform;
  overflow: hidden;
  border-radius: 8px;
}

/* v-img wrapper */
.movie-img {
  position: relative;
  overflow: hidden;
}

/* target cả <img> hoặc class vuetify image */
.movie-img img,
.movie-img .v-image__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
}

/* zoom nhẹ khi hover card */
.movie-card:hover .movie-img img,
.movie-card:hover .movie-img .v-image__image {
  transform: scale(1.04);
}

/* overlay mờ (ẩn mặc định) */
.movie-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.25s ease;
  pointer-events: none; /* không chặn click */
}

.movie-card:hover .movie-overlay {
  background: rgba(0, 0, 0, 0.45);
}

.movie-play {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0.95);
  opacity: 0;
  transition: opacity 0.18s ease, transform 0.18s ease;
  pointer-events: none;
  z-index: 2;
}

/* show play khi hover */
.movie-card:hover .movie-play {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.favorite-btn {
  /* position: relative; */
  z-index: 4;
}
.v-btn {
  transition: background-color 0.3s;
}
.scroll {
  margin: 15px;
}
.btnList {
  border-radius: 12px;
  font-weight: 500;
  text-transform: none;
  transition: 
    transform 0.25s ease,
    box-shadow 0.25s ease,
    filter 0.25s ease;
}
.btnList:hover{
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 10px 30px rgba(0,0,0,0.35);
  filter: brightness(1.1); 
}
.btnList:active {
  transform: scale(0.96);
}
.fade-scale-enter-active {
  transition: all 0.35s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.94) translateY(12px);
}

.fade-scale-leave-active {
  transition: all 0.2s ease;
  position: absolute;
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.badge-top-left,
.badge-top-right,
.badge-bottom-left,
.badge-bottom-right {
  position: absolute !important;
  background: rgba(105, 105, 105, 0.6) !important;
  /* color: #fff !important; */
  font-size: 12px !important;
  padding: 2px 10px !important;
  border-radius: 10px;
  z-index: 10;
  width: auto;
  height: auto;
  font-weight: 600 !important;
}

/* 4 góc */
.badge-top-left {
  top: 6px;
  left: 6px;
}

.badge-top-right {
  top: 6px;
  right: 6px;
  background-color: rgb(204, 35, 35) !important;
}

.badge-bottom-left {
  bottom: 6px;
  left: 6px;
}

.badge-bottom-right {
  bottom: 6px;
  right: 6px;
}
.movie-info{
  text-align: left;
  display: flex;
  gap: 4px;
  flex-wrap: nowrap; 
}
.category-item {
  white-space: nowrap; /* Không tách từ */
  color: grey;
  flex-wrap: wrap; 
}
.text-left {
  text-align: left !important;
}
.page-enter {
  animation: pageEnter 0.6s ease-out;
}

@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.v-skeleton-loader__image {
  border-radius: 12px;
}
.trending-track {
  padding: 12px;
}

.trending-link {
  text-decoration: none;
  color: inherit;
}

/* CARD */
.trending-card {
  width: 180px;
  background: #111;
  border-radius: 14px;
  overflow: hidden;
  margin-right: 12px;
  transition: transform 0.25s ease;
   display: flex;
  flex-direction: column;
}

.trending-card:hover {
  transform: translateY(-6px);
}

/* POSTER */
.trending-poster {
  background: radial-gradient(#222, #000);
  position: relative;
  aspect-ratio: 9/16;
  flex-shrink: 0;
}

/* RATING */
.trending-rating {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: #ffcc00;
  margin: 2px 0;
  font-size: 12px;
  border-radius: 999px;
  font-weight: 600;
  min-width: 44px;
  text-align: center;
}

/* INFO */
.trending-info {
  display: flex;
  gap: 10px;
  padding: 10px;
  height: 72px;       
  align-items: flex-start;
}

.trending-number {
  width: 26px;        /* 🔥 cố định */
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  color: #ffcc00;
  line-height: 1;
  flex-shrink: 0;
}

.trending-details {
  flex: 1;
}

.trending-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.trending-original {
  font-size: 12px;
  color: #aaa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.v-slide-group-item {
  flex: 0 0 auto;
}
</style>
