<template>
  <v-container class="search-page" fluid>
    <v-col cols="12" class="text-center" v-if="isLoading">
      <v-progress-circular indeterminate color="primary" size="50" />
    </v-col>
    <div v-else>
      <div class="poster-wrapper">

    <!-- Background image -->
    <v-img
      :src="getOptimizedImage(movie.poster_url)"
      class="poster-img"
      cover
    />

    <!-- Overlay effects -->
    <div class="overlay-dark"></div>
    <div class="overlay-gradient-1"></div>
    <div class="overlay-gradient-2"></div>

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

        <v-chip size="small" class="chip-custom">
          TV
        </v-chip>

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
      class="mt-4 xem-ngay-btn"
      @click="goToWatch()"
    >
      ▶ Xem ngay
    </v-btn>
    </div>
  </div>

    <!-- ========================= -->
    <!--  PHẦN 2: 2 CỘT (VIDEO + INFO/TRAILER) -->
    <!-- ========================= -->
    <v-row class="mt-6">

      <!-- CỘT TRÁI: VIDEO -->
      <v-col cols="12" md="4">
        <v-card color="black" flat>
          <v-img
            width="100%"
            height="100%"
            :src="getOptimizedImage(movie.poster_url)"
            frameborder="0"
            allowfullscreen
          />
          <!-- Overlay khi hover -->
    <div class="poster-overlay"></div>

    <!-- Nút Xem Ngay -->
    <div class="poster-play-btn">
      ▶ Xem ngay
    </div>
        </v-card>
      </v-col>

      <!-- CỘT PHẢI: TRAILER + INFO PHIM -->
      <v-col cols="12" md="8">

        <!-- TRAILER -->
        <v-card color="grey-darken-4" flat class="mb-4 pa-4" v-if="movie.trailer_id">

          <div class="trailer-thumb" @click="dialogTrailer = true">
            <iframe
              width="100%"
              height="500"
              :src="`https://www.youtube.com/embed/${movie.trailer_id}?autoplay=1`"
              frameborder="0"
              allowfullscreen
            ></iframe>
            
          </div>

        <!-- THÔNG TIN PHIM -->
          <h3 class="text-left mb-3">{{ movie.title }}</h3>

          <div class="text-left mb-2">
            <div v-html="movie.description"></div>
          </div>

          <p class="text-left"><strong style="color: orange;">Diễn viên:</strong> {{ movie.actors.join(', ') }}</p>
          <p class="text-left"><strong style="color: orange;">Đạo diễn:</strong> {{ movie.director.join(', ') }}</p>
          <p class="text-left"><strong style="color: orange;">Thể loại:</strong> {{ movie.genre.name }}</p>

          <div class="d-flex align-center">
            <strong class="text-left mr-2">Đánh giá:</strong>
            <v-rating readonly :model-value="movie.rating" color="yellow" />
          </div>
        </v-card>

      </v-col>

    </v-row>

    <!-- ========================= -->
    <!--  PHẦN 3: DANH SÁCH TẬP PHIM -->
    <!-- ========================= -->
    <v-card class="my-6 pa-4" color="grey-darken-4" flat>
      <h3 class="text-white mb-3">Danh sách tập</h3>

      <v-row>
        <v-col
          v-for="(ep, i) in movie.pageMovie"
          :key="i"
          cols="6"
          sm="4"
          md="2"
        >
          <v-btn block color="primary" @click="playEpisode(ep)">
            {{ ep.name }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Dialog Trailer -->
    <v-dialog v-model="dialogTrailer" max-width="900">
      <v-card color="black">
        <v-btn icon="mdi-close" class="position-absolute right-2 top-2" @click="dialogTrailer = false"></v-btn>

        <iframe
          width="100%"
          height="500"
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
import {  toggleFavorite, isFavorite } from "@/utils/favorite";
import Hls from "hls.js";
export default {
  name: "MoviesPage",
  data() {
    return {
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
        quality: ""

      },
      isTrailer: false,
      urlImage: urlImage,
      urlImage1: urlImage1,
      suggestedMovies: [],
      comments: [],
      newComment: "",
      shareDialog: false,
      link: "",
      liked: false
    };
  },
  props: ["slug"],
  
  watch: {
    async slug(newSlug) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await this.MoveInfor1(newSlug);
      this.playVideo(this.movie.videoUrl);

      await this.ListMovieByCate();
      await this.GetComment();
      console.log(this.currentEpisodeIndex);

    },
  },
  async mounted() {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
            console.log(result)
            if (result.status == true || result.status == "success") {
              this.link = "";
              this.movie.page = result.movie.episode_current;
              this.movie.idMovie = result.movie._id;
              this.movie.title = result.movie.name;
              this.movie.description = result.movie.content;
              this.movie.poster_url = result.movie.poster_url;
              this.movie.thumb_url = result.movie.thumb_url;
              this.movie.quality = result.movie.quality;

              
              this.movie.pageMovie = result.episodes[0].server_data.sort(
                (a, b) => parseInt(b.name.match(/\d+/)) - parseInt(a.name.match(/\d+/))
              );
              // this.movie.pageMovie = serverData;
              // this.movie.pageMovie = result.episodes[0].server_data;
              this.movie.director = result.movie.director;
              this.movie.servers = result.episodes;
              this.movie.trailer_url = result.movie.trailer_url;
              this.movie.name = result.movie.name;
              this.movie.thumb_url = result.movie.thumb_url
              this.movie.lang = result.movie.lang
              this.movie.origin_name = result.movie.origin_name
              this.movie.year = result.movie.year
              this.movie.slug = result.movie.slug
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
                    result.episodes[0].server_data[result.episodes[0].server_data.length-1].link_embed;
                    this.currentEpisodeIndex = 0
                  // this.movie.title = result.movie.name;
                  this.isTrailer = false;
                } else {
                  var tap = this.movie.page.split("Tập ")[1].trim();
                  const data = result.episodes[0].server_data.find(
                    (ep) => ep.slug === tap || ep.slug.includes(tap)
                  );
                  // this.currentEpisodeIndex = parseInt(tap,10) -1;
                  const idx = this.movie.pageMovie.findIndex(ep => ep.name === result.movie.episode_current);
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
               this.GetComment()
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
            console.log(result)
            if (result.status == true || result.status == "success") {
              this.link = "link";
              this.movie.page = result.movie.episode_current;
              this.movie.idMovie = result.movie._id;
              this.movie.title = result.movie.name;
              this.movie.description = result.movie.content;
              this.movie.poster_url = result.movie.poster_url;
              this.movie.thumb_url = result.movie.thumb_url;
              this.movie.quality = result.movie.quality;

              this.movie.pageMovie = result.episodes[0].server_data.sort(
                (a, b) => parseInt(b.name.match(/\d+/)) - parseInt(a.name.match(/\d+/))
              );
              // this.movie.pageMovie = result.episodes[0].server_data;
              this.movie.director = result.movie.director;
              this.movie.servers = result.episodes;
              this.movie.trailer_url = result.movie.trailer_url;
              this.movie.name = result.movie.name;
              this.movie.thumb_url = result.movie.thumb_url;
              this.movie.lang = result.movie.lang;
              this.movie.origin_name = result.movie.origin_name
              this.movie.year = result.movie.year
              this.movie.slug = result.movie.slug

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
                    result.episodes[0].server_data[result.episodes[0].server_data.length-1].link_embed;
                    // this.currentEpisodeIndex = result.episodes[0].server_data.length-1
                    this.currentEpisodeIndex = 0
                  this.movie.title = result.movie.name;
                  this.isTrailer = false;
                } else {
                  var tap = this.movie.page.split("Tập ")[1].trim();
                  const data = result.episodes[0].server_data.find(
                    (ep) => ep.slug === tap || ep.slug.includes(tap)
                  );
                  // this.currentEpisodeIndex = parseInt(tap,10)-1;
                  const idx = this.movie.pageMovie.findIndex(ep => ep.name === result.movie.episode_current);
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
               this.GetComment()
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

    goToWatch() {
    this.$router.push(`/movie/${this.movie.slug}`);
    // hoặc:
    // this.$router.push(`/watch/${this.movie.slug}`);
  },
    playVideo(url) {
      const video = this.$refs.videoPlayer;
      console.log(url)
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
        const hls = new Hls({ maxBufferLength: 5,enableWorker: true, startLevel: -1,});
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
    handleFavorite(){
      let aa = toggleFavorite(this.movie);
      console.log(aa)
      this.liked = !this.liked;
    },

    getOptimizedImage(imagePath) {
        return `${
          this.urlImage1 +
          imagePath
        }`;
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
        // if (this.link == "") {
        //   ListMovieByCate(
        //     this.movie.categoris,

        //     (data) => {
        //       if (data.status == "success") {
        //         this.suggestedMovies = data.data.items;
        //         this.isLoading = false;
        //         resolve(true);
        //       } else {
        //         reject("error");
        //       }
        //     },
        //     (err) => {
        //       console.log(err);
        //       reject(err);
        //     }
        //   );
        // } else {
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

    scrollLeft() {
      const container = this.$refs.slideWrapper;
      if (container) {
        container.scrollBy({ left: -220, behavior: "smooth" });
      }
    },
    scrollRight() {
      const container = this.$refs.slideWrapper;
      if (container) {
        container.scrollBy({ left: 220, behavior: "smooth" });
      }
    },
    getTrailer() {
      this.movie.videoUrl = this.movie.trailer_url;
      this.isTrailer = true;
    },
    playEpisode(episode) {
      try{
        console.log(episode)
        this.currentEpisode = episode;
        this.isLoading = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if(episode.filename != undefined || episode.filename != null || episode.filename != ''){
          this.movie.title = episode.filename;

        }
        this.movie.videoUrl = episode.link_embed;
        this.movie.LinkDown = episode.link_m3u8;
        const idx = this.movie.pageMovie.findIndex(ep => ep.name === episode.name);
        if (idx !== -1) {
          this.currentEpisodeIndex = idx;
        }
        // this.currentEpisodeIndex = parseInt(episode.name.split('Tập')[1].trim(),10)-1
        this.movie.page = episode.name;

        const normalized = episode.name.replace('Tập ', 'tap').trim()
        this.$router.replace({
          name: "MovieDetail",
          params: { slug: this.slug },
          query: { page: normalized }
        });
        this.playVideo(this.movie.videoUrl);
        this.GetComment();
        this.isLoading = false;
      }
      catch{
        this.isLoading = false;
        
      }
      
    },
    switchServer(server) {
      this.isLoading = true;
      
      // this.movie.pageMovie = server.server_data;
      this.movie.pageMovie = server.server_data.sort(
        (a, b) => parseInt(b.name.match(/\d+/)) - parseInt(a.name.match(/\d+/))
      );
      if (
        this.movie.page == "Full" ||
        // this.movie.page.toUpperCase().includes("HOÀN TẤT") ||
        this.movie.page.includes("/")
      ) {
        this.movie.videoUrl = server.server_data[server.server_data.length-1].link_embed;
        this.movie.LinkDown = server.server_data[server.server_data.length-1].link_m3u8;
        this.isTrailer = false;
      } else {
        var tap = this.movie.page.split("Tập ")[1].trim();
        const data = server.server_data.includes(tap);
        if (data) {
          this.movie.videoUrl = data.link_embed;
          this.movie.LinkDown = data.link_m3u8;
          this.isTrailer = false;
        }
      }
      

      this.GetComment();
      setTimeout(() => {
        this.isLoading = false;

      }, 1000);
    },
    nextEpisode() {
      
      if (this.currentEpisodeIndex > 0) {
        console.log(this.currentEpisodeIndex)
        this.currentEpisodeIndex--;
        
        const nextEp = this.movie.pageMovie[this.currentEpisodeIndex];
        this.playEpisode(nextEp);
      }
      
    },
    prevEpisode() {
      if (this.currentEpisodeIndex < this.movie.pageMovie.length - 1) {
        console.log(this.currentEpisodeIndex)
        this.currentEpisodeIndex++;
        const prevEp = this.movie.pageMovie[this.currentEpisodeIndex];
        this.playEpisode(prevEp);
      }
      
    },
    generateEmbedHtml(url) {
      if (this.isTrailer) {
        const youtubeMatch = this.movie.trailer_url.split("?v=");
        // const youtubeMatch = url.match(
        //   /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/
        // );
        if (youtubeMatch.length > 0) {
          const videoId = youtubeMatch[1];

          return `
            <iframe width="100%" height="100%"
              src="https://www.youtube.com/embed/${videoId}?autoplay=1"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen loading="lazy"
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; touch-action: manipulation;"
              >
            </iframe>
          `;
        } else {
          // Nếu không phải YouTube thì giả sử là .mp4 và dùng thẻ video
          return `
            <video width="100%" height="100%" controls preload="none" style="touch-action: manipulation;">
              <source src="${url}" type="video/mp4">
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          `;
        }
        //return `<video width="100%" height="600" controls><source src="${url}" type="video/mp4">Trình duyệt của bạn không hỗ trợ video.</video> `;
      } else {
        return `<div style="position: relative; width: 100%; padding-bottom: 56.25%; ">
      <iframe
        src="${url}"
        frameborder="0"
        class="w-full h-full"
        webkit-playsinline
        loading="lazy"
        allowfullscreen
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; touch-action: manipulation;"
      ></iframe>
    </div>`;
      }
    },
  },
  computed: {
    thumbnailUrl() {
      const match = this.movie.videoUrl.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/
      );
      return match
        ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`
        : "/placeholder.jpg"; // fallback ảnh tĩnh nếu không phải YouTube
    },

    embedHtml() {
      const url = this.movie.videoUrl;
      if (this.isTrailer) {
        const youtubeMatch = url.match(
          /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/
        );
        if (youtubeMatch) {
          const videoId = youtubeMatch[1];
          return `
            <iframe width="100%" height="600"
              src="https://www.youtube.com/embed/${videoId}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen loading="lazy"
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; touch-action: manipulation;"
              
              >
            </iframe>
          `;
        } else {
          return `
            <video width="100%" height="600" controls preload="none" style="touch-action: manipulation;">
              <source src="${url}" type="video/mp4">
              Trình duyệt của bạn không hỗ trợ video.
            </video>
          `;
        }
      } else {
        return `
          <div style="position: relative; width: 100%; padding-bottom: 56.25%;">
            <iframe
              src="${url}"
              frameborder="0"
              class="w-full h-full"
              webkit-playsinline
              loading="lazy"
              allowfullscreen
              allow=" fullscreen"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; touch-action: manipulation;"
            ></iframe>
          </div>
        `;
      }
    },
  },
};
</script>

<style scoped>
.poster-wrapper {
  position: relative;
  width: 100%;
  height: 75vh;
  overflow: hidden;
  border-radius: 20px ;
}

.poster-img {
  width: 100%;
  height: 100%;
  transform: scale(1.15);
  filter: brightness(0.9);
}

.overlay-dark {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
}

.overlay-gradient-1 {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, black, transparent);
}

.overlay-gradient-2 {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top right, rgba(0,0,0,0.5), transparent);
}

.poster-content {
  position: absolute;
  bottom: 40px;
  left: 20px;
  max-width: 600px;
  color: white;
}

.poster-title {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 8px;
  background: linear-gradient(to bottom, #ddd, #fff);
  -webkit-background-clip: text;
  color: transparent;
}

.poster-sub {
  font-size: 14px;
  opacity: 0.8;
}

.poster-badges {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.chip-custom {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  text-transform: uppercase;
}
.poster-card {
  background: transparent !important;
}

.poster-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  cursor: pointer;
}

.poster-img {
  transition: transform 0.35s ease;
}

.poster-wrapper:hover .poster-img {
  transform: scale(1.07);
}

/* Lớp mờ */
.poster-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.poster-wrapper:hover .poster-overlay {
  opacity: 1;
}

/* Nút xem ngay */
.poster-play-btn {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 28px;
  font-weight: 700;
  color: white;
  text-shadow: 0 0 8px rgba(0,0,0,0.5);

  opacity: 0;
  transition: opacity 0.3s ease;
}

.poster-wrapper:hover .poster-play-btn {
  opacity: 1;
}

/* 📱 MOBILE: nút luôn hiển thị */
@media (max-width: 768px) {
  .poster-play-btn {
    opacity: 1 !important;
    font-size: 22px;
  }
  .poster-overlay {
    opacity: 1 !important;
  }
}
.text-left{
  font-size: 14px;
}
.poster-content {
  position: absolute;
  bottom: 40px;
  left: 40px;
  z-index: 10;
  color: white;
}

.xem-ngay-btn {
  font-size: 20px;
  font-weight: 600;
  padding: 10px 26px;
  border-radius: 12px;
}

/* Mobile chỉnh lại vị trí nút */
@media (max-width: 768px) {
  .poster-content {
    bottom: 20px;
    left: 20px;
  }

  .xem-ngay-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
