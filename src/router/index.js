// import { createRouter, createWebHashHistory } from 'vue-router'
import { createRouter, createWebHistory } from "vue-router";
//import { Tracking } from "@/model/api";
// import { CheckSession } from "@/model/api";
// import store from "@/store";

const routes = [
  {
    path: "/login",
    name: "LoginPage",
    component: () => import("@/components/Login"),
    meta: {
      title: "Đăng nhập - Web Phim Online",
      description: "Đăng nhập để trải nghiệm xem phim miễn phí chất lượng cao.",
      robots: "noindex, nofollow",
    },
  },
  {
    path: "/home1",
    name: "Home1Page",
    component: () => import("@/pages/Home1"),
    meta: {
      title: "Trang chủ - Web Phim Online",
      description: "Xem phim online miễn phí chất lượng cao.",
      keepAlive: true,
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
      robots: "noindex, nofollow",
    },
  },
  {
    path: "/Error",
    name: "ErrorPage",
    component: () => import("@/pages/Error.vue"),
    meta: {
      title: "Lỗi - Không tìm thấy trang",
      description: "Trang bạn tìm không tồn tại, vui lòng quay lại trang chủ.",
      robots: "noindex, nofollow",
    },
  },
  {
    path: '/chatbot',
    name: 'ChatbotFull',
    component: () => import('@/components/ChatbotFull.vue')
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
          keepAlive: false,
        },
      },
      {
        path: "/movies/:slug",
        name: "Movies",
        component: () => import("@/pages/MovieDetails/Movies.vue"),
        props: true,
        meta: {
          title: "Chi tiết phim - Web Phim Online",
          description:
            "Xem thông tin chi tiết phim, trailer, đánh giá và link xem miễn phí.",
          keepAlive: false,
        },
      },
      {
        path: "/favorite",
        name: "FavoritePage",
        component: () => import("@/pages/Favorite/Favorite.vue"),
        meta: {
            title: "Phim bộ hay nhất - Web Phim Online",
            description: "Tuyển tập phim bộ mới nhất, hấp dẫn, cập nhật liên tục.",
            auth: true,
            requiresAuth: true,
            robots: "noindex, nofollow"
        },
      },
      {
        path: "/phim-chieu-rap",
        name: "PhimChieuRap",
        component: () => import("@/pages/PhimChieuRap/PhimChieuRap.vue"),
        meta: {
            title: "Phim bộ hay nhất - Web Phim Online",
            description: "Tuyển tập phim bộ mới nhất, hấp dẫn, cập nhật liên tục.",
            keepAlive: true
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
        path: "/movie-schedule",
        name: "MovieSchedule",
        component: () => import("@/pages/SchedulePage/MovieSchedule.vue"),
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
        path: "/gioi-thieu",
        name: "AboutPage",
        component: () => import("@/pages/About.vue"),
        meta: {
          title: "Giới thiệu về chúng tôi - Web Phim Online",
          description: "Tìm hiểu thêm về nền tảng xem phim trực tuyến chất lượng cao của chúng tôi.",
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
  scrollBehavior(to, from, savedPosition) {
    // Nếu có vị trí cũ (back/forward) thì giữ nguyên
    if (savedPosition) {
      return savedPosition;
    }
    // Lần đầu chuyển trang thì mặc định cuộn lên đầu trang
    //return { top: 0, behavior: 'smooth' };
  }
});

router.onError((error) => {
  const chunkFailed = /Loading chunk [\d]+ failed/;

  if (chunkFailed.test(error.message)) {
    console.warn("Chunk failed → Reload");
    window.location.reload();
  }
});

// router.afterEach((to) => {
//   // Trì hoãn tracking toàn cục để tránh gây lag khi bắt đầu chuyển trang
//   setTimeout(() => {
//     Tracking(
//       { page: to.fullPath }, 
//       () => {},
//       (err) => console.log(err)
//     )
//   }, 5000);
// })

router.beforeEach((to, from, next) => {
  // Normalize `page` query for MovieDetail: convert numeric `page=125` -> `page=tap125`
  if (to.name === 'MovieDetail' && to.query?.page) {
    const p = String(to.query.page);
    if (!p.startsWith('tap')) {
      const digits = p.match(/\d+/);
      if (digits) {
        const newQuery = { ...to.query, page: 'tap' + digits[0] };
        next({ name: to.name, params: to.params, query: newQuery, replace: true });
        return;
      }
    }
  }


  //const isLoggedIn = !!store.state.empInfor;

  if (to.meta.requiresAuth) {
    const token = localStorage.getItem("token");
    if (!token){
      return next({
      path: "/login",
      query: { redirect: to.fullPath }
    });
    }
  }
  next();
});

router.afterEach((to) => {
  // Chuyển logic SEO sang afterEach để không làm chậm quá trình render component
  const defaultTitle = "Web Phim Online - Xem phim miễn phí";
  const defaultDesc = "Xem phim mới nhất, miễn phí, chất lượng cao";

  document.title = to.meta.title || defaultTitle;

  const upsertMeta = (attr, key, content) => {
    if (!content) return;
    let el = document.querySelector(attr === 'property' ? `meta[property="${key}"]` : `meta[name="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  let canonicalUrl = window.location.origin + to.path;
  if (to.query.page) canonicalUrl += `?page=${to.query.page}`;

  const canonical = document.querySelector('link[rel="canonical"]') || (() => {
    const l = document.createElement('link');
    l.setAttribute('rel', 'canonical');
    document.head.appendChild(l);
    return l;
  })();
  canonical.setAttribute('href', canonicalUrl);

  upsertMeta('name', 'description', to.meta.description || defaultDesc);
  upsertMeta('property', 'og:title', to.meta.title || defaultTitle);
  upsertMeta('property', 'og:description', to.meta.description || defaultDesc);
  upsertMeta('property', 'og:url', canonicalUrl);
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('name', 'twitter:title', to.meta.title || defaultTitle);
  upsertMeta('name', 'twitter:description', to.meta.description || defaultDesc);
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'robots', to.meta.robots || 'index, follow');
});

// router.afterEach(() => {
//   // delay nhẹ cho UX mượt
//   setTimeout(() => {
//     store.dispatch('loading/stopLoading')
//   }, 700)
// })


export default router;
