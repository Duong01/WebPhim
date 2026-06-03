import { createRouter, createWebHistory } from "vue-router";

import Home from "@/pages/Home.vue";
import PhimBo from "@/pages/PhimBo/PhimBo.vue";
import PhimChieuRap from "@/pages/PhimChieuRap/PhimChieuRap.vue";
import PhimLe from "@/pages/PhimLe/PhimLe.vue";
import TVShow from "@/pages/TVShow/TVShow.vue";
import HoatHinh from "@/pages/HoatHinh/HoatHinh.vue";

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
    path: "/profile",
    name: "ProfilePage",
    component: () => import("@/components/Profile.vue"),
    meta: {
      title: "Đăng ký tài khoản - Web Phim Online",
      description: "Đăng ký tài khoản để trải nghiệm xem phim miễn phí chất lượng cao.",
      robots: "noindex, nofollow",
    },
  },

  {
    path: "/forgot-password",
    name: "ForgotPasswordPage",
    component: () => import("@/components/ForgotPassword.vue"),
    meta: {
      title: "Quên mật khẩu - Web Phim Online",
      description: "Quên mật khẩu để trải nghiệm xem phim miễn phí chất lượng cao.",
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
        component: Home,
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
        meta: {
          title: "Chi tiết phim",
          keepAlive: true,
        },
      },
      {
        path: "/favorite",
        name: "FavoritePage",
        component: () => import("@/pages/Favorite/Favorite.vue"),
        meta: {
          robots: "noindex, nofollow",
        },
      },
      {
        path: "/phim-chieu-rap",
        name: "PhimChieuRap",
        component: PhimChieuRap,
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
        component: PhimBo,
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
        component: PhimLe,
        meta: { keepAlive: true },
      },
      {
        path: "/tv-shows",
        name: "TVShow",
        component: TVShow,
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
        component: HoatHinh,
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
    //return false;
    return {
    top: 0,
    left: 0,
    behavior: "auto",
  };
    //return { top: 0 }; // mượt hơn 
  },
});

router.onError((error) => {
  if (/Loading chunk .* failed/i.test(error.message)) {
    window.location.reload();
  }
});

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

/* ========================
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

/* ========================
   Prevent DevTools Globally
========================= */
window.addEventListener('keydown', (e) => {
  // Ngăn chặn phím F12
  if (e.key === 'F12' || e.keyCode === 123) {
    e.preventDefault();
    return false;
  }
  // Ngăn chặn Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+U / Ctrl+C
  if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
    e.preventDefault();
    return false;
  }
  if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
    e.preventDefault();
    return false;
  }
});

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

export default router;