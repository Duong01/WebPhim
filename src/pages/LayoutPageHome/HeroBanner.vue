<template>
<v-row no-gutters class="align-center mt-6 mb-2">
  <v-col cols="12">
    <h1 class="category-title d-flex align-center" style="color: orange">
      
      🔥 {{ $t('Hoạt Hình Trung Quốc – Bảng Xếp Hạng Thịnh Hành') }}
    </h1>
  </v-col>
</v-row>

<!-- <div class="day-tabs">
      <v-btn
        v-for="day in days"
        :key="day.value"
        :color="daily === day.value ? 'blue-darken-3' : 'grey-darken-3'"
        @click="changeDay(day.value)"
        rounded
      >
        {{ day.label }}
      </v-btn>
    </div> -->
<v-divider :content-offset="[12, 2.5]" opacity=".7">* * *</v-divider>
<v-slide-group
  show-arrows="desktop"
  class="trending-track"
  v-if="movie.length"
>
  <v-slide-group-item
    v-for="(item, index) in movie"
    :key="`${item._type}-${index}`"
    class="trending-item"
  >
    
      <v-card role="button" class="trending-card" elevation="0" @click="goMovies(item)">
        <!-- POSTER -->
        <v-img
          :src="'https://hoathinh3d.vn'+item.thumbnail"
          aspect-ratio="9/16"
          cover
          loading="lazy"
          class="trending-poster"
          transition="fade-transition"
          referrerpolicy="no-referrer"
        >
          <!-- BADGE -->
          <div class="trending-rank" :class="'rank-' + (index + 1)">
            {{ index + 1 }}
          </div>
          <div class="trending-rating">
            <template v-if="item._type === 'early'">
              {{ item.early_screening_time }}
            </template>
            <template v-else>
              {{ item.rating }} ⭐
            </template>
            
          </div>

          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular indeterminate :width="5" />
            </div>
          </template>
        </v-img>

        <!-- INFO -->
        <div class="trending-info">
          
          <div class="trending-details">
            <div class="trending-title">
              {{ item.title }}
              
            </div>
            <div class="trending-original">
              📺 Tập {{ item.current_episode }}
            </div>
          </div>
          <v-tooltip
            activator="parent"
            location="top"
            
          >{{ item.title }}</v-tooltip>
        </div>
        
      </v-card>
  </v-slide-group-item>
</v-slide-group>
</template>

<script>
export default {
  props: ["movie"],
  methods: {
    goMovies(url) {
      var slug = url.slug
      this.$store.commit("imageThumbnail","https://hoathinh3d.vn/"+url.thumbnail)
      this.$router.push({
        name : 'Movies',
        params: {slug}
      })
    },
  },
};
</script>

<style scoped>

/* ===== TITLE ===== */

.category-title{
font-size:22px;
font-weight:800;
letter-spacing:.6px;
margin-bottom:8px;
}


/* ===== SLIDE TRACK ===== */

.trending-track{

padding:12px;

scroll-behavior:smooth;

display:flex;

gap:14px;

}

/* animation khi load */

.trending-track{
animation:fadeUp .6s ease forwards;
}

@keyframes fadeUp{

from{
opacity:0;
transform:translateY(20px);
}

to{
opacity:1;
transform:translateY(0);
}

}


/* ===== CARD ===== */

.trending-card{

width:240px;

border-radius:16px;

overflow:hidden;

background:#141414;

cursor:pointer;

transform:translateZ(0);

will-change:transform;

transition:
transform .45s cubic-bezier(.22,1,.36,1),
box-shadow .45s ease;

}

/* hover animation */

.trending-card:hover{

transform:translateY(-10px) scale(1.06);

box-shadow:
0 20px 60px rgba(0,0,0,.8);

z-index:5;

}


/* ===== POSTER ===== */

.trending-poster{

aspect-ratio:9/16;

background:#000;

overflow:hidden;

}

/* zoom image nhẹ */

.trending-poster img,
.trending-poster .v-image__image{

transition:transform .6s cubic-bezier(.22,1,.36,1);

}

.trending-card:hover .trending-poster img,
.trending-card:hover .trending-poster .v-image__image{

transform:scale(1.06);

}


/* ===== RATING ===== */

.trending-rating{

position:absolute;

top:8px;
right:8px;

padding:3px 10px;

font-size:12px;

font-weight:600;

border-radius:999px;

background:rgba(0,0,0,.7);

backdrop-filter:blur(8px);

color:#ffcc00;

}


/* ===== RANK NUMBER ===== */

.trending-rank{

position:absolute;

bottom:-6px;
left:10px;

font-size:40px;

font-weight:900;

line-height:1;

text-shadow:2px 2px 10px rgba(0,0,0,.7);

transition:transform .4s cubic-bezier(.22,1,.36,1);

}

.trending-card:hover .trending-rank{

transform:scale(1.08);

}


/* ===== RANK COLORS ===== */

.rank-1{color:#ff3b30;}
.rank-2{color:#ff9500;}
.rank-3{color:#ffd60a;}
.rank-4{color:#9bb6ad;}
.rank-5{color:#df95df;}
.rank-6{color:#b85e6a;}
.rank-7{color:#ffffff;}
.rank-8{color:#2c9690;}
.rank-9{color:#ebc89b;}
.rank-10{color:#8eb48d;}


/* ===== INFO ===== */

.trending-info{

padding:10px;

height:70px;

display:flex;

align-items:flex-start;

}


/* ===== TEXT ===== */

.trending-title{

font-size:14px;

font-weight:600;

line-height:1.3;

overflow:hidden;

display:-webkit-box;

-webkit-line-clamp:2;

-webkit-box-orient:vertical;

}

.trending-original{

font-size:12px;

color:#aaa;

margin-top:2px;

}


/* ===== SLIDE ITEM ===== */

.v-slide-group-item{

flex:0 0 auto;

transition:transform .3s ease;

}


/* ===== RESPONSIVE ===== */

@media (max-width:768px){

.trending-card{
width:180px;
}

.trending-rank{
font-size:32px;
}

}

</style>
