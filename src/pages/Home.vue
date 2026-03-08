<template>
<v-fade-transition appear>
    <div class="page-enter">
      <div style="width: 100%">
    <keep-alive>
      <CarouselPage v-once />
    </keep-alive>
    <div style="overflow-x: auto; white-space: nowrap; margin-top: 10px;">
      <v-row no-gutters class="align-center mb-2">
        <v-col cols="12">
          <h1 class="category-title d-flex align-center">
            <v-icon size="20" class="mr-2"
              >mdi-filmstrip</v-icon
            >
            {{$t('Bạn muốn xem gì?')}}
          </h1>
        </v-col>
      </v-row>

      <div class="ad-banner-container">
        <router-link
          v-for="(item, index) in items"
          :key="index"
          :to="item.link"
          class="ad-banner-card"
          :class="`ad-banner-${index}`"
        >
          <div class="ad-banner-content">
            <v-icon size="40" class="ad-banner-icon">{{ getIconForCategory(item.title) }}</v-icon>
            <div class="ad-banner-text">
              <h3 class="ad-banner-title">{{ item.title }}</h3>
              <p class="ad-banner-subtitle">{{$t('Khám phá ngay')}}</p>
            </div>
            <v-icon size="28" class="ad-banner-arrow">mdi-arrow-right</v-icon>
          </div>
          <div class="ad-banner-bg"></div>
        </router-link>
      </div>
    </div>

    <!-- PHIM MỚI CẬP NHẬT -->
<v-row no-gutters class="align-center mt-6 mb-2">
  <v-col cols="12">
    <h1 class="category-title d-flex align-center">
      <v-icon size="20" class="mr-2">
        mdi-update
      </v-icon>
      {{ $t('Phim mới cập nhật') }}
    </h1>
  </v-col>
</v-row>

<!-- <div class="day-tabs">
      <v-btn
        v-for="day in days"
        :key="day.value"
        :color="daily === day.value ? 'blue-darken-3' : 'grey-darken-3'"
        @click="changeDay(day.value)"
        rounded
      >
        {{ day.label }}
      </v-btn>
    </div> -->
<v-divider :content-offset="[12, 2.5]" opacity=".7">* * *</v-divider>
<v-slide-group
  show-arrows="desktop"
  class="trending-track"
  v-if="earlyMovies.length"
>
  <v-slide-group-item
    v-for="(item, index) in earlyMovies"
    :key="`${item._type}-${index}`"
    class="trending-item"
  >
    
      <v-card role="button" class="trending-card" elevation="0" @click="goMovies(item)">
        <!-- POSTER -->
        <v-img
          :src="'https://hoathinh3d.vn'+item.thumbnail"
          aspect-ratio="9/16"
          cover
          loading="lazy"
          class="trending-poster"
          transition="fade-transition"
          referrerpolicy="no-referrer"
        >
          <!-- BADGE -->
          <div class="trending-rating">
            <template v-if="item._type === 'early'">
              {{ item.early_screening_time }}
            </template>
            <template v-else>
              {{ item.rating }} ⭐
            </template>
            
          </div>

          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular indeterminate :width="5" />
            </div>
          </template>
        </v-img>

        <!-- INFO -->
        <div class="trending-info">
          
          <div class="trending-details">
            <div class="trending-title">
              {{ item.title }}
              
            </div>
            <div class="trending-original">
              📺 Tập {{ item.current_episode }}
            </div>
          </div>
          <v-tooltip
            activator="parent"
            location="top"
            
          >{{ item.title }}</v-tooltip>
        </div>
        
      </v-card>
  </v-slide-group-item>
</v-slide-group>


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
                  <v-icon size="20" color="orange-darken-2" class="mr-1"
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
  class="mx-auto movie-card"
  role="button"
>
  <v-img
    :src="getOptimizedImage(item.thumb_url, section.id)"
    :lazy-src="getOptimizedImage(item.thumb_url, section.id)"
    :alt="`Poster phim ${item.name}`"
    class="movie-img"
    height="250"
    loading="lazy"
    aspect-ratio="2/3"
    cover
  >
    <!-- BADGE -->
    <div class="badge-container">
      <v-btn icon size="x-small" variant="flat" class="badge-top-left">
        {{ item.episode_current }}
      </v-btn>

      <v-btn icon size="x-small" variant="flat" class="badge-top-right">
        {{ item.quality }}
      </v-btn>
    </div>

    <!-- OVERLAY -->
    <div class="movie-overlay"></div>

    <!-- PLAY BUTTON -->
    <!-- <div class="movie-play" v-if="$vuetify.display.smAndUp">
      <v-icon size="42">mdi-play-circle</v-icon>
    </div> -->

    <!-- EXPAND CONTENT -->
    <div class="movie-expand">
      <div class="movie-actions">
        <v-btn icon size="small" class="action-btn primary">
          <v-icon size="18">mdi-play</v-icon>
        </v-btn>

        <v-btn icon size="small" class="action-btn">
          <v-icon size="18">mdi-plus</v-icon>
        </v-btn>

        <v-btn icon size="small" class="action-btn" @click.stop.prevent="handleFavorite(item)">
          <v-icon size="18">mdi-heart-outline</v-icon>
        </v-btn>
      </div>

      <div class="movie-meta">
        <span class="rating">⭐ {{ item.tmdb?.vote_average || '8.5' }}</span>
        <span class="dot"></span>
        <span>{{ item.lang }}</span>
        <span class="dot"></span>
        <span>{{ item.year }}</span>
      </div>

      <div class="movie-genres">
        <span
          v-for="(cate, ind) in getCategoriesToShow(item.category)"
          :key="ind"
          class="genre"
        >
          {{ cate.name }}
        </span>
      </div>
    </div>
  </v-img>

  <!-- TITLE -->
  <div class="movie-bottom">
    <v-card-title class="movie-title text-left">
      {{ item.name }}
    </v-card-title>
    <v-card-title class="movie-originname text-left">
      {{ item.origin_name }}
    </v-card-title>
    <v-card-text class="movie-time text-left">
      {{ timeAgo(item.modified.time) }}
    </v-card-text>
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
  NewUpdate,
  PostMoviesFavorite
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
        { label: this.$t("Chủ Nhật"), value: "chu-nhat" },
        { label: this.$t("Thứ Hai"), value: "thu-hai" },
        { label: this.$t("Thứ Ba"), value: "thu-ba" },
        { label: this.$t("Thứ Tư"), value: "thu-tu" },
        { label: this.$t("Thứ Năm"), value: "thu-nam" },
        { label: this.$t("Thứ Sáu"), value: "thu-sau" },
        { label: this.$t("Thứ Bảy"), value: "thu-bay" },
      ],
      daily: "",
      earlyMovies:[],
      regular_movies:[],
      movieFavorite:{
        IDAccount :this.$store.state.empInfor.ID || localStorage.getItem("name"),
        IDMovies: '',
        slug: '',
        currentPage: '',
        UrlMovies: '',
        origin_name: '',
        name: '',
        year: '',
        lang:''
      },

    };
  },
  props: ['item'],
  components: {
    CarouselPage,
  },
  async mounted() {
    try{
      const todayIndex = new Date().getDay();
      this.daily = this.days[todayIndex].value;
      await this.ListNewUpdate()
      this.$nextTick(() => {
        this.observeSections();
      });

      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = window.location.href;
      document.head.appendChild(link);
    }catch(err){
      console.log(err)
    }finally {
      this.$store.dispatch('loading/stopLoading')
    }
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
        return this.$t(this.$t('Vừa xong'));
      }
      const diff = now - time;
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return this.$t('Vừa xong');
        if (minutes < 60) return  `${minutes} ${this.$t('phút trước')}`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} ${this.$t('giờ trước')}`;
        const days = Math.floor(hours / 24);
        return `${days} ${this.$t('ngày trước')}`;
  },

    getColor(index) {
      return this.colorList[index % this.colorList.length];
    },

    getIconForCategory(title) {
      const iconMap = {
        'PHIM MỚI': 'mdi-star-outline',
        'PHIM BỘ': 'mdi-play-circle-outline',
        'PHIM TRUNG QUỐC': 'mdi-flag-outline',
        'PHIM LẺ': 'mdi-movie-outline',
        'PHIM TÌNH CẢM': 'mdi-heart-outline'
      };
      return iconMap[title] || 'mdi-filmstrip';
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
    // async ListNewUpdate(){
    //   NewUpdate(`?day=${this.daily}`,(dat)=>{
    //     console.log(dat)
    //     if(dat.success == true){
    //         this.earlyMovies = dat.early_movies
    //         this.regular_movies = dat.regular_movies

    //     }
    //   }, (err)=>{
    //     console.log(err)
    //   })
    // },
    async ListNewUpdate(){
      NewUpdate(`?action=getTrending`,(dat)=>{
        if(dat.success == true){
            this.earlyMovies = dat.movies

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

              if (result.status === "success" || result.status == true) {
                this.link = "link1";
                section.listMovie = result.items.slice(0,12);
                this.addStructuredData(section.listMovie);
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

              if (result.status === "success" || result.status == true) {
                this.link = "link1";
                section.listMovie = result.data.items;

                if (result.data.seoOnPage) {
                  this.updateMetaTags(result.data.seoOnPage);
                }
                this.addStructuredData(section.listMovie);
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
    addStructuredData(movies) {
      const oldScript = document.getElementById("movie-schema");
      if (oldScript) oldScript.remove(); // tránh trùng

      const script = document.createElement("script");
      script.id = "movie-schema";
      script.type = "application/ld+json";

      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: movies.slice(0, 10).map((m, i) => ({
          "@type": "Movie",
          position: i + 1,
          name: m.name,
          image: m.thumb_url
        }))
      });

      document.head.appendChild(script);
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
    goMovies(url) {
      var slug = url.slug
      this.$store.commit("imageThumbnail","https://hoathinh3d.vn"+url.cover_image)
      this.$router.push({
        name : 'Movies',
        params: {slug}
      })
    },
    handleFavorite(movie){
      console.log(movie)
      this.movieFavorite.IDMovies = movie._id
      this.movieFavorite.slug = movie.slug
      this.movieFavorite.currentPage = movie.episode_current
      this.movieFavorite.UrlMovies = 'https://phimimg.com/'+movie.thumb_url
      this.movieFavorite.origin_name = movie.origin_name
      this.movieFavorite.name = movie.name
      this.movieFavorite.year = movie.year
      this.movieFavorite.lang = movie.lang
      console.log(this.movieFavorite)
      PostMoviesFavorite(this.movieFavorite, (dat) =>{
        if(dat.data.status == "success"){
          alert("🎬 " + dat.data.message)
          
        }
        else{
          alert(dat.data.message)
        }

      }, (err) =>{
        console.log(err)
      })
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
  // allMovies() {
  //   return [
  //     ...this.earlyMovies.map((m, i) => ({
  //       ...m,
  //       _type: 'early',
  //       _index: i,
  //     })),
  //     ...this.regular_movies.map((m, i) => ({
  //       ...m,
  //       _type: 'regular',
  //       _index: i,
  //     })),
  //   ]
  // },
}
};
</script>

<style scoped>
.category-header {
  margin: 20px 0;
  gap: 10px;
}

.category-title {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: .6px;
  margin-bottom: 8px;
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
.v-img {
  contain: content;
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
  transform: scale(0.85);
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
  border-radius: 16px;
  overflow: hidden;
  background: #141414;
  transition:
    transform .45s cubic-bezier(.22,1,.36,1),
    box-shadow .45s ease,
    opacity .3s ease;
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
.movie-card:hover {
  transform: translateY(-12px) scale(0.85);
  box-shadow:
    0 30px 60px rgba(0,0,0,0.8),
    0 0 40px rgba(255,255,255,0.05);
  z-index: 20;
}

.movie-img img,
.movie-img .v-image__image {
  transition: transform .7s cubic-bezier(.22,1,.36,1);
}

.movie-card:hover .movie-img img,
.movie-card:hover .movie-img .v-image__image {
  transform: scale(1.05);
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
  /* color: #fff !important; */
  font-size: 12px !important;
  padding: 2px 10px !important;
  border-radius: 10px;
  z-index: 10;
  width: auto;
  height: auto;
  font-weight: 600 !important;
  backdrop-filter: blur(10px);
  background: rgba(255,255,255,.12) !important;
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 999px;
  padding: 4px 12px !important;
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
  width: 260px;
  border-radius: 18px;
  overflow: hidden;
  background: #141414;
  transition:
    transform .4s cubic-bezier(.22,1,.36,1),
    box-shadow .4s ease;
}

.trending-card:hover {
  transform: translateY(-10px) scale(1.06);
  box-shadow:
    0 20px 50px rgba(0,0,0,0.8);
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
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  display: flex;
}

.trending-original {
  font-size: 12px;
  color: #aaa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
}
.v-slide-group-item {
  flex: 0 0 auto;
}
.day-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}

.day-btn {
    min-width: unset; 
  white-space: nowrap;
  background: #2a2a2a;
  color: #ccc;
}

.day-btn.active {
  border: 1px solid #00e5ff;
  color: #00e5ff;
}

/* AD BANNER STYLES */
.ad-banner-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  padding: 12px 0;
  margin: 20px 0;
}

.ad-banner-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  min-height: 110px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  background: rgba(255,255,255,.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,.08);
  transition:
    transform .4s cubic-bezier(.22,1,.36,1),
    box-shadow .4s ease;
}

.ad-banner-card:hover {
   transform: translateY(-8px);
  box-shadow:
    0 20px 40px rgba(0,0,0,.6);
}

.ad-banner-card:active {
  transform: scale(0.98);
}

.ad-banner-bg {
  position: absolute;
  inset: 0;
  background-size: 300% 300%;
  animation: gradientShift 8s ease infinite;
  z-index: 0;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.ad-banner-0 .ad-banner-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
}

.ad-banner-1 .ad-banner-bg {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #f093fb 100%);
}

.ad-banner-2 .ad-banner-bg {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #4facfe 100%);
}

.ad-banner-3 .ad-banner-bg {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 50%, #fa709a 100%);
}

.ad-banner-4 .ad-banner-bg {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 50%, #30cfd0 100%);
}

.ad-banner-content {
  color: #fff;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
  width: 100%;
}

.ad-banner-icon {
  flex-shrink: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.ad-banner-text {
  color: #fff;
  flex: 1;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.ad-banner-title {
  font-size: 18px;
  font-weight: 800;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.ad-banner-subtitle {
  font-size: 12px;
  margin: 0;
  opacity: 0.95;
  font-weight: 500;
}

.ad-banner-arrow {
  flex-shrink: 0;
  opacity: 0.8;
  transition: transform 0.3s ease;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.ad-banner-card:hover .ad-banner-arrow {
  transform: translateX(6px);
  opacity: 1;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .ad-banner-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }
  
  .ad-banner-card {
    min-height: 100px;
    padding: 16px 20px;
  }
  
  .ad-banner-icon {
    font-size: 32px;
  }
  
  .ad-banner-title {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .trending-card{
    width: 180px;
  }
  .ad-banner-container {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 10px;
    padding: 12px 0;
    margin: 20px 0;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  }
  
  .ad-banner-container::-webkit-scrollbar {
    height: 4px;
  }
  
  .ad-banner-container::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .ad-banner-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
  
  .ad-banner-card {
    min-height: 90px;
    padding: 14px 16px;
    min-width: 160px;
    flex-shrink: 0;
    flex-direction: row;
    text-align: left;
  }
  
  .ad-banner-content {
    flex-direction: row;
    gap: 12px;
  }
  
  .ad-banner-icon {
    font-size: 28px;
  }
  
  .ad-banner-title {
    font-size: 13px;
    letter-spacing: 0.5px;
  }
  
  .ad-banner-subtitle {
    font-size: 11px;
  }
  
  .ad-banner-arrow {
    display: none;
  }
}

@media (max-width: 480px) {
  .ad-banner-container {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: 8px;
    padding: 10px 0;
    margin: 20px 0;
  }
  
  .ad-banner-card {
    min-height: 80px;
    padding: 12px 14px;
    min-width: 140px;
    flex-shrink: 0;
    flex-direction: row;
  }
  
  .ad-banner-icon {
    font-size: 24px;
  }
  
  .ad-banner-title {
    font-size: 12px;
  }
}
.trending-track,
.ad-banner-container {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch; /* iOS mượt hơn */
}
.movie-card,
.trending-card,
.ad-banner-card {
  will-change: transform;
  transform: translateZ(0);
}
.page-enter {
  min-height: 100vh;
  background:
    radial-gradient(circle at 15% 10%, rgba(255,255,255,0.05), transparent 40%),
    radial-gradient(circle at 85% 0%, rgba(255,255,255,0.04), transparent 40%),
    linear-gradient(to bottom, #111 0%, #0a0a0a 40%, #000 100%);
}
.movie-list:hover .movie-card {
  /* opacity: .45; */
  transform: scale(.96);
}

.movie-list .movie-card:hover {
  opacity: 1 !important;
  transform: translateY(-12px) scale(1.1);
}
@keyframes fadeUpModern {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.movie-list,
.trending-track {
  animation: fadeUpModern .7s ease forwards;
}
/* CARD */
.movie-card {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: #141414;
  transition: transform .4s cubic-bezier(.22,1,.36,1);
}

.movie-card:hover {
  transform: translateY(-10px) scale(1.07);
  z-index: 20;
}

/* OVERLAY */
.movie-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0,0,0,.9) 0%,
    rgba(0,0,0,.6) 40%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity .3s ease;
}

.movie-card:hover .movie-overlay {
  opacity: 1;
}

/* PLAY ICON */
.movie-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(.8);
  opacity: 0;
  transition: all .3s ease;
  color: white;
}

.movie-card:hover .movie-play {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

/* EXPAND */
.movie-expand {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 14px;
  opacity: 0;
  transform: translateY(20px);
  transition: all .35s cubic-bezier(.22,1,.36,1);
}

.movie-card:hover .movie-expand {
  opacity: 1;
  transform: translateY(0);
}

/* ACTION BUTTON */
.movie-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.action-btn {
  backdrop-filter: blur(6px);
  background: rgba(255,255,255,.08) !important;
  border: 1px solid rgba(255,255,255,.15);
  transition: .2s;
}

.action-btn:hover {
  background: rgba(255,255,255,.2) !important;
  transform: scale(1.1);
}

.action-btn.primary {
  background: #e50914 !important;
  color: white !important;
}

/* META */
.movie-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #ddd;
  margin-bottom: 6px;
}

.movie-meta .dot {
  width: 4px;
  height: 4px;
  background: #aaa;
  border-radius: 50%;
}

/* GENRE */
.movie-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.genre {
  font-size: 10px;
  padding: 3px 8px;
  background: rgba(255,255,255,.08);
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.15);
}

/* BOTTOM */
.movie-bottom {
  padding: 6px 8px 10px;
}

.movie-title {
  font-size: 14px;
  font-weight: 600;
}
.movie-originname{
  font-size: 12px;
  padding-top: 0;

  color: #ccc;
}

.movie-time {
  font-size: 11px;
  color: #aaa;
  padding-top: 0;
}
</style>
