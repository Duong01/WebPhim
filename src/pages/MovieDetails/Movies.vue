<template>
  <v-container class="search-page" fluid>
    <v-col cols="12" class="text-center" v-if="isLoading">
      <v-progress-circular indeterminate color="primary" size="50" />
    </v-col>
    <div v-else>
      <div>
        <!-- Background image -->
        <v-img

          :src="getOptimizedImage(movie.thumb_url)"
          cover
          class="poster-wrapper"
        />

        <!-- Overlay effects -->
        <!-- <div class="overlay-dark"></div> -->
        <div class="overlay-gradient-1"></div>
        <!-- <div class="overlay-gradient-2"></div> -->

        <!-- Content -->
        <div class="poster-content">
          <h1 class="poster-title">
            {{ movie.name }}
          </h1>

          <p class="poster-sub">{{ movie.origin_name }}</p>

          <!-- Badges -->
          <div class="poster-badges">
            <v-chip size="small" class="chip-custom">
              ⭐ TMDB {{ movie.tmdb || 0 }}
            </v-chip>

            <v-chip size="small" class="chip-custom"> TV </v-chip>

            <v-chip size="small" class="chip-custom">
              {{ movie.year }}
            </v-chip>

            <v-chip size="small" class="chip-custom">
              {{ movie.quality }}
            </v-chip>

            <v-chip size="small" class="chip-custom">
              {{ movie.lang }}
            </v-chip>
          </div>
          <v-btn
            color="primary"
            size="large"
            class="mt-4 xem-ngay-btn text-center"
            @click="goToWatch()"
          >
            ▶ Xem ngay
          </v-btn>
        </div>
      </div>

      <!--  PHẦN 2: 2 CỘT (VIDEO + INFO/TRAILER) -->
      <v-row>
        <div class="h-full container mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10 ">
          <!-- CỘT TRÁI: VIDEO -->
        <v-col cols="12" md="4">
          <div class="poster-wrapper">
            <v-img
              class="poster-img"
              :src="getOptimizedImage(movie.poster_url)"
            />
            <div class="poster-overlay">
              <span class="overlay-text">Xem ngay</span>
            </div>
          </div>
        </v-col>

        <!-- CỘT PHẢI: TRAILER + INFO PHIM -->
        <v-col cols="12" md="8">
          <!-- TRAILER -->
          <v-card color="grey-darken-4" flat class="mb-4 pa-4">
            <div class="trailer-box" v-if="movie.trailer_id">
              <iframe
                class="trailer-iframe"
                :src="`https://www.youtube.com/embed/${movie.trailer_id}`"
                frameborder="0"
                allowfullscreen
              >
              </iframe>
            </div>

            <!-- TITLE -->
            <h2 class="movie-title text-left">{{ movies.name }}</h2>

            <!-- DESCRIPTION -->
            <div
              class="movie-description text-left"
              v-html="movies.content"
            ></div>

            <!-- INFO GRID -->
            <div class="movie-info-grid text-left">
              <div class="info-row">
                <strong>Thể loại:</strong>
                <span class="inline-list">
                  <span v-for="(cate, ind) in movies.category" :key="ind">
                    {{ cate.name
                    }}<span v-if="ind < movies.category.length - 1">, </span>
                  </span>
                </span>
              </div>

              <div class="info-row">
                <strong>Quốc gia:</strong>
                <span>{{ movies.country[0].name || "Đang cập nhật" }}</span>
              </div>

              <div class="info-row">
                <strong>Số tập:</strong>
                <span>{{ movies.episode_total }} tập</span>
              </div>

              <div class="info-row">
                <strong>Thời lượng:</strong>
                <span>{{ movies.time }}</span>
              </div>

              <div class="info-row">
                <strong>Diễn viên:</strong>
                <span class="inline-list">
                  <span v-for="(actor, ind) in movies.actor" :key="ind">
                    {{ actor
                    }}<span v-if="ind < movies.actor.length - 1">, </span>
                  </span>
                </span>
              </div>
            </div>

            <!-- RATING -->
            <div class="rating-row text-left">
              <strong class="mr-2">Đánh giá:</strong>
              <v-rating
                readonly
                :model-value="movie.rating"
                color="yellow"
                density="compact"
              />
            </div>
          </v-card>
        </v-col>
        </div>
        
      </v-row>

      <!-- ========================= -->
      <!--  PHẦN 3: DANH SÁCH TẬP PHIM -->
      <!-- ========================= -->
      <v-card class="my-6 pa-4" color="grey-darken-4" flat>
        <h3 class="text-white mb-3">Danh sách tập</h3>

        <v-row>
          <v-col
            v-for="(ep, i) in visibleEpisodes"
            :key="i"
            cols="4"
            sm="4"
            md="2"
            lg="2"
            xl="2"
          >
            <v-btn block color="primary">
              {{ ep.name }}
            </v-btn>
          </v-col>
        </v-row>
        <div class="text-center mt-4">
          <v-btn
            color="pink"
            variant="tonal"
            @click="toggleEpisodes"
            class="mt-4 px-4 py-2 rounded-full text-sm flex items-center gap-2 transition cursor-pointer bg-white/10 hover:bg-white/20 text-gray-200"
          >
            {{ showAllEpisodes ? "Thu gọn " : "Xem thêm" }}
            <v-icon size="18" class="mr-1">
              {{ showAllEpisodes ? "mdi-chevron-up" : "mdi-chevron-down" }}
            </v-icon>
          </v-btn>
        </div>
      </v-card>

      <!-- Dialog Trailer -->
      <v-dialog v-model="dialogTrailer" max-width="900">
        <v-card color="black">
          <v-btn
            icon="mdi-close"
            class="position-absolute right-2 top-2"
            @click="dialogTrailer = false"
          ></v-btn>

          <iframe
            width="100%"
            height="700"
            :src="`https://www.youtube.com/embed/${movie.trailer_id}?autoplay=1`"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>


<script>
import {
  MoveInfor,
  MoveInfor1,
  // ListMovieByCate,
  Categoris1,
  urlImage,
  urlImage1,
  GetComments,
  AddComment,
} from "@/model/api";
import { toggleFavorite, isFavorite } from "@/utils/favorite";
import Hls from "hls.js";
export default {
  name: "MoviesPage",
  data() {
    return {
      showAllEpisodes: false,
      dialogTrailer: false,
      videoLoaded: false,
      tab: "",
      shareUrl: window.location.href,
      tabserver: null,
      currentEpisodeIndex: 0,
      currentEpisode: [],
      items: [
        {
          title: "Home",
          disabled: false,
          href: "/home",
        },
        {
          title: this.slug,
          disabled: true,
        },
      ],
      isLoading: true,
      isLoadingData: false,
      Message: "",
      color: "",
      mess: false,

      movies: [],
      movie: {
        title: "",
        valueRate: 4.5,
        description: "",
        videoUrl: "",
        actors: [],
        director: [],
        servers: [],
        genre: "",
        pageMovie: [],
        page: 1,
        rating: 5,
        categoris: "",
        trailer_url: "",
        name: "",
        LinkDown: "",
        trailer_id: "",
        idMovie: "",
        thumb_url: "",
        lang: "",
        origin_name: "",
        year: "",
        slug: "",
        poster_url: "",
        quality: "",
      },
      isTrailer: false,
      urlImage: urlImage,
      urlImage1: urlImage1,
      suggestedMovies: [],
      comments: [],
      newComment: "",
      shareDialog: false,
      link: "",
      liked: false,
    };
  },
  props: ["slug"],

  watch: {
    async slug(newSlug) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      await this.MoveInfor1(newSlug);
      this.playVideo(this.movie.videoUrl);

      await this.ListMovieByCate();
      await this.GetComment();
      console.log(this.currentEpisodeIndex);
    },
  },
  async mounted() {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
      await this.MoveInfor1(this.slug);
      this.playVideo(this.movie.videoUrl);

      await this.ListMovieByCate();
      await this.GetComment();
      console.log(this.currentEpisodeIndex);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    // Call API
    MoveInfor(slug) {
      return new Promise((resolve, reject) => {
        MoveInfor(
          slug,
          (result) => {
            console.log(result);
            if (result.status == true || result.status == "success") {
              this.link = "";
              this.movies = result.movie;
              this.movie.page = result.movie.episode_current;
              this.movie.idMovie = result.movie._id;
              this.movie.title = result.movie.name;
              this.movie.description = result.movie.content;
              this.movie.poster_url = result.movie.poster_url;
              this.movie.thumb_url = result.movie.thumb_url;
              this.movie.quality = result.movie.quality;

              this.movie.pageMovie = result.episodes[0].server_data.sort(
                (a, b) =>
                  parseInt(b.name.match(/\d+/)) - parseInt(a.name.match(/\d+/))
              );
              // this.movie.pageMovie = serverData;
              // this.movie.pageMovie = result.episodes[0].server_data;
              this.movie.director = result.movie.director;
              this.movie.servers = result.episodes;
              this.movie.trailer_url = result.movie.trailer_url;
              this.movie.name = result.movie.name;
              this.movie.thumb_url = result.movie.thumb_url;
              this.movie.lang = result.movie.lang;
              this.movie.origin_name = result.movie.origin_name;
              this.movie.year = result.movie.year;
              this.movie.slug = result.movie.slug;
              // if (result.data.seoOnPage) {
              //   this.updateMetaTags(result.data.seoOnPage)
              // }
              if (this.movie.trailer_url != "") {
                this.movie.trailer_id = this.movie.trailer_url.split("?v=")[1];
              }

              if (
                result.movie.status == "trailer" &&
                result.episodes[0].server_data[0].link_embed == ""
              ) {
                this.movie.videoUrl = result.movie.trailer_url;
                // this.movie.title = result.movie.name;
                this.isTrailer = true;
              } else {
                if (
                  this.movie.page == "Full" ||
                  this.movie.page.toUpperCase().includes("HOÀN TẤT") ||
                  this.movie.page.includes("/")
                ) {
                  this.movie.videoUrl =
                    result.episodes[0].server_data[
                      result.episodes[0].server_data.length - 1
                    ].link_embed;
                  this.currentEpisodeIndex = 0;
                  // this.movie.title = result.movie.name;
                  this.isTrailer = false;
                } else {
                  var tap = this.movie.page.split("Tập ")[1].trim();
                  const data = result.episodes[0].server_data.find(
                    (ep) => ep.slug === tap || ep.slug.includes(tap)
                  );
                  // this.currentEpisodeIndex = parseInt(tap,10) -1;
                  const idx = this.movie.pageMovie.findIndex(
                    (ep) => ep.name === result.movie.episode_current
                  );
                  if (idx !== -1) {
                    this.currentEpisodeIndex = idx;
                  }
                  if (data) {
                    this.movie.videoUrl = data.link_embed;
                    this.movie.LinkDown = data.link_m3u8;
                    // this.movie.title = data.filename;
                    this.isTrailer = false;
                  } else {
                    const data = result.episodes[1].server_data.find(
                      (ep) => ep.slug === tap || ep.slug.includes(tap)
                    );
                    if (data) {
                      this.movie.videoUrl = data.link_embed;
                      this.movie.LinkDown = data.link_m3u8;
                      // this.movie.title = data.filename;
                      this.isTrailer = false;
                    }
                  }
                  // this.movie.videoUrl = result.episodes[0].server_data[tap-1].link_embed
                  // this.isTrailer = false;
                }
              }
              this.movie.actors = result.movie.actor;
              for (var i = 0; i < result.movie.country.length; i++) {
                this.movie.genre = result.movie.country[i];
              }
              this.movie.categoris = result.movie.category[0].slug;
              this.isLoading = false;
              this.GetComment();
              this.liked = isFavorite(this.movie.idMovie);
              resolve(true);
            } else {
              reject("error");
            }
          },
          (err) => {
            console.log(err);
            this.loading = false;
            this.isLoadingData = true;
            reject(err);
          }
        );
      });
    },
    MoveInfor1(slug) {
      return new Promise((resolve, reject) => {
        MoveInfor1(
          slug,
          (result) => {
            console.log(result);
            if (result.status == true || result.status == "success") {
              this.link = "link";
              this.movies = result.movie;
              this.movie.page = result.movie.episode_current;
              this.movie.idMovie = result.movie._id;
              this.movie.title = result.movie.name;
              this.movie.description = result.movie.content;
              this.movie.poster_url = result.movie.poster_url;
              this.movie.thumb_url = result.movie.thumb_url;
              this.movie.quality = result.movie.quality;

              this.movie.pageMovie = result.episodes[0].server_data.sort(
                (a, b) =>
                  parseInt(b.name.match(/\d+/)) - parseInt(a.name.match(/\d+/))
              );
              // this.movie.pageMovie = result.episodes[0].server_data;
              this.movie.director = result.movie.director;
              this.movie.servers = result.episodes;
              this.movie.trailer_url = result.movie.trailer_url;
              this.movie.name = result.movie.name;
              this.movie.thumb_url = result.movie.thumb_url;
              this.movie.lang = result.movie.lang;
              this.movie.origin_name = result.movie.origin_name;
              this.movie.year = result.movie.year;
              this.movie.slug = result.movie.slug;

              // if (result.data.seoOnPage) {
              //   this.updateMetaTags(result.data.seoOnPage)
              // }

              if (this.movie.trailer_url != "") {
                this.movie.trailer_id = this.movie.trailer_url.split("?v=")[1];
              }
              if (
                result.movie.status == "trailer" &&
                result.episodes[0].server_data[0].link_embed == ""
              ) {
                this.movie.videoUrl = result.movie.trailer_url;
                this.movie.title = result.movie.name;
                this.isTrailer = true;
              } else {
                if (
                  this.movie.page == "Full" ||
                  this.movie.page.toUpperCase().includes("HOÀN TẤT") ||
                  this.movie.page.includes("/")
                ) {
                  this.movie.videoUrl =
                    result.episodes[0].server_data[
                      result.episodes[0].server_data.length - 1
                    ].link_embed;
                  // this.currentEpisodeIndex = result.episodes[0].server_data.length-1
                  this.currentEpisodeIndex = 0;
                  this.movie.title = result.movie.name;
                  this.isTrailer = false;
                } else {
                  var tap = this.movie.page.split("Tập ")[1].trim();
                  const data = result.episodes[0].server_data.find(
                    (ep) => ep.slug === tap || ep.slug.includes(tap)
                  );
                  // this.currentEpisodeIndex = parseInt(tap,10)-1;
                  const idx = this.movie.pageMovie.findIndex(
                    (ep) => ep.name === result.movie.episode_current
                  );
                  if (idx !== -1) {
                    this.currentEpisodeIndex = idx;
                  }

                  if (data) {
                    this.movie.videoUrl = data.link_embed;
                    this.movie.title = data.filename;
                    this.isTrailer = false;
                  } else {
                    const data = result.episodes[1].server_data.find(
                      (ep) => ep.slug === tap || ep.slug.includes(tap)
                    );
                    if (data) {
                      this.movie.videoUrl = data.link_embed;
                      this.movie.title = data.filename;
                      this.isTrailer = false;
                    }
                  }
                  // this.movie.videoUrl = result.episodes[0].server_data[tap-1].link_embed
                  // this.isTrailer = false;
                }
              }
              this.movie.actors = result.movie.actor;
              for (var i = 0; i < result.movie.country.length; i++) {
                this.movie.genre = result.movie.country[i];
              }
              this.movie.categoris = result.movie.category[0].slug;
              this.isLoading = false;
              this.GetComment();
              this.liked = isFavorite(this.movie._id);
              resolve(true);
            } else {
              this.MoveInfor(slug).then(resolve).catch(reject);
              // reject("error");
            }
          },
          (err) => {
            console.log(err);
            this.MoveInfor(slug).then(resolve).catch(reject);
            //reject(err);
          }
        );
      });
    },
    toggleEpisodes() {
      this.showAllEpisodes = !this.showAllEpisodes;
    },
    goToWatch() {
      this.$router.push(`/movie/${this.movie.slug}`);
      // hoặc:
      // this.$router.push(`/watch/${this.movie.slug}`);
    },
    playVideo(url) {
      const video = this.$refs.videoPlayer;
      console.log(url);
      if (!video) return;
      // ======== Nguồn phimapi.com ========
      if (url.includes("player.phimapi.com/player/?url=")) {
        url = url.split("player/?url=")[1];
      }
      // ======== Nguồn opstream10.com (link share) ========
      if (url.includes("opstream10.com/share/")) {
        const iframe = this.$refs.videoIframe;
        if (iframe) {
          iframe.style.display = "block";
          iframe.src = url;
        }
        video.style.display = "none";
        return;
      }
      // Nếu là file .m3u8 → dùng HLS
      if (Hls.isSupported() && url.endsWith(".m3u8")) {
        const hls = new Hls({
          maxBufferLength: 5,
          enableWorker: true,
          startLevel: -1,
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        video.addEventListener("play", () => {
          hls.startLoad();
        });

        video.addEventListener("pause", () => {
          hls.stopLoad();
        });
        video.style.display = "block";
        const iframe = this.$refs.videoIframe;
        if (iframe) iframe.style.display = "none";
      } else {
        // Nếu là mp4 hoặc youtube thì dùng thẻ video thông thường
        video.src = url;
        video.play();
      }
    },
    DownloadVideo(linkdown) {
      window.open(linkdown);
    },
    handleFavorite() {
      let aa = toggleFavorite(this.movie);
      console.log(aa);
      this.liked = !this.liked;
    },

    getOptimizedImage(imagePath) {
      return `${this.urlImage1 + imagePath}`;
      // }
    },
    // Chuản SEO
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
    ListMovieByCate() {
      return new Promise((resolve, reject) => {
        Categoris1(
          this.movie.categoris,

          (data) => {
            if (data.status == true) {
              this.suggestedMovies = data.data.items;
              this.isLoading = false;
              resolve(true);
            } else {
              reject("error");
            }
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        );
        // }
      });
    },
    shareMovie() {
      this.shareDialog = true;
    },

    shareTo(platform) {
      // const url = encodeURIComponent(shareUrl.value);
      // const text = encodeURIComponent("Xem phim này nè!");
      let shareLink = "";

      switch (platform) {
        case "facebook":
          shareLink = `https://www.facebook.com/sharer/sharer.php`;
          break;
        case "youtube":
          shareLink = `https://www.youtube.com/`;
          break;
        case "twitter":
          shareLink = `https://twitter.com`;
          break;
      }
      // const shareUrl = window.location.href;

      window.open(shareLink, "_blank");
    },
    ResponseError() {
      this.Message = this.$t("Dữ liệu đã được gửi tới Admin để xử lý");
      this.color = "error";
      this.mess = true;
    },
    copyLink() {
      const shareUrl = window.location.href;
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert(this.$t("Đã sao chép liên kết!"));
      });
    },
    addComment() {
      var account = localStorage.getItem("name");
      var data = {
        movieId: this.movie.idMovie,
        userId: this.$store.state.empInfor.id,
        username: account,
        content: this.newComment,
      };
      if (account == null || account == "") {
        this.$router.push("/login");
      }
      if (this.newComment.trim()) {
        AddComment(
          data,
          (dat) => {
            if (dat.status == 201) {
              this.Message = dat.data.message;
              this.color = "success";
              this.mess = true;
              this.GetComment();
            }
          },
          (err) => {
            this.Message = err.response.data.message;
            this.color = "error";
            this.mess = true;
          }
        );
        this.newComment = "";
      }
    },
    GetComment() {
      return new Promise((resolve, reject) => {
        if (!this.movie.idMovie) reject("error");
        GetComments(
          { movieId: this.movie.idMovie },
          (res) => {
            if (Array.isArray(res)) {
              this.comments = res.map((c) => ({
                username: c.username,
                content: c.content,
                createdAt: c.createdAt,
              }));
              resolve(true);
            } else {
              reject("error");
            }
          },
          (err) => {
            console.error("Lỗi lấy bình luận:", err);
            reject(err);
          }
        );
      });
    },
  },
  computed: {
    visibleEpisodes() {
      if (!this.movie?.pageMovie) return [];
      return this.showAllEpisodes
        ? this.movie.pageMovie // Hiện tất cả tập
        : this.movie.pageMovie.slice(0, 20); // Chỉ 20 tập đầu
    },
  },
};
</script>

<style scoped>
/* Poster hover */
.poster-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.poster-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.55);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.poster-wrapper:hover .poster-img {
  opacity: 0.4;
}

.poster-wrapper:hover .poster-overlay {
  opacity: 1;
}

.overlay-text {
  color: white;
  font-size: 1.4rem;
  font-weight: bold;
}


/* Movie info layout */
.movie-info-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Một dòng: nhãn + nội dung */
.info-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 6px;
  line-height: 1.4;
}

/* Danh sách không xuống dòng */
.inline-list {
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
}

.inline-list span {
  white-space: nowrap;
}


/* Title + Description */
.movie-title {
  font-size: 1.6rem;
  font-weight: 600;
}

.movie-description {
  line-height: 1.6;
  margin-bottom: 12px;
}

</style>
