<template>
  <div class="trend-wrapper" >

    <!-- HOT MOVIES -->
    <div class="panel">
      <h3 class="panel-title">🔥 {{$t('SÔI NỔI NHẤT')}}</h3>

      <div
        v-for="(movie,i) in movies.slice(0,4)"
        :key="i"
        class="list-item"
      >
        <span class="rank">{{ i+1 }}.</span>

        <img :src="movie.thumb_url" class="thumb" @click="goMovie(movie)" />

        <div class="name">{{ movie.name }}</div>
        
      </div>
    </div>

    <!-- FAVORITE -->
    <div class="panel">
      <h3 class="panel-title">❤️ {{$t('YÊU THÍCH NHẤT')}}</h3>

      <div
        v-for="(movie,i) in favoriteMovies"
        :key="i"
        class="list-item"
      >
        <span class="rank">{{ i+1 }}.</span>

        <img :src="'https://phimimg.com/' + movie.thumb_url" class="thumb" @click="goMovie(movie)"/>

        <div class="name">{{ movie.name }}</div>
      </div>
    </div>

    <!-- HOT CATEGORY -->
    <div class="panel" v-show="$vuetify.display.smAndUp">
      <h3 class="panel-title">📂 {{$t('THỂ LOẠI HOT')}}</h3>

      <div
        v-for="(c,i) in categories"
        :key="i"
        class="category-item"
      >
      <router-link :to="c.router" class="category-link">
        <span class="rank">{{ i+1 }}.</span>
        <v-icon :color="c.arrow.includes('up') ? 'green' : 'red'">
          {{ c.arrow }}
        </v-icon>
        <span class="tag" :class="c.color">
          {{ c.name }}
        </span>
      </router-link>
      </div>
    </div>

    <!-- COMMENTS -->
    <div class="panel" v-show="$vuetify.display.smAndUp">
      <h3 class="panel-title">⚡ {{$t('BÌNH LUẬN MỚI')}}</h3>

      <div
        v-for="(c,i) in comments"
        :key="i"
        class="comment"
      >
        <img :src="c.avatar" class="avatar"/>

        <div>
          <div class="user">{{ c.user }}</div>
          <div class="text">{{ c.text }}</div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default{
  props:["movies"],
  data(){
    return{
      hotMovies:[
        { name:"The Batman", img:"https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onM.jpg" },
        { name:"The Flash", img:"https://image.tmdb.org/t/p/w500/8aM2qUoXW7jTnH7rPz9rYtLqLh.jpg" },
        { name:"Black Panther: Wakanda Forever", img:"https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALFehM0uL4DGLw.jpg" },
        { name:"Avatar: The Way of Water", img:"https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg" },
      ],
      favoriteMovies:[
        
      ],
      categories:[
        { name:"Hành động", router:"the-loai/hanh-dong", arrow:"mdi-arrow-up-right", color:"red" },
        { name:"Tâm lý", router:"the-loai/tam-ly", arrow:"mdi-arrow-up-right", color:"blue" },
        { name:"Tình cảm", router:"the-loai/tinh-cam", arrow:"mdi-arrow-up-right", color:"pink" },
        { name:"Hài hước", router:"the-loai/hai-huoc", arrow:"mdi-arrow-down-right", color:"blue" },
        { name:"Kinh dị", router:"the-loai/kinh-di", arrow:"mdi-arrow-up-right", color:"green" }
      ],
      comments:[
        { user:"Nguyễn Văn A", text:"Bộ phim này thật tuyệt vời!", avatar:"https://randomuser.me/api/portraits/men/1.jpg" },
        { user:"Trần Thị B", text:"Tôi rất thích diễn xuất của diễn viên chính.", avatar:"https://randomuser.me/api/portraits/women/2.jpg" },
        { user:"Lê Văn C", text:"Cốt truyện hơi yếu nhưng hiệu ứng đẹp.", avatar:"https://randomuser.me/api/portraits/men/3.jpg" },
        { user:"Phạm Thị D", text:"Âm nhạc trong phim rất hay!", avatar:"https://randomuser.me/api/portraits/women/4.jpg" },
      ]
    }
  },
  async mounted(){
    const res = await fetch("https://phimapi.com/v1/api/danh-sach/phim-le?page=1&sort_field=year&sort_type=desc&limit=4");
        const data = await res.json();

        this.favoriteMovies = data.items || data.data?.items || [];
  },
  methods:{
    goMovie(movie){
      this.$router.push({ name: "Movies", params: { slug: movie.slug } });
    }
  }
}
</script>
<style scoped>

.trend-wrapper{

  display:grid;

  grid-template-columns:repeat(4,1fr);

  gap:24px;

  background: linear-gradient(160deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));

  padding:28px;

  border-radius:var(--zc-radius-lg);

  border:1px solid var(--zc-border);

  backdrop-filter: blur(10px);

}

/* PANEL */

.panel{
  display:flex;
  flex-direction:column;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--zc-border);
  padding:20px;
  border-radius:var(--zc-radius);
  transition: box-shadow 0.35s ease, border-color 0.35s ease;
}

.panel:hover{
  border-color: rgba(255, 183, 0, 0.25);
  box-shadow: 0 12px 36px rgba(0,0,0,.45), 0 0 22px rgba(255,140,0,.08);
}

.panel-title{
  font-weight:800;
  margin-bottom:18px;
  color:var(--zc-text);
  font-size:15px;
  letter-spacing: 0.4px;
}

/* MOVIE LIST */

.list-item{
  display:flex;
  padding: 8px;
  align-items:center;
  gap:12px;
  margin-bottom:10px;
  cursor:pointer;
  border-radius: 10px;
  transition: background 0.25s ease, transform 0.25s var(--zc-ease);
}

.list-item:hover{
  transform:translateX(6px);
  background: rgba(255, 183, 0, 0.06);
}

.rank{
  color:var(--zc-text-faint);
  width:20px;
  font-weight: 700;
}

.thumb{
  width:70px;
  height:44px;
  object-fit:cover;
  border-radius:8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}

.name{
  color:var(--zc-text);
  font-size:14px;
  transition: color 0.25s ease;
}

.list-item:hover .name{
  color: #ffb700;
}

/* CATEGORY */

.category-item{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:12px;
  padding: 8px;
  border-radius: 10px;
  transition: background 0.25s ease;
}

.category-item:hover{
  background: rgba(255, 183, 0, 0.06);
}

.tag{
  padding:8px 18px;
  margin-left: 20px;
  border-radius:999px;
  font-size:13px;
  font-weight:600;
  color:white;
  box-shadow: 0 4px 14px rgba(0,0,0,0.35);
  transition: transform 0.25s var(--zc-ease);
}

.category-item:hover .tag{
  transform: scale(1.05);
}

/* gradient tags */

.red{
  background:linear-gradient(45deg,#ff0040,#ff2e63);
}

.blue{
  background:linear-gradient(45deg,#00b4db,#007bff);
}

.pink{
  background:linear-gradient(45deg,#ff4fa3,#9b59b6);
}

.green{
  background:linear-gradient(45deg,#00c853,#00bfa5);
}

.purple{
  background:linear-gradient(45deg,#ff416c,#8e44ad);
}

/* COMMENTS */

.comment{
  display:flex;
  gap:10px;
  margin-bottom:14px;
  padding: 8px;
  border-radius: 10px;
  transition: background 0.25s ease;
}

.comment:hover{
  background: rgba(255, 255, 255, 0.03);
}

.avatar{
  width:36px;
  height:36px;
  border-radius:50%;
  border: 2px solid rgba(255, 183, 0, 0.35);
}

.user{
  font-size:13px;
  color:var(--zc-text);
  font-weight: 600;
}

.text{
  font-size:12px;
  color:var(--zc-text-dim);
}

/* MOBILE */

@media(max-width:1100px){

  .trend-wrapper{
    grid-template-columns:repeat(2,1fr);
  }

}

@media(max-width:600px){

  .trend-wrapper{
    grid-template-columns:1fr;
    padding: 16px;
  }

}

.category-link{
  text-decoration: none;
}
</style>
