<template>
  <v-fade-transition appear>
    <div class="watch-page">
      <v-container class="search-page" fluid>
         <v-col cols="12" class="text-center" v-if="isLoading">
          <v-progress-circular indeterminate color="primary" size="50" />
        </v-col>
    <!--<div v-else-if="isLoadingData">
      <p style="text-align: center;">{{$t('Hết thời gian yêu cầu, vui lòng kiểm tra lại đường truyền internet')}}</p>
    </div> -->
        <div v-else>
          <!-- Breadcrumb -->
          <v-breadcrumbs :items="items">
            <template v-slot:divider>
              <v-icon icon="mdi-chevron-right"></v-icon>
            </template>
          </v-breadcrumbs>

          <!-- Bố cục hai cột -->
          <v-row dense>
            <!-- Cột bên trái: Video + nút + danh sách tập + info -->
            <v-col cols="12" md="9">
              <!-- VIDEO -->
              <div class="video-wrapper">
                <!-- Video chính -->
                <video
                  ref="videoPlayer"
                  class="video-player"
                  controls
                  playsinline
                  webkit-playsinline
                  preload="metadata"
                  muted
                  :poster="movie.thumb_url || ''"
                  @click="playVideoOnClick"
                ></video>
                
                <!-- Play overlay khi chưa click -->
                <div v-if="!videoStarted && $vuetify.display.mdAndUp" class="video-play-overlay" @click="playVideoOnClick">
                  <v-icon size="x-large" color="white">mdi-play-circle</v-icon>
                  <p class="overlay-text">{{ $t('Click để xem phim') }}</p>
                </div>
              </div>

              <!-- nut next tap và back tap -->
              <div
                class="d-flex justify-center align-center my-3"
                style="gap: 12px"
              >
                <v-btn
                  color="grey-darken-2"
                  @click="prevEpisode()"
                  :disabled="currentEpisodeIndex >= movie.pageMovie.length - 1"
                >
                  <v-icon start>mdi-chevron-left</v-icon>
                  {{ $t("Tập trước") }}
                </v-btn>

                <v-chip color="blue-darken-2" text-color="white">
                  {{ movie.pageMovie[currentEpisodeIndex]?.name }}
                </v-chip>

                <v-btn
                  color="grey-darken-2"
                  @click="nextEpisode()"
                  :disabled="currentEpisodeIndex <= 0"
                >
                  {{ $t("Tập tiếp") }}
                  <v-icon end>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
              <v-card
                class="my-4"
                variant="flat"
                color="grey-darken-4"
                theme="dark"
              >
                <v-card-title class="d-flex align-center custom-title">
                  <span class="text-h6 title-text"
                    >{{ movie.title }}
                    <v-chip
                      class="ml-2 chip-limit"
                      color="red"
                      text-color="white"
                      >{{ movie.pageMovie[currentEpisodeIndex]?.name }}</v-chip
                    >
                  </span>
                </v-card-title>
              </v-card>
              <!-- Nhóm nút + server -->
              <div
                class="d-flex align-center justify-space-between flex-wrap px-4 py-2 function-buttons-wrapper"
                style="background-color: #1a1a1a; gap: 16px"
              >
                <!-- Nút chức năng -->
                <div class="d-flex align-center flex-wrap function-buttons" style="gap: 8px; flex-wrap: wrap">
                  <v-btn variant="text" @click="getTrailer()" class="function-btn">
                    <v-icon start icon="mdi-youtube" />
                    <span class="btn-text-short">Trailer</span>
                  </v-btn>
                  <v-btn variant="text" @click="shareMovie" class="function-btn"
                    ><v-icon start icon="mdi-share-variant" /><span class="btn-text-short">{{
                      $t("Chia sẻ")
                    }}</span></v-btn
                  >
                  <v-btn variant="text" @click="ResponseError" class="function-btn"
                    ><v-icon start icon="mdi-flag" /><span class="btn-text-short">{{ $t("Báo lỗi") }}</span></v-btn
                  >
                  <v-btn variant="text" @click="handleFavorite" class="function-btn"
                    ><v-icon
                      start
                      :icon="liked ? 'mdi-bookmark' : 'mdi-bookmark-outline'"
                    /><span class="btn-text-short">{{ $t("Xem sau") }}</span></v-btn
                  >
                </div>

                <!-- Server -->

                <div
                  class="d-flex align-center server-tabs-wrapper"
                  style="gap: 8px; overflow-x: auto; flex-wrap: nowrap"
                >
                  <router-link :to="movie.LinkDown" download target="_blank">
                    <v-btn class="ma-2" icon="mdi-cloud-download"></v-btn>
                  </router-link>
                  <v-tabs
                    v-model="tabserver"
                    class="custom-tabs flex-shrink-0"
                    background-color="transparent"
                  >
                    <v-tab
                      v-for="(server, index) in movie.servers"
                      :key="index"
                      @click="switchServer(server)"
                      :class="{ 'active-tab': tabserver === index }"
                      size="small"
                    >
                      {{ server.server_name || `Server ${index + 1}` }}
                    </v-tab>
                  </v-tabs>
                </div>
              </div>

              <!-- Danh sách tập -->
              <v-card
                class="my-4"
                variant="flat"
                color="grey-darken-4"
                theme="dark"
                v-if="$vuetify.display.smAndDown"
              >
                <v-card-title class="d-flex align-center custom-title">
                  <span class="text-h6 title-text"
                    >{{ movie.title }}
                    <v-chip
                      class="ml-2 chip-limit"
                      color="red"
                      text-color="white"
                      >{{ movie.pageMovie[currentEpisodeIndex]?.name }}</v-chip
                    >
                  </span>
                </v-card-title>
                <v-card-text>
                  <v-sheet class="episode-list mt-4" elevation="0">
                  <v-row dense class="episode-row">
                    <v-col
                      v-for="(episode, index) in visibleEpisodes"
                      :key="index"
                      cols="4"
                      sm="6"
                      md="4"
                      class="episode-col-responsive"
                    >
                        <v-btn
                          block
                          size="small"
                          @click="playEpisode(episode)"
                          :color="
                            index === currentEpisodeIndex
                              ? 'red'
                              : 'grey-darken-2'
                            "
                          class="episode-item-btn"
                        >
                          {{
                            episode.name
                              ? episode.name.includes("Tập")
                                ? episode.name
                                : $t("Tập ") + episode.name
                              : "Trailer"
                          }}
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-sheet>

                  <div class="text-center mt-4">
                    <v-btn
                      color="gray"
                      variant="tonal"
                      @click="toggleEpisodes"
                      class="btnnext"
                    >
                      {{ showAllEpisodes ? "Thu gọn " : "Xem thêm" }}
                      <v-icon size="18" class="mr-1">
                        {{
                          showAllEpisodes
                            ? "mdi-chevron-up"
                            : "mdi-chevron-down"
                        }}
                      </v-icon>
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>

              

              <!-- Thông tin phim -->
              <v-card
                class="pa-6 text-left"
                color="grey-darken-4"
                variant="flat"
                rounded="lg"
                theme="dark"
              >
                <v-card-title class="text-white mb-4"
                  >{{ movie.title }} ( {{ movie.name }})</v-card-title
                >
                <v-card-text class="text-white">
                  <div v-html="movie.description"></div>
                </v-card-text>
                <v-card-text class="text-white">
                  <p>
                    <strong>{{ $t("Diễn viên") }}:</strong>
                    {{ movie.actors.join(", ") }}
                  </p>
                  <p>
                    <strong>{{ $t("Đạo diễn") }}:</strong>
                    {{ movie.director.join(", ") }}
                  </p>
                  <p>
                    <strong>{{ $t("Thể loại") }}:</strong>
                    {{ movie.genre.name }}
                  </p>
                  <div class="d-flex align-center">
                    <strong class="mr-2">{{ $t("Đánh giá") }}:</strong>
                    <v-rating
                      readonly
                      :length="5"
                      :size="28"
                      :model-value="movie.rating"
                      active-color="yellow-darken-2"
                    />
                  </div>
                </v-card-text>
              </v-card>
              <!-- TRAILER -->
              <div class="mb-4">
                <v-row>
                  <v-col cols="12" sm="6" md="3">
                    <h3 class="text-white mb-2">TRAILER</h3>

                    <!-- Thumb container -->
                    <div
                      class="trailer-thumb"
                      @click="dialogTrailer = true"
                      role="button"
                      aria-label="Play trailer"
                    >
                      <img
                        :src="`https://img.youtube.com/vi/${movie.trailer_id}/mqdefault.jpg`"
                        :alt="`Trailer ${movie.name}`"
                        loading="lazy"
                      />

                      <!-- dark overlay khi hover -->
                      <div class="trailer-overlay" />

                      <!-- nút Play (SVG) ở giữa -->
                      <div class="trailer-play" aria-hidden="true">
                        <svg
                          width="64"
                          height="64"
                          viewBox="0 0 64 64"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <!-- nền tròn tối để làm nổi tam giác -->
                          <circle
                            cx="32"
                            cy="32"
                            r="30"
                            fill="rgba(0,0,0,0.55)"
                          />
                          <!-- tam giác play màu trắng -->
                          <path d="M26 20 L46 32 L26 44 Z" fill="#fff" />
                        </svg>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="6" md="6" class="d-flex align-center">
                    <p class="text-grey-lighten-1">
                      {{ movie.title }} - {{ $t("Xem trailer chính thức") }}
                    </p>
                  </v-col>
                </v-row>
              </div>

              <!-- Dialog trailer -->
              <v-dialog v-model="dialogTrailer" max-width="900px" persistent>
                <v-card class="bg-black relative">
                  <!-- Nút đóng -->
                  <v-btn
                    icon="mdi-close"
                    class="absolute top-2 right-2 z-10"
                    variant="text"
                    @click="dialogTrailer = false"
                  ></v-btn>

                  <!-- Video -->
                  <iframe
                    width="100%"
                    height="600"
                    :src="`https://www.youtube.com/embed/${movie.trailer_id}?autoplay=1`"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    loading="lazy"
                  >
                  </iframe>

                  <!-- <iframe
      width="100%"
      height="500"
      :src="movie.trailer_url"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe> -->
                </v-card>
              </v-dialog>
              <div ref="lazyComment"></div>
              <!-- Bình luận -->
              <v-card
                flat
                color="#1e1e1e"
                class="pa-6 rounded-xl elevation-2 mt-6"
              >
                <h2 class="text-white mb-6 text-h5 font-weight-bold">
                  🗨️ {{ $t("Bình luận") }}
                </h2>
                <div
                  v-if="
                    idAccount == '' ||
                    idAccount == null ||
                    idAccount == undefined
                  "
                >
                  <v-btn
                    color="primary"
                    variant="tonal"
                    @click="Login"
                    class="btnnext"
                  >
                    <v-icon icon="mdi-play" />
                    {{$t('Đăng nhập để bình luận')}}
                  </v-btn>
                </div>
                <v-text-field
                  v-else
                  v-model="newComment"
                  :placeholder="$t('Thêm bình luận...')"
                  variant="outlined"
                  color="blue"
                  class="rounded-xl mb-4"
                  density="comfortable"
                  hide-details
                  append-inner-icon="mdi-send"
                  @click:append-inner="addComments"
                  :rules="[(v) => !!v || $t('Bình luận không được để trống')]"
                ></v-text-field>
                <v-divider class="mb-4" color="grey darken-3"></v-divider>
                <div v-if="comments.length <= 0" class="mb-5 text-center">
                  {{$t('Chưa có bình luận nào. Hãy là người đầu tiên!')}}
                </div>
                <div
                  v-else
                  v-for="(comment, index) in comments"
                  :key="index"
                  class="d-flex align-start mb-5"
                >
                  <v-avatar size="44" class="me-3" color="blue-grey-darken-3">
                    <v-icon color="white">mdi-account</v-icon>
                  </v-avatar>
                  <div class="flex-grow-1">
                    <div class="d-flex align-center mb-1">
                      <span
                        class="text-blue-lighten-3 font-weight-medium me-2"
                        >{{ comment.NameCreate }}</span
                      >
                      <v-chip
                        size="x-small"
                        color="grey-darken-4"
                        text-color="grey-lighten-1"
                        variant="flat"
                      >
                        {{ timeAgo(comment.DayCreate) }}
                      </v-chip>
                    </div>
                    <div class="d-flex text-white text-body-2 align-start">
                      {{ comment.Comments }}
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" md="3" class="right-panel" v-if="$vuetify.display.smAndUp">
              <!-- THÔNG TIN PHIM -->
              <v-card
                color="grey-darken-4"
                variant="flat"
                rounded="lg"
                class="mb-4"
                theme="dark"
              >
                <v-card-title class="text-h5" style="font-weight: bold; color: #42dfff;">
                  {{ movie.name }}
                  
                </v-card-title>
                <v-tooltip
                    activator="parent"
                    location="top"
                  >{{ movie.name }}
                  </v-tooltip>
              </v-card>

              <!-- DANH SÁCH TẬP -->
              <v-card
                color="grey-darken-4"
                variant="flat"
                rounded="lg"
                theme="dark"
                
              >
                <v-card-title :class="$vuetify.display.smAndDown ? 'text-body-2' : 'text-h6'"> {{$t('Danh sách tập')}} </v-card-title>

                <v-card-text>
                  <v-sheet class="episode-list mt-4" elevation="0">
                  <v-row dense>
                    <v-col
                      v-for="(episode, index) in visibleEpisodesRight"
                      :key="index"
                      cols="6"
                    >
                      <v-btn
                        block
                        :size="$vuetify.display.smAndDown ? 'small' : 'default'"
                        :color="
                          index === currentEpisodeIndex
                            ? 'red'
                            : 'grey-darken-2'
                        "
                        @click="playEpisode(episode)"
                      >
                        {{ episode.name || "Trailer" }}
                      </v-btn>
                    </v-col>
                  </v-row>
                  </v-sheet>
                </v-card-text>
              </v-card>
            </v-col>
            
            <div ref="lazyCate"></div>

            <!-- Gợi ý phim - Responsive Scroll Layout -->
            <v-col cols="12">
              <div class="suggested-movies my-8">
                <h2 class="text-h5 mb-4">🎬 {{ $t("Phim được đề xuất") }}</h2>
                
                <!-- Scroll container -->
                <div class="suggested-scroll-wrapper">
                  <!-- Left nav button -->
                  <button 
                    class="suggested-nav-btn suggested-nav-left"
                    @click="scrollSuggestedLeft"
                    aria-label="Scroll left"
                  >
                    <v-icon>mdi-chevron-left</v-icon>
                  </button>

                  <!-- Scrollable content -->
                  <div ref="suggestedScrollContainer" class="suggested-content-scroll">
                    <router-link
                      v-for="suggested in suggestedMovies"
                      :key="suggested._id"
                      :to="{ name: 'Movies', params: { slug: suggested.slug } }"
                      class="suggested-movie-card"
                    >
                      <div class="suggested-card-wrapper">
                        <!-- Poster Image -->
                        <div class="suggested-poster">
                          <img
                            :src="getOptimizedImage(suggested.poster_url)"
                            :alt="suggested.name"
                            loading="lazy"
                            class="suggested-poster-img"
                          />
                          <!-- Hover overlay -->
                          <div class="suggested-overlay">
                            <div class="suggested-play-icon">
                              <v-icon size="48">mdi-play-circle</v-icon>
                            </div>
                          </div>
                        </div>

                        <!-- Card info -->
                        <div class="suggested-info">
                          <div class="suggested-title">{{ suggested.name }}</div>
                          <div class="suggested-meta">
                            <span class="suggested-episode">{{ suggested.episode_current }}</span>
                            <span class="suggested-lang">{{ suggested.lang }}</span>
                          </div>
                          <div class="suggested-category">
                            {{ suggested.category[0]?.name }} • {{ suggested.year }}
                          </div>
                        </div>
                      </div>
                    </router-link>
                  </div>

                  <!-- Right nav button -->
                  <button 
                    class="suggested-nav-btn suggested-nav-right"
                    @click="scrollSuggestedRight"
                    aria-label="Scroll right"
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </button>
                </div>
              </div>
            </v-col>
          </v-row>

          <!-- dialog share -->
          <v-dialog v-model="shareDialog" max-width="500">
            <v-card
              class="pa-4"
              style="background-color: #1e1e1e; color: white"
            >
              <v-card-title class="text-h6 justify-center">{{
                $t("Chia sẻ")
              }}</v-card-title>

              <v-row class="justify-center mt-4" dense>
                <v-col cols="3" class="text-center">
                  <v-btn
                    icon
                    size="large"
                    @click="shareTo('facebook')"
                    class="bg-grey-darken-4"
                  >
                    <v-icon icon="mdi-facebook" />
                  </v-btn>
                  <div class="mt-1 text-caption">Facebook</div>
                </v-col>

                <v-col cols="3" class="text-center">
                  <v-btn
                    icon
                    size="large"
                    @click="shareTo('youtube')"
                    class="bg-grey-darken-4"
                  >
                    <v-icon icon="mdi-youtube" />
                  </v-btn>
                  <div class="mt-1 text-caption">YouTube</div>
                </v-col>

                <v-col cols="3" class="text-center">
                  <v-btn
                    icon
                    size="large"
                    @click="copyLink"
                    class="bg-grey-darken-4"
                  >
                    <v-icon icon="mdi-link-variant" />
                  </v-btn>
                  <div class="mt-1 text-caption">Copy link</div>
                </v-col>

                <v-col cols="3" class="text-center">
                  <v-btn
                    icon
                    size="large"
                    @click="shareTo('twitter')"
                    class="bg-grey-darken-4"
                  >
                    <v-icon icon="mdi-twitter" />
                  </v-btn>
                  <div class="mt-1 text-caption">Twitter</div>
                </v-col>
              </v-row>

              <v-card
                class="mt-4 px-3 py-2 d-flex align-center"
                style="background-color: #2a2a2a; border-radius: 8px"
              >
                <span
                  class="text-truncate"
                  style="color: #facc15; max-width: 100%"
                >
                  {{ shareUrl }}
                </span>
                <v-spacer />
                <v-btn icon @click="copyLink" size="small">
                  <v-icon icon="mdi-content-copy" />
                </v-btn>
              </v-card>

              <v-btn
                icon
                class="position-absolute"
                style="top: 8px; right: 8px"
                @click="shareDialog = false"
              >
                <v-icon icon="mdi-close" />
              </v-btn>
            </v-card>
          </v-dialog>
          <!-- Snackbar -->
          <v-snackbar v-model="mess" :timeout="3000" :color="color">
            {{ Message }}
          </v-snackbar>
        </div>
      </v-container>
    </div>
  </v-fade-transition>
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
  PostMoviesFavorite,
  CheckSession,
} from "@/model/api";
//import {  toggleFavorite } from "@/utils/favorite";
import Hls from "hls.js";
export default {
  name: "MovieDetail",
  data() {
    return {
      // phat trailler
      playTrailerFirst: false,
      trailerSkipped: false,
      trailerPlayable: false,
      mainVideoUrl: "",
      videoStarted: false,

      hasLoadedCate: false,
      hasLoadedComment: false,
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
      movieFavorite: {
        IDAccount: "",
        IDMovies: "",
        slug: "",
        currentPage: "",
        UrlMovies: "",
        origin_name: "",
        name: "",
        year: "",
        lang: "",
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
      videoKey: "",
      saveTimeInterval: null,
    };
  },
  props: ["slug", "page"],
  beforeUnmount() {
    // Lưu thời gian xem trước khi rời khỏi
    this.saveWatchTime();
    
    // Dừng save interval
    if (this.saveTimeInterval) {
      clearInterval(this.saveTimeInterval);
    }

    // Hủy video HTML5
    if (this.$refs.videoPlayer) {
      this.$refs.videoPlayer.pause();
      this.$refs.videoPlayer.src = "";
      this.$refs.videoPlayer.load();
    }

    // Hủy iframe
    if (this.$refs.videoIframe) {
      this.$refs.videoIframe.src = "";
    }

    // Hủy HLS nếu có
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
  },
  watch: {
    async slug(newSlug) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      await this.MoveInfor1(newSlug);
      if (this.page) {
        console.log(this.page);
        if (this.page == "01") {
          this.currentEpisodeIndex = this.movie.pageMovie.length - 1;
        } else {
          this.currentEpisodeIndex = this.movie.pageMovie.findIndex(
            (ep) => ep.name.replace("Tập ", "tap") === this.page
          );
        }
      }
      if (this.currentEpisodeIndex == -1) {
        var page = this.page.replace("tap", "");
        if (this.page == "01") {
          this.currentEpisodeIndex = this.movie.pageMovie.length - 1;
        } else {
          this.currentEpisodeIndex = this.movie.pageMovie.findIndex(
            (ep) => ep.name.replace("Tập ", "tap") === page
          );
        }
      }
      if (this.currentEpisodeIndex == -1) {
        this.currentEpisodeIndex = this.movie.pageMovie.findIndex((ep) => {
            const epNumber = parseInt(
              (ep.name.toString().match(/\d+/) || [])[0],
              10
            );
            return epNumber === page;
          });
      }
      this.movie.title =
        this.movie.pageMovie[this.currentEpisodeIndex]?.filename;
      const epName = this.movie.pageMovie[this.currentEpisodeIndex]?.name;
      this.movie.videoUrl =
        this.movie.pageMovie[this.currentEpisodeIndex]?.link_m3u8;

      this.setupVideo(this.movie.videoUrl);
      console.log(this.currentEpisodeIndex);
      if (epName) {
        const normalized = epName.replace("Tập ", "tap");

        this.$router.replace({
          name: "MovieDetail",
          params: { slug: newSlug },
          query: { page: normalized },
        });
      }
      // Load thời gian xem cho film mới
      this.$nextTick(() => {
        this.loadWatchTime();
      });
      // await this.ListMovieByCate();
      // await this.GetComment();
    },
  },
  async mounted() {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // this.$store.dispatch('loading/stopLoading')
      await this.MoveInfor1(this.slug);
      // this.$store.dispatch('loading/stopLoading')
      if (this.page) {
        if (this.page == "01") {
          this.currentEpisodeIndex = this.movie.pageMovie.length - 1;
        } else {
          this.currentEpisodeIndex = this.movie.pageMovie.findIndex(
            (ep) => ep.name.replace("Tập ", "tap") === this.page
          );
        }
      }
      if (this.currentEpisodeIndex == -1) {
        var page = this.page.replace("tap", "");
        if (this.page == "01") {
          this.currentEpisodeIndex = this.movie.pageMovie.length - 1;
        } else {
          this.currentEpisodeIndex = this.movie.pageMovie.findIndex(
            (ep) => ep.name.replace("Tập ", "tap") === page
          );
        }
      }
      if (this.currentEpisodeIndex == -1) {
        this.currentEpisodeIndex = this.movie.pageMovie.findIndex((ep) => {
            const epNumber = parseInt(
              (ep.name.toString().match(/\d+/) || [])[0],
              10
            );
            return epNumber === page;
          });
      }
      this.movie.title =
        this.movie.pageMovie[this.currentEpisodeIndex]?.filename;

      const epName = this.movie.pageMovie[this.currentEpisodeIndex]?.name;
      this.movie.videoUrl =
        this.movie.pageMovie[this.currentEpisodeIndex]?.link_m3u8;
      this.videoKey = `movie_${this.slug}_${this.page || "01"}`;

      // Không setup video khi vào page - chỉ setup khi user click play
      this.isTrailer = false;

      //this.playVideo(this.movie.videoUrl);

      //this.bindVideoEvents();
      console.log(this.currentEpisodeIndex);
      if (epName) {
        const normalized = epName.replace("Tập ", "tap");

        // Cập nhật URL
        this.$router.replace({
          name: "MovieDetail",
          params: { slug: this.slug },
          query: { page: normalized },
        });
      }
      this.initLazyLoad();
      
      // Load thời gian xem từ localStorage
      this.$nextTick(() => {
        this.loadWatchTime();
      });
      
      // Bắt đầu save thời gian xem mỗi 5 giây
      if (this.saveTimeInterval) {
        clearInterval(this.saveTimeInterval);
      }
      this.saveTimeInterval = setInterval(() => {
        this.saveWatchTime();
      }, 5000);
      
      // await this.ListMovieByCate();
      // await this.GetComment();
    } catch (err) {
      console.log(err);
    }finally {
      this.$store.dispatch('loading/stopLoading')
    }
  },
  methods: {
    // Lưu thời gian xem vào localStorage
    saveWatchTime() {
      const video = this.$refs.videoPlayer;
      if (!video || !this.movie.idMovie) return;
      
      const currentTime = video.currentTime;
      const duration = video.duration;
      
      // Chỉ lưu nếu video đã tải được
      if (isFinite(currentTime) && isFinite(duration) && duration > 0) {
        const watchData = {
          movieId: this.movie.idMovie,
          slug: this.movie.slug,
          episode: this.movie.pageMovie[this.currentEpisodeIndex]?.name,
          currentTime: currentTime,
          duration: duration,
          timestamp: Date.now()
        };
        
        // Lưu vào localStorage với key duy nhất
        localStorage.setItem('webphim_watchtime', JSON.stringify(watchData));
      }
    },
    
    // Load thời gian xem từ localStorage
    loadWatchTime() {
      const video = this.$refs.videoPlayer;
      if (!video || !this.movie.idMovie) return;
      
      try {
        const watchData = localStorage.getItem('webphim_watchtime');
        if (watchData) {
          const data = JSON.parse(watchData);
          
          // Chỉ load nếu là cùng film và cùng tập
          if (data.movieId === this.movie.idMovie && 
              data.episode === this.movie.pageMovie[this.currentEpisodeIndex]?.name) {
            
            // Đợi video loadedmetadata để set currentTime
            const setTime = () => {
              if (isFinite(data.currentTime) && data.currentTime > 0) {
                video.currentTime = data.currentTime;
                console.log(`Đã khôi phục thời gian xem: ${Math.floor(data.currentTime)} giây`);
              }
              video.removeEventListener('loadedmetadata', setTime);
            };
            
            video.addEventListener('loadedmetadata', setTime);
          }
        }
      } catch (error) {
        console.error('Lỗi load thời gian xem:', error);
      }
    },

    extractYoutubeId(url) {
      const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/
      );
      return match ? match[1] : null;
    },

    resetPlayer() {
      const video = this.$refs.videoPlayer;
      const iframe = this.$refs.videoIframe;

      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.style.display = "block";
      }

      if (iframe) {
        iframe.src = "";
        iframe.style.display = "none";
      }

      if (this.hls) {
        this.hls.destroy();
        this.hls = null;
      }
    },
    timeAgo(timestamp) {
      const time = new Date(timestamp).getTime();
      const now = Date.now();

      if (time > now) {
        return "Vừa xong";
      }
      const diff = now - time;
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return "Vừa xong";
      if (minutes < 60) return `${minutes} phút trước`;

      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} giờ trước`;
      const days = Math.floor(hours / 24);
      return `${days} ngày trước`;
    },
    // Call API
    MoveInfor(slug) {
      return new Promise((resolve, reject) => {
        MoveInfor(
          slug,
          (result) => {
            console.log(result);
            if (result.status == true || result.status == "success") {
              this.link = "";
              this.movie.page = result.movie.episode_current;
              this.movie.idMovie = result.movie._id;
              this.movie.title = result.movie.name;
              this.movie.description = result.movie.content;
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

              // SEO TITLE
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

              document.title = result.movie.name || "Phim hay";
              removeOldMeta("og:title", "property");
              setMeta("og:title", result.movie.name, "property");

              // END SEO
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
              this.movie.page = result.movie.episode_current;
              this.movie.idMovie = result.movie._id;
              this.movie.title = result.movie.name;
              this.movie.description = result.movie.content;
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

              // SEO TITLE
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
              document.title = result.movie.name || "Phim hay";
              removeOldMeta("og:title", "property");
              setMeta("og:title", result.movie.name, "property");
              // end SEO
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
    initLazyLoad() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(async (entry) => {
            if (!entry.isIntersecting) return;

            if (entry.target === this.$refs.lazyCate && !this.hasLoadedCate) {
              this.hasLoadedCate = true;
              await this.ListMovieByCate();
            }

            if (
              entry.target === this.$refs.lazyComment &&
              !this.hasLoadedComment
            ) {
              this.hasLoadedComment = true;
              await this.GetComment();
            }
          });
        },
        { threshold: 0.2 }
      );

      if (this.$refs.lazyCate) observer.observe(this.$refs.lazyCate);
      if (this.$refs.lazyComment) observer.observe(this.$refs.lazyComment);
    },

    // bindVideoEvents() {
    //   const video = this.$refs.videoPlayer;
    //   if (!video) return;

    //   // khi video load xong metadata → mới set currentTime
    //   video.addEventListener("loadedmetadata", this.restoreTime);

    //   // lưu vị trí xem
    //   video.addEventListener("timeupdate", this.saveTime);
    // },
    saveTime() {
      const video = this.$refs.videoPlayer;
      if (!video) return;

      const current = Math.floor(video.currentTime);

      if (!this.lastSavedTime || current - this.lastSavedTime >= 5) {
        localStorage.setItem(this.videoKey, current);
        this.lastSavedTime = current;
      }
    },

    restoreTime() {
      const video = this.$refs.videoPlayer;
      const savedTime = localStorage.getItem(this.videoKey);

      if (video && savedTime) {
        video.currentTime = parseFloat(savedTime);
      }
    },
    toggleEpisodes() {
      this.showAllEpisodes = !this.showAllEpisodes;
    },
    setupVideo(url) {
      const video = this.$refs.videoPlayer;
      if (!video || !url) return;

      if (this.hls) {
        this.hls.destroy();
        this.hls = null;
      }

      if (Hls.isSupported() && url.endsWith(".m3u8")) {
        this.hls = new Hls();
        this.hls.loadSource(url);
        this.hls.attachMedia(video);
      } else {
        video.src = url;
      }
    },
    playVideo(url) {
      // Setup video source nếu cần
      if (url) {
        this.setupVideo(url);
      }

      const video = this.$refs.videoPlayer;
      if (!video) return;

      // Nếu là lần đầu click hoặc chuyển tập thì unmute
      

      video.play().catch(() => {
        video.play();
      });
    },
    playVideoOnClick() {
      if (!this.videoStarted) {
        // Setup video data khi user click play (lazy loading)
        if (this.movie.videoUrl && !this.hlsInstance) {
          this.setupVideo(this.movie.videoUrl);
        }

        this.videoStarted = true;
        const video = this.$refs.videoPlayer;
        if (video) {
          video.muted = false;
          video.play().catch(() => {
            video.play();
          });
        }
      }
    },
    DownloadVideo(linkdown) {
      window.open(linkdown);
    },
    handleFavorite() {
      this.liked = !this.liked;
      this.movieFavorite.IDAccount = this.idAccount;
      this.movieFavorite.IDMovies = this.movie.idMovie;
      this.movieFavorite.slug = this.movie.slug;
      this.movieFavorite.currentPage = this.movie.page;
      this.movieFavorite.UrlMovies = this.movie.thumb_url;
      this.movieFavorite.origin_name = this.movie.origin_name;
      this.movieFavorite.name = this.movie.name;
      this.movieFavorite.year = this.movie.year;
      this.movieFavorite.lang = this.movie.lang;

      if (
        this.idAccount == "" ||
        this.idAccount == null ||
        this.idAccount == undefined
      ) {
        alert("Bạn vui lòng đăng nhập");
        this.$router.push("/login");
        return;
      }
      const token = localStorage.getItem("token");
      if (token) {
        CheckSession(
          (dat) => {
            if (dat.data.status == "success") {
              this.$store.commit("setEmpInfor", dat.data.data);
              this.$store.commit("setAvatar", dat.data.data.Avatar);
              PostMoviesFavorite(
                this.movieFavorite,
                (dat) => {
                  if (dat.data.status == "success") {
                    alert("🎬 " + dat.data.message);
                  } else {
                    alert(dat.data.message);
                  }
                },
                (err) => {
                  alert(err);
                }
              );
            } else {
              alert(dat.data.message);
              this.$router.push({
                path: "/login",
                query: { redirect: this.$route.fullPath },
              });
            }
          },
          (err) => {
            alert(err);
          }
        );
      }
      else{
        alert(this.$t("Vui lòng đăng nhập để sử dụng chức năng này"))
        this.$router.push({
                path: "/login",
                query: { redirect: this.$route.fullPath },
              });
      }
    },

    getOptimizedImage(imagePath) {
      // if (this.link == "") {
      //   return `${this.urlImage + encodeURIComponent(imagePath)}&w=384&q=100`;
      // } else {
      return `${
        this.urlImage1 + "https://phimimg.com/" + encodeURIComponent(imagePath)
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
    
    scrollSuggestedLeft() {
      const container = this.$refs.suggestedScrollContainer;
      if (container) {
        container.scrollBy({ 
          left: -280, 
          behavior: "smooth" 
        });
      }
    },
    
    scrollSuggestedRight() {
      const container = this.$refs.suggestedScrollContainer;
      if (container) {
        container.scrollBy({ 
          left: 280, 
          behavior: "smooth" 
        });
      }
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
    Login() {
      this.$router.push("/login");
    },
    addComments() {
      var account = this.idAccount;
      var data = {
        IDAccount: account,
        IDMovies: this.movie.idMovie,
        NameCreate: localStorage.getItem("nameShow") || "",
        Comments: this.newComment,
        NameMovie: this.movie.name,
        CurrentPage: this.movie.page,
      };
      if (account == null || account == "" || account == undefined) {
        alert("Bạn vui lòng đăng nhập");
        this.$router.push("/login");
      }
      if (this.newComment.trim()) {
        CheckSession(
          (dat) => {
            if (dat.data.status == "success") {
              this.$store.commit("setEmpInfor", dat.data.data);
              this.$store.commit("setAvatar", dat.data.data.Avatar);
              AddComment(
                data,
                (data) => {
                  if (dat.data.status == "success") {
                    this.Message = data.data.message;
                    this.color = "success";
                    this.mess = true;
                    this.GetComment();
                  }
                },
                (err) => {
                  this.Message = err.data.message;
                  this.color = "error";
                  this.mess = true;
                }
              );
            } else {
              alert(dat.data.message);
              this.$router.push({
                path: "/login",
                query: { redirect: this.$route.fullPath },
              });
            }
          },
          (err) => {
            alert(err);
          }
        );

        this.newComment = "";
      }
    },
    GetComment() {
      var movie = {
        idMovies: this.movie.idMovie,
        page: 1,
      };
      GetComments(
        movie,
        (res) => {
          console.log(res);
          if (res.data.status == "success") {
            this.comments = res.data.data;
          } else {
            console.log(res.data.message);
          }
        },
        (err) => {
          console.error("Lỗi lấy bình luận:", err);
        }
      );
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
      try {
        console.log(episode);
        this.currentEpisode = episode;
        this.isLoading = true;
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (
          episode.filename != undefined ||
          episode.filename != null ||
          episode.filename != ""
        ) {
          this.movie.title = episode.filename;
        }
        this.movie.videoUrl = episode.link_embed;
        this.movie.LinkDown = episode.link_m3u8;
        const idx = this.movie.pageMovie.findIndex(
          (ep) => ep.name === episode.name
        );
        if (idx !== -1) {
          this.currentEpisodeIndex = idx;
        }
        // this.currentEpisodeIndex = parseInt(episode.name.split('Tập')[1].trim(),10)-1
        this.movie.page = episode.name;

        const normalized = episode.name.replace("Tập ", "tap").trim();
        this.$router.replace({
          name: "MovieDetail",
          params: { slug: this.slug },
          query: { page: normalized },
        });

        if (this.videoKey) {
          localStorage.removeItem(this.videoKey);
        }

        // cập nhật tập mới
        this.currentEpisodeIndex = this.movie.pageMovie.findIndex(
          (e) => e.name === episode.name
        );

        // tạo key mới cho tập mới
        this.videoKey = `movie_${this.slug}_${this.page}`;

        // Setup video và play tập mới (auto-play với unmute)
        this.movie.videoUrl = episode.link_m3u8;
        this.setupVideo(this.movie.videoUrl);
        this.videoStarted = true;
        this.$nextTick(() => {
          const video = this.$refs.videoPlayer;
          if (video) {
            video.muted = false;
            video.play().catch(() => {
              video.play();
            });
          }
        });

        this.GetComment();
        this.isLoading = false;
      } catch {
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
        this.movie.videoUrl =
          server.server_data[server.server_data.length - 1].link_embed;
        this.movie.LinkDown =
          server.server_data[server.server_data.length - 1].link_m3u8;
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
        console.log(this.currentEpisodeIndex);
        this.currentEpisodeIndex--;

        const nextEp = this.movie.pageMovie[this.currentEpisodeIndex];
        this.playEpisode(nextEp);
      }
    },
    prevEpisode() {
      if (this.currentEpisodeIndex < this.movie.pageMovie.length - 1) {
        console.log(this.currentEpisodeIndex);
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
    idAccount() {
      return this.$store.state.empInfor.ID || localStorage.getItem("name");
    },

    youtubeEmbedUrl() {
      if (!this.movie.trailer_url) return "";

      const id = this.extractYoutubeId(this.movie.trailer_url);
      if (!id) return "";

      return `https://www.youtube.com/embed/${id}?mute=0&playsinline=1&rel=0`;
    },
    visibleEpisodes() {
      if (!this.movie?.pageMovie) return [];
      return this.showAllEpisodes
        ? this.movie.pageMovie // Hiện tất cả tập
        : this.movie.pageMovie; // Chỉ 20 tập đầu
        //: this.movie.pageMovie.slice(0, 20); // Chỉ 20 tập đầu
    },
    visibleEpisodesRight() {
      return  this.movie.pageMovie // Hiện tất cả tập
        
    },
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

.right-panel {
  position: sticky;
  top: 72px;
}

.episode-scroll {
  max-height: 60vh;
  overflow-y: auto;
}
.video-wrapper {
  width: 100% !important;
  aspect-ratio: 16 / 9;
  position: relative;
  background: #0a0a0a;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  
  /* YouTube-style shadow */
  box-shadow: 
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 8px 24px rgba(0, 0, 0, 0.6);
  
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Smooth focus state */
  cursor: pointer;
}

.video-wrapper:hover,
.video-wrapper:focus-within {
  box-shadow: 
    0 0 0 1px rgba(255, 255, 255, 0.12),
    0 12px 32px rgba(0, 0, 0, 0.8);
  transform: translateY(-1px);
}

/* YouTube-style glow border on hover */
.video-wrapper::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(255, 200, 0, 0.15),
    rgba(255, 61, 0, 0.1),
    rgba(0, 229, 255, 0.15)
  );
  filter: blur(8px);
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s ease;
}

.video-wrapper:hover::before {
  opacity: 0.6;
}

.video-player,
.video-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  aspect-ratio: 16 / 9;
  border: none;
  border-radius: 12px;
  background: #000;
  display: block;
  
  /* YouTube player smooth appearance */
  animation: playerFadeIn 0.5s ease-out;
}

@keyframes playerFadeIn {
  from {
    opacity: 0.8;
  }
  to {
    opacity: 1;
  }
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

/* ===== SUGGESTED MOVIES SCROLL LAYOUT ===== */
.suggested-movies {
  width: 100%;
  overflow: hidden;
}

.suggested-scroll-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  width: 100%;
  overflow: visible;
}

.suggested-content-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  padding: 8px 0;
  -webkit-overflow-scrolling: touch;
  flex: 1;
  min-width: 0;
  
  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.suggested-content-scroll::-webkit-scrollbar {
  display: none;
}

.suggested-movie-card {
  flex: 0 0 auto;
  width: 200px;
  min-width: 200px;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
}

.suggested-movie-card:hover {
  transform: translateY(-8px);
}

.suggested-card-wrapper {
  background: #2e2e2e;
  border-radius: 12px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.3s ease;
}

.suggested-movie-card:hover .suggested-card-wrapper {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

.suggested-poster {
  position: relative;
  width: 100%;
  padding-bottom: 150%;
  overflow: hidden;
  background: #1e1e1e;
}

.suggested-poster-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.suggested-movie-card:hover .suggested-poster-img {
  transform: scale(1.08);
}

.suggested-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.suggested-movie-card:hover .suggested-overlay {
  opacity: 1;
}

.suggested-play-icon {
  color: white;
  opacity: 0.9;
}

.suggested-info {
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: white;
}

.suggested-title {
  font-size: clamp(12px, 3vw, 16px);
  font-weight: 600;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
}

.suggested-meta {
  display: flex;
  gap: 8px;
  font-size: clamp(12px, 3vw, 16px);
  color: #ffd600;
  font-weight: 500;
  flex-wrap: wrap;
}

.suggested-episode {
  background: rgba(255, 214, 0, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
}

.suggested-lang {
  background: rgba(100, 150, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  color: #64b5f6;
}

.suggested-category {
  font-size: 11px;
  color: #aaa;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: auto;
}

/* Navigation buttons */
.suggested-nav-btn {
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  min-width: 40px;
  max-width: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  padding: 0;
}

.suggested-nav-btn:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.suggested-nav-btn:active {
  transform: scale(0.95);
}

.suggested-nav-left {
  margin-right: 0;
}

.suggested-nav-right {
  margin-left: 0;
}

/* Responsive - Tablet */
@media (max-width: 960px) {
  .suggested-scroll-wrapper {
    gap: 6px;
  }

  .suggested-movie-card {
    width: 170px;
    min-width: 170px;
  }

  .suggested-nav-btn {
    width: 36px;
    height: 36px;
  }

  .suggested-content-scroll {
    gap: 12px;
  }

  .suggested-info {
    padding: 10px;
  }

  .suggested-title {
    font-size: clamp(12px, 3vw, 16px);
  }

  .suggested-meta {
    font-size: 11px;
  }

  .suggested-category {
    font-size: 10px;
  }
}

/* Responsive - Mobile */
@media (max-width: 768px) {
  .suggested-scroll-wrapper {
    gap: 4px;
    margin-bottom: 12px;
  }

  .suggested-movie-card {
    width: 150px;
    min-width: 150px;
  }

  .suggested-nav-btn {
    width: 32px;
    height: 32px;
  }

  .suggested-content-scroll {
    gap: 10px;
  }

  .suggested-info {
    padding: 8px;
  }

  .suggested-title {
    font-size: clamp(12px, 3vw, 16px);
    -webkit-line-clamp: 2;
  }

  .suggested-meta {
    font-size: 10px;
  }

  .suggested-category {
    font-size: 9px;
  }
}

/* Responsive - Small Mobile */
@media (max-width: 480px) {
  .suggested-scroll-wrapper {
    gap: 2px;
    margin-bottom: 8px;
  }

  .suggested-movie-card {
    width: 130px;
    min-width: 130px;
  }

  .suggested-nav-btn {
    width: 28px;
    height: 28px;
    font-size: clamp(12px, 3vw, 16px);
  }

  .suggested-content-scroll {
    gap: 8px;
  }

  .suggested-info {
    padding: 6px;
  }

  .suggested-title {
    font-size: 11px;
    -webkit-line-clamp: 1;
    line-height: 1.2;
  }

  .suggested-meta {
    font-size: 9px;
    gap: 4px;
  }

  .suggested-episode,
  .suggested-lang {
    padding: 1px 6px;
    font-size: 8px;
  }

  .suggested-category {
    font-size: 8px;
  }

  .suggested-poster {
    padding-bottom: 140%;
  }
}

.video-play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  transition: background 0.3s ease;
}

.video-play-overlay:hover {
  background: rgba(0, 0, 0, 0.5);
}

.video-play-overlay .v-icon {
  size: 80px !important;
  transition: size 0.3s ease;
}

.overlay-text {
  color: white;
  margin-top: 12px;
  font-size: clamp(12px, 3vw, 16px);
  font-weight: 500;
  text-align: center;
  transition: font-size 0.3s ease;
}

/* Tablet - Reduce size */
@media (max-width: 768px) {
  .video-play-overlay .v-icon {
    size: 50px !important;
  }

  .overlay-text {
    font-size: clamp(12px, 3vw, 16px);
    margin-top: 10px;
  }
}

/* Mobile - Further reduce size */
@media (max-width: 480px) {
  .video-play-overlay .v-icon {
    size: 48px !important;
  }

  .overlay-text {
    font-size: clamp(12px, 3vw, 16px);
    margin-top: 8px;
    padding: 0 16px;
  }
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
  border-radius: 10px;
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
  font-size: clamp(12px, 3vw, 16px);
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

.episode-col {
  flex: 0 0 20% !important;
  max-width: 20% !important;
  padding: 4px;
}
.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain; /* hoặc 'cover' nếu bạn muốn full */
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
.btnnext {
  border-radius: 10px;
  color: #757575;
}
.watch-page {
  margin: 0 !important;
  animation: watchEnter 0.5s ease-out;
  width: 100% !important;
}

@keyframes watchEnter {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.v-btn {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.v-btn:hover {
  transform: translateY(-2px);
}

.v-btn:active {
  transform: scale(0.96);
}
.episode-list {
  max-height: calc(5 * 90px);
  overflow-y: auto;
  margin: 10px;
}

.episode-row {
  width: 100%;
}

.episode-col-responsive {
  padding: 6px !important;
}

.episode-item-btn {
  min-height: 25px !important;
  font-size: 0.85rem !important;
  padding: 6px 4px !important;
  white-space: normal;
  word-break: break-word;
}
.controls {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

.controls button {
  color: white;
  background: none;
  border: none;
  font-size: clamp(12px, 3vw, 16px);
  cursor: pointer;
}

.controls input[type="range"] {
  flex: 1;
}

/* Mobile - YouTube responsive design */
@media (max-width: 768px) {
  .video-wrapper {
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .video-iframe,
  .video-player {
    border-radius: 8px;
  }

  /* Responsive buttons */
  .episode-nav-buttons {
    gap: 8px !important;
  }

  .episode-btn {
    min-width: auto !important;
    padding: 8px 12px !important;
    font-size: 0.9rem !important;
    flex: 1;
    min-height: 40px !important;
  }

  .episode-btn .v-icon {
    size: 20px !important;
  }

  .btn-text {
    display: inline;
  }

  .episode-chip-info {
    flex: 0 1 auto;
    min-width: 80px;
  }

  .function-buttons-wrapper {
    flex-direction: column !important;
    align-items: stretch !important;
  }

  .function-buttons {
    width: 100%;
    gap: 8px !important;
  }

  .function-btn {
    flex: 1;
    min-height: 40px !important;
    font-size: 0.85rem !important;
    padding: 8px 12px !important;
  }

  .function-btn .v-icon {
    margin-right: 4px !important;
  }

  .btn-text-short {
    display: inline;
    font-size: 0.85rem;
  }

  .server-tabs-wrapper {
    width: 100%;
    margin-top: 8px;
  }

  .custom-tabs {
    width: 100%;
  }

  /* Episode buttons in mobile */
  .episode-col-responsive {
    padding: 6px !important;
  }

  .episode-item-btn {
    min-height: 30px !important;
    font-size: 0.85rem !important;
    padding: 8px 6px !important;
  }
}

@media (max-width: 480px) {
  .video-wrapper {
    border-radius: 6px;
  }

  .video-iframe,
  .video-player {
    border-radius: 6px;
  }

  /* Extra small screens */
  .episode-nav-buttons {
    flex-direction: column;
    gap: 10px !important;
  }

  .episode-btn {
    width: 100% !important;
    min-height: 44px !important;
    font-size: 0.95rem !important;
    padding: 10px !important;
  }

  .episode-chip-info {
    width: 100%;
    text-align: center;
  }

  .function-buttons {
    width: 100%;
  }

  .function-btn {
    min-height: 44px !important;
    font-size: 0.9rem !important;
    padding: 10px 8px !important;
  }

  .function-btn .v-icon {
    size: 20px !important;
  }

  .btn-text-short {
    font-size: 0.9rem;
  }

  /* Episode buttons on very small screens */
  .episode-col-responsive {
    padding: 8px !important;
  }

  .episode-item-btn {
    min-height: 44px !important;
    font-size: 0.9rem !important;
    padding: 10px !important;
  }
}
</style>
