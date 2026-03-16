<template>
  <div class="trend-wrapper">

    <!-- HOT MOVIES -->
    <div class="panel">
      <h3 class="panel-title">🔥 SÔI NỔI NHẤT</h3>

      <div
        v-for="(movie,i) in hotMovies"
        :key="i"
        class="list-item"
      >
        <span class="rank">{{ i+1 }}.</span>

        <img :src="movie.img" class="thumb"/>

        <div class="name">{{ movie.name }}</div>
      </div>
    </div>

    <!-- FAVORITE -->
    <div class="panel">
      <h3 class="panel-title">❤️ YÊU THÍCH NHẤT</h3>

      <div
        v-for="(movie,i) in favoriteMovies"
        :key="i"
        class="list-item"
      >
        <span class="rank">{{ i+1 }}.</span>

        <img :src="movie.img" class="thumb"/>

        <div class="name">{{ movie.name }}</div>
      </div>
    </div>

    <!-- HOT CATEGORY -->
    <div class="panel">
      <h3 class="panel-title">📂 THỂ LOẠI HOT</h3>

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
    <div class="panel">
      <h3 class="panel-title">⚡ BÌNH LUẬN MỚI</h3>

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
  data(){
    return{
      hotMovies:[
        { name:"The Batman", img:"https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onM.jpg" },
        { name:"The Flash", img:"https://image.tmdb.org/t/p/w500/8aM2qUoXW7jTnH7rPz9rYtLqLh.jpg" },
        { name:"Black Panther: Wakanda Forever", img:"https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALFehM0uL4DGLw.jpg" },
        { name:"Avatar: The Way of Water", img:"https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg" },
      ],
      favoriteMovies:[
        { name:"The Batman", img:"https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onM.jpg" },
        { name:"The Flash", img:"https://image.tmdb.org/t/p/w500/8aM2qUoXW7jTnH7rPz9rYtLqLh.jpg" },
        { name:"Black Panther: Wakanda Forever", img:"https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALFehM0uL4DGLw.jpg" },
        { name:"Avatar: The Way of Water", img:"https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg" },
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
  }
}
</script>
<style scoped>

.trend-wrapper{

  display:grid;

  grid-template-columns:repeat(4,1fr);

  gap:30px;

  background:#0b0b0b;

  padding:30px;

  border-radius:18px;

  border:1px solid rgba(255,255,255,.06);
}

/* PANEL */

.panel{
  display:flex;
  flex-direction:column;
}

.panel-title{
  font-weight:700;
  margin-bottom:18px;
  color:white;
  font-size:16px;
}

/* MOVIE LIST */

.list-item{
  display:flex;
  padding: 10px;
  align-items:center;

  gap:12px;

  margin-bottom:14px;

  cursor:pointer;

  transition:.25s;
}

.list-item:hover{
  transform:translateX(6px);
}

.rank{
  color:#777;
  width:20px;
}

.thumb{
  width:70px;
  height:40px;

  object-fit:cover;

  border-radius:6px;
}

.name{
  color:#ddd;
  font-size:14px;
}

/* CATEGORY */

.category-item{
  display:flex;
  align-items:center;
  gap:12px;
  margin-bottom:16px;
  padding: 10px;
}

.tag{
  padding:8px 18px;
  margin-left: 20px;

  border-radius:30px;

  font-size:13px;

  font-weight:600;

  color:white;
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
}

.avatar{
  width:36px;
  height:36px;
  border-radius:50%;
}

.user{
  font-size:13px;
  color:white;
}

.text{
  font-size:12px;
  color:#aaa;
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
  }

}
.panel{
  background:#111;
  padding:20px;
  border-radius:14px;
}
.panel:hover{
  box-shadow:0 10px 40px rgba(255,0,60,.15);
}
.category-link{
  text-decoration: none;
}
</style>
