<template>
  <div style="width: 100%">
    <CarouselPage />
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

    <div v-if="isFavo" >
    <v-lazy :options="{ threshold: 0.5 }" min-height="300" transition="fade-transition" v-for="(section, index) in ListMovieFavo" :key="index">
      <template #default>
          
        <div>
          <v-row class="category-header" align="center" no-gutters>
            <v-col cols="auto">
              <h1 class="category-title">
                <v-icon size="20" color="#ffcc00" class="mr-1">mdi-filmstrip</v-icon>
                {{$t('Danh sách phim của bạn!')}}
              </h1>
            </v-col>
            <v-col cols="auto">
              <router-link
                :to="{ name: 'FavoritePage', params: {  } }"
                class="view-all"
              >
                {{$t('Xem tất cả')}} >>
              </router-link>
            </v-col>
          </v-row>
          <!-- Khi đã load -->
          <div v-if="!isLoading">
            <v-row
              no-gutters
              tag="transition-group"
              name="fade-scale"
              class="movie-list"
            >
              <v-col
                v-for="(item, index1) in section.listMovie.slice(0, 12)"
                :key="item.slug || index1"
                cols="6"
                sm="4"
                md="2"
                style="padding: 10px"
              >
              
                <router-link
                  :to="{ name: 'MovieDetail', params: { slug: item.slug } }"
                >
                  <v-card
                    class="mx-auto  movie-card"
                    max-width="344"
                  >
                  
                    <v-img
                      :src=" item.thumb_url.includes('https://phimimg.com/upload') ?  `https://phimapi.com/image.php?url=` + item.thumb_url : `https://phimapi.com/image.php?url=` + 'https://phimimg.com/'+ item.thumb_url"
                      :lazy-src="item.thumb_url.includes('https://phimimg.com/upload') ?  `https://phimapi.com/image.php?url=` + item.thumb_url : `https://phimapi.com/image.php?url=` + 'https://phimimg.com/'+ item.thumb_url"
                      height="250"
                      cover
                    >

                      <template #default>
                        <v-btn
                          icon
                          size="small"
                          variant="flat"
                          class="favorite-btn"
                          @click.stop.prevent="handleFavorite(item)"
                          :color="isFavoriteMovie(item) ? 'red' : ''"
                        >
                      
                          <v-icon>
                            {{ isFavoriteMovie(item)
                                  ? "mdi-heart"
                                  : "mdi-heart-outline" }}
                          </v-icon>
                          
                        </v-btn>
                        <div class="movie-overlay"></div>
                        <div class="movie-play">
                          <svg width="64" height="64" viewBox="0 0 64 64">
                            <circle cx="32" cy="32" r="30" fill="rgba(0,0,0,0.55)" />
                            <path d="M26 20 L46 32 L26 44 Z" fill="#fff" />
                          </svg>
                        </div>
                      </template>
                    </v-img>
                    <v-card-subtitle class="episode-lang">
                      {{
                        item.page === "Tập 0"
                          ? `Full - ${item.lang}`
                          : `${item.page} - ${item.lang}`
                      }}
                    </v-card-subtitle>

                    <v-card-title class="movie-title">{{ item.name }}</v-card-title>

                    <v-card-text class="movie-info">
                      <div class="text-grey text-truncate">
                        <v-icon size="14" class="mr-1" color="grey">mdi-tag</v-icon>
                        {{ item.origin_name }} ({{ item.year }})
                      </div>
                    </v-card-text>
                  </v-card>
                </router-link>
              </v-col>
            </v-row>
          </div>

          <!-- Khi đang load -->
          <div v-else style="height: 400px">
            <v-row>
              <v-col
                v-for="n in 6"
                :key="n"
                cols="6"
                sm="4"
                md="2"
                style="padding: 10px"
              >
                <v-skeleton-loader type="image" height="250" />
              </v-col>
            </v-row>
          </div>
        </div>
      </template>
    </v-lazy>
  </div>




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
                  :to="
                    section.name === 'QuocGia' || section.name === 'PhimNew'
                      ? {
                          name: section.name,
                          params: { path: section.id.split('/')[1].split('?')[0] },
                        }
                      : { 
                          name: section.name,
                          params: { path: section.id.split('/')[1].split('?')[0] },
                        }
                  "
                  class="view-all"
                >
                  {{ $t("Xem tất cả") }} >>
                </router-link>
              </v-col>
            </v-row>

            <div v-if="section.loaded">
              <v-row
                no-gutters
                tag="transition-group"
                name="fade-scale"
                class="movie-list"
              >
                <v-col
                  v-for="(item, index) in section.loading
                    ? Array(12).fill({})
                    : section.listMovie.slice(0, 12)"
                  :key="item.slug || index"
                  
                  cols="6"
                  sm="6"
                  md="3"
                  style="padding: 10px"
                >
                  <v-skeleton-loader
                    v-if="section.loading"
                    type="image"
                    height="250"
                  />
                  <router-link
                    :to="{ name: 'MovieDetail', params: { slug: item.slug } }"
                    v-else
                  >
                    <v-card
                      class="mx-auto  movie-card"
                      
                    >
                      <v-img
                        :src="getOptimizedImage(item.poster_url, section.id)"
                        :lazy-src="
                          getOptimizedImage(item.poster_url, section.id)
                        "
                        :alt="`Poster phim ${item.name}`"
                        class="movie-img"
                        height="250"
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
                          

                          <!-- hiển thị dưới cùng bên phải -->
                          <v-btn
                            icon
                            size="small"
                            variant="flat"
                            class="badge-bottom-right"
                          >
                            {{item.time}}
                          </v-btn>

                          <!-- hiển thị dưới cùng bên trái -->
                          <v-btn
                            icon
                            size="small"
                            variant="flat"
                            class="badge-bottom-left"
                          >
                            {{item.country[0].name}}
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
                      </v-img>

                      <div>
                          <v-card-title class="movie-title text-left">{{ item.name }}</v-card-title>

                          <v-card-text class="movie-info text-left">
                              <div class="category-wrap" v-for="(cate, ind) in item.category" :key="ind">
                                <!-- khong xuong dong -->
                                {{ cate.name }} 
                                <span  v-if="ind < cate.length -1">
                                  ,
                                </span>
                              </div>
                              <span> • {{ item.year }}</span>
                          </v-card-text>
                        <v-card-text class="text-grey text-truncate text-left" style="font-size: 12px; padding-bottom:10px;"> {{timeAgo(item.modified.time)}}</v-card-text>
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
</template>

<script>
import {
  // ListMovieByCateHome,
  ListMovieByCateHome1,
  urlImage,
  urlImage1,
} from "@/model/api";
import CarouselPage from "./Carousel.vue";
import { getFavorites,isFavorite } from "@/utils/favorite";
import {  toggleFavorite } from "@/utils/favorite";

export default {
  name: "HomePage",
  data() {
    return {
      hoverIndex: null,
      urlImage: urlImage,
      urlImage1: urlImage1,
      isLoading: true,
      loaded: false,
      loading: false,
      favoriteMovies: [],
      ListMovieFavo: [],
      isFavo: false,
      colorList: ["#e57373", "#81c784", "#64b5f6", "#ffb74d", "#ba68c8"],
      sections: [
      {
          title: this.$t("PHIM ĐỀ CỬ"),
          id: "danh-sach/hoat-hinh?page=1&sort_field=modified.time&sort_type=desc&country=trung-quoc&limit=20",
          name: "HoatHinh",
          listMovie: [],
          content: "",
          loaded: false,
          link: { name: "HoatHinh" },
        },
        {
          title: this.$t("PHIM THỊNH HÀNH"),
          id: "danh-sach/tv-shows?page=1&sort_field=year&sort_type=desc&limit=20",
          name: "PhimNew",
          listMovie: [],
          content: "",
          loaded: false,
          link: { name: "PhimNew" },
        },
        
        {
          title: this.$t("PHIM VIỆT NAM"),
          id: "quoc-gia/viet-nam?page=1&sort_field=year&sort_type=desc&limit=20",
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
          id: "quoc-gia/trung-quoc?page=1&sort_field=year&sort_type=desc&limit=20",
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
          id: "danh-sach/phim-bo?page=1&sort_field=year&sort_type=desc&limit=20",
          name: "PhimBo",
          listMovie: [],
          content: "",
          loaded: false,
          link: { name: "PhimBo" },
        },
        {
          title: this.$t("PHIM LẺ"),
          id: "danh-sach/phim-le?page=1&sort_field=year&sort_type=desc&limit=20",
          name: "PhimLe",
          listMovie: [],
          content: "",
          loaded: false,
          link: { name: "PhimLe" },
        },
        {
          title: this.$t("PHIM HÀN QUỐC"),
          id: "quoc-gia/han-quoc?page=1&sort_field=year&sort_type=desc&limit=20",
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
              path: "/phim-bo?page=1&sort_field=year&sort_type=desc&limit=20",
            },
          },
        },
        {
          title: this.$t("PHIM TRUNG QUỐC"),
          name: "QuocGia",
          link: {
            name: "QuocGia",
            params: {
              path: "trung-quoc?page=1&sort_field=year&sort_type=desc&limit=20",
            },
          },
        },
        {
          title: this.$t("PHIM LẺ"),
          name: "PhimLe",
          link: {
            name: "PhimLe",
            params: {
              path: "/phim-le?page=1&sort_field=year&sort_type=desc&limit=20",
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
              path: "tinh-cam?page=1&sort_field=year&sort_type=desc&limit=20",
            },
          },
        },
      ],
      link: "",
    };
  },
  components: {
    CarouselPage,
  },
  async mounted() {
    //   await Promise.all(
    //     this.sections.map(item => this.ListMovie(item.id, item))
    // );
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.loadFavorites();
    
    this.$nextTick(() => {
      this.observeSections();
    });
  },
  methods: {
    
    timeAgo(timestamp) {
    const diff = Date.now() - new Date(timestamp).getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours   = Math.floor(minutes / 60);
    const days    = Math.floor(hours / 24);

    if (days > 0) return `${days} ngày ${hours} giờ trước`;
    if (hours > 0) return `${hours} giờ ${minutes} phút trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return "Sắp chiếu";
  },

    handleFavorite(movie){
      console.log(movie)
      // this.movie.thumb_url = movie.thumb_url
      toggleFavorite(movie);
      this.$forceUpdate();
      // this.liked = !this.liked;
    },

    loadFavorites() {
      this.isLoading = true;
      setTimeout(() => {
        const favorites = getFavorites();

        if (favorites && favorites.length > 0) {
          this.isFavo = true;
          this.ListMovieFavo = [
            {
              loaded: true,
              listMovie: favorites,
            },
          ];
        } else {
          this.isFavo = false;
        }

        this.isLoading = false;
      }, 800); // Delay 0.8s cho hiệu ứng loading

      
    },


    getColor(index) {
      return this.colorList[index % this.colorList.length];
    },

    observeSections() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const sectionIndex = [...this.$refs.sectionRefs].indexOf(
                entry.target
              );
              const section = this.sections[sectionIndex];

              if (section && !section.loaded) {
                section.loaded = true; // bật render skeleton
                section.loading = true; // loading riêng cho section

                this.ListMovie(section.id, section)
                  .then(() => {
                    section.loading = false;
                  })
                  .catch((err) => {
                    console.error(err);
                    section.loading = false;
                  });
              }

              observer.unobserve(entry.target); // chỉ quan sát 1 lần
            }
          });
        },
        {
          rootMargin: "0px 0px 0px 0px", // bỏ preload, chỉ khi chạm vào mới load
          threshold: 0.25, // ít nhất 25% section visible mới load
        }
      );

      this.$refs.sectionRefs.forEach((el) => {
        if (el) observer.observe(el);
      });
    },
    ListMovie(sectionId, section) {
      section.loading = true;
      section.loaded = false;
      // this.isLoading = true
      if (section.id == "quoc-gia/viet-nam?page=1&limit=20") {
        return new Promise((resolve, reject) => {
          ListMovieByCateHome1(
            sectionId,
            (result) => {
              if (result.status === "success" || result.status == true) {
                section.listMovie = result.data.items;
                this.link = "link1";
                if (result.data.seoOnPage) {
                  this.updateMetaTags(result.data.seoOnPage);
                }
                section.loading = false;
                section.loaded = true;
                // this.isLoading = false;
                resolve(true);
              } else {
                section.loading = false;
                resolve(false);
              }
            },
            (err) => {
              console.error(err);
              section.loading = false;
              reject(err);
            }
          );
        });
      } else {
        return new Promise((resolve, reject) => {
          ListMovieByCateHome1(
            sectionId,
            (result) => {
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
                resolve(true);
              } else {
                section.loading = false;
                resolve(false);
              }
            },
            (err) => {
              console.error(err);
              section.loading = false;
              reject(err);
            }
          );
        });
      }
    },
    getOptimizedImage(imagePath) {
      if (this.link != "link1") {
        return `${this.urlImage + encodeURIComponent(imagePath)}&w=384&q=100`;
      } else {
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
    isFavoriteMovie(movie) {
      // const favorites = getFavorites();
      // return favorites.some(f => f._id === movie._id || f._id === movie.idMovie);
      return isFavorite(movie.idMovie || movie._id);
    },
    
    // // Thêm/bỏ yêu thích
    // toggleFavorite(movie) {
    //   const index = this.favoriteMovies.findIndex(
    //     (fav) => fav._id === movie.id
    //   );
    //   if (index !== -1) {
    //     this.favoriteMovies.splice(index, 1); // Bỏ yêu thích
    //   } else {
    //     this.favoriteMovies.push(movie); // Thêm yêu thích
    //   }
    // },
  },
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
  -webkit-line-clamp: 2; /* hiện 2 dòng */
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
  height: 250px;
}

@media (max-width: 600px) {
  .v-img {
    height: 180px;
  }
}

/* container card */
.movie-card {
  position: relative;

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
  transition: all 0.3s ease;
}
.btnList:hover{
  
  transform: scale(1.05); 
}
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-scale-enter-from,
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
  font-size: 11px !important;
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

</style>
