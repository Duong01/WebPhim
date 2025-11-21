// import { createRouter, createWebHashHistory } from 'vue-router'
import { createRouter, createWebHistory  } from 'vue-router'

const routes =[
    {
        path: '/login',
        name: "LoginPage",
        component: () => import("@/components/Login"),
        meta: {
            title: "Đăng nhập - Web Phim Online",
            description: "Đăng nhập để trải nghiệm xem phim miễn phí chất lượng cao."
        }
    },
    {
        path: '/register',
        name: "RegisterPage",
        component: () => import("@/components/Register"),
        meta: {
            title: "Đăng ký tài khoản - Web Phim Online",
            description: "Tạo tài khoản miễn phí để lưu phim yêu thích và lịch sử xem."
        }
    },
    {
        path: '/Error',
        name: "ErrorPage",
        component: () => import("@/pages/Error.vue"),
        meta: {
            title: "Lỗi - Không tìm thấy trang",
            description: "Trang bạn tìm không tồn tại, vui lòng quay lại trang chủ."
        }
    },
    {
        
        path: '',
        name: "Layout",
        redirect: '/home',
        component: () => import("@/components/Layout"),
        children: [
        {
            path: '/home',
            name: "HomePage",
            component: () => import("@/pages/Home"),
            meta: {
          title: "Xem phim online miễn phí - Web Phim Online",
          description: "Kho phim mới nhất, hot nhất, cập nhật liên tục, xem online miễn phí."
        }
        },
        {
            path: '/movie/:slug',
            name: "MovieDetail",
            component: () => import("@/pages/MoiveDetail.vue"),
            props: true,
            meta: {
          title: "Chi tiết phim - Web Phim Online",
          description: "Xem thông tin chi tiết phim, trailer, đánh giá và link xem miễn phí."
        }
        },
        {
            path: '/favorite',
            name: "FavoritePage",
            component: () => import("@/pages/Favorite/Favorite.vue"),
            meta: {
          title: "Phim bộ hay nhất - Web Phim Online",
          description: "Tuyển tập phim bộ mới nhất, hấp dẫn, cập nhật liên tục."
        }
        },
        {
            path: 'search',
            name: "SearchMovie",
            component: () => import("@/pages/SearchMovie.vue"),
            props: true,
            meta: {
          title: "Tìm kiếm phim - Web Phim Online",
          description: "Tìm kiếm phim nhanh chóng theo tên, thể loại, quốc gia."
        }
        },

        {
            path: '/phim-bo',
            name: "PhimBo",
            component: () => import("@/pages/PhimBo/PhimBo.vue"),
            meta: {
          title: "Phim bộ hay nhất - Web Phim Online",
          description: "Tuyển tập phim bộ mới nhất, hấp dẫn, cập nhật liên tục."
        }
        },
        {
            path: '/phim-le',
            name: "PhimLe",
            component: () => import("@/pages/PhimLe/PhimLe.vue"),
            meta: {
          title: "Phim lẻ mới nhất - Web Phim Online",
          description: "Danh sách phim lẻ hot nhất, xem online chất lượng cao."
        }
        },
        {
            path: '/tv-shows',
            name: "TVShow",
            component: () => import("@/pages/TVShow/TVShow.vue"),
            meta: {
          title: "Phim sắp chiếu - Web Phim Online",
          description: "Khám phá những bộ phim bom tấn sắp ra mắt."
        }
        },
        {
            path: '/hoat-hinh',
            name: "HoatHinh",
            component: () => import("@/pages/HoatHinh/HoatHinh.vue"),
            meta: {
          title: "Phim hoạt hình - Web Phim Online",
          description: "Phim hoạt hình cho thiếu nhi và người lớn, đa dạng thể loại."
        }
        },
        {
            path: '/the-loai/:path',
            name: "TheLoai",
            component: () => import("@/pages/TheLoai/TheLoai.vue"),
            props: true,
            meta: {
          title: "Phim theo thể loại - Web Phim Online",
          description: "Xem danh sách phim theo từng thể loại được yêu thích."
        }
        },
        {
            path: '/danh-sach/:path',
            name: "PhimNew",
            component: () => import("@/pages/PhimNew/PhimNew.vue"),
            props: true,
            meta: {
          title: "Phim mới & phim hot - Web Phim Online",
          description: "Cập nhật nhanh các bộ phim mới nhất và được xem nhiều nhất."
        }
        },
        {
            path: '/quoc-gia/:path',
            name: "QuocGia",
            component: () => import("@/pages/QuocGia/QuocGia.vue"),
            props: true,
            meta: {
          title: "Phim theo quốc gia - Web Phim Online",
          description: "Khám phá phim từ nhiều quốc gia: Hàn, Trung, Mỹ, Việt Nam."
        }
        },
        {
            path: '/:catchAll(.*)',
            redirect: '/Error'
          }
        
        ]
    }
    

]

// Thời gian session tối đa (ví dụ: 30 phút)
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 phút

// Lưu thời điểm bắt đầu khi user vào trang lần đầu
if (!sessionStorage.getItem('sessionStart')) {
  sessionStorage.setItem('sessionStart', Date.now());
}









const router = createRouter({
    history: createWebHistory (process.env.BASE_URL),
    routes,
    scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  }
  })
  router.onError((error) => {
    const chunkFailed = /Loading chunk [\d]+ failed/;
  
    if (chunkFailed.test(error.message)) {
      console.warn("Chunk failed → Reload");
      window.location.reload();
    }
  });
  router.beforeEach((to, from, next) => {
    const defaultTitle = "Web Phim Online - Xem phim miễn phí";
  const defaultDesc = "Xem phim mới nhất, phim hot, phim bộ, phim lẻ online miễn phí.";

  document.title = to.meta.title || defaultTitle;

let descTag = document.querySelector('meta[name="description"]');
  if (!descTag) {
    descTag = document.createElement("meta");
    descTag.setAttribute("name", "description");
    document.head.appendChild(descTag);
  }
  descTag.setAttribute("content", to.meta.description || defaultDesc);
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement("meta");
    ogTitle.setAttribute("property", "og:title");
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute("content", to.meta.title || defaultTitle);

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement("meta");
    ogDesc.setAttribute("property", "og:description");
    document.head.appendChild(ogDesc);
  }
  ogDesc.setAttribute("content", to.meta.description || defaultDesc);


  //  Kiểm tra session hết hạn
  const sessionStart = parseInt(sessionStorage.getItem('sessionStart'), 10);
  const now = Date.now();
  const inactiveTime = now - sessionStart;

  if (inactiveTime > SESSION_TIMEOUT) {
    // Xoá session cũ và reload trang
    sessionStorage.removeItem('sessionStart');
    console.log("Phiên làm việc đã hết hạn, đang tải lại trang...");
    window.location.reload();
    return; // Dừng điều hướng để reload
  } else {
    // Cập nhật lại thời gian hoạt động gần nhất
    sessionStorage.setItem('sessionStart', now);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      fetch(window.location.href, { method: "HEAD" })
        .then(() => {})
        .catch(() => window.location.reload());
    }
  });
  

    if (to.matched.length === 0) {
      next('/Error')
    } else {
      next()
    }
  })

export default router