<template>
  <v-container class="search-page" fluid>
    <v-parallax :src="getOptimizedImage(movie.poster_url)">
      <v-container class="fill-height">
        <v-row class="justify-center align-center text-center">
          <v-col cols="12" md="8">
            <h1 class="text-h2 text-white mb-4">{{ movie.title }}</h1>
            <h3 class="text-h5 text-grey-lighten-2 mb-6">
              {{ movie.name }}
            </h3>

            <v-btn color="primary" class="mr-3">Xem ngay</v-btn>
            <v-btn color="red">Chia sẻ</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-parallax>

    <!-- ========================= -->
    <!--  PHẦN 2: 2 CỘT (VIDEO + INFO/TRAILER) -->
    <!-- ========================= -->
    <v-row class="mt-6">

      <!-- CỘT TRÁI: VIDEO -->
      <v-col cols="12" md="7">
        <v-card color="black" flat>
          <iframe
            v-if="currentEpisode"
            width="100%"
            height="420"
            :src="currentEpisode.video_url"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </v-card>
      </v-col>

      <!-- CỘT PHẢI: TRAILER + INFO PHIM -->
      <v-col cols="12" md="5">

        <!-- TRAILER -->
        <v-card color="grey-darken-4" flat class="mb-4 pa-4">
          <h3 class="text-white mb-2">Trailer</h3>

          <div class="trailer-thumb" @click="dialogTrailer = true">
            <img
              :src="getOptimizedImage(movie.poster_url)"
              class="rounded-lg"
            />
            <div class="trailer-overlay"></div>
            <div class="trailer-play">
              ▶
            </div>
          </div>
        </v-card>

        <!-- THÔNG TIN PHIM -->
        <v-card color="grey-darken-4" flat class="pa-4">
          <h3 class="text-white mb-3">{{ movie.title }}</h3>

          <div class="text-white mb-2">
            <strong>Mô tả:</strong>
            <div v-html="movie.description"></div>
          </div>

          <p class="text-white"><strong>Diễn viên:</strong> {{ movie.actors.join(', ') }}</p>
          <p class="text-white"><strong>Đạo diễn:</strong> {{ movie.director.join(', ') }}</p>
          <p class="text-white"><strong>Thể loại:</strong> {{ movie.genre.name }}</p>

          <div class="d-flex align-center">
            <strong class="text-white mr-2">Đánh giá:</strong>
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
      // if (this.link == "") {
      //   return `${this.urlImage + encodeURIComponent(imagePath)}&w=384&q=100`;
      // } else {
        return `${
          this.urlImage1 +
          "https://phimimg.com/" +
          encodeURIComponent(imagePath)
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
@media (min-width: 956px) {
  .search-page {
    padding: 0 60px !important;
  }
  .video-wrapper {
    width: 100%;
    /* padding: 0 40px; */
    /* max-height: 800px; */
    aspect-ratio: 16 / 9;
    background: black;
    position: relative;
    overflow: hidden;
    border-radius: 12px;
  }
}


.video-wrapper iframe,
.video-wrapper video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.suggested-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 8px;
}

.text-wrap {
  white-space: normal !important;
  overflow-wrap: break-word;
}

.suggested-item:hover {
  background-color: #2e2e2e;
}

.movie-detail {
  padding: 12px 0;
}
a {
  color: #fff;
}
.custom-tabs .v-tab {
  color: white;
  background-color: transparent;
  border-radius: 8px;
  transition: all 0.3s;
}
.custom-tabs .v-tab.active-tab {
  color: #000;
  background-color: #f8b230;
  border-radius: 5px;
  font-weight: bold;
}

.movie-info p {
  margin-bottom: 8px;
}

.scroll-container {
  scroll-behavior: smooth;
  gap: 16px;
}

.movie-card-link {
  text-decoration: none;
  color: inherit;
  flex-shrink: 0;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.position-absolute {
  position: absolute;
}

.top-0 {
  top: 0;
}

.left-0 {
  left: 0;
}
.suggested-slide-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 10px;
  scroll-behavior: smooth;
}

.suggested-slide {
  display: flex;
  gap: 16px;
  transition: transform 0.3s ease-in-out;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.movie-card {
  flex: 0 0 auto;
  width: 200px;
  background-color: #2e2e2e;
  border-radius: 12px;
  overflow: hidden;
  scroll-snap-align: start;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.movie-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

.card-inner {
  position: relative;
}

.card-image-wrapper {
  position: relative;
  overflow: hidden;
  height: 300px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.movie-card:hover .card-image {
  transform: scale(1.05);
}

.card-hover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  text-align: center;
  padding: 8px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.movie-card:hover .card-hover-overlay {
  transform: translateY(0);
}

.card-title {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-info {
  padding: 12px;
  color: #ccc;
}

.episode-chip {
  display: inline-block;
  background-color: #ffd600;
  color: black;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 6px;
}

.origin {
  font-weight: bold;
  color: #fff;
}

.meta {
  font-size: 0.8rem;
  color: #aaa;
}

/* Nút điều hướng trái phải */
.nav-btn {
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  font-size: 24px;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 50%;
  user-select: none;
  transition: background-color 0.3s ease;
  z-index: 10;
  flex-shrink: 0;
}

.nav-btn:hover {
  background-color: rgba(0, 0, 0, 0.9);
}

.nav-btn.left {
  margin-right: 8px;
}

.nav-btn.right {
  margin-left: 8px;
}

.trailer-thumb {
  width: 222px;
  height: 125px;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
  transition: transform 0.25s ease;
}

/* Ảnh */
.trailer-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.35s ease;
}

/* overlay (mặc định trong suốt) */
.trailer-overlay {
  position: absolute;
  inset: 0; /* top:0;right:0;bottom:0;left:0; */
  background: rgba(0, 0, 0, 0);
  transition: background 0.25s ease;
  pointer-events: none; /* để click qua overlay */
}

/* nút play (ẩn mặc định) */
.trailer-play {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0.95);
  opacity: 0;
  transition: opacity 0.18s ease, transform 0.18s ease;
  pointer-events: none; /* cho phép click container */
  filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.6));
}

/* khi hover -> làm nổi ảnh, hiện overlay + play */
.trailer-thumb:hover img {
  transform: scale(1.03);
}

.trailer-thumb:hover .trailer-overlay {
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid yellow;
}

.trailer-thumb:hover .trailer-play {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.episode-list {
  display: flex;
  flex-wrap: wrap;
}
.episode-col {
  flex: 0 0 20% !important;  
  max-width: 20% !important; 
  padding: 4px;
}
.video-player {
  width: 100%;
  height: 100%;
  object-fit: cover; /* hoặc 'cover' nếu bạn muốn full */
  background-color: black;
  cursor: pointer;
}
.suggested-item {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: background-color 0.2s;
}
.suggested-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
.v-list-item {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
.custom-title {
  display: flex;
  flex-wrap: wrap;     
  gap: 8px;        
  white-space: normal; 
  width: 100%;
}

.title-text {
  white-space: normal; 
  word-break: break-word;
}

.chip-limit {
  max-width: 140px;  
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;   
}
</style>
