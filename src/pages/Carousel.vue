<template>
  <v-container fluid class="pa-0">
    <v-carousel
      v-if="videoList.length"
      height="450"
      hide-delimiters
      progress="primary"
      show-arrows="hover"
      cycle
      interval="10000"
    >
      <v-carousel-item
        v-for="(item) in videoList"
        :key="item._id"
      >
      <v-img
        :src="pathImage + item.poster_url"
        cover
        height="100%"
      >
        <!-- Overlay thông tin -->
        <v-sheet
          color="rgba(0, 0, 0, 0.5)"
          height="100%"
          class="d-flex flex-column justify-end px-6 pb-6"
        >
          <div class="text-white">
            <h2 class="text-h4 font-weight-bold mb-2">{{ item.name }}</h2>
            <p class="mb-1"><strong>Năm:</strong> {{ item.year }}</p>
            <p class="mb-1"><strong>Thể loại:</strong> {{ item.category.map(cat => cat.name).join(', ') }}</p>

            <v-btn
              color="red-accent-3"
              variant="flat"
              @click="goToDetail(item.slug)"
            >
              Xem ngay
            </v-btn>
          </div>
        </v-sheet>

      </v-img>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script>
import { ListMovieByCate } from "@/model/api";

export default {
  name: "CarouselPage",
  data() {
    return {
      pathImage: "https://img.ophim.live/uploads/movies/",
      videoList: [],
      path: "phim-moi-cap-nhat",
    };
  },
  created() {
    this.ListMovie();
  },
  methods: {
    ListMovie() {
       ListMovieByCate(`${this.path}?page=1`, (result) => {
        if (result.status === 'success') {
          this.videoList = result.data.items.slice(1,6)
        }
      }, (err) => {
        console.log(err)
      })
    },
    goToDetail(slug) {
      this.$router.push({ name: 'MovieDetail', params: { slug } });
    },
  },
};
</script>

<style scoped>
.text-h4 {
  font-weight: bold;
}
</style>
