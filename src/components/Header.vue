<template>
  <div>
    <v-app-bar class="main-navbar">
      <!-- Logo -->
      <v-app-bar-nav-icon
        v-show="$vuetify.display.smAndDown"
        @click="drawer = !drawer"
      />
      <v-img
        :src="imageLogo"
        alt="Phim360"
        contain
        class=""
        cover
        :max-width="smAndDown ? 180 : 120"
        :max-height="smAndDown ? 60 : 40"
        style="cursor: pointer"
        @click="goHome"
      ></v-img>

      <!-- Menu chính -->
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
          text
          :to="{ path: '/home' }"
          :class="{ 'text-green': $route.path === '/home' }"
        >
          {{ $t("Trang chủ") }}
        </v-btn>
        <!-- <v-btn
          text
          :to="{ path: '/phim-bo' }"
          :class="{ 'text-green': $route.path === '/phim-bo' }"
        >
          {{ $t("Phim Bộ") }}
        </v-btn> -->
        <!-- <v-btn
          text
          :to="{ path: '/phim-le' }"
          :class="{ 'text-green': $route.path === '/phim-le' }"
        >
          {{ $t("Phim Lẻ") }}
        </v-btn> -->

        <!-- Dropdown Thể loại -->
        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn
              text
              v-bind="props"
              @click="getTheLoai"
              :loading="loadingTheLoai"
              :disabled="loadingTheLoai"
            >
              {{ $t("Thể loại") }}
              <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list style="background-color: #1e1e1e">
            <v-sheet
              class="pa-4"
              style="
                max-width: 600px;
                background-color: #1e1e1e;
                color: white;
                border-radius: 8px;
              "
            >
              <v-row dense>
                <v-col
                  v-for="genre in genres"
                  :key="genre._id"
                  cols="12"
                  sm="6"
                  md="3"
                >
                  <RouterLink
                    :to="{ name: 'TheLoai', params: { path: genre.slug } }"
                    class="d-block text-white text-body-2 mb-2"
                    style="text-decoration: none"
                  >
                    {{ genre.name }}
                  </RouterLink>
                </v-col>
              </v-row>
            </v-sheet>
          </v-list>
        </v-menu>

        <!-- Dropdown Quốc gia -->
        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn
              text
              v-bind="props"
              @click="getQuocGia"
              :loading="loadingQuocGia"
              :disabled="loadingQuocGia"
            >
              {{ $t("Quốc gia") }}
              <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list style="background-color: #1e1e1e">
            <v-sheet
              class="pa-4"
              style="
                max-width: 600px;
                background-color: #1e1e1e;
                color: white;
                border-radius: 8px;
              "
            >
              <v-row dense>
                <v-col
                  v-for="country in countries"
                  :key="country._id"
                  cols="12"
                  sm="6"
                  md="3"
                >
                  <RouterLink
                    :to="{ name: 'QuocGia', params: { path: country.slug } }"
                    class="d-block text-white text-body-2 mb-2"
                    style="text-decoration: none"
                  >
                    {{ country.name }}
                  </RouterLink>
                </v-col>
              </v-row>
            </v-sheet>
          </v-list>
        </v-menu>

         <v-btn
          text
          :to="{ path: '/movie-schedule' }"
          :class="{ 'text-green': $route.path === '/movie-schedule' }"
        >
          {{ $t("Lịch chiếu") }}
        </v-btn>
        <!--<v-btn
          text
          :to="{ path: '/favorite' }"
          :class="{ 'text-green': $route.path === '/favorite' }"
        >
          {{ $t("Đã lưu") }}
        </v-btn> -->
      </v-toolbar-items>

      <!-- Search + Language + Profile -->
      <!-- <v-spacer /> -->
      <!-- <div style="padding: 0 20px;"></div> -->
      <template v-slot:append>

      
      <v-menu
        v-model="menuVisible"
        :close-on-content-click="false"
        :open-on-click="false"
        :open-on-focus="false"
        @keyup.enter="searchMovie"
        offset-y
      >
        <template #activator="{ props: activatorProps }">
          <div class="search-wrapper">
          <v-text-field
            v-bind="activatorProps"
            v-model="searchQuery"
            :placeholder="$t('Tên phim')"
            append-inner-icon="mdi-magnify"
            @keyup.enter="searchMovie"
            @click="openSearchHistory"
            @click:append-inner="searchMovie"
            @update:model-value="onInput"
            clearable
            solo
            hide-details
            class="search-input"
            density="comfortable"
            rounded="pill"
          />
          </div>
        </template>
        
        <v-list
          v-if="movieSuggestions.length > 0"
          style="
            min-width: 100%;
            max-height: 250px;
            overflow-y: auto;
            background-color: #1e1e1e;
            color: white;
            border-radius: 8px;
          "
        >
          <v-list-item
            v-for="(item, index) in movieSuggestions"
            :key="index"
            @click="selectSuggestion(item)"
          >
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <v-list
          v-else
          style="
            min-width: 100%;
            background-color: #1e1e1e;
            color: white;
            border-radius: 8px;
          "
        >
          <v-list-item>
            <v-list-item-title>{{
              $t("Không tìm thấy kết quả")
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Theme -->
      <v-btn
        icon
        title="Theme"
        @click="changeTheme"
        v-show="$vuetify.display.mdAndUp"
      >
        <v-icon>mdi-white-balance-sunny</v-icon>
      </v-btn>
      <!-- Ngôn ngữ -->
      <v-menu offset-y v-if="$vuetify.display.mdAndUp">
        <template #activator="{ props }">
          <v-btn icon v-bind="props" :title="$t('Ngôn ngữ')">
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="lang in languages"
            :key="lang.title"
            @click="changeLanguage(lang.title)"
          >
            <v-list-item-title>{{ lang.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Tài khoản -->
      <v-menu offset-y v-if="!isLogin">
        <template #activator="{ props }">
          <v-btn icon v-bind="props" :title="$t('Tài khoản')">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="NextRouter()">
            <v-list-item-title>{{ $t("Đã lưu") }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="Login()">
            <v-list-item-title>{{ $t("Đăng nhập") }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="Register()">
            <v-list-item-title>{{ $t("Đăng ký") }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y v-else>
        <template #activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              class="account-btn"
              :title="account"
            >
              <v-icon size="20">mdi-account-circle</v-icon>

              <!-- Chỉ hiện tên trên md trở lên -->
              <span
                class="account-name"
                v-if="$vuetify.display.mdAndUp"
              >
                {{ account }}
              </span>
            </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="$vuetify.display.mdAndDown">
            <v-list-item-title><v-icon>mdi-account-circle</v-icon> {{ account }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="NextRouter()">
            <v-list-item-title>{{ $t("Đã lưu") }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="Logout()">
            <v-list-item-title>{{ $t("Đăng xuất") }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      </template>
    </v-app-bar>

    <!--  header ben duoi an/hien khi scroll -->
    
      <v-bottom-navigation
      class="bottom-navbar"
      :class="{ 'bottom-navbar--hidden': !showBottomBar }"
      grow
    >
    
      <v-btn 
        :to="{ path: '/home' }"
        :class="{ 'text-green': $route.path === '/home' }"
      >
        <v-icon>mdi-home</v-icon>
        <span>{{ $t("Trang chủ") }}</span>
      </v-btn>
      <v-btn 
        :to="{ path: '/phim-bo' }"
        :class="{ 'text-green': $route.path === '/phim-bo' }">
        <v-icon>mdi-movie</v-icon>
        <span>{{ $t("Phim Bộ") }}</span>
      </v-btn>
      <v-btn
          
          :to="{ path: '/phim-le' }"
          :class="{ 'text-green': $route.path === '/phim-le' }"
        >
        <v-icon>mdi-movie</v-icon>
          <span>{{ $t("Phim Lẻ") }}</span>
      </v-btn>
      <v-btn
      :to="{ path: '/hoat-hinh' }"
      :class="{ 'text-green': $route.path === '/hoat-hinh' }"
      v-show="$vuetify.display.mdAndUp"
      >
        <v-icon>mdi-movie</v-icon>
        <span>{{ $t("Hoạt hình") }}</span>
      </v-btn>

      <v-btn 
        :to="{ path: '/favorite' }"
          :class="{ 'text-green': $route.path === '/favorite' }"
      >
        <v-icon >mdi-heart</v-icon>
        <span>{{ $t("Đã lưu") }}</span>
      </v-btn>
      <v-btn
          :to="{ path: '/movie-schedule' }"
          :class="{ 'text-green': $route.path === '/movie-schedule' }"
          v-show="$vuetify.display.mdAndDown"
        >
        <v-icon >mdi-calendar</v-icon>
          <span>{{ $t("Lịch chiếu") }}</span>
        </v-btn>
      
    </v-bottom-navigation>


    <!-- DRAWER CHO MOBILE -->
    <v-navigation-drawer v-model="drawer" app temporary class="d-md-none">
      <v-list nav dense>
        <!-- Mục chính -->
        <v-list-item
          :to="{ path: '/home' }"
          :class="{ 'text-green': $route.path === '/home' }"
        >
          <v-list-item-title>{{ $t("Trang chủ") }}</v-list-item-title>
        </v-list-item>

        <v-list-item
          :to="{ path: '/phim-bo' }"
          :class="{ 'text-green': $route.path === '/phim-bo' }"
        >
          <v-list-item-title>{{ $t("Phim Bộ") }}</v-list-item-title>
        </v-list-item>

        <v-list-item
          :to="{ path: '/phim-le' }"
          :class="{ 'text-green': $route.path === '/phim-le' }"
        >
          <v-list-item-title>{{ $t("Phim Lẻ") }}</v-list-item-title>
        </v-list-item>

        <!-- THỂ LOẠI (submenu) -->
        <v-expansion-panels multiple>
          <v-expansion-panel>
            <v-expansion-panel-title
              @click="getTheLoai"
              :loading="loadingTheLoai"
              :disabled="loadingTheLoai"
            >
              {{ $t("Thể loại") }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list dense>
                <v-list-item
                  v-for="genre in genres"
                  :key="genre._id"
                  :to="{ name: 'TheLoai', params: { path: genre.slug } }"
                  @click="drawer = false"
                >
                  <v-list-item-title>{{ genre.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- QUỐC GIA (submenu) -->
          <v-expansion-panel>
            <v-expansion-panel-title
              @click="getQuocGia"
              :loading="loadingQuocGia"
              :disabled="loadingQuocGia"
            >
              {{ $t("Quốc gia") }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list dense>
                <v-list-item
                  v-for="country in countries"
                  :key="country._id"
                  :to="{ name: 'QuocGia', params: { path: country.slug } }"
                  @click="drawer = false"
                >
                  <v-list-item-title>{{ country.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>

          
          <!-- Divider -->
          <v-divider class="my-2"></v-divider>
        </v-expansion-panels>
        <!-- Sắp chiếu -->
          <v-list-item
            :to="{ path: '/tv-shows' }"
            :class="{ 'text-green': $route.path === '/tv-shows' }"
          >
            <v-list-item-title>{{ $t("TV Show") }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            :to="{ path: '/hoat-hinh' }"
            :class="{ 'text-green': $route.path === '/hoat-hinh' }"
          >
            <v-list-item-title>{{ $t("Hoạt hình") }}</v-list-item-title>
          </v-list-item>
          
          <v-list-item
            :to="{ path: '/movie-schedule' }"
            :class="{ 'text-green': $route.path === '/movie-schedule' }"
          >
            <v-list-item-title>{{ $t("Lịch chiếu") }}</v-list-item-title>
          </v-list-item>
        <!-- Theme (chuyển theme) -->
        <v-list-item @click="changeTheme">
          <v-list-item-icon>
            <v-icon>mdi-white-balance-sunny</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ $t("Đổi giao diện") }}</v-list-item-title>
        </v-list-item>

        <!-- Ngôn ngữ -->
        <v-expansion-panels multiple>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-list-item-icon
                ><v-icon>mdi-translate</v-icon>
                {{ $t("Ngôn ngữ") }}</v-list-item-icon
              >
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list dense>
                <v-list-item
                  v-for="lang in languages"
                  :key="lang.title"
                  @click="changeLanguage(lang.title)"
                >
                  <v-list-item-title>{{ lang.name }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <!-- Profile -->
        <!-- <v-expansion-panels multiple v-if="!account">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-list-item-icon
                ><v-icon>mdi-account-circle</v-icon> Tài khoản</v-list-item-icon
              >
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list>
                <v-list-item @click="Login()">
                  <v-list-item-title>{{ $t("Đăng nhập") }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="Register()">
                  <v-list-item-title>{{ $t("Đăng ký") }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels multiple v-else>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-list-item-icon
                ><v-icon>mdi-account-circle</v-icon>
                <span>
                  {{ account }}
                </span>
              </v-list-item-icon>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list>
                <v-list-item @click="Logout()">
                  <v-list-item-title>{{ $t("Đăng xuất") }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels> -->
      </v-list>
    </v-navigation-drawer>

    <v-snackbar v-model="mess" :timeout="3000" :color="color">
      {{ Message }}
    </v-snackbar>
  </div>
</template>

<script>
import vi from "element-plus/dist/locale/vi.mjs";
import en from "element-plus/dist/locale/en.mjs";
import cn from "element-plus/dist/locale/zh-cn.mjs";
import { getLanguage, setLanguage } from "@/utils/cookies";
import { Categoris2, City2, Search, Search1 } from "@/model/api";
import imageLogo from "@/assets/Logo.png";
export default {
  name: "HeaderVuetify",
  data() {
    return {
      imageLogo: imageLogo,
      loadingQuocGia: false,
      loadingTheLoai: false,
      drawer: false,
      loading: false,
      mess: false,
      Message: "",
      color: "",
      // account: "",
      searchQuery: "",
      curElLang: "",
      curLang: "",
      searchInput: "",
      movieSuggestions: JSON.parse(localStorage.getItem("HisSearch"))
        ? JSON.parse(localStorage.getItem("HisSearch"))
        : [],
      menuVisible: false,
      genres: [],
      countries: [],
      languages: [
        { name: "Tiếng Việt", title: "vi-VN" },
        { name: "English", title: "en-US" },
        { name: "中国", title: "zh-CN" },
      ],
      lastScrollY: 0,
      showBottomBar: true,
    };
  },
  inject: ["currentTheme", "setTheme"],
  mounted() {
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    this.account =
      this.$store.state.EmpName || localStorage.getItem("nameShow");
    const history = JSON.parse(localStorage.getItem("HisSearch"));
    this.movieSuggestions = history ? history : [];
    console.log(this.movieSuggestions);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  computed: {
    account() {
      return this.$store.state.empInfor?.EmpName || "";
    },
    isLogin() {
      return !!this.$store.state.empInfor?.ID;
    },
  },
  methods: {
    handleScroll() {
      const currentY = window.scrollY;

      if (currentY > this.lastScrollY && currentY > 50) {
        // cuộn xuống → ẩn
        this.showBottomBar = false;
      } else {
        // cuộn lên → hiện
        this.showBottomBar = true;
      }

      this.lastScrollY = currentY;
    },

    openSearchHistory() {
      this.menuVisible = true;

      // Load lịch sử
      const history = JSON.parse(localStorage.getItem("HisSearch") || "[]");

      // Gán vào gợi ý
      this.movieSuggestions = history;
    },
    changeTheme() {
      const newTheme = this.currentTheme() === "dark" ? "light" : "dark";
      this.setTheme(newTheme);
    },
    getTheLoai() {
      this.loadingTheLoai = true;
      Categoris2(
        {},
        (dat) => {
          // if (dat.status == "success" || dat.status == true) {
          //   this.genres = dat.data.items;
          //   this.loadingTheLoai = false;
          // }
          this.genres = dat;
          this.loadingTheLoai = false;
        },
        (err) => {
          console.log(err);
          this.loadingTheLoai = false;
        }
      );
    },
    getQuocGia() {
      this.loadingQuocGia = true;
      City2(
        {},
        (dat) => {
          // if (dat.status == "success" || dat.status == true) {
          //   this.countries = dat.data.items;
          //   this.loadingQuocGia = false;
          // }
          this.countries = dat;
          this.loadingQuocGia = false;
        },
        (err) => {
          console.log(err);
          this.loadingQuocGia = false;
        }
      );
    },
    searchMovie() {
      if (this.searchQuery) {
        this.$router.push({
          name: "SearchMovie",
          query: { keyword: this.searchQuery },
        });
        let history = JSON.parse(localStorage.getItem("HisSearch") || "[]");
        history = history.filter((h) => h.name !== this.searchQuery);
        history.unshift({ name: this.searchQuery });
        history = history.slice(0, 5);
        localStorage.setItem("HisSearch", JSON.stringify(history));
        this.searchQuery = "";
        this.menuVisible = false;
      }
    },
    changeLanguage(keyLang) {
      this.curLang = keyLang;
      this.ChangeLang();
    },
    ChangeLang() {
      switch (this.curLang) {
        case "en-US":
          this.curElLang = en;
          break;
        case "vi-VN":
          this.curElLang = vi;
          break;
        case "zh-CN":
          this.curElLang = cn;
          break;
        default:
          this.curElLang = vi;
          break;
      }

      if (this.curLang) {
        this.$i18n.locale = this.curLang;
        setLanguage(this.curLang);
        this.$store.state.curi18n.curLang = this.curLang;
        this.$store.state.curi18n.curElLang = this.curElLang;
      }
    },
    InitLang() {
      const currLang = getLanguage();
      this.curLang = currLang || "vi-VN";
      this.ChangeLang();
    },
    Login() {
      this.$router.push("/login");
    },
    NextRouter() {
      this.$router.push("/favorite");
    },
    Register() {
      this.$router.push("/register");
    },
    handleLogin() {
      this.$router.push("/login");
    },
    handleRegister() {
      this.$router.push("/register");
    },
    goHome() {
      this.$router.push("/home");
    },
    Logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("favoriteMovies");
      localStorage.removeItem("user");

      this.$router.push("/login");
    },
    onInput(value) {
      if (!value || typeof value !== "string" || value.trim().length < 2) {
        const history = JSON.parse(localStorage.getItem("HisSearch") || "[]");

        // Nếu người dùng chưa nhập gì → hiển thị lịch sử trong movieSuggestions
        if (!this.searchQuery) {
          this.movieSuggestions = history.map((h) => ({ name: h }));
        }
        // this.movieSuggestions = [];
        this.menuVisible = false;
        return;
      } else {
        this.openSearchHistory();
      }

      this.fetchMovieSuggestions(value.trim());
    },
    fetchMovieSuggestions(keyword) {
      try {
        Search(
          { keyword },
          (dat) => {
            if (dat.data.items == null || dat.data.items == []) {
              Search1(
                { keyword },
                (data) => {
                  if (data.data.items != null) {
                    this.movieSuggestions =
                      data.data.items.sort((a, b) => b.year - a.year) || [];
                    this.menuVisible = this.movieSuggestions.length > 0;
                  }
                },
                (err) => {
                  console.error("Lỗi khi gọi API2:", err);
                }
              );
            } else {
              this.movieSuggestions =
                dat.data.items.sort((a, b) => b.year - a.year) || [];
              this.menuVisible = this.movieSuggestions.length > 0;
            }
          },
          (err) => {
            console.error("Lỗi khi gọi API1:", err);
          }
        );
      } catch (err) {
        console.error("Lỗi ngoài ý muốn:", err);
      }
    },
    selectSuggestion(item) {
      this.searchQuery = item.name;
      let history = JSON.parse(localStorage.getItem("HisSearch") || "[]");
      history = history.filter((h) => h.name !== item.name);
      history.unshift({ name: item.name });
      history = history.slice(0, 5);
      localStorage.setItem("HisSearch", JSON.stringify(history));
      this.menuVisible = false;
      this.searchMovie();
    },
  },
  created() {
    this.account =
      localStorage.getItem("nameShow") || this.$store.state.empInfor.EmpName;
    this.InitLang();
  },
};
</script>

<style scoped>
.main-navbar {
  background-color: rgba(0, 0, 0, 0.3) !important;
  backdrop-filter: blur(10px);
  top: 0;
  z-index: 1000;
}

.search-wrapper {
  flex: 1;                /* 🔥 cho phép giãn */
  max-width: 420px;       /* desktop */
  min-width: 250px;
}

@media (max-width: 960px) {
  .search-wrapper {
    max-width: 100%;
  }
}

.search-input {
  width: 100%;
}
.text-green {
  color: #00e165 !important;
}
a.router-link-exact-active,
a.router-link-active,
a:hover {
  color: #00e165 !important;
}
.v-spacer {
  flex-grow: 0 !important;
}
.account-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 180px;
}

.account-name {
  font-size: 14px;
  font-weight: 500;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.account-menu-name {
  font-weight: 600;
}
.bottom-navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1005;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.bottom-navbar--hidden {
  transform: translateY(100%);
  opacity: 0;
  pointer-events: none;
}
</style>
