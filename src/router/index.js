import { createRouter, createWebHistory } from "vue-router";

/* =========================
   Routes (giữ nguyên cấu trúc)
========================= */
const routes = [
  {
    path: "/login",
    name: "LoginPage",
    component: () => import("@/components/Login.vue"),
    meta: {
      title: "Đăng nhập - Web Phim Online",
      description: "Đăng nhập để trải nghiệm xem phim miễn phí chất lượng cao.",
      robots: "noindex, nofollow",
    },
  },
  {
    path: "/home1",
    name: "Home1Page",
    component: () => import("@/pages/Home1.vue"),
    meta: {
      title: "Trang chủ - Web Phim Online",
      description: "Xem phim online miễn phí chất lượng cao.",
      keepAlive: true,
    },
  },
  {
    path: "/register",
    name: "RegisterPage",
    component: () => import("@/components/Register.vue"),
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
      description: "Trang bạn tìm không tồn tại.",
      robots: "noindex, nofollow",
    },
  },
  {
    path: "/chatbot",
    name: "ChatbotFull",
    component: () => import("@/components/ChatbotFull.vue"),
  },
  {
    path: "",
    name: "Layout",
    redirect: "/home",
    component: () => import("@/components/Layout.vue"),
    children: [
      {
        path: "/home",
        name: "HomePage",
        component: () => import("@/pages/Home.vue"),
        meta: {
          title: "Xem phim online miễn phí - Web Phim Online",
          description: "Kho phim mới nhất, hot nhất.",
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
          title: "Chi tiết phim",
          keepAlive: false,
        },
      },
      {
        path: "/movies/:slug",
        name: "Movies",
        component: () => import("@/pages/MovieDetails/Movies.vue"),
        props: true,
      },
      {
        path: "/favorite",
        name: "FavoritePage",
        component: () => import("@/pages/Favorite/Favorite.vue"),
        meta: {
          requiresAuth: true,
          robots: "noindex, nofollow",
        },
      },
      {
        path: "/phim-chieu-rap",
        name: "PhimChieuRap",
        component: () => import("@/pages/PhimChieuRap/PhimChieuRap.vue"),
        meta: { keepAlive: true },
      },
      {
        path: "search",
        name: "SearchMovie",
        component: () => import("@/pages/SearchMovie.vue"),
        props: true,
        meta: { keepAlive: true },
      },
      {
        path: "/phim-bo",
        name: "PhimBo",
        component: () => import("@/pages/PhimBo/PhimBo.vue"),
        meta: { keepAlive: true },
      },
      {
        path: "/movie-schedule",
        name: "MovieSchedule",
        component: () => import("@/pages/SchedulePage/MovieSchedule.vue"),
        meta: { keepAlive: true },
      },
      {
        path: "/phim-le",
        name: "PhimLe",
        component: () => import("@/pages/PhimLe/PhimLe.vue"),
        meta: { keepAlive: true },
      },
      {
        path: "/tv-shows",
        name: "TVShow",
        component: () => import("@/pages/TVShow/TVShow.vue"),
        meta: { keepAlive: true },
      },
      {
        path: "/gioi-thieu",
        name: "AboutPage",
        component: () => import("@/pages/About.vue"),
        meta: { keepAlive: true },
      },
      {
        path: "/hoat-hinh",
        name: "HoatHinh",
        component: () => import("@/pages/HoatHinh/HoatHinh.vue"),
        meta: { keepAlive: true },
      },
      {
        path: "/the-loai/:path",
        name: "TheLoai",
        component: () => import("@/pages/TheLoai/TheLoai.vue"),
        props: true,
        meta: { keepAlive: true },
      },
      {
        path: "/danh-sach/:path",
        name: "PhimNew",
        component: () => import("@/pages/PhimNew/PhimNew.vue"),
        props: true,
        meta: { keepAlive: true },
      },
      {
        path: "/quoc-gia/:path",
        name: "QuocGia",
        component: () => import("@/pages/QuocGia/QuocGia.vue"),
        props: true,
        meta: { keepAlive: true },
      },
      {
        path: "/:catchAll(.*)",
        redirect: "/Error",
      },
    ],
  },
];

/* =========================
   Create router
========================= */
const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 }; // mượt hơn nhiều
  },
});

/* =========================
   Chunk error fix
========================= */
router.onError((error) => {
  if (/Loading chunk .* failed/i.test(error.message)) {
    window.location.reload();
  }
});

/* =========================
   BeforeEach (nhẹ, không lag)
========================= */
router.beforeEach((to, from, next) => {
  // normalize page query
  if (to.name === "MovieDetail" && to.query?.page) {
    const p = String(to.query.page);
    if (!p.startsWith("tap")) {
      const digits = p.match(/\d+/);
      if (digits) {
        return next({
          name: to.name,
          params: to.params,
          query: { ...to.query, page: "tap" + digits[0] },
          replace: true,
        });
      }
    }
  }

  // auth check
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem("token");
    if (!token) {
      return next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    }
  }

  next();
});

/* =========================
   SEO (không block render)
========================= */
router.afterEach((to) => {
  requestAnimationFrame(() => {
    const defaultTitle = "Web Phim Online";
    const defaultDesc = "Xem phim miễn phí";

    document.title = to.meta.title || defaultTitle;

    const setMeta = (attr, key, content) => {
      if (!content) return;
      let el = document.querySelector(
        attr === "property"
          ? `meta[property="${key}"]`
          : `meta[name="${key}"]`
      );
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const url = window.location.origin + to.fullPath;

    setMeta("name", "description", to.meta.description || defaultDesc);
    setMeta("property", "og:title", document.title);
    setMeta("property", "og:description", to.meta.description || defaultDesc);
    setMeta("property", "og:url", url);
    setMeta("name", "robots", to.meta.robots || "index, follow");
  });
});

export default router;