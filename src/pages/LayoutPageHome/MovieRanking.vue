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
  padding: 10px 4px;
  scrollbar-width: none;
}

.ranking-row::-webkit-scrollbar {
  display: none;
}

.ranking-item {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  transition: transform 0.35s var(--zc-ease);
}

.ranking-item:hover {
  transform: translateY(-6px);
}

.rank {
  font-size: 100px;
  font-weight: 900;
  color: transparent;
  -webkit-text-stroke: 3px rgba(255, 255, 255, 0.85);
  line-height: 0.9;
  transition: -webkit-text-stroke-color 0.3s ease;
}

.ranking-item:hover .rank {
  -webkit-text-stroke-color: #ffb700;
}

.poster {
  width: 140px;
  border-radius: 12px;
  box-shadow: 0 8px 26px rgba(0, 0, 0, 0.6);
  transition: box-shadow 0.35s ease;
}

.ranking-item:hover .poster {
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.7), 0 0 22px rgba(255, 140, 0, 0.18);
}
</style>
