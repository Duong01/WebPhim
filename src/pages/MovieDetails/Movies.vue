<template>
<v-fade-transition appear>
  <div class="detail-page">
    <v-container class="search-page" fluid>
    <!-- <v-col cols="12" class="text-center" v-if="isLoading">
      <v-progress-circular indeterminate color="primary" size="50" />
    </v-col> -->
    <div>
      <div class="movie-banner">
        <!-- Ảnh nền mờ -->
        <div
                v-if="isLoading"
                class="default-placeholder"
              >
                <v-skeleton-loader
                  type="image, article"
                  height="80vh"
                  width="100%"
                  class="rounded-lg"
                />
              </div>
        <div
          class=""
        >
          <v-img
            :src="getOptimizedImage(movie.thumb_url)"
            :alt="`Poster phim ${movie.name}`"
            class="banner-img"
            width="100%"
            height="80vh"
            loading="lazy"
            cover
          />
          
        </div>

        <!-- Lớp tối -->
      </div>

      <!--  PHẦN 2: 2 CỘT (VIDEO + INFO/TRAILER) -->
      <div class="h-full container mx-auto flex flex-col lg:flex-row gap-10">
        <v-row class="mt-0 pt-0" dense>
          <!-- CỘT TRÁI: VIDEO -->
          <v-col cols="12" md="4">
            <v-card flat class="poster-card">
              <div
                v-if="isLoading || !movie.poster_url"
                class="default-placeholder"
              >
                <v-skeleton-loader
                  type="image, article"
                  height="220"
                  class="rounded-lg"
                />
              </div>
              <!-- Ảnh + hiệu ứng hover -->
              <div v-else class="poster-wrapper">
                <v-img
                  :src="getOptimizedImage(movie.poster_url)"
                  class="poster-img"
                  height="220"
                  width="30%"
                  cover
                  @click="goToWatch('first')"
                  v-show="$vuetify.display.mdAndUp"
                ></v-img>

                <!-- Overlay mờ khi hover -->
                <!-- <div class="poster-overlay"></div> -->

                <!-- Nút xem ngay -->
                <!-- <div class="poster-btn">▶ Xem ngay</div> -->

                <div class="banner-right text-left">
                  <div class="info-row mb-1 white--text">
                    <h5 class="movie-title">{{ movies.name }}</h5>
                    <p class="movie-sub">{{ movies.origin_name }}</p>
                    <div class="d-flex justify-center ga-2 pb-2 pt-0">
                      <v-chip variant="flat" size="small">
                      {{movies.year}}
                      </v-chip>
                      <v-chip variant="flat" size="small">
                        {{movies.episode_current}}
                      </v-chip>
                      <v-chip variant="flat" size="small">
                        {{movies.quality}}
                      </v-chip>
                    </div>
                    <!-- <el-collapse v-model="activeNames" v-if="$vuetify.display.smAndDown">
      
                      <el-collapse-item title="Giới thiệu" name="1" >
                        <template #icon="{ isActive }">
                          <span class="icon-ele">
                            {{ isActive ? 'Thu gọn' : 'Xem thêm' }}
                          </span>
                        </template>
                        <div
                          class="movie-description text-left"
                          style="font-size: 12px"
                          v-html="movies.content"
                        ></div>
                        
                      </el-collapse-item>
                      
                    </el-collapse> -->
                    <div>
                      <p class="movie-sub">Giới thiệu: </p>
                      <div
                        class="movie-description text-left"
                        style="font-size: 12px"
                        v-html="movies.content"
                      ></div>
                    </div>
                    
                    
                    <div class="movie-info-grid text-left">
                <div>
                  <strong>Thể loại:</strong>
                  <div
                    class="category-nowrap"
                    v-for="(cate, ind) in movies.category"
                    :key="ind"
                  >
                    <!-- khong xuong dong -->
                    {{ cate.name }}
                    <span v-if="ind < movies.category.length - 1"> , </span>
                  </div>
                </div>
                <div>
                  <strong>Quốc gia:</strong>
                  {{ movies.country[0].name || "Đang cập nhật" }}
                </div>

                <div>
                  <strong>Số tập:</strong> {{ movies.episode_total }} tập
                </div>
                <div><strong>Thời lượng:</strong> {{ movies.time }}</div>
                <div>
                  <strong>Diễn viên:</strong>
                  <div
                    class="category-nowrap"
                    v-for="(actor, ind) in movies.actor"
                    :key="ind"
                  >
                    <!-- khong xuong dong -->
                    {{ actor }}
                    <span v-if="ind < movies.actor.length - 1"> , </span>
                  </div>
                </div>
              </div>
                    
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>

          <!-- CỘT PHẢI: TRAILER + INFO PHIM -->
          <v-col cols="12" md="8">
            <div class="center-buttons">
              <v-btn class="watch-now" size="large" @click="goToWatch('now')">
              ▶ Xem Ngay
              </v-btn>


              <div class="hero-actions">
                <div class="action-item">
                  <v-btn variant="text" @click="goToWatch('first')">
                    <span class="flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play" aria-hidden="true"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"></path></svg></span>
                    Xem từ đầu
                  </v-btn>
                </div>
                <div class="action-item">
                  <v-btn variant="text" @click="handleFavorite()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>
                     Xem sau
                  </v-btn>
                  
                </div>
                <div class="action-item">
                  <v-btn variant="text" @click="shareMovie()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share" aria-hidden="true"><path d="M12 2v13"></path><path d="m16 6-4-4-4 4"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path></svg>
                     Chia sẻ
                  </v-btn>
                </div>
                <!-- <div class="action-item"><v-icon>mdi-comment-outline</v-icon> Bình luận</div>
                <div class="rating-box">
                <v-icon color="white">mdi-star</v-icon> 0.0 Đánh giá
                </div> -->
              </div>
            </div>
            <v-sheet elevation="4">
              <v-tabs color="primary" v-model="tab">
                <v-tab value="one">Tập phim</v-tab>
                <v-tab value="two">Trailer</v-tab>
                <v-tab value="three">{{ $t("Bình luận") }}</v-tab>
                <v-tab value="four">Đề xuất</v-tab>
              </v-tabs>

              <v-divider></v-divider>

              <v-tabs-window v-model="tab">
                <v-tabs-window-item value="one">
                  
                  <!-- ========================= -->
                  <!--  PHẦN 3: DANH SÁCH TẬP PHIM -->
                  <!-- ========================= -->
                      <v-tabs
                        v-model="currentServer"
                        color="orange"
                        show-arrows
                      >
                        <v-tab
                          v-for="(server, i) in movie.servers"
                          :key="i"
                          :value="server.server_name"
                        >
                          {{ server.server_name }}
                        </v-tab>
                      </v-tabs>

                      <!-- NỘI DUNG THEO SERVER -->
                      <v-tabs-window v-model="currentServer">
                        <v-tabs-window-item
                          v-for="(server, i) in movie.servers"
                          :key="i"
                          :value="server.server_name"
                        >

                          <!-- DANH SÁCH TẬP -->
                          <v-row class="mt-4">
                            <v-col
                              v-for="(ep, idx) in server.server_data.slice(0,20)"
                              :key="idx"
                              cols="4"
                              sm="4"
                              md="2"
                              lg="2"
                            >
                              <v-btn
                                block
                                color="primary"
                                class="episode-btn"
                                @click="goToWatch(ep)"
                              >
                                {{ ep.name }}
                              </v-btn>
                            </v-col>
                          </v-row>
                          <div class="text-center mt-4">
                          <v-btn
                              color="gray"
                              variant="tonal"
                              @click="goToWatch('first')"
                              class="btnnext"
                              v-if="episodeLimit < movie.pageMovie.length"
                            >
                              Xem thêm
                              <v-icon size="12" class="mr-1">mdi-chevron-down</v-icon>
                            </v-btn>

                            <v-btn
                              color="gray"
                              variant="tonal"
                              @click="goToWatch('first')"
                              class="btnnext"
                              v-else
                            >
                              Thu gọn
                              <v-icon size="12" class="mr-1">mdi-chevron-up</v-icon>
                            </v-btn>
                        </div>

                        </v-tabs-window-item>
                      </v-tabs-window>
                  
                </v-tabs-window-item>
                <v-tabs-window-item value="two">
                  <div class="trailer-box">
                    <v-lazy min-height="300">
                    <iframe
                      class="trailer-iframe"
                      :src="`https://www.youtube.com/embed/${movie.trailer_id}`"
                      frameborder="0"
                      loading="lazy"
                      allowfullscreen
                    >
                    </iframe>
                    </v-lazy>
                  </div>
                  
                </v-tabs-window-item>
                <v-tabs-window-item value="three">
                  <v-sheet class="pa-5">
                    <div
                      v-for="(comment, index) in comments"
                      :key="index"
                      class="d-flex align-start mb-5"
                    >
                      <v-avatar size="44" class="me-3" color="blue-grey-darken-3">
                        <v-icon color="white">mdi-account</v-icon>
                      </v-avatar>
                      <div class="flex-grow-1">
                        <div class="d-flex align-center mb-1">
                          <span class="text-blue-lighten-3 font-weight-medium me-2">{{
                            comment.username
                          }}</span>
                          <v-chip
                            size="x-small"
                            color="grey-darken-4"
                            text-color="grey-lighten-1"
                            variant="flat"
                          >
                            {{ comment.time }}
                          </v-chip>
                        </div>
                        <div class="text-white text-body-2">{{ comment.content }}</div>
                        
                      </div>
                    </div>
                  </v-sheet>
                </v-tabs-window-item>
                <v-tabs-window-item value="four">
                  <div class="suggested-movies my-8">
                    <v-row>
                      <v-col
                        v-for="suggested in suggestedMovies"
                        :key="suggested._id"
                        cols="6"
                        sm="4"
                        md="4"
                      >
                      <v-lazy transition="fade-transition">
                        <router-link
                          :to="{ name: 'Movies', params: { slug: suggested.slug } }"
                          class="text-decoration-none"
                        >
                          <v-card elevation="2" class="bg-grey-darken-4" hover>
                            <v-img
                              :lazy-src="getOptimizedImage(suggested.thumb_url)"
                              :src="getOptimizedImage(suggested.thumb_url)"
                              aspect-ratio="16/9"
                              cover
                            ></v-img>
                            <div class="ml-3 flex-grow-1">
                              <div class="text-white text-body-2 font-weight-medium text-truncate">
                                {{ suggested.name }}
                              </div>
                              <div class="text-grey-lighten-1 text-caption">
                                {{ suggested.episode_current }} | {{ suggested.lang }}<br />
                                {{ suggested.category[0]?.name }} • {{ suggested.year }}
                              </div>
                            </div>
                          </v-card>
                        </router-link>
                        </v-lazy>
                      </v-col>
                    </v-row>
                  </div>
                </v-tabs-window-item>
              </v-tabs-window>
            </v-sheet>
            <!-- TRAILER -->
            
          </v-col>
        </v-row>
      </div>

      <!-- dialog share -->
      <v-dialog v-model="shareDialog" max-width="500">
        <v-card class="pa-4" style="background-color: #1e1e1e; color: white">
          <v-card-title class="text-h6 justify-center">{{$t('Chia sẻ')}}</v-card-title>

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
            <span class="text-truncate" style="color: #facc15; max-width: 100%">
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
            height="500"
            :src="`https://www.youtube.com/embed/${movie.trailer_id}?autoplay=1`"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </v-card>
      </v-dialog>
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
  PostMoviesFavorite
} from "@/model/api";
//import { toggleFavorite, isFavorite } from "@/utils/favorite";
import Hls from "hls.js";
export default {
  name: "MoviesPage",
  data() {
    return {
      activeNames: "1",
      tab: "one",
      currentServer: null,
      imageLoaded: false,
      showAllEpisodes: false,
      dialogTrailer: false,
      videoLoaded: false,
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
      episodeLimit: 20,
      episodeLimitMap: {},

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
      }
    };
  },
  props: ["slug"],

  watch: {
    async slug(newSlug) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      await this.MoveInfor1(newSlug);
      //this.playVideo(this.movie.videoUrl);

      //await this.ListMovieByCate();
      //await this.GetComment();
      console.log(this.currentEpisodeIndex);
    },
  },
  async mounted() {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
      await this.MoveInfor1(this.slug);
      if (this.movie?.servers?.length) {
        this.currentServer = this.movie.servers[0].server_name;
      }
      
      //this.playVideo(this.movie.videoUrl);

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
              //this.GetComment();
              //this.liked = isFavorite(this.movie.idMovie);
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
              //this.GetComment();
              //this.liked = isFavorite(this.movie._id);
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

    loadMore() {
    if (!this.movie?.pageMovie) return;
    this.episodeLimit += 20;
    },
    toggleEpisodes() {
      this.showAllEpisodes = !this.showAllEpisodes;
    },
    goToWatch(ep) {
      console.log(ep)
      var page= "01"
        if(ep == 'first'){
          page= '01'
        }
        
        else if(ep == "Full" || ep == "Full"){
          page = 'Full'
        }
        else if(ep == "trailer" || ep == "Trailer"){
          page = 'Trailer'
        }
        else if(ep == 'now'){
          page = this.formatEpisode(this.movie.page);
        }
        else{
          page = this.formatEpisode(ep.name);

        }
      
      
      this.$router.push({
      name: "MovieDetail",
      params: { slug: this.movie.slug },
      query: { page }
    });
    },
    formatEpisode(text) {
      // Ví dụ: "Tập 1" → "tap01"
      const num = parseInt(text.replace(/\D/g, ""), 10);

      if (isNaN(num)) return text;

      const padded = num < 10 ? `0${num}` : `${num}`;
      return `tap${padded}`;
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
      // let aa = toggleFavorite(this.movie);
      // console.log(aa);
      this.liked = !this.liked;
      this.movieFavorite.IDMovies = this.movie.idMovie
      this.movieFavorite.slug = this.movie.slug
      this.movieFavorite.currentPage = this.movie.page
      this.movieFavorite.UrlMovies = this.movie.thumb_url
      this.movieFavorite.origin_name = this.movie.origin_name
      this.movieFavorite.name = this.movie.name
      this.movieFavorite.year = this.movie.year
      this.movieFavorite.lang = this.movie.lang
      PostMoviesFavorite(this.movieFavorite, (dat) =>{
        if(dat.data.status == "success"){
          alert("🎬 Lưu vào danh sách thành công!")
          
        }
        else{
          alert(dat.data.message)
        }

      }, (err) =>{
        console.log(err)
      })
    
    },

    getOptimizedImage(imagePath) {
      return `${imagePath.includes("https://phimimg.com/upload") ? this.urlImage1 + imagePath : this.urlImage1 + "https://phimimg.com/" + imagePath}`;
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
    
    GetComment() {
      return new Promise((resolve, reject) => {
        if (!this.movie.idMovie) reject("error");
        var movie = {
          idMovies: this.movie.idMovie,
          page: 1
        }
        GetComments(
          movie,
          (res) => {
            if (Array.isArray(res)) {
              this.comments = res.map((c) => ({
                username: c.NameCreate,
                content: c.Comments,
                createdAt: c.DayCreate,
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
        : this.movie.pageMovie.slice(0, this.episodeLimit); // Chỉ 20 tập đầu
    },
  },
};
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  padding: 0  !important;
}
.poster-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 20px;
  cursor: pointer;
  height: auto;
}

/* Ảnh nền poster */

.banner-poster {
  width: 100%;
  height: auto !important;
  object-fit: cover;
  transform: scale(1.12);
  filter: brightness(0.9);
  transition: transform 0.35s ease;
}

/* Hover phóng nhẹ */
.img-left:hover {
  transform: scale(1.07);
  transition: transform 0.3s ease;
}

.overlay-gradient-1 {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, black, transparent);
}

.poster-content {
  position: absolute;
  bottom: 40px;
  left: 40px;
  z-index: 10;
  max-width: 90%;
  color: white;
}

.poster-title {
  font-size: clamp(24px, 6vw, 42px);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 8px;
}

.poster-sub {
  font-size: clamp(12px, 3vw, 16px);
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

.poster-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
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

  opacity: 0;
  transition: opacity 0.3s ease;
}

.poster-wrapper:hover .poster-play-btn {
  opacity: 1;
}

/* Mobile: nút luôn hiện */
@media (max-width: 768px) {
  .poster-content {
    bottom: 20px;
    left: 20px;
  }

  .xem-ngay-btn {
    width: 100%;
    text-align: center;
  }

  .poster-play-btn {
    opacity: 1 !important;
    font-size: 22px;
  }

  .poster-overlay {
    opacity: 1 !important;
  }
}

/* Nút xem ngay */
.xem-ngay-btn {
  font-size: 20px;
  font-weight: 600;
  padding: 10px 26px;
  border-radius: 12px;
}

.trailer-box {
  position: relative;
  min-height: 300px;
  width: 100%;
  padding-bottom: 56.25%;
  /* 16:9 */
  border-radius: 10px;
  overflow: hidden;
  object-fit: contain;
}

.trailer-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.movie-title {
  color: white;
  margin: 15px 0 10px 0;
  font-weight: 700;
}

.movie-description {
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 15px;
}

/* Thông tin phim */
.movie-info-grid p,
.movie-description,
.movie-info-grid div {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  color: #ccc;
  font-size: 12px;
  line-height: 1.4;
}

.movie-info-grid strong {
  color: orange;
}

.category-nowrap {
  white-space: nowrap;
}

.rating-row {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.btnnext {
  border-radius: 10px;
  color: #757575;
}

.img-poster {
  width: auto;
  height: auto !important;
  display: block;
  object-fit: contain;
}
.poster-card {
  background: transparent !important;
  position: relative;
}
.poster-wrapper:hover .poster-img {
  transform: scale(1.06);
}
.poster-btn {
  position: absolute;
  inset: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  /* background-color: rgba(255, 0, 0, 0.9); */
  color: rgb(250, 250, 250);
  font-size: 22px;
  font-weight: 600;

  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  border-radius: 14px;
}

/* Hover → hiện nút */
.poster-wrapper:hover .poster-btn {
  opacity: 1;
  transform: translateY(0);
}
@media (max-width: 768px) {
  .poster-btn {
    opacity: 1 !important;
    /* background: rgba(255, 0, 0, 0.8); */
    font-size: 18px;
  }
  .divider {
    font-size: 9px;
    margin: 0 8px;
    color: rgba(255, 255, 255, 0.5);
  }
  .info-row {
    font-size: 0.6rem;
    color: #ddd;
  }
  .banner-buttons {
    display: flex;
    gap: 10px;
    margin: 15px 0;
  }
}

.movie-banner {
  padding-bottom: 0;
  margin-bottom: 0;
  position: relative;
  width: 100%;
  height: 450px;
  border-radius: 12px;
  overflow: hidden;
}

.banner-bg {
  object-fit: cover;
  transform: scale(1.1);
  width: 100%;
  height: 100%;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgb(58, 57, 57) 30%, transparent 80%);
}

.banner-content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  gap: 20px;
  padding: 20px;
  color: white;
}

.banner-left {
  width: 180px;
  flex-shrink: 0;
}

.banner-poster {
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
}

.banner-right {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
}

.movie-title {
  font-size: 28px;
  font-weight: 800;
}

.movie-sub {
  opacity: 0.7;
  margin-top: -4px;
}

.banner-buttons {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.movie-meta {
  font-size: 14px;
  opacity: 0.8;
}
.episode-btn {
  border-radius: 8px;
  font-weight: 600;
}
.divider {
  font-size: 11px;
  margin: 0 8px;
  color: rgba(255, 255, 255, 0.5);
}
.info-row {
  font-size: 0.9rem;
  color: #ddd;
}
.action-item {
display: flex;
/* align-items: center; */
gap: 4px;
}
.center-buttons {
display: flex;
flex-direction: column;
/* align-items: center; */
gap: 20px;
padding: 10px 0;
}
.hero-actions {
display: flex;
gap: 26px;
font-size: 14px;
opacity: 0.85;
}
.watch-now {
background: #ffd76b !important;
color: black !important;
font-weight: 700;
padding: 10px 26px;
border-radius: 30px;
}
.tab.active {
font-weight: 700;
border-bottom: 2px solid #ffd76b;
}
.section-tabs {
margin-top: 35px;
display: flex;
gap: 35px;
font-size: 16px;
color: #ccc;
}
.section-tabs .active {
font-weight: bold;
color: #ffd76b;
border-bottom: 2px solid #ffd76b;
}
.icon-ele {
  margin: 0 10px ;
  color: #409eff;
}
.detail-page {
  animation: detailEnter 0.45s ease-out;
}

@keyframes detailEnter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.banner-img {
  filter: brightness(0.75);
  animation: bannerFade 0.6s ease;
}

@keyframes bannerFade {
  from {
    opacity: 0;
    transform: scale(1.04);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.poster-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
}

.poster-img {
  transition: transform 0.35s ease;
}

.poster-wrapper:hover .poster-img {
  transform: scale(1.06);
}
.watch-now {
  font-weight: 700;
  font-size: 18px;
  border-radius: 999px;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.watch-now:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(255, 180, 0, 0.4);
}

.watch-now:active {
  transform: scale(0.95);
}
</style>
