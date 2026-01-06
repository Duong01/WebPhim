// import { createRouter, createWebHashHistory } from 'vue-router'
import { createRouter, createWebHistory } from "vue-router";
import { CheckSession } from "@/model/api";
import store from "@/store";

const routes = [
  {
    path: "/login",
    name: "LoginPage",
    component: () => import("@/components/Login"),
    meta: {
      title: "Đăng nhập - Web Phim Online",
      description: "Đăng nhập để trải nghiệm xem phim miễn phí chất lượng cao.",
    },
  },
  {
    path: "/register",
    name: "RegisterPage",
    component: () => import("@/components/Register"),
    meta: {
      title: "Đăng ký tài khoản - Web Phim Online",
      description:
        "Tạo tài khoản miễn phí để lưu phim yêu thích và lịch sử xem.",
    },
  },
  {
    path: "/Error",
    name: "ErrorPage",
    component: () => import("@/pages/Error.vue"),
    meta: {
      title: "Lỗi - Không tìm thấy trang",
      description: "Trang bạn tìm không tồn tại, vui lòng quay lại trang chủ.",
    },
  },
  {
    path: "",
    name: "Layout",
    redirect: "/home",
    component: () => import("@/components/Layout"),
    children: [
      {
        path: "/home",
        name: "HomePage",
        component: () => import("@/pages/Home"),
        meta: {
          title: "Xem phim online miễn phí - Web Phim Online",
          description:
            "Kho phim mới nhất, hot nhất, cập nhật liên tục, xem online miễn phí.",
          keepAlive: true,
        },
      },
      {
        path: "/movie/:slug",
        name: "MovieDetail",
        component: () => import("@/pages/MovieDetails/MoiveDetail.vue"),
        props: (route) => ({
          slug: route.params.slug,
          page: route.query.page,
        }),
        meta: {
          title: "Chi tiết phim - Web Phim Online",
          description:
            "Xem thông tin chi tiết phim, trailer, đánh giá và link xem miễn phí.",
          keepAlive: true,
        },
      },
      {
        path: "/movies/:slug",
        name: "MoviesPage",
        component: () => import("@/pages/MovieDetails/Movies.vue"),
        props: true,
        meta: {
          title: "Chi tiết phim - Web Phim Online",
          description:
            "Xem thông tin chi tiết phim, trailer, đánh giá và link xem miễn phí.",
          keepAlive: true,
        },
      },
      {
        path: "/favorite",
        name: "FavoritePage",
        component: () => import("@/pages/Favorite/Favorite.vue"),
        meta: {
            title: "Phim bộ hay nhất - Web Phim Online",
            description: "Tuyển tập phim bộ mới nhất, hấp dẫn, cập nhật liên tục.",
            keepAlive: true,
            auth: true,
            requiresAuth: true
        },
      },
      {
        path: "search",
        name: "SearchMovie",
        component: () => import("@/pages/SearchMovie.vue"),
        props: true,
        meta: {
          title: "Tìm kiếm phim - Web Phim Online",
          description:
            "Tìm kiếm phim nhanh chóng theo tên, thể loại, quốc gia.",
          keepAlive: true,
        },
      },

      {
        path: "/phim-bo",
        name: "PhimBo",
        component: () => import("@/pages/PhimBo/PhimBo.vue"),
        meta: {
          title: "Phim bộ hay nhất - Web Phim Online",
          description:
            "Tuyển tập phim bộ mới nhất, hấp dẫn, cập nhật liên tục.",
          keepAlive: true,
        },
      },
      {
        path: "/phim-le",
        name: "PhimLe",
        component: () => import("@/pages/PhimLe/PhimLe.vue"),
        meta: {
          title: "Phim lẻ mới nhất - Web Phim Online",
          description: "Danh sách phim lẻ hot nhất, xem online chất lượng cao.",
          keepAlive: true,
        },
      },
      {
        path: "/tv-shows",
        name: "TVShow",
        component: () => import("@/pages/TVShow/TVShow.vue"),
        meta: {
          title: "Phim sắp chiếu - Web Phim Online",
          description: "Khám phá những bộ phim bom tấn sắp ra mắt.",
          keepAlive: true,
        },
      },
      {
        path: "/hoat-hinh",
        name: "HoatHinh",
        component: () => import("@/pages/HoatHinh/HoatHinh.vue"),
        meta: {
          title: "Phim hoạt hình - Web Phim Online",
          description:
            "Phim hoạt hình cho thiếu nhi và người lớn, đa dạng thể loại.",
          keepAlive: true,
        },
      },
      {
        path: "/the-loai/:path",
        name: "TheLoai",
        component: () => import("@/pages/TheLoai/TheLoai.vue"),
        props: true,
        meta: {
          title: "Phim theo thể loại - Web Phim Online",
          description: "Xem danh sách phim theo từng thể loại được yêu thích.",
          keepAlive: true,
        },
      },
      {
        path: "/danh-sach/:path",
        name: "PhimNew",
        component: () => import("@/pages/PhimNew/PhimNew.vue"),
        props: true,
        meta: {
          title: "Phim mới & phim hot - Web Phim Online",
          description:
            "Cập nhật nhanh các bộ phim mới nhất và được xem nhiều nhất.",
          keepAlive: true,
        },
      },
      {
        path: "/quoc-gia/:path",
        name: "QuocGia",
        component: () => import("@/pages/QuocGia/QuocGia.vue"),
        props: true,
        meta: {
          title: "Phim theo quốc gia - Web Phim Online",
          description:
            "Khám phá phim từ nhiều quốc gia: Hàn, Trung, Mỹ, Việt Nam.",
          keepAlive: true,
        },
      },
      {
        path: "/:catchAll(.*)",
        redirect: "/Error",
      },
    ],
  },
];

// Thời gian session tối đa (ví dụ: 30 phút)

// Lưu thời điểm bắt đầu khi user vào trang lần đầu
if (!sessionStorage.getItem("sessionStart")) {
  sessionStorage.setItem("sessionStart", Date.now());
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: "smooth" };
  },
});
router.onError((error) => {
  const chunkFailed = /Loading chunk [\d]+ failed/;

  if (chunkFailed.test(error.message)) {
    console.warn("Chunk failed → Reload");
    window.location.reload();
  }
});
router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth){
    CheckSession((dat)=>{
      console.log(dat)
      if(dat.status == "success"){
        store.commit("setEmpInfor", dat.data);
        return next()
      }
      if(dat.status == "error")
      {
        alert(dat.message)
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }
      return next()
    },(er)=>{
      // session timeout or not login
      if(er?.response?.status == 401)
      {
        console.error(er.response.data);
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        }
        return next()
    })
  }
  else{
    next()
  }
  

  // ===== 3. Set meta SEO =====
  const defaultTitle = "Web Phim Online - Xem phim miễn phí"
  const defaultDesc = "Xem phim mới nhất, miễn phí, chất lượng cao"

  document.title = to.meta.title || defaultTitle
  let desc = document.querySelector('meta[name="description"]')
  if (!desc) {
    desc = document.createElement("meta")
    desc.setAttribute("name", "description")
    document.head.appendChild(desc)
  }
  desc.setAttribute("content", to.meta.description || defaultDesc)

})


export default router;
