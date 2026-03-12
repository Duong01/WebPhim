<template>

<v-row no-gutters class="align-center mt-6 mb-2">
  <v-col cols="12">
    <h1 class="category-title d-flex align-center" style="color: orange">
      
      {{ $t('BXH HTTQ THỊNH HÀNH') }}
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
  v-if="earlyMovies.length"
>
  <v-slide-group-item
    v-for="(item, index) in earlyMovies"
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

props:{
title:String,
movies:Array
}

}
</script>

<style scoped>

.trending-row{

padding:30px 40px;

}

.row-header h2{

color:#fff;
font-size:24px;
font-weight:700;
margin-bottom:15px;

}

.trending-scroll{

display:flex;
gap:18px;
overflow-x:auto;
scrollbar-width:none;

}

.trending-scroll::-webkit-scrollbar{
display:none;
}

.trending-item{

display:flex;
align-items:flex-end;

gap:6px;

cursor:pointer;

min-width:210px;

transition:transform .25s;

}

.trending-item:hover{
transform:scale(1.1);
z-index:10;
}

.rank{

font-size:90px;
font-weight:900;

color:transparent;

-webkit-text-stroke:3px #fff;

line-height:1;

opacity:.9;

}

.poster{

width:130px;

border-radius:6px;

overflow:hidden;

}

.rating{

position:absolute;
top:6px;
right:6px;

background:#000c;
color:#fff;

font-size:12px;

padding:2px 6px;

border-radius:4px;

}

.episode{

position:absolute;
bottom:6px;
left:6px;

background:#e50914;

font-size:12px;

padding:2px 6px;

border-radius:4px;

color:#fff;

}

.movie-title{

width:130px;

color:#ddd;

font-size:13px;

margin-top:6px;

white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis;

}

</style>