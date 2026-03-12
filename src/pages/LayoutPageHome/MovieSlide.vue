<template>
  <div class="hero">

    <div v-if="!imageLoaded" class="hero-skeleton"></div>

  <!-- IMAGE -->
    <img
        v-show="imageLoaded"
        :src="currentImage"
        class="hero-bg"
        @load="imageLoaded=true"
    />

    <!-- CONTENT -->
    <div class="hero-content">

      <div class="left">
        <h1 class="title">{{ currentMovie.name }}</h1>

        <div class="meta">
          <span class="badge">{{ currentMovie.year }}</span>
          <span class="badge">HD Vietsub</span>
        </div>

        <p class="desc">
          {{ currentMovie.content?.slice(0,150) }}...
        </p>

        <div class="actions">
          <button class="btn-play">
            ▶ Xem Ngay
          </button>

          <button class="btn-icon">♡</button>
          <button class="btn-icon">⤴</button>
        </div>
      </div>

      <!-- THUMBNAILS -->
      <div class="thumbs">
        <div
          v-for="(movie,index) in movies"
          :key="movie.slug"
          class="thumb"
          :class="{active:index===activeIndex}"
          @click="setMovie(index)"
        >
          <img :src="getImage(movie.thumb_url)" />
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { urlImage1 } from "@/model/api";

export default {
  props:["movies"],

  data(){
    return{
      urlImage1,
      activeIndex:0,
        imageLoaded:false
    }
  },
  watch:{
  activeIndex(){
    this.imageLoaded=false
  }
},

  computed:{
    currentMovie(){
      return this.movies?.[this.activeIndex] || {}
    },

    currentImage(){
      if(!this.currentMovie.thumb_url) return ""

      if(this.currentMovie.thumb_url.includes("http"))
        return this.currentMovie.thumb_url

      return this.urlImage1+"https://phimimg.com/"+this.currentMovie.thumb_url
    }
  },

  methods:{
    setMovie(index){
      this.activeIndex=index
    },

    getImage(path){
      if(path?.includes("http")) return path
      return this.urlImage1+"https://phimimg.com/"+path
    }
  }
}
</script>
<style scoped>

.hero{
  position:relative;
  height:520px;
  border-radius:20px;
  overflow:hidden;
  
}

/* BACKGROUND */

.hero-bg{
  position:absolute;
  inset:0;

  background-size:cover;
  background-position:center;

  filter:brightness(.7);

  width:100%;
  height:100%;

  object-fit:cover;
}

/* GRADIENT */

.hero::before{
  content:"";
  position:absolute;
  inset:0;

  background:linear-gradient(
    90deg,
    rgba(0,0,0,.95) 0%,
    rgba(0,0,0,.8) 30%,
    rgba(0,0,0,.2) 60%,
    transparent 100%
  );
}

/* CONTENT */

.hero-content{
  position:relative;

  display:flex;
  flex-direction:column;

  justify-content:center;

  height:100%;

  padding:60px;

  z-index:2;
}

/* LEFT */

.left{
  max-width:500px;
}

.title{
  font-size:48px;
  font-weight:800;
  color:white;
}

.meta{
  margin:12px 0;
}

.badge{
  background:#222;
  padding:6px 10px;
  border-radius:6px;
  margin-right:6px;
  font-size:13px;
}

.desc{
  color:#bbb;
  margin-top:10px;
  line-height:1.5;
}

/* BUTTONS */

.actions{
  margin-top:20px;
  display:flex;
  gap:12px;
}

.btn-play{
  background:#ff0000;
  color:white;

  padding:12px 24px;

  border:none;

  border-radius:30px;

  font-weight:700;

  cursor:pointer;
}

.btn-icon{
  width:42px;
  height:42px;

  border-radius:50%;

  border:1px solid rgba(255,255,255,.4);

  background:rgba(0,0,0,.4);

  color:white;

  cursor:pointer;
}

/* THUMBNAILS */

.thumbs{
  position:absolute;

  bottom:20px;
  right:30px;

  display:flex;
  gap:12px;
}

.thumb{
  width:60px;
  height:90px;

  border-radius:8px;

  overflow:hidden;

  cursor:pointer;

  opacity:.7;

  transition:.3s;
}

.thumb img{
  width:100%;
  height:100%;
  object-fit:cover;
}

.thumb.active{
  border:2px solid red;
  opacity:1;
  transform:scale(1.1);
}
.hero-skeleton{
  position:absolute;
  inset:0;

  background:linear-gradient(
    90deg,
    #1a1a1a 25%,
    #2a2a2a 37%,
    #1a1a1a 63%
  );

  background-size:400% 100%;

  animation:skeleton 1.2s infinite;
}

@keyframes skeleton{
  0%{background-position:100% 0}
  100%{background-position:-100% 0}
}
</style>