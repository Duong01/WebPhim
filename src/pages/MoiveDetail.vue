<template>
  <div class="movie-detail">
    <!-- Phần 1: Video phim -->
    <iframe
      :src="movie.videoUrl"
      autoplay
      muted
      width="100%"
      height="600px"
      allowfullscreen
      frameborder="0"
      style="border: 1px solid #ccc"
    >
      Your browser does not support the video tag.
    </iframe>
    <!-- Tập phim -->
    <b-card class="bg-light text-dark">
      <b-card-header class="d-flex align-items-center">
        <strong class="text-dark me-2">{{ movie.title }}</strong>
        <b-badge variant="danger">Tập {{ movie.page }}</b-badge>
      </b-card-header>
      <b-card-body class="text-left">
        <b-button-group class="d-flex flex-wrap justify-content">
          <div
            v-for="(episode, index) in movie.pageMovie"
            :key="index"
            class="episode-button-wrapper"
            style="width: 80px; height: 40px; margin: 10px 20px"
          >
            <b-button
              variant="dark"
              class="episode-button"
              style="margin: 10px 20px; width: 100%; height: 100%"
              @click="playEpisode(episode)"
            >
              {{ episode.slug }}
            </b-button>
          </div>
        </b-button-group>
      </b-card-body>
    </b-card>

    <!-- Phần 2: Thông tin phim -->
    <div class="movie-info text-left">
      <h1>{{ movie.title }}</h1>
      <p v-html="movie.description"></p>
      <p><strong>{{$t('Diễn viên:')}} </strong>{{ movie.actors.join(", ") }}</p>
      <p><strong>{{$t('Đạo diễn:')}}</strong> {{ movie.director.join(", ") }}</p>
      <p><strong>{{$t('Thể loại')}}:</strong> {{ movie.genre.name }}</p>
      <p>
        <strong>{{$t('Đánh giá:')}}</strong> <el-rate v-model="movie.rating" disabled />
      </p>
    </div>

    <!-- Phần 3: Đề xuất phimphim -->
    <div class="suggested-movies text-left">
      <h1>{{$t('Đề xuất cho bạn!')}}</h1>
      <div class="scroll-container movie-list" ref="movieList">
        <router-link
          v-for="suggested in suggestedMovies.slice(0, 8)"
          :key="suggested.id"
          :to="{ name: 'MovieDetail', params: { slug: suggested.slug } }"
          class="text-decoration-none"
        >
        <b-card no-body class="movie-card">
          <b-card-img :src="getOptimizedImage(suggested.poster_url)" alt="Movie Image" class="movie-image" loading="lazy" />
          <div class="overlay">
              <b-badge v-if="suggested.episode_current == 'Tập 0'" variant="warning" class="badge-top-left">Full-{{ suggested.lang }}</b-badge>
              <b-badge v-else variant="warning" class="badge-top-left">{{ suggested.episode_current }}-{{ suggested.lang }}</b-badge>
            </div>
            <b-card-body class="p-2 text-center movie-title">
              <b-card-title class="m-0 text-truncate" :title="suggested.name">
                {{ suggested.name }}
              </b-card-title>
            </b-card-body>
        </b-card>
          <!-- <b-img
            width="250"
            height="200"
            :src="urlImage + suggested.poster_url"
            :alt="suggested.origin_name"
            lazy
          />
          <b-card-body class="p-2 text-center movie-title">
              <b-card-title class="m-0 text-truncate" :title="suggested.name">
                {{ suggested.name }}
              </b-card-title>
            </b-card-body> -->
          <!-- <p>{{ suggested.title }}</p> -->
        </router-link>
      </div>
       <!-- Scroll Buttons -->
    <div class="scroll-buttons">
      <div class="scroll-button" @click="scrollLeft">←</div>
      <div class="scroll-button" @click="scrollRight">→</div>
    </div>
    </div>


    <!-- Phần 4: Binh luận -->
    <div class="comments">
      <h2>{{$t('Bình luận')}}</h2>
      <b-form-textarea v-model="newComment" :placeholder="$t('Viết bình luận...')" />
      <b-button @click="addComment">{{$t('Gửi')}}</b-button>
      <ul>
        <li v-for="(comment, index) in comments" :key="index">{{ comment }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { MoveInfor, ListMovieByCate, urlImage } from "@/model/api";

export default {
  name: "MovieDetail",
  data() {
    return {
      isLoading: true,
      movie: {
        title: "",
        valueRate: 5,
        description: "",
        videoUrl: "",
        actors: [],
        director: [],
        genre: "",
        pageMovie: [],
        page: 1,
        rating: 5,
        categoris: "",
      },
      urlImage: urlImage,
      suggestedMovies: [],
      comments: [],
      newComment: "",
    };
  },
  props: ["slug"],
  watch: {
    slug(newSlug) {
      this.MoveInfor(newSlug);
      this.ListMovieByCate();
    },
  },
  mounted() {
    this.MoveInfor(this.slug);
    this.ListMovieByCate();
  },
  methods: {
    // Call API
    MoveInfor(slug) {
      MoveInfor(
        slug,
        (result) => {
          if (result.status == true) {
            this.movie.title = result.movie.name;
            this.movie.description = result.movie.content;
            this.movie.pageMovie = result.episodes[0].server_data;
            this.movie.director = result.movie.director;
            this.movie.videoUrl = result.episodes[0].server_data[0].link_embed
            this.movie.actors = result.movie.actor;
            for (var i = 0; i < result.movie.country.length; i++) {
              this.movie.genre = result.movie.country[i];
            }
            this.movie.categoris = result.movie.category[0].slug;
            this.isLoading = false  
            
          }
          console.log(result);
        },
        (err) => {
          console.log(err);
        }
      );
    },
    getOptimizedImage(imagePath) {
      return `${this.urlImage+encodeURIComponent(imagePath)}&w=384&q=100`;
    },
    ListMovieByCate() {
      ListMovieByCate(
        this.movie.categoris,

        (data) => {
          if (data.status == "success") {
            this.suggestedMovies = data.data.items;
            this.isLoading = false;
          }
          console.log(data);
        },
        (err) => {
          console.log(err);
        }
      );
    },

    addComment() {
      if (this.newComment.trim()) {
        this.comments.push(this.newComment);
        this.newComment = "";
      }
    },
    playEpisode(episode) {
      this.isLoading = true
      this.movie.title = episode.filename;
      this.movie.videoUrl = episode.link_embed;
      this.movie.page = episode.slug;
    },

    scrollLeft() {
      const container = this.$refs.movieList;
      container.scrollLeft -= 250; // Adjust the scroll distance as needed
    },
    
    // Scroll the container to the right
    scrollRight() {
      const container = this.$refs.movieList;
      container.scrollLeft += 250; // Adjust the scroll distance as needed
    },


  },
};
</script>

<style scoped>
.movie-video video {
  width: 100%;
  max-height: 600px;
}

.movie-info {
  text-align: left;
  margin-top: 20px;
}

.suggestion-list {
  display: flex;
  gap: 15px;
}

.suggestion-card {
  flex: 0 0 250px;
}

.comment-list {
  list-style: none;
  padding: 0;
}

.comment-list li {
  background: #f1f1f1;
  padding: 10px;
  margin-bottom: 5px;
}
.suggested-movies {
  text-align: center;
}

.movie-slider {
  display: flex;
  align-items: center;
  position: relative;
}

.movie-list {
  display: flex;
  overflow: hidden;
  width: 100%; /* hoặc một giá trị cố định nếu bạn muốn giới hạn chiều rộng */
  transition: transform 0.3s ease;
}

.movie-card {
  margin-right: 22px;
  text-align: center;
  flex-shrink: 0; /* Không co lại khi không gian bị hạn chế */
}
.suggested-movies {
  position: relative;
}

.scroll-container {
  display: flex;
  overflow-x: scroll;
  gap: 16px;
  padding-bottom: 8px;
}

.movie-card {
  width: 250px;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-align: center;
  cursor: pointer;
  position: relative;
  background-color: #1c1c1e;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}
.movie-card:hover {
  transform: scale(1.05);
}

.movie-card img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.movie-card p {
  margin-top: 8px;
  font-size: 16px;
  font-weight: bold;
}

.scroll-buttons {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  width: 100%;
  visibility: hidden;
}

.scroll-container:hover + .scroll-buttons,
.scroll-buttons:hover {
  visibility: visible;
}

.scroll-button {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.scroll-button:hover {
  background-color: rgba(0, 0, 0, 0.7);
}


.movie-title {
  background: rgba(0, 0, 0, 0.7); /* Làm mờ nền đen */
  color: white;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 5px;
  font-size: 20px;
}
h4{
  font-size: 20px;
}
.overlay {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
