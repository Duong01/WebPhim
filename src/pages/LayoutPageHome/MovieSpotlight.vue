<template>
  <div class="movie-row">
    <div class="row-wrapper">
      <!-- LEFT -->
      <v-btn
        v-show="showLeft"
        icon
        class="arrow arrow-left"
        @click="scrollLeft"
      >
        <v-icon size="28">mdi-chevron-left</v-icon>
      </v-btn>

      <!-- LIST -->
      <div class="movie-scroll" ref="scroll" @scroll="checkScroll">
        <!-- SKELETON -->
        <template v-if="loading">
          <div v-for="i in 8" :key="i" class="movie-card">
            <div class="skeleton"></div>
          </div>
        </template>
        <template v-else-if="movies.length === 0">
          <div
            v-for="i in 8"
            :key="i"
            class="movie-card"
          >
            <v-img
              class="mx-auto"
              :src="imageError"
            ></v-img>
          </div>
        </template>
        <template v-else>

          <div v-for="(movie, i) in movies" :key="i" class="movie-card">
            <router-link
              :to="{ name: 'Movies', params: { slug: movie.slug } }"
              class="movie-link"
            >
              <!-- THUMB (ảnh nền) -->
              <div class="thumb-wrapper">
                <v-img
                  :src="movie.thumb_url"
                  aspect-ratio="16/9"
                  cover
                  height="200"
                  class="thumb"
                >
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular indeterminate />
                  </div>
                </template>
                </v-img>

                <!-- POSTER -->
                <v-img
                  :src="movie.poster_url"
                  aspect-ratio="2/3"
                  cover
                  height="80"
                  class="poster"
                />
              </div>

              <!-- INFO -->
              <div class="info">
                <div class="name">
                  {{ movie.name }}
                </div>

                <div class="origin">
                  {{ movie.origin_name }}
                </div>

                <div class="meta">
                  <span class="tag">HD</span>
                  <span class="year">{{ movie.year }}</span>
                  <span class="time">
                    {{ movie.time || movie.episode || "0 phút" }}
                  </span>
                </div>
              </div>
            </router-link>
          </div>
        </template>

        
      </div>

      <!-- RIGHT -->
      <v-btn
        v-show="showRight"
        icon
        class="arrow arrow-right"
        @click="scrollRight"
      >
        <v-icon size="28">mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import { urlImage1 } from "@/model/api";
import imageError from "@/assets/imgLoading.gif";

export default {
  props: ["movies"],

  data() {
    return {
      imageError: imageError,

      urlImage1,
      showLeft: false,
      showRight: true,
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.checkScroll();
      window.addEventListener("resize", this.checkScroll);
    });
  },

  methods: {
    getImage(path){

      if(!path) return ""

      if(path.includes("http"))
        return path

      return this.urlImage1 +
        "https://phimimg.com/" +
        path

    },

    scrollLeft() {
      const el = this.$refs.scroll;

      el.scrollBy({
        left: -el.clientWidth * 0.9,
        behavior: "smooth",
      });
    },

    scrollRight() {
      const el = this.$refs.scroll;

      el.scrollBy({
        left: el.clientWidth * 0.9,
        behavior: "smooth",
      });
    },

    checkScroll() {
      const el = this.$refs.scroll;
      if (!el) return;

      this.showLeft = el.scrollLeft > 5;

      this.showRight = el.scrollWidth > el.clientWidth + el.scrollLeft + 5;
    },
  },
};
</script>

<style scoped>
.movie-scroll {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 10px 20px;
  scrollbar-width: none;
}
.movie-scroll::-webkit-scrollbar {
  display: none;
}

/* CARD */
.movie-card {
  width: 300px;
  flex: 0 0 auto;
  transition: transform 0.35s var(--zc-ease);
}
.movie-card:hover {
  transform: translateY(-6px);
}

/* THUMB */
.thumb-wrapper {
  position: relative;
}

.thumb {
  border-radius: 14px;
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.6);
  transition: box-shadow 0.35s ease;
}

.movie-card:hover .thumb {
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.7), 0 0 22px rgba(255, 140, 0, 0.15);
}

/* POSTER (small, bottom-left) */
.poster {
  position: absolute;
  bottom: -30px;
  left: 12px;

  width: 70px;
  height: 100px;

  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.75);
  border: 2px solid rgba(255, 255, 255, 0.08);
}

/* INFO */
.info {
  margin-top: 40px;
  padding-left: 90px;
}

.name {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
  transition: color 0.25s ease;
}

.movie-card:hover .name {
  color: #ffb700;
}

.origin {
  font-size: 13px;
  color: var(--zc-text-dim);
  margin-top: 2px;
}

.meta {
  margin-top: 6px;
  font-size: 12px;
  display: flex;
  gap: 6px;
  align-items: center;
}

.tag {
  background: var(--zc-grad);
  color: #0a0a12;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 5px;
}

.year {
  color: #ffb700;
  font-weight: 600;
}

.time {
  color: var(--zc-text-dim);
}

/* ARROWS */
.arrow {
  position: absolute;
  top: 40%;
  width: 50px;
  height: 50px;
  background: rgba(10, 10, 18, 0.8);
  color: white;
  border-radius: 50%;
  z-index: 30;
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  transition: all 0.3s var(--zc-ease);
}

.arrow:hover {
  background: var(--zc-grad);
  color: #0a0a12;
  box-shadow: 0 8px 22px rgba(255, 140, 0, 0.45);
  transform: scale(1.06);
}

.arrow-left {
  left: 0;
}

.arrow-right {
  right: 0;
}

/* SKELETON */
.skeleton {
  height: 180px;
  border-radius: 14px;
  background: linear-gradient(110deg, #16161f 25%, #23232f 37%, #16161f 63%);
  background-size: 200% 100%;
  animation: skeleton 1.2s infinite;
}

@keyframes skeleton {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}

/* MOBILE */
@media (max-width: 768px) {
  .movie-card {
    width: 220px;
  }

  .poster {
    width: 60px;
    height: 90px;
  }

  .info {
    padding-left: 80px;
  }

  .arrow {
    display: none;
  }
}

.movie-link {
  text-decoration: none;
  color: inherit;
}
.movie-row {
  position: relative;
}

.row-wrapper {
  position: relative;
  overflow: visible;
}
</style>
