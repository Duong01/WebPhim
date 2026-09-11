import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/login",
    name: "LoginPage",
    component: () => import("@/components/Login.vue"),
    meta: {
      title: "Đăng nhập - ZCines",
      description: "Đăng nhập để trải nghiệm xem phim miễn phí chất lượng cao tại ZCines.",
      robots: "noindex, nofollow",
    },
  },
  {
    path: "/profile",
    name: "ProfilePage",
    component: () => import("@/components/Profile.vue"),
    meta: {
      title: "Hồ sơ cá nhân - ZCines",
      description: "Quản lý hồ sơ, phim yêu thích và lịch sử xem phim của bạn tại ZCines.",
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
      title: "Xem Phim Online Miễn Phí Vietsub FullHD | ZCines",
      description:
        "Xem phim online miễn phí chất lượng cao Vietsub FullHD: phim bộ, phim lẻ, anime mới nhất tại ZCines.",
      keepAlive: true,
    },
  },
  {
    path: "/register",
    name: "RegisterPage",
    component: () => import("@/components/Register.vue"),
    meta: {
      title: "Đăng ký tài khoản - ZCines",
      description:
        "Tạo tài khoản miễn phí để lưu phim yêu thích và lịch sử xem tại ZCines.",
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
          title: "Xem Phim Online Miễn Phí, Phim Vietsub Full HD Mới Nhất | ZCines",
          description:
            "ZCines - Xem phim online miễn phí chất lượng cao Vietsub FullHD: phim bộ, phim lẻ, anime, phim chiếu rạp Hàn Quốc, Trung Quốc, Âu Mỹ mới nhất 2025 cập nhật liên tục.",
          keywords:
            "xem phim online, xem phim miễn phí, phim vietsub, phim full hd, phim mới nhất 2025, phim bộ hay, phim lẻ hay, anime vietsub, phim chiếu rạp, zcines",
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
          title: "Xem Phim Vietsub Full HD - ZCines",
          description:
            "Xem phim Vietsub FullHD miễn phí, thuyết minh, lồng tiếng chất lượng cao tại ZCines.",
          keywords:
            "xem phim vietsub, phim full hd, xem phim miễn phí, phim thuyết minh, phim lồng tiếng, zcines",
          ogType: "video.movie",
          keepAlive: false,
        },
      },
      {
        path: "/movies/:slug",
        name: "Movies",
        component: () => import("@/pages/MovieDetails/Movies.vue"),
        props: true,
        meta: {
          title: "Xem Phim Vietsub Full HD - ZCines",
          description:
            "Xem phim Vietsub FullHD miễn phí, thuyết minh, lồng tiếng chất lượng cao tại ZCines.",
          keywords:
            "xem phim vietsub, phim full hd, xem phim miễn phí, phim thuyết minh, phim lồng tiếng, zcines",
          ogType: "video.movie",
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
        component: () => import("@/pages/PhimChieuRap/PhimChieuRap.vue"),
        meta: {
          title: "Phim Chiếu Rạp Mới Nhất 2025 - Phim Bom Tấn Hay Nhất | ZCines",
          description:
            "Tổng hợp phim chiếu rạp mới nhất 2025: phim bom tấn Hollywood, phim điện ảnh Hàn Quốc, Trung Quốc, Việt Nam Vietsub FullHD. Xem phim chiếu rạp miễn phí tại ZCines.",
          keywords:
            "phim chiếu rạp, phim chiếu rạp mới nhất, phim bom tấn, phim điện ảnh hay, phim hollywood, phim chiếu rạp 2025, xem phim chiếu rạp miễn phí, zcines",
          keepAlive: true,
        },
      },
      {
        path: "search",
        name: "SearchMovie",
        component: () => import("@/pages/SearchMovie.vue"),
        props: true,
        meta: {
          title: "Tìm Kiếm Phim - Tìm Phim Hay Theo Tên | ZCines",
          description:
            "Công cụ tìm kiếm phim thông minh: tìm phim bộ, phim lẻ, anime, phim chiếu rạp theo tên phim, tên diễn viên nhanh chóng tại ZCines.",
          robots: "noindex, follow",
          keepAlive: true,
        },
      },
      {
        path: "/phim-bo",
        name: "PhimBo",
        component: () => import("@/pages/PhimBo/PhimBo.vue"),
        meta: {
          title: "Phim Bộ Hay Nhất Mới Nhất 2025 - Xem Phim Bộ Vietsub | ZCines",
          description:
            "Xem phim bộ hay nhất mới nhất 2025 Vietsub FullHD: phim bộ Hàn Quốc, Trung Quốc, phim bộ tình cảm, cổ trang, hành động cập nhật trọn bộ tại ZCines.",
          keywords:
            "phim bộ, phim bộ hay, phim bộ mới nhất, phim bộ hàn quốc, phim bộ trung quốc, phim bộ vietsub, xem phim bộ miễn phí, phim bộ 2025, zcines",
          keepAlive: true,
        },
      },
      {
        path: "/movie-schedule",
        name: "MovieSchedule",
        component: () => import("@/pages/SchedulePage/MovieSchedule.vue"),
        meta: {
          title: "Lịch Chiếu Phim Bộ Mới Tập Mới Nhất Hôm Nay | ZCines",
          description:
            "Lịch chiếu phim bộ mới nhất hôm nay: theo dõi lịch phát sóng các tập phim Hàn Quốc, Trung Quốc, anime mới nhất mỗi ngày tại ZCines.",
          keywords:
            "lịch chiếu phim, lịch phát sóng phim, phim mới tập mới, lịch chiếu phim bộ, phim mới hôm nay, zcines",
          keepAlive: true,
        },
      },
      {
        path: "/phim-le",
        name: "PhimLe",
        component: () => import("@/pages/PhimLe/PhimLe.vue"),
        meta: {
          title: "Phim Lẻ Hay Nhất Mới Nhất 2025 - Xem Phim Lẻ Vietsub | ZCines",
          description:
            "Xem phim lẻ hay nhất mới nhất 2025 Vietsub FullHD: phim lẻ hành động, kinh dị, tình cảm, hài hước, phim lẻ Âu Mỹ, Hàn Quốc miễn phí tại ZCines.",
          keywords:
            "phim lẻ, phim lẻ hay, phim lẻ mới nhất, phim lẻ vietsub, phim lẻ âu mỹ, phim lẻ hàn quốc, xem phim lẻ miễn phí, phim lẻ 2025, zcines",
          keepAlive: true,
        },
      },
      {
        path: "/tv-shows",
        name: "TVShow",
        component: () => import("@/pages/TVShow/TVShow.vue"),
        meta: {
          title: "TV Shows, Chương Trình Truyền Hình & Reality Show Hay | ZCines",
          description:
            "Xem TV shows, chương trình truyền hình thực tế, gameshow, talkshow Việt Nam và quốc tế Vietsub mới nhất miễn phí tại ZCines.",
          keywords:
            "tv shows, chương trình truyền hình, reality show, gameshow hay, show truyền hình thực tế, tv show vietsub, zcines",
          keepAlive: true,
        },
      },
      {
        path: "/gioi-thieu",
        name: "AboutPage",
        component: () => import("@/pages/About.vue"),
        meta: {
          title: "Giới Thiệu ZCines - Trang Xem Phim Online Miễn Phí | ZCines",
          description:
            "Giới thiệu ZCines: trang xem phim online miễn phí chất lượng cao Vietsub FullHD với kho phim khổng lồ, cập nhật nhanh nhất, trải nghiệm mượt mà không quảng cáo khó chịu.",
          keywords:
            "giới thiệu zcines, web xem phim, trang xem phim online, xem phim miễn phí chất lượng cao, zcines là gì",
          keepAlive: true,
        },
      },
      {
        path: "/hoat-hinh",
        name: "HoatHinh",
        component: () => import("@/pages/HoatHinh/HoatHinh.vue"),
        meta: {
          title: "Anime, Phim Hoạt Hình Mới Nhất 2025 Vietsub Hay Nhất | ZCines",
          description:
            "Xem anime, phim hoạt hình mới nhất 2025 Vietsub: anime Nhật Bản, Trung Quốc, phim hoạt hình Disney, anime hay nhất miễn phí FullHD tại ZCines.",
          keywords:
            "anime, xem anime, anime vietsub, phim hoạt hình, anime mới nhất, anime hay, phim hoạt hình disney, anime nhật bản, xem anime miễn phí, zcines",
          keepAlive: true,
        },
      },
      {
        path: "/the-loai/:path",
        name: "TheLoai",
        component: () => import("@/pages/TheLoai/TheLoai.vue"),
        props: true,
        meta: {
          title: "Phim Theo Thể Loại - Hành Động, Tình Cảm, Kinh Dị Hay | ZCines",
          description:
            "Khám phá phim theo thể loại: phim hành động, tình cảm, kinh dị, viễn tưởng, cổ trang, hài hước Vietsub FullHD mới nhất miễn phí tại ZCines.",
          keywords:
            "phim theo thể loại, phim hành động, phim tình cảm, phim kinh dị, phim viễn tưởng, phim cổ trang, phim hài, thể loại phim hay, zcines",
          keepAlive: true,
        },
      },
      {
        path: "/danh-sach/:path",
        name: "PhimNew",
        component: () => import("@/pages/PhimNew/PhimNew.vue"),
        props: true,
        meta: {
          title: "Phim Mới Cập Nhật 2025 - Danh Sách Phim Mới Nhất | ZCines",
          description:
            "Danh sách phim mới cập nhật liên tục 2025: phim mới Vietsub FullHD, phim chiếu rạp, phim bộ, phim lẻ, anime mới nhất hôm nay tại ZCines.",
          keywords:
            "phim mới, phim mới nhất, phim mới 2025, phim mới cập nhật, danh sách phim mới, phim mới ra mắt, phim hot, zcines",
          keepAlive: true,
        },
      },
      {
        path: "/quoc-gia/:path",
        name: "QuocGia",
        component: () => import("@/pages/QuocGia/QuocGia.vue"),
        props: true,
        meta: {
          title: "Phim Theo Quốc Gia - Hàn Quốc, Trung Quốc, Âu Mỹ Hay | ZCines",
          description:
            "Xem phim theo quốc gia: phim Hàn Quốc, phim Trung Quốc, phim Âu Mỹ, phim Nhật Bản, phim Thái Lan Vietsub FullHD mới nhất miễn phí tại ZCines.",
          keywords:
            "phim theo quốc gia, phim hàn quốc, phim trung quốc, phim âu mỹ, phim nhật bản, phim thái lan, phim hoa ngữ, phim mỹ hay, zcines",
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
    const defaultTitle = "ZCines - Xem phim online Vietsub FullHD";
    const defaultDesc =
      "Xem phim online miễn phí Vietsub FullHD, phim bộ, phim lẻ, anime, hoạt hình, phim chiếu rạp mới nhất tại ZCines.";
    const routeTitle = to.meta.title || defaultTitle;
    const routeDesc = to.meta.description || defaultDesc;
    const canonicalPath = to.matched.length
      ? to.fullPath.split("?")[0].replace(/\/+$/, "") || "/"
      : "/";
    const canonicalUrl = `${window.location.origin}${canonicalPath}`;

    document.title = routeTitle;

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

    const setCanonical = (href) => {
      let el = document.querySelector('link[rel="canonical"]');
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", "canonical");
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    setMeta("name", "description", routeDesc);
    setMeta("name", "robots", to.meta.robots || "index, follow");
    setMeta("name", "keywords", to.meta.keywords || "xem phim online, xem phim miễn phí, phim vietsub, phim full hd, phim hay, phim mới, phim bộ, phim lẻ, anime, phim chiếu rạp, zcines");
    setMeta("property", "og:title", routeTitle);
    setMeta("property", "og:description", routeDesc);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:site_name", "ZCines");
    setMeta("property", "og:type", to.meta.ogType || "website");
    setMeta("property", "og:locale", "vi_VN");
    setMeta("property", "og:image", to.meta.ogImage || "https://zcines.com/og-image.jpg");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", routeTitle);
    setMeta("name", "twitter:description", routeDesc);
    setMeta("name", "twitter:image", to.meta.ogImage || "https://zcines.com/og-image.jpg");

    setCanonical(canonicalUrl);
  });
});

/* ========================
   Prevent DevTools Globally
========================= */
// window.addEventListener('keydown', (e) => {
//   // Ngăn chặn phím F12
//   if (e.key === 'F12' || e.keyCode === 123) {
//     e.preventDefault();
//     return false;
//   }
//   // Ngăn chặn Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+U / Ctrl+C
//   if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
//     e.preventDefault();
//     return false;
//   }
//   if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
//     e.preventDefault();
//     return false;
//   }
// });

// window.addEventListener('contextmenu', (e) => {
//   e.preventDefault();
// });

export default router;