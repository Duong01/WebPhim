<template>
  <div class="ranking-row">
    <div
      v-for="(movie, index) in movies.slice(0, 10)"
      :key="movie.slug"
      class="ranking-item"
    >
      <div class="rank">
        {{ index + 1 }}
      </div>

      <v-img :src="getImage(movie)" aspect-ratio="9/16" cover class="poster" >
        <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular indeterminate />
                  </div>
                </template>
      </v-img>

    </div>
  </div>
</template>

<script>
export default {
  props: ["movies", "loading"],

  methods: {
    getImage(movie) {
      if (movie.thumbnail) return "https://hoathinh3d.vn" + movie.thumbnail;

      if (movie.thumb_url?.includes("http")) return movie.thumb_url;

      return "https://phimimg.com/" + movie.thumb_url;
    },
  },
};
</script>

<style scoped>
.ranking-row {
  display: flex;

  gap: 20px;

  overflow-x: auto;
}

.ranking-item {
  display: flex;

  align-items: flex-end;

  gap: 6px;
}

.rank {
  font-size: 100px;

  font-weight: 900;

  color: transparent;

  -webkit-text-stroke: 3px white;
}

.poster {
  width: 140px;

  border-radius: 6px;
}
</style>