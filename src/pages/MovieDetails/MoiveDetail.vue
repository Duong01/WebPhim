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
            <v-col cols="12" lg="9" md="8">
              <!-- VIDEO -->
              <div class="video-wrapper" @dblclick="toggleFullScreen" style="background-color: #000;">
                <!-- Iframe Player -->
                <iframe
                  v-if="hasStartedPlaying"
                  ref="videoPlayer"
                  :src="movie.videoUrl"
                  class="video-player"
                  :class="{ 'video-loading': isIframeLoading }"
                  allowfullscreen
                  allow="autoplay; fullscreen"
                  frameborder="0"
                  style="background-color: #000;"
                  @load="onIframeLoad"
                ></iframe>

                <!-- Loading State / Smooth transition -->
                <div
                  v-if="hasStartedPlaying && isIframeLoading"
                  class="video-loading-overlay"
                >
                  <v-img :src="movie.thumb_url" cover class="video-player-poster-blur"></v-img>
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    size="64"
                  />
                </div>

                <!-- Poster / Play overlay -->
                <div
                  v-if="!hasStartedPlaying"
                  class="video-play-overlay"
                  :class="{ 'video-unavailable': !hasPlayableVideo }"
                  @click="hasPlayableVideo ? startPlaying() : null"
                >
                  <v-img :src="movie.thumb_url || movie.poster_url" cover class="video-player-poster"></v-img>
                  <template v-if="hasPlayableVideo">
                    <v-icon size="80" color="white">mdi-play-circle</v-icon>
                    <p class="overlay-text">{{ $t("Click để xem phim") }}</p>
                  </template>
                  <template v-else>
                    <v-icon size="80" color="grey-lighten-1">mdi-movie-open-off</v-icon>
                    <p class="overlay-text text-grey-lighten-1">{{ $t("Phim đang cập nhật") }}</p>
                  </template>
                </div>
              </div>
              <!-- nut next tap và back tap -->
              <div
                class="d-flex justify-center align-center my-4 episode-nav-wrapper"
              >
                <v-btn
                  variant="tonal"
                  color="grey-lighten-1"
                  class="nav-episode-btn"
                  @click="prevEpisode()"
                  :disabled="currentEpisodeIndex <= 0"
                >
                  <v-icon start>mdi-chevron-left</v-icon>
                  {{ $t("Tập trước") }}
                </v-btn>

                <v-chip
                  color="primary"
                  class="mx-3 px-4 font-weight-bold"
                  size="large"
                  variant="elevated"
                >
                  {{ movie.pageMovie[currentEpisodeIndex]?.name }}
                </v-chip>

                <v-btn
                  variant="tonal"
                  color="grey-lighten-1"
                  class="nav-episode-btn"
                  @click="nextEpisode()"
                  :disabled="currentEpisodeIndex >= movie.pageMovie.length - 1"
                >
                  {{ $t("Tập tiếp") }}
                  <v-icon end>mdi-chevron-right</v-icon>
                </v-btn>
              </div>

              <!-- Action Bar & Server Tabs -->
              <div
                class="player-toolbar d-flex flex-column flex-md-row align-stretch align-md-center justify-space-between mb-6 pa-4 rounded-lg"
                style="gap: 16px"
              >
                <!-- Server -->
                <div
                  class="d-flex align-center flex-nowrap gap-2 server-tabs-wrapper overflow-x-auto pb-2 pb-md-0"
                >
                  <div
                    class="text-caption text-grey mr-2 d-flex align-center flex-shrink-0"
                  >
                    <v-icon size="small" class="mr-1"
                      >mdi-server-network</v-icon
                    >
                    Server:
                  </div>
                  <div class="d-flex gap-2 flex-nowrap">
                    <v-btn
                      v-for="(server, index) in movie.servers"
                      :key="index"
                      @click="switchServer(server)"
                      :color="tabserver === index ? 'primary' : 'grey-darken-3'"
                      :variant="tabserver === index ? 'flat' : 'elevated'"
                      size="small"
                      class="text-none server-btn font-weight-medium flex-shrink-0"
                      elevation="2"
                    >
                      {{ server.server_name || `Server ${index + 1}` }}
                    </v-btn>
                  </div>
                  <router-link
                    :to="movie.LinkDown || ''"
                    download
                    target="_blank"
                    class="ml-2 flex-shrink-0"
                  >
                    <v-btn
                      size="small"
                      color="success"
                      variant="tonal"
                      icon="mdi-cloud-download"
                      title="Tải xuống"
                    ></v-btn>
                  </router-link>
                </div>

                <!-- Action buttons -->
                <div
                  class="d-flex align-center gap-2 flex-nowrap action-buttons-group overflow-x-auto pb-2 pb-md-0"
                >
                  <v-btn
                    variant="tonal"
                    color="white"
                    size="small"
                    @click="dialogTrailer = true"
                    class="action-btn flex-shrink-0 text-no-wrap"
                  >
                    <v-icon start color="red">mdi-youtube</v-icon> Trailer
                  </v-btn>
                  <v-btn
                    variant="tonal"
                    color="white"
                    size="small"
                    @click="shareMovie"
                    class="action-btn flex-shrink-0 text-no-wrap"
                  >
                    <v-icon start color="blue">mdi-share-variant</v-icon>
                    {{ $t("Chia sẻ") }}
                  </v-btn>
                  <v-btn
                    variant="tonal"
                    color="white"
                    size="small"
                    @click="ResponseError"
                    class="action-btn flex-shrink-0 text-no-wrap"
                  >
                    <v-icon start color="warning">mdi-flag</v-icon>
                    {{ $t("Báo lỗi") }}
                  </v-btn>
                  <v-btn
                    variant="tonal"
                    :color="liked ? 'primary' : 'white'"
                    size="small"
                    @click="handleFavorite"
                    class="action-btn flex-shrink-0 text-no-wrap"
                  >
                    <v-icon start :color="liked ? 'white' : 'pink'">{{
                      liked ? "mdi-bookmark" : "mdi-bookmark-outline"
                    }}</v-icon>
                    {{ $t("Xem sau") }}
                  </v-btn>
                </div>
              </div>

              <!-- Danh sách tập (Chỉ hiển thị mobile) -->
              <v-card
                class="mb-6 modern-card"
                color="#1a1a1a"
                variant="flat"
                rounded="lg"
                v-if="$vuetify.display.smAndDown"
              >
                <v-card-title
                  class="pt-4 pb-3 px-4 border-b d-flex align-center custom-title"
                  style="border-color: rgba(255, 255, 255, 0.08) !important"
                >
                  <span
                    class="text-h6 font-weight-bold text-white title-text d-flex align-center w-100"
                    >{{ movie.title }}
                    <v-chip
                      class="ml-3 chip-limit"
                      color="primary"
                      variant="flat"
                      size="small"
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
                        ref="episodeContainer"
                      >
                        <v-btn
                          block
                          size="small"
                          @click="playEpisode(episode)"
                          :variant="
                            index === currentEpisodeIndex ? 'flat' : 'tonal'
                          "
                          :color="
                            index === currentEpisodeIndex
                              ? 'primary'
                              : 'grey-darken-5'
                          "
                          :class="[
                            'episode-item-btn',
                            'rounded-md',
                            'font-weight-medium',
                            'text-none',
                            {
                              'episode-item-active':
                                index === currentEpisodeIndex,
                            },
                          ]"
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
                      variant="tonal"
                      color="grey-lighten-1"
                      @click="toggleEpisodes"
                      class="btnnext"
                      size="small"
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
                class="movie-info-card pa-5 mb-6"
                color="#1a1a1a"
                flat
                rounded="lg"
              >
                <v-row>
                  <v-col
                    cols="12"
                    sm="4"
                    md="3"
                    lg="3"
                    v-if="$vuetify.display.smAndUp"
                  >
                    <v-img
                      :src="getOptimizedImage(movie.thumb_url)"
                      aspect-ratio="2/3"
                      cover
                      class="rounded-lg elevation-4"
                    ></v-img>
                  </v-col>
                  <v-col cols="12" sm="8" md="9" lg="9">
                    <h1
                      class="text-h5 font-weight-bold text-sm-h4 text-white mb-2"
                    >
                      {{ movie.title }}
                    </h1>
                    <h2 class="text-subtitle-1 text-grey mb-4">
                      {{ movie.name }}
                    </h2>
                    <div class="content-wrapper mb-4">
                      <div
                        class="text-body-1 text-grey-lighten-2 content-desc"
                        :class="{'content-collapsed': isLongDescription && !isDescriptionExpanded}"
                        v-html="movie.description"
                      ></div>
                      <v-btn v-if="isLongDescription" variant="text" size="small" @click="isDescriptionExpanded = !isDescriptionExpanded" class="mt-1 pa-0 text-primary font-weight-bold text-none">
                        {{ isDescriptionExpanded ? $t('Thu gọn') : $t('Xem thêm') }}
                        <v-icon end size="small">{{ isDescriptionExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                      </v-btn>
                    </div>


                    <v-divider color="grey-darken-3" class="mb-4"></v-divider>
                    <v-row
                      dense
                      class="text-body-2 text-grey-lighten-1 info-grid-modern"
                    >
                      <v-col cols="12" md="6" class="d-flex align-start mb-2">
                        <span class="info-label">{{ $t("Thể loại:") }}</span>
                        <span class="info-value text-white">
                          <template v-if="movies?.category?.length">
                            <span
                              v-for="(cate, ind) in movies.category"
                              :key="ind"
                              class="hover-text"
                            >
                              {{ cate.name
                              }}<span v-if="ind < movies.category.length - 1"
                                >,
                              </span>
                            </span>
                          </template>
                          <span v-else>{{ $t("Đang cập nhật") }}</span>
                        </span>
                      </v-col>

                      <v-col cols="12" md="6" class="d-flex align-start mb-2">
                        <span class="info-label">{{ $t("Quốc gia:") }}</span>
                        <span class="info-value text-white">
                          {{
                            movies?.country?.[0]?.name || $t("Đang cập nhật")
                          }}
                        </span>
                      </v-col>

                      <v-col cols="12" md="6" class="d-flex align-start mb-2">
                        <span class="info-label">{{ $t("Số tập:") }}</span>
                        <span class="info-value text-white">
                          {{ movies?.episode_total || "?" }} {{ $t("tập") }}
                        </span>
                      </v-col>

                      <v-col cols="12" md="6" class="d-flex align-start mb-2">
                        <span class="info-label">{{ $t("Thời lượng:") }}</span>
                        <span class="info-value text-white">
                          {{ movies?.time || $t("Đang cập nhật") }}
                        </span>
                      </v-col>

                      <v-col cols="12" class="d-flex align-start mb-2">
                        <span class="info-label">{{ $t("Diễn viên:") }}</span>
                        <span class="info-value text-white">
                          <template v-if="movies?.actor?.length">
                            <span
                              v-for="(actor, ind) in movies.actor"
                              :key="ind"
                              class="hover-text"
                            >
                              {{ actor
                              }}<span v-if="ind < movies.actor.length - 1"
                                >,
                              </span>
                            </span>
                          </template>
                          <span v-else>{{ $t("Đang cập nhật") }}</span>
                        </span>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
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
                color="#1a1a1a"
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
                    {{ $t("Đăng nhập để bình luận") }}
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
                  {{ $t("Chưa có bình luận nào. Hãy là người đầu tiên!") }}
                </div>
                <div
                  v-else
                  v-for="(comment, index) in comments"
                  :key="index"
                  class="d-flex align-start mb-5"
                >
                  <div
                    class="avatar-with-crown"
                    v-if="comment.Avartar != '' && comment.Avartar != null"
                  >
                    <v-avatar
                      size="44"
                      class="me-3"
                      color="blue-grey-darken-3"
                      :image="comment.Avartar"
                    ></v-avatar>
                    <v-icon
                      v-if="isFanCung"
                      class="crown-icon"
                      color="yellow-darken-2"
                      size="18"
                      >mdi-crown</v-icon
                    >
                  </div>

                  <v-avatar
                    size="44"
                    class="me-3"
                    color="blue-grey-darken-3"
                    v-else
                  >
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

            <!-- Cột bên phải: Danh sách tập (Desktop) -->
            <v-col
              cols="12"
              lg="3"
              md="4"
              class="right-panel"
              v-if="$vuetify.display.mdAndUp"
            >
              <!-- DANH SÁCH TẬP -->
              <v-card
                color="#1a1a1a"
                variant="flat"
                rounded="lg"
                class="episode-panel mb-6"
              >
                <v-card-title
                  class="pt-4 pb-3 px-4 border-b"
                  style="border-color: rgba(255, 255, 255, 0.08) !important"
                >
                  <div class="d-flex align-center justify-space-between w-100">
                    <span
                      class="text-h6 font-weight-bold text-white d-flex align-center"
                    >
                      <v-icon start color="primary" class="mr-2"
                        >mdi-format-list-bulleted-square</v-icon
                      >
                      {{ $t("Danh sách tập") }}
                    </span>
                    <v-chip color="primary" size="small" variant="tonal"
                      >{{ movie.pageMovie.length }} Tập</v-chip
                    >
                  </div>
                </v-card-title>

                <v-card-text>
                  <v-sheet class="episode-list mt-4" elevation="0">
                    <v-row dense>
                      <v-col
                        v-for="(episode, index) in visibleEpisodesRight"
                        :key="index"
                        cols="6"
                        lg="6"
                        md="12"
                        ref="episodeContainer"
                      >
                        <v-btn
                          block
                          :variant="
                            index === currentEpisodeIndex ? 'flat' : 'tonal'
                          "
                          :color="
                            index === currentEpisodeIndex
                              ? 'primary'
                              : 'grey-darken-5'
                          "
                          :class="[
                            'episode-btn',
                            'rounded-md',
                            'font-weight-medium',
                            'text-none',
                            {
                              'episode-item-active':
                                index === currentEpisodeIndex,
                            },
                          ]"
                          @click="playEpisode(episode)"
                          height="40"
                        >
                          {{
                            episode.name
                              ? episode.name.includes("Tập")
                                ? episode.name
                                : "Tập " + episode.name
                              : "Trailer"
                          }}
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
                <h2 class="text-h5 font-weight-bold text-white mb-4">
                  <v-icon left color="primary" class="mr-2"
                    >mdi-movie-open-star</v-icon
                  >{{ $t("Phim được đề xuất") }}
                </h2>

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
                  <div
                    ref="suggestedScrollContainer"
                    class="suggested-content-scroll"
                  >
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
                          <div class="suggested-title">
                            {{ suggested.name }}
                          </div>
                          <div class="suggested-meta">
                            <span class="suggested-episode">{{
                              suggested.episode_current
                            }}</span>
                            <span class="suggested-lang">{{
                              suggested.lang
                            }}</span>
                          </div>
                          <div class="suggested-category">
                            {{ suggested.category[0]?.name }} •
                            {{ suggested.year }}
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
                <v-col cols="3" class="text-center">
                  <v-btn
                    icon
                    size="large"
                    @click="shareTo('tiktok')"
                    class="bg-grey-darken-4"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="white"
                    >
                      <path
                        d="M12.75 2h2.5c.1 1.2.6 2.3 1.5 3.2.9.9 2 1.4 3.2 1.5v2.6c-1.4-.1-2.7-.5-3.9-1.2v5.6c0 3.4-2.7 6.1-6.1 6.1S4 17.1 4 13.7 6.7 7.6 10.1 7.6c.3 0 .6 0 .9.1v2.7c-.3-.1-.6-.2-.9-.2-1.9 0-3.5 1.6-3.5 3.5S8.2 17.2 10.1 17.2s3.5-1.6 3.5-3.5V2z"
                      />
                    </svg>
                  </v-btn>
                  <div class="mt-1 text-caption">TikTok</div>
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
  // urlImage,
  urlImage1,
  GetComments,
  AddComment,
  PostMoviesFavorite,
  UpdateMoviesFavorite,
  CheckSession,
  Tracking,
  UpdateTimeWatch,
} from "@/model/api";
//import {  toggleFavorite } from "@/utils/favorite";
// import Hls from "hls.js";
import { useHead } from "@vueuse/head";
export default {
  name: "MovieDetail",
  data() {
    return {
      isFullscreen: false,

      hasLoadedCate: false,
      hasLoadedComment: false,
      showAllEpisodes: false,
      dialogTrailer: false,
      isIframeLoading: true,
      lastTimeUpdateTime: 0,
      shareUrl: window.location.href,
      tabserver: null,
      currentEpisodeIndex: 0,
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
      movies:[],
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
        vote_average: "",
        poster_url: "",
        quality: "",
        time: "",
        episode_total: "",
      },
      movieFavorite: {
        IDAccount: "",
        IDMovies: "",
        slug: "",
        currentPage: "",
        UrlMovies: "",
        poster_url: "",
        origin_name: "",
        name: "",
        year: "",
        lang: "",
        time: "",
        quality: "",
        vote_average: "",
        totalPage: "",
      },
      urlImage1: urlImage1,
      suggestedMovies: [],
      comments: [],
      newComment: "",
      shareDialog: false,
      liked: false,
      saveTimeInterval: null,
      timeSpentWatching: 0,
      favoriteUpdateCounter: 0,
      hasAutoUpdatedFavorite: false,
      hasStartedPlaying: false,
      isDescriptionExpanded: false,
    };
  },
  props: ["slug", "page"],
  beforeUnmount() {
    // Lưu thời gian xem trước khi rời khỏi

    this.saveWatchTime();
    if (this.idAccount) {
      this.saveWatchTimeAPI();
    }

    // Dừng save interval
    if (this.saveTimeInterval) {
      clearInterval(this.saveTimeInterval);
    }

    // Hủy iframe
    if (this.$refs.videoPlayer) {
      this.$refs.videoPlayer.src = "";
    }

    // remove fullscreen listeners
    document.removeEventListener(
      "fullscreenchange",
      this.handleFullscreenChange
    );
    document.removeEventListener(
      "webkitfullscreenchange",
      this.handleFullscreenChange
    );
    document.removeEventListener(
      "mozfullscreenchange",
      this.handleFullscreenChange
    );
    document.removeEventListener(
      "MSFullscreenChange",
      this.handleFullscreenChange
    );
  },
  watch: {
    async slug(newSlug) {
      await this.MoveInfor1(newSlug);
      if (this.page) {
        if (this.page == "01") {
          this.currentEpisodeIndex = 0;
        } else {
          this.currentEpisodeIndex = this.movie.pageMovie.findIndex(
            (ep) => ep.name.replace("Tập ", "tap") === this.page
          );
        }
      }
      if (this.currentEpisodeIndex == -1) {
        var page = this.page.replace("tap", "");
        if (this.page == "01") {
          this.currentEpisodeIndex = 0;
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
      if (epName) {
        const normalized = epName.replace("Tập ", "tap");
        if (this.$route.query.page !== normalized) {
          this.$router.replace({
            name: "MovieDetail",
            params: { slug: newSlug },
            query: { page: normalized },
          });
        }
      }
      this.favoriteUpdateCounter = 0;
      this.hasAutoUpdatedFavorite = false;
      this.hasStartedPlaying = false; // Reset iframe khi đổi phim
      this.$store.commit("settimeWatch", null);
      // Load thời gian xem cho film mới
      this.$nextTick(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        this.loadWatchTime();
        // Trì hoãn tracking để ưu tiên render và load các dữ liệu quan trọng
        setTimeout(() => {
          this.Tracking();
        }, 1500);
        this.scrollToActiveEpisode();
      });
      // await this.ListMovieByCate();
      // await this.GetComment();
    },
  },
  async mounted() {
    try {
      // this.$store.dispatch('loading/stopLoading')
      await this.MoveInfor1(this.slug);
      // this.$store.dispatch('loading/stopLoading')
      if (this.page) {
        if (this.page == "01") {
          this.currentEpisodeIndex = 0;
        } else {
          this.currentEpisodeIndex = this.movie.pageMovie.findIndex(
            (ep) => ep.name.replace("Tập ", "tap") === this.page
          );
        }
      }
      if (this.currentEpisodeIndex == -1) {
        var page = this.page.replace("tap", "");
        if (this.page == "01") {
          this.currentEpisodeIndex = 0;
        } else {
          this.currentEpisodeIndex = this.movie.pageMovie.findIndex(
            (ep) => ep.name.replace("Tập ", "tap") === page
          );
          if (this.currentEpisodeIndex == -1) {
            this.currentEpisodeIndex = this.movie.pageMovie.findIndex(
              (ep) => ep.name.replace("Tập ", "") === page.replace("0", "")
            );
          }
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
      const epName = this.movie.pageMovie[this.currentEpisodeIndex]?.name;
      this.movie.videoUrl = this.movie.pageMovie[this.currentEpisodeIndex]?.link_embed;

      //this.playVideo(this.movie.videoUrl);

      //this.bindVideoEvents();
      if (epName) {
        const normalized = epName.replace("Tập ", "tap");

        // Cập nhật URL
        if (this.$route.query.page !== normalized) {
          this.$router.replace({
            name: "MovieDetail",
            params: { slug: this.slug },
            query: { page: normalized },
          });
        }
      }
      this.updateSEO();
      this.initLazyLoad();

      // Load thời gian xem từ localStorage
      this.$nextTick(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        this.loadWatchTime();
        setTimeout(() => {
          this.Tracking();
        }, 1500);
        this.scrollToActiveEpisode();
      });

      // Bắt đầu save thời gian xem
      if (this.saveTimeInterval) {
        clearInterval(this.saveTimeInterval);
      }
      this.saveTimeInterval = setInterval(() => {
        this.timeSpentWatching += 60;
        this.saveWatchTime();
        if (this.idAccount) {
          this.saveWatchTimeAPI();
        }
        // Tự động cập nhật vào danh sách yêu thích/lịch sử
        if (this.idAccount && !this.hasAutoUpdatedFavorite) {
          this.favoriteUpdateCounter++;
          if (this.favoriteUpdateCounter >= 1) {
            this.autoUpdateFavorite();
            this.hasAutoUpdatedFavorite = true;
          }
        }
      }, 60000);
      
      this.updateMeta();
      // Fullscreen change listeners (update isFullscreen state across browsers)
      document.addEventListener(
        "fullscreenchange",
        this.handleFullscreenChange
      );
      document.addEventListener(
        "webkitfullscreenchange",
        this.handleFullscreenChange
      );
      document.addEventListener(
        "mozfullscreenchange",
        this.handleFullscreenChange
      );
      document.addEventListener(
        "MSFullscreenChange",
        this.handleFullscreenChange
      );

      // await this.ListMovieByCate();
      // await this.GetComment();
    } catch (err) {
      console.log(err);
    } finally {
      this.$store.dispatch("loading/stopLoading");
    }
  },
  methods: {
    saveWatchTimeAPI() {
      try {
        if (!this.movie?.idMovie) return;

        // Vì dùng iframe nên không lấy được currentTime, sử dụng biến đếm thời gian xem
        const currentTime = this.timeSpentWatching || 1;

        // Tránh spam API nếu thời gian không đổi
        if (this.lastTimeUpdateTime === currentTime) return;

        this.lastTimeUpdateTime = currentTime;

      

        const payload = {
          IDMovies: this.movie.idMovie,
          IDAccount: this.idAccount,
          timeWatch: Math.floor(currentTime || 0),
          currentPage: this.movie.pageMovie[this.currentEpisodeIndex]?.name,
          slug : this.movie.slug,
          UrlMovies : this.movie.thumb_url,
          origin_name : this.movie.origin_name,
          name : this.movie.name,
          year : this.movie.year,
          lang : this.movie.lang,
          time : this.movie.time,
          quality : this.movie.quality,
          vote_average : this.movie.tmdb?.vote_average,
          poster_url : this.movie.poster_url,
          totalPage : this.movie.episode_total
        };

        UpdateTimeWatch(payload, ()=>{
        },(err)=>{
          console.error(err);
        })
      } catch (error) {
        console.error("Lỗi lưu thời gian xem:", error);
      }
    },

    Tracking() {
      Tracking(
        { page: window.location.href },
        () => {},
        (err) => console.log(err)
      );
    },

    updateMeta() {
      useHead({
        title: `${this.movie.title || this.movie.name} Tập ${
          this.movie.page
        } Vietsub HD`,
        meta: [
          {
            name: "description",
            content: `Xem ${this.movie.title} tập ${
              this.movie.page
            } vietsub, chất lượng cao cực mượt. ${
              this.movie.description
                ? this.movie.description.substring(0, 100) + "..."
                : ""
            }`,
          },
          { property: "og:title", content: this.movie.title },
          { property: "og:description", content: this.movie.description },
          { property: "og:image", content: this.movie.thumb_url },
          { property: "og:url", content: window.location.href },
          { property: "og:type", content: "video.episode" },
        ],
        link: [{ rel: "canonical", href: window.location.href }],
        script: [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              name: `${this.movie.title} Tập ${this.movie.page}`,
              description: this.movie.description,
              thumbnailUrl: this.movie.thumb_url,
              uploadDate: new Date().toISOString(),
              embedUrl: window.location.href,
            }),
          },
        ],
      });
    },
    // Lưu thời gian xem vào localStorage
    saveWatchTime() {
      if (!this.movie.idMovie) return;

      const currentTime = this.timeSpentWatching || 1;
      const duration = this.movie.time ? parseInt(this.movie.time) * 60 : 3600; // Giả định thời lượng

      if (currentTime > 0) {
        const watchData = {
          IDMovies: this.movies._id,
          slug: this.movies.slug,
          episode: this.movie.pageMovie[this.currentEpisodeIndex]?.name,
          timeWatch: currentTime,
          duration: duration,
          timestamp: Date.now(),
          currentPage: this.movie.pageMovie[this.currentEpisodeIndex]?.name,
          lang: this.movies.lang,
          quality: this.movies.quality,
          name: this.movies.name,
          thumb_url: this.movies.thumb_url,
          poster_url: this.movies.poster_url,
          origin_name: this.movies.origin_name,
          year: this.movies.year,
          time: this.movies.time,
          episode_total: this.movies.episode_total,
          totalPage: this.movies.episode_total
          
        };

        // Lưu vào localStorage với key duy nhất
        const key = `webphim_watchtime`;

        localStorage.setItem(key, JSON.stringify(watchData));
      }
    },

    // Load thời gian xem từ localStorage
    loadWatchTime() {
      if (!this.movie.idMovie) return;

      try {
        if (
          this.$store.state.timeWatch !== "" &&
          this.$store.state.timeWatch != null
        ) {
          const storeTime = Number(this.$store.state.timeWatch);
          this.timeSpentWatching = storeTime;
          this.$store.commit("settimeWatch", null);
          return;
        }

        const key = `webphim_watchtime`;
        const watchData = localStorage.getItem(key);

        if (!watchData) return;

        const data = JSON.parse(watchData);
        if (data.slug === this.movies.slug) {
          this.timeSpentWatching = data.timeWatch || 0;
        }
      } catch (error) {
        console.error("Lỗi load thời gian xem:", error);
      }
    },

    timeAgo(timestamp) {
      const time = new Date(timestamp).getTime();
      const now = Date.now();

      if (time > now) return "Vừa xong";

      const diff = now - time;

      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return "Vừa xong";
      if (minutes < 60) return `${minutes} phút trước`;

      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} giờ trước`;

      const days = Math.floor(hours / 24);
      if (days < 30) return `${days} ngày trước`;

      const months = Math.floor(days / 30);
      if (months < 12) return `${months} tháng trước`;

      const years = Math.floor(months / 12);
      return `${years} năm trước`;
    },
    // Call API
    MoveInfor(slug) {
      return new Promise((resolve, reject) => {
        MoveInfor(
          slug,
          (result) => {
            if (result.status == true || result.status == "success") {
              this.movies = result.movie;
              this.movie.page = result.movie.episode_current;
              this.movie.idMovie = result.movie._id;
              this.movie.title = result.movie.name;
              this.movie.description = result.movie.content;
              this.movie.pageMovie = result.episodes[0].server_data.sort(
                (a, b) =>
                  parseInt(a.name.match(/\d+/)) - parseInt(b.name.match(/\d+/))
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
              this.movie.vote_average = result.movie.tmdb?.vote_average;
              this.movie.poster_url = result.movie.poster_url;
              this.movie.quality = result.movie.quality;
              this.movie.time = result.movie.time;
              this.movie.episode_total = result.movie.episode_total;

              if (this.movie.trailer_url != "") {
                let tUrl = this.movie.trailer_url;
                if (tUrl.includes("youtube.com/embed/")) {
                  this.movie.trailer_id = tUrl.split("embed/")[1].split("?")[0];
                } else {
                  this.movie.trailer_id = tUrl.includes("?v=") 
                    ? tUrl.split("?v=")[1].split("&")[0] 
                    : (tUrl.includes("youtu.be/") ? tUrl.split("youtu.be/")[1].split("?")[0] : "");
                }
              }

              const hasActualEpisodes = result.episodes && result.episodes[0]?.server_data?.length > 0 && result.episodes[0].server_data[0].link_embed !== "";

              if (!hasActualEpisodes) {
                if (this.movie.trailer_id) {
                  this.movie.videoUrl = `https://www.youtube.com/embed/${this.movie.trailer_id}?autoplay=1`;
                } else {
                  this.movie.videoUrl = "";
                }
              } else {
                if (
                  this.movie.page == "Full" ||
                  this.movie.page.toUpperCase().includes("HOÀN TẤT") ||
                  this.movie.page.includes("/")
                ) {
                  this.movie.videoUrl = this.ensureAutoplay(
                    result.episodes[0].server_data[
                      result.episodes[0].server_data.length - 1
                    ].link_embed
                  );
                  this.currentEpisodeIndex = 0;
                  // this.movie.title = result.movie.name;
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
                    this.movie.videoUrl = this.ensureAutoplay(data.link_embed);
                    this.movie.LinkDown = data.link_m3u8;
                    // this.movie.title = data.filename;
                  } else {
                    const data = result.episodes[1].server_data.find(
                      (ep) => ep.slug === tap || ep.slug.includes(tap)
                    );
                    if (data) {
                      this.movie.videoUrl = this.ensureAutoplay(data.link_embed);
                      this.movie.LinkDown = data.link_m3u8;
                      // this.movie.title = data.filename;
                    }
                  }
                }
              }
              this.movie.actors = result.movie.actor;
              for (var i = 0; i < result.movie.country.length; i++) {
                this.movie.genre = result.movie.country[i];
              }
              this.movie.categoris = result.movie.category[0].slug;
              this.isLoading = false;
              this.updateMeta();

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
            if (result.status == true || result.status == "success") {
              this.movies = result.movie;
              this.movie.page = result.movie.episode_current;
              this.movie.idMovie = result.movie._id;
              this.movie.title = result.movie.name;
              this.movie.description = result.movie.content;
              this.movie.pageMovie = result.episodes[0].server_data.sort(
                (a, b) =>
                  parseInt(a.name.match(/\d+/)) - parseInt(b.name.match(/\d+/))
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
              this.movie.vote_average = result.movie.tmdb?.vote_average;
              this.movie.poster_url = result.movie.poster_url;
              this.movie.quality = result.movie.quality;
              this.movie.time = result.movie.time;
              this.movie.episode_total = result.movie.episode_total;

              if (this.movie.trailer_url != "") {
                let tUrl = this.movie.trailer_url;
                if (tUrl.includes("youtube.com/embed/")) {
                  this.movie.trailer_id = tUrl.split("embed/")[1].split("?")[0];
                } else {
                  this.movie.trailer_id = tUrl.includes("?v=") 
                    ? tUrl.split("?v=")[1].split("&")[0] 
                    : (tUrl.includes("youtu.be/") ? tUrl.split("youtu.be/")[1].split("?")[0] : "");
                }
              }

              const hasActualEpisodes = result.episodes && result.episodes[0]?.server_data?.length > 0 && result.episodes[0].server_data[0].link_embed !== "";

              if (!hasActualEpisodes) {
                if (this.movie.trailer_id) {
                  this.movie.videoUrl = `https://www.youtube.com/embed/${this.movie.trailer_id}?autoplay=1`;
                } else {
                  this.movie.videoUrl = "";
                }
              } else {
                if (
                  this.movie.page == "Full" ||
                  this.movie.page.toUpperCase().includes("HOÀN TẤT") ||
                  this.movie.page.includes("/")
                ) {
                  this.movie.videoUrl = this.ensureAutoplay(
                    result.episodes[0].server_data[
                      result.episodes[0].server_data.length - 1
                    ].link_embed
                  );
                  // this.currentEpisodeIndex = result.episodes[0].server_data.length-1
                  this.currentEpisodeIndex = 0;
                  this.movie.title = result.movie.name;
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
                    this.movie.videoUrl = this.ensureAutoplay(data.link_embed);
                    this.movie.title = data.filename;
                  } else {
                    const data = result.episodes[1].server_data.find(
                      (ep) => ep.slug === tap || ep.slug.includes(tap)
                    );
                    if (data) {
                      this.movie.videoUrl = this.ensureAutoplay(data.link_embed);
                      this.movie.title = data.filename;
                    }
                  }
                }
              }
              this.movie.actors = result.movie.actor;
              for (var i = 0; i < result.movie.country.length; i++) {
                this.movie.genre = result.movie.country[i];
              }
              this.movie.categoris = result.movie.category[0].slug;
              this.isLoading = false;

              this.updateMeta();

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

    updateSEO() {
      useHead({
        title: `${this.movie.title} Vietsub FullHD - Xem Phim ${this.movie.title} Mới Nhất | ZCines`,
        meta: [
          { name: "description", content: this.movie.description || `Xem phim ${this.movie.title} Vietsub FullHD chất lượng cao. Cập nhật tập mới nhất nhanh chóng, xem online miễn phí tại ZCines.` },
          { property: "og:title", content: this.movie.title },
          { property: "og:description", content: this.movie.description },
          { property: "og:image", content: this.movie.thumb_url || this.movie.poster_url },
          { property: "og:url", content: window.location.href },
          { property: "og:type", content: "video.movie" },
        ],
        link: [{ rel: "canonical", href: window.location.href }],
        script: [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Movie",
              "name": this.movie.title,
              "image": this.movie.thumb_url || this.movie.poster_url,
              "description": this.movie.description,
              "dateCreated": this.movie.year || new Date().getFullYear().toString()
            }),
          },
        ],
      });
    },
    toggleEpisodes() {
      this.showAllEpisodes = !this.showAllEpisodes;
    },
    ensureAutoplay(url) {
      if (!url) return url;
      if (url.includes('?')) {
        if (!url.includes('autoplay=1')) {
          return url + '&autoplay=1';
        }
      } else {
        return url + '?autoplay=1';
      }
      return url;
    },
    onIframeLoad() {
      this.isIframeLoading = false;
    },
    setupVideo(url) {
      this.isIframeLoading = true;
      this.movie.videoUrl = this.ensureAutoplay(url);
    },
    startPlaying() {
      this.hasStartedPlaying = true;
      this.isIframeLoading = true;
    },
    toggleFullScreen() {
      const wrapper = this.$el.querySelector(".video-wrapper");
      if (!wrapper) return;
      const doc = document;
      const lockLandscape = () => {
        const orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
        if (orientation && typeof orientation.lock === "function") {
          orientation.lock("landscape").catch(() => {});
        }
      };
      const unlockOrientation = () => {
        const orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
        if (orientation && typeof orientation.unlock === "function") {
          orientation.unlock();
        }
      };

      if (!this.isFullscreen) {
        const video = this.$refs.videoPlayer;
        if (wrapper.requestFullscreen) wrapper.requestFullscreen();
        else if (wrapper.webkitRequestFullscreen) wrapper.webkitRequestFullscreen();
        else if (wrapper.mozRequestFullScreen) wrapper.mozRequestFullScreen();
        else if (wrapper.msRequestFullscreen) wrapper.msRequestFullscreen();
        else if (video && typeof video.webkitEnterFullscreen === "function") {
          try {
            video.webkitEnterFullscreen();
            this.isFullscreen = true;
            lockLandscape();
            return;
          } catch (e) {
            // ignore
          }
        }
        lockLandscape();
        this.isFullscreen = true;
      } else {
        const video = this.$refs.videoPlayer;
        if (doc.exitFullscreen) doc.exitFullscreen();
        else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
        else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen();
        else if (doc.msExitFullscreen) doc.msExitFullscreen();
        else if (video && typeof video.webkitExitFullscreen === "function") {
          try {
            video.webkitExitFullscreen();
          } catch (e) {
            console.log(e);
          }
        }
        unlockOrientation();
        this.isFullscreen = false;
      }
    },
    handleFullscreenChange() {
      const doc = document;
      const isFs = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      this.isFullscreen = isFs;
      const orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
      if (!isFs) {
        if (orientation && typeof orientation.unlock === "function") {
          orientation.unlock();
        }
        this.showControls = true;
        this.clearHideControlsTimer();
      } else {
        if (orientation && typeof orientation.lock === "function") {
          orientation.lock("landscape").catch(() => {});
        }
        this.startHideControlsTimer();
      }
    },
    // Keyboard shortcuts: left/right or J/L for +/-10s, space toggle play
    onKeyDown(e) {
      const tag = document.activeElement && document.activeElement.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        document.querySelector(":focus")?.isContentEditable
      )
        return;

      const key = e.key.toLowerCase();
      const video = this.$refs.videoPlayer;
      if (!video) return;

      if (key === "arrowright" || key === "l") {
        e.preventDefault();
        this.seekBy(10);
      } else if (key === "arrowleft" || key === "j") {
        e.preventDefault();
        this.seekBy(-10);
      } else if (key === " " || key === "spacebar") {
        e.preventDefault();
        this.togglePlay();
      }
    },
    seekBy(seconds) {
      const video = this.$refs.videoPlayer;
      if (!video || !isFinite(video.duration)) return;
      let t = (video.currentTime || 0) + seconds;
      if (t < 0) t = 0;
      if (t > video.duration) t = video.duration;
      video.currentTime = t;
      this.onTimeUpdate();
      // show controls when user uses keys
      this.showControlsTemporarily();
    },
    autoUpdateFavorite() {
      if (!this.idAccount || !this.movie.idMovie) return;

      const currentEp =
        this.movie.pageMovie[this.currentEpisodeIndex]?.name || this.movie.page;

      (this.movieFavorite.IDAccount = this.idAccount),
        (this.movieFavorite.IDMovies = this.movie.idMovie),
        (this.movieFavorite.slug = this.movie.slug),
        (this.movieFavorite.currentPage = currentEp),
        (this.movieFavorite.UrlMovies = this.movie.thumb_url),
        (this.movieFavorite.origin_name = this.movie.origin_name),
        (this.movieFavorite.name = this.movie.name),
        (this.movieFavorite.year = this.movie.year),
        (this.movieFavorite.lang = this.movie.lang),
        (this.movieFavorite.time = this.movie.time),
        (this.movieFavorite.quality = this.movie.quality),
        (this.movieFavorite.vote_average = this.movie.vote_average),
        (this.movieFavorite.poster_url = this.movie.poster_url),
        (this.movieFavorite.totalPage = this.movie.episode_total);

      // Cập nhật âm thầm không cần alert
      UpdateMoviesFavorite(
        this.movieFavorite,
        (res) => {
          if (res.data.status === "success") {
            this.liked = true;
          }
        },
        (err) => {
          console.error("Auto update favorite failed:", err);
        }
      );
    },
    scrollToActiveEpisode() {
      this.$nextTick(() => {
        // Tìm tất cả elements có class episode-item-active
        const activeElements = this.$el.querySelectorAll(
          ".episode-item-active"
        );

        activeElements.forEach((activeBtn) => {
          if (activeBtn) {
            // Tìm container episode-list gần nhất
            const episodeList = activeBtn.closest(".episode-list");
            if (episodeList) {
              // Tính vị trí của activeBtn trong container
              const containerRect = episodeList.getBoundingClientRect();
              const activeRect = activeBtn.getBoundingClientRect();
              const relativeTop = activeRect.top - containerRect.top;
              const containerHeight = episodeList.clientHeight;

              // Cuộn để đưa activeBtn vào giữa container
              const scrollTop =
                episodeList.scrollTop +
                relativeTop -
                containerHeight / 2 +
                activeRect.height / 2;

              episodeList.scrollTo({
                top: scrollTop,
                behavior: "smooth",
              });
            } else {
              // Fallback: cuộn toàn trang nếu không tìm thấy container
              activeBtn.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
              });
            }
          }
        });
      });
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
      this.movieFavorite.time = this.movie.time;
      this.movieFavorite.quality = this.movie.quality;
      this.movieFavorite.vote_average = this.movie.tmdb?.vote_average;
      this.movieFavorite.poster_url = this.movie.poster_url;
      this.movieFavorite.totalPage = this.movie.episode_total;
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
      } else {
        alert(this.$t("Vui lòng đăng nhập để sử dụng chức năng này"));
        this.$router.push({
          path: "/login",
          query: { redirect: this.$route.fullPath },
        });
      }
    },

    getOptimizedImage(imagePath) {
      return `${
        imagePath.includes("https://phimimg.com/upload")
          ? this.urlImage1 + imagePath
          : this.urlImage1 + "https://phimimg.com/" + imagePath
      }`;
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
          behavior: "smooth",
        });
      }
    },

    scrollSuggestedRight() {
      const container = this.$refs.suggestedScrollContainer;
      if (container) {
        container.scrollBy({
          left: 280,
          behavior: "smooth",
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
        case "tiktok":
          shareLink = `https://www.tiktok.com/`;
          break;
      }
      // const shareUrl = window.location.href;

      window.open(shareLink, "_blank");
    },
    ResponseError() {
      Tracking(
        { page: "Có xảy ra lỗi: " + window.location.href },
        () => {},
        (err) => console.log(err)
      );
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

    playEpisode(episode) {
      try {
        console.log(episode);
        this.isLoading = true;
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
        if (this.$route.query.page !== normalized) {
          this.$router.replace({
            name: "MovieDetail",
            params: { slug: this.slug },
            query: { page: normalized },
          });
        }

        this.isIframeLoading = true;
        this.movie.videoUrl = this.ensureAutoplay(episode.link_embed);

        // cập nhật tập mới
        this.currentEpisodeIndex = this.movie.pageMovie.findIndex(
          (e) => e.name === episode.name
        );
        this.favoriteUpdateCounter = 0; // Reset bộ đếm khi đổi tập
        this.hasAutoUpdatedFavorite = false;

        //this.GetComment();
        this.isLoading = false;
        this.$nextTick(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          this.scrollToActiveEpisode();
        });
      } catch {
        this.isLoading = false;
      }
    },
    switchServer(server) {
      this.isLoading = true;

      // this.movie.pageMovie = server.server_data;
      this.isIframeLoading = true;
      this.movie.pageMovie = server.server_data.sort(
        (a, b) => parseInt(a.name.match(/\d+/)) - parseInt(b.name.match(/\d+/))
      );
      
      if (
        this.movie.page == "Full" ||
        // this.movie.page.toUpperCase().includes("HOÀN TẤT") ||
        this.movie.page.includes("/")
      ) {
        this.movie.videoUrl =
          this.ensureAutoplay(server.server_data[server.server_data.length - 1].link_embed);
        this.movie.LinkDown =
          server.server_data[server.server_data.length - 1].link_m3u8;
      } else {
        var tap = this.movie.page.split("Tập ")[1].trim();
        const data = server.server_data.includes(tap);
        if (data) {
          this.movie.videoUrl = this.ensureAutoplay(data.link_embed);
          this.movie.LinkDown = data.link_m3u8;
        }
      }

      this.GetComment();
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
      this.scrollToActiveEpisode();
    },
    nextEpisode() {
      if (this.currentEpisodeIndex < this.movie.pageMovie.length - 1) {
        this.currentEpisodeIndex++;
        const nextEp = this.movie.pageMovie[this.currentEpisodeIndex];
        this.playEpisode(nextEp);
      }
    },
    prevEpisode() {
      if (this.currentEpisodeIndex > 0) {
        this.currentEpisodeIndex--;
        const prevEp = this.movie.pageMovie[this.currentEpisodeIndex];
        this.playEpisode(prevEp);
      }
    },
  },
  computed: {
    idAccount() {
      return this.$store.state.empInfor.ID || localStorage.getItem("name");
    },
    avatar() {
      return (
        this.$store.state.empInfor?.Avatar || this.$store.state.Avatar || ""
      );
    },
    isFanCung() {
      // Lấy giá trị từ localStorage với tên là 'name'
      const fanStatus = localStorage.getItem("name");
      return fanStatus == 2 || fanStatus == 3;
    },
    visibleEpisodes() {
      if (!this.movie?.pageMovie) return [];
      return this.showAllEpisodes
        ? this.movie.pageMovie // Hiện tất cả tập
        : this.movie.pageMovie; // Chỉ 20 tập đầu
      //: this.movie.pageMovie.slice(0, 20); // Chỉ 20 tập đầu
    },
    visibleEpisodesRight() {
      return this.movie.pageMovie; // Hiện tất cả tập
    },
    hasPlayableVideo() {
      return !!this.movie.videoUrl;
    },
    isLongDescription() {
      return this.movie?.description?.length > 200;
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
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08), 0 8px 24px rgba(0, 0, 0, 0.6);

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Smooth focus state */
  cursor: pointer;
}

.video-player.video-loading {
  opacity: 0;
}

.video-loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  background: #000;
}

.video-player-poster-blur {
  position: absolute;
  inset: 0;
  filter: blur(8px);
  opacity: 0.6;
}

.video-loading-overlay .v-progress-circular {
  z-index: 3;
}

.video-wrapper:hover,
.video-wrapper:focus-within {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12),
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

/* Toolbar hiện đại phía dưới video */
.player-toolbar {
  background-color: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.server-tabs-wrapper::-webkit-scrollbar,
.action-buttons-group::-webkit-scrollbar {
  height: 4px;
}
.server-tabs-wrapper::-webkit-scrollbar-track,
.action-buttons-group::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
.server-tabs-wrapper::-webkit-scrollbar-thumb,
.action-buttons-group::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.action-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0;
  white-space: nowrap;
}

.server-btn {
  letter-spacing: 0;
  transition: all 0.2s ease;
}

/* Khung chứa các tập phim (Desktop) */
.episode-panel {
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
}

.episode-list {
  max-height: 550px;
  overflow-y: auto;
}

.episode-list::-webkit-scrollbar {
  width: 6px;
}
.episode-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
.episode-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
.episode-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
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
  font-size: clamp(10px, 3vw, 13px);
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

a {
  color: #fff;
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

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: black;
  cursor: pointer;
  will-change: auto;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}
.content-desc {
  font-size: 14px;
  line-height: 1.6;
}
.content-collapsed {
  max-height: 65px; /* ~3 lines */
  overflow: hidden;
  position: relative;
  -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
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
  height: 44px !important;
  letter-spacing: 0.3px;
  border-radius: 10px !important;
  transition: all 0.2s ease;
}
.episode-item-active {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15) inset;
  transform: scale(1.02);
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

/* Loading overlay for video */
.video-loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 25;
  background: rgba(0, 0, 0, 0.35);
}

.video-play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background 0.3s ease;
}
.video-play-overlay:hover {
  background: rgba(0, 0, 0, 0.6);
}
.video-play-overlay .v-icon {
  transition: transform 0.3s ease;
}
.video-play-overlay:hover .v-icon {
  transform: scale(1.1);
}
.video-play-overlay.video-unavailable {
  cursor: default;
}
.video-play-overlay.video-unavailable:hover {
  background: rgba(0, 0, 0, 0.4);
}
.video-play-overlay.video-unavailable:hover .v-icon {
  transform: scale(1);
}
.video-player-poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.overlay-text {
  color: white;
  margin-top: 12px;
  font-size: 1.1rem;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0,0,0,0.8);
}
/* Thông tin phim */
/* Info Grid Modern */
.info-grid-modern {
  line-height: 1.6;
}
.info-label {
  min-width: 90px;
  color: orange;
  font-weight: 600;
}
.info-value {
  flex: 1;
  word-break: break-word;
}
.hover-text {
  transition: color 0.2s ease;
  cursor: pointer;
}
.hover-text:hover {
  color: #f8b230;
}
.avatar-with-crown {
  position: relative;
  display: inline-flex; /* Đảm bảo vương miện được định vị tương đối với avatar */
  align-items: center;
  justify-content: center;
}

.crown-icon {
  position: absolute;
  top: -5px; /* Điều chỉnh vị trí theo ý muốn */
  right: 5px; /* Điều chỉnh vị trí theo ý muốn */
}
</style>
