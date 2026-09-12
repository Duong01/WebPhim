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
        alt="Zcines"
        class=""
        cover
        :max-width="$vuetify.display.smAndDown ? 120 : 180"
        :max-height="$vuetify.display.smAndDown ? 40 : 60"
        style="cursor: pointer"
        @click="goHome"
      ></v-img>

      <!-- Menu chính -->
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
          variant="text"
          class="nav-btn"
          :to="{ path: '/home' }"
          :class="{ 'bottom-nav-active': $route.path === '/home' }"
        >
          <v-icon size="20">mdi-fire</v-icon>
          <span>{{ $t("Trang chủ") }}</span>
        </v-btn>
        <!-- <v-btn
          text
          :to="{ path: '/phim-bo' }"
          :class="{ 'bottom-nav-active': $route.path === '/phim-bo' }"
        >
          {{ $t("Phim Bộ") }}
        </v-btn> -->
        <!-- <v-btn
          text
          :to="{ path: '/phim-le' }"
          :class="{ 'bottom-nav-active': $route.path === '/phim-le' }"
        >
          {{ $t("Phim Lẻ") }}
        </v-btn> -->

        <!-- Dropdown Thể loại -->
        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn
              variant="text"
              class="nav-btn"
              v-bind="props"
              @click="getTheLoai"
              :loading="loadingTheLoai"
              :disabled="loadingTheLoai"
            >
              <v-icon size="20">mdi-shape</v-icon>
              <span>{{ $t("Thể loại") }}</span>
              <v-icon class="nav-caret" size="18">mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list style="background-color: transparent" class="menu-glass">
            <v-sheet
              class="pa-4"
              style="
                max-width: 640px;
                background-color: transparent;
                color: white;
                border-radius: 16px;
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
                    class="menu-link d-block text-white text-body-2 mb-2"
                    style="text-decoration: none"
                  >
                  <v-icon size="16" class="mr-1">mdi-filmstrip</v-icon>
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
              variant="text"
              class="nav-btn"
              v-bind="props"
              @click="getQuocGia"
              :loading="loadingQuocGia"
              :disabled="loadingQuocGia"
            >
              <v-icon size="20">mdi-earth</v-icon>
              <span>{{ $t("Quốc gia") }}</span>
              <v-icon class="nav-caret" size="18">mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list style="background-color: transparent" class="menu-glass">
            <v-sheet
              class="pa-4"
              style="
                max-width: 640px;
                background-color: transparent;
                color: white;
                border-radius: 16px;
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
                    class="menu-link d-block text-white text-body-2 mb-2"
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
          variant="text"
          class="nav-btn"
          :to="{ path: '/phim-chieu-rap' }"
          :class="{ 'bottom-nav-active': $route.path === '/phim-chieu-rap' }"
        >
          <v-icon size="20">mdi-ticket-confirmation</v-icon>
          <span>{{ $t("Chiếu rạp") }}</span>
        
        </v-btn>
        <v-btn
          variant="text"
          class="nav-btn"
          :to="{ path: '/movie-schedule' }"
          :class="{ 'bottom-nav-active': $route.path === '/movie-schedule' }"
        >
          <v-icon size="20">mdi-calendar-clock</v-icon>
          <span>{{ $t("Lịch chiếu") }}</span>
        </v-btn>
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
          class="menu-glass"
          style="
            min-width: 100%;
            max-height: 280px;
            overflow-y: auto;
            background-color: transparent;
            color: white;
            border-radius: 14px;
          "
        >
          <v-list-item
            v-for="(item, index) in movieSuggestions"
            :key="index"
            class="suggestion-item"
            @click="selectSuggestion(item)"
          >
            <template #prepend>
              <v-icon size="18" color="rgba(255,255,255,.45)">mdi-history</v-icon>
            </template>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <v-list
          v-else
          class="menu-glass"
          style="
            min-width: 100%;
            background-color: transparent;
            color: white;
            border-radius: 14px;
          "
        >
          <v-list-item>
            <template #prepend>
              <v-icon size="18" color="rgba(255,255,255,.45)">mdi-magnify</v-icon>
            </template>
            <v-list-item-title>{{
              $t("Không tìm thấy kết quả")
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      
      <!-- Ngôn ngữ -->
      <v-menu offset-y v-if="$vuetify.display.mdAndUp">
        <template #activator="{ props }">
          <v-btn class="nav-icon-btn" icon variant="text" v-bind="props" :title="$t('Ngôn ngữ')">
            <v-icon size="22">mdi-translate</v-icon>
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
          <v-btn class="nav-icon-btn" icon variant="text" v-bind="props" :title="$t('Tài khoản')">
            <v-avatar size="32" :image="avatar" v-if="avatar != ''"></v-avatar>
            <v-icon v-else size="22">mdi-account-circle-outline</v-icon>
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
              class="nav-icon-btn account-btn"
              :title="account"
            >
            <div class="avatar-with-crown">
              <v-avatar size="32" :image="avatar" v-if="avatar != ''"></v-avatar>
              <v-icon v-else size="22">mdi-account-circle-outline</v-icon>
              <v-icon v-if="isFanCung" class="crown-icon" color="yellow-darken-2" size="16">mdi-crown</v-icon>
            </div>

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
            <v-list-item-title class="d-flex align-center">
              <div class="avatar-with-crown mr-2">
                <v-avatar :image="avatar" v-if="avatar != ''"></v-avatar>
                <v-icon size="20" v-else>mdi-account-circle</v-icon>
                <v-icon v-if="isFanCung" class="crown-icon" color="yellow-darken-2" size="14">mdi-crown</v-icon>
              </div>
              {{ account }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="NextRouter()">
            <v-list-item-title>{{ $t("Đã lưu") }}</v-list-item-title>
          </v-list-item>
          <v-list-item @click="$router.push('/profile')">
            <v-list-item-title>{{ $t("Hồ sơ") }}</v-list-item-title>
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
        height="78"
      >
    
      <v-btn 
        class="bottom-nav-btn"
        :to="{ path: '/home' }"
        :class="{ 'bottom-nav-active': $route.path === '/home' }"
      >
        <v-icon size="22">mdi-fire</v-icon>
        <span>{{ $t("Trang chủ") }}</span>
      </v-btn>
      <v-btn 
      class="bottom-nav-btn"
        :to="{ path: '/phim-bo' }"
        :class="{ 'bottom-nav-active': $route.path === '/phim-bo' }">
        <v-icon size="22">mdi-movie</v-icon>
        <span>{{ $t("Phim Bộ") }}</span>
      </v-btn>
      <v-btn
          class="bottom-nav-btn"
          :to="{ path: '/phim-le' }"
          :class="{ 'bottom-nav-active': $route.path === '/phim-le' }"
        >
        <v-icon size="22">mdi-movie</v-icon>
          <span>{{ $t("Phim Lẻ") }}</span>
      </v-btn>
      <v-btn
      class="bottom-nav-btn"
      :to="{ path: '/hoat-hinh' }"
      :class="{ 'bottom-nav-active': $route.path === '/hoat-hinh' }"
      v-show="$vuetify.display.mdAndUp"
      >
        <v-icon size="22">mdi-movie</v-icon>
        <span>{{ $t("Hoạt hình") }}</span>
      </v-btn>

      
      <v-btn
      class="bottom-nav-btn"
          :to="{ path: '/movie-schedule' }"
          :class="{ 'bottom-nav-active': $route.path === '/movie-schedule' }"
          v-show="$vuetify.display.mdAndDown"
        >
        <v-icon size="22">mdi-calendar</v-icon>
          <span>{{ $t("Lịch chiếu") }}</span>
        </v-btn>
        <v-btn 
        class="bottom-nav-btn"
        :to="{ path: '/favorite' }"
          :class="{ 'bottom-nav-active': $route.path === '/favorite' }"
      >
        <v-icon size="22">mdi-heart</v-icon>
        <span>{{ $t("Đã lưu") }}</span>
      </v-btn>
      
    </v-bottom-navigation>

    <!-- DRAWER CHO MOBILE -->
    <v-navigation-drawer v-model="drawer" app temporary class="d-md-none">
      <v-list nav dense class="drawer-list">
        <!-- Mục chính -->
        <v-list-item
          :to="{ path: '/home' }"
          :class="{ 'bottom-nav-active': $route.path === '/home' }"
        >
          <template #prepend>
            <v-icon size="20">mdi-fire</v-icon>
          </template>
          <v-list-item-title>{{ $t("Trang chủ") }}</v-list-item-title>
        </v-list-item>

        <v-list-item
          :to="{ path: '/phim-bo' }"
          :class="{ 'bottom-nav-active': $route.path === '/phim-bo' }"
        >
          <template #prepend>
            <v-icon size="20">mdi-movie</v-icon>
          </template>
          <v-list-item-title>{{ $t("Phim Bộ") }}</v-list-item-title>
        </v-list-item>

        <v-list-item
          :to="{ path: '/phim-le' }"
          :class="{ 'bottom-nav-active': $route.path === '/phim-le' }"
        >
          <template #prepend>
            <v-icon size="20">mdi-movie-open</v-icon>
          </template>
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
              <div class="drawer-panel-title">
                <v-icon size="20">mdi-shape</v-icon>
                <span>{{ $t("Thể loại") }}</span>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list dense>
                <v-list-item
                  v-for="genre in genres"
                  :key="genre._id"
                  :to="{ name: 'TheLoai', params: { path: genre.slug } }"
                  @click="drawer = false"
                >
                  <template #prepend>
                    <v-icon size="18">mdi-filmstrip</v-icon>
                  </template>
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
              <div class="drawer-panel-title">
                <v-icon size="20">mdi-earth</v-icon>
                <span>{{ $t("Quốc gia") }}</span>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list dense>
                <v-list-item
                  v-for="country in countries"
                  :key="country._id"
                  :to="{ name: 'QuocGia', params: { path: country.slug } }"
                  @click="drawer = false"
                >
                  <template #prepend>
                    <v-icon size="18">mdi-flag</v-icon>
                  </template>
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
            :class="{ 'bottom-nav-active': $route.path === '/tv-shows' }"
          >
            <template #prepend>
              <v-icon size="20">mdi-television-classic</v-icon>
            </template>
            <v-list-item-title>{{ $t("TV Show") }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            :to="{ path: '/hoat-hinh' }"
            :class="{ 'bottom-nav-active': $route.path === '/hoat-hinh' }"
          >
            <template #prepend>
              <v-icon size="20">mdi-animation</v-icon>
            </template>
            <v-list-item-title>{{ $t("Hoạt hình") }}</v-list-item-title>
          </v-list-item>

          <v-list-item
            :to="{ path: '/movie-schedule' }"
            :class="{ 'bottom-nav-active': $route.path === '/movie-schedule' }"
          >
            <template #prepend>
              <v-icon size="20">mdi-calendar-clock</v-icon>
            </template>
            <v-list-item-title>{{ $t("Lịch chiếu") }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            :to="{ path: '/phim-chieu-rap' }"
            :class="{ 'bottom-nav-active': $route.path === '/phim-chieu-rap' }"
          >
            <template #prepend>
              <v-icon size="20">mdi-ticket-confirmation</v-icon>
            </template>
            <v-list-item-title>{{ $t("Chiếu rạp") }}</v-list-item-title>
          </v-list-item>

        <!-- Theme (chuyển theme) -->
        <v-list-item @click="changeTheme" class="bottom-nav-active">
          <template #prepend>
            <v-icon size="20">mdi-white-balance-sunny</v-icon>
          </template>
          <v-list-item-title>{{ $t("Đổi giao diện") }}</v-list-item-title>
        </v-list-item>

        <!-- Ngôn ngữ -->
        <v-expansion-panels multiple>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <div class="drawer-panel-title">
                <v-icon size="20">mdi-translate</v-icon>
                <span>{{ $t("Ngôn ngữ") }}</span>
              </div>
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
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  computed: {
    account() {
      return this.$store.state.empInfor?.EmpName || "";
    },
    avatar() {
      const user = this.$store.state.empInfor;
      let av = user?.Avatar || user?.Avartar || this.$store.state.Avatar || localStorage.getItem("Avatar");
      // Kiểm tra loại bỏ các giá trị trống, null thật hoặc chuỗi "null"/"undefined"
      if (!av || av === "null" || av === "undefined" || String(av).trim() === "") {
        return "";
      }
      return av;
    },
    isLogin() {
      return !!this.$store.state.empInfor?.ID || !!localStorage.getItem("name"); 
    },
    isFanCung() {
      // Lấy giá trị từ localStorage với tên là 'name'
      const fanStatus = localStorage.getItem("name");
      return fanStatus == 2 || fanStatus == 3;
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
          this.genres = dat.data.items;
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
          this.countries = dat.data.items;
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
      localStorage.removeItem("token");
      localStorage.removeItem("favoriteMovies");
      localStorage.removeItem("user");
      localStorage.removeItem("name");
      localStorage.removeItem("nameShow");
      localStorage.removeItem("Avatar");
      
      // Xóa dữ liệu trong store để cập nhật giao diện (avatar & info) ngay lập tức
      if (this.$store) {
        this.$store.commit("setEmpInfor", {});
        this.$store.commit("setAvatar", "");
      }

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
        Search1(
          { keyword },
          (dat) => {
            if (dat.data.items == null || dat.data.items == []) {
              Search(
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
    
    this.InitLang();
  },
};
</script>

<style scoped>

/* =========================================================
   ZCINES HEADER — RESPONSIVE / NO OVERLAP
   ========================================================= */

.main-navbar {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;

  width: 100%;
  height: 64px !important;
  min-height: 64px !important;

  z-index: 1000;

  background:
    linear-gradient(
      180deg,
      rgba(7, 7, 12, 0.96),
      rgba(7, 7, 12, 0.86)
    ) !important;

  backdrop-filter: blur(18px) saturate(1.4);
  -webkit-backdrop-filter: blur(18px) saturate(1.4);

  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.45);

  overflow: visible !important;
}


/* =========================================================
   GRADIENT LINE
   ========================================================= */

.main-navbar::after {
  content: "";

  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  height: 2px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255, 183, 0, 0.55),
      rgba(255, 94, 0, 0.55),
      transparent
    );

  pointer-events: none;
}


/* =========================================================
   VUETIFY APP BAR CONTENT
   ========================================================= */

.main-navbar :deep(.v-toolbar__content) {
  height: 64px !important;
  min-height: 64px !important;

  display: flex !important;
  align-items: center !important;

  width: 100%;

  padding: 0 16px !important;

  gap: 10px;

  box-sizing: border-box;
}


/* =========================================================
   MOBILE MENU BUTTON
   ========================================================= */

.main-navbar :deep(.v-app-bar-nav-icon) {
  flex: 0 0 40px;

  width: 40px !important;
  height: 40px !important;

  margin: 0 !important;
}


/* =========================================================
   LOGO
   ========================================================= */

.main-navbar :deep(.v-img) {
  flex: 0 0 auto;

  width: 150px;
  max-width: 150px;

  height: 48px;
  max-height: 48px;

  object-fit: contain;

  cursor: pointer;

  margin: 0 !important;
}


/* =========================================================
   MAIN MENU
   ========================================================= */

.main-navbar :deep(.v-toolbar-items) {
  flex: 1 1 auto;

  min-width: 0;

  display: flex !important;
  align-items: center !important;

  height: 100%;

  gap: 4px;

  overflow: hidden;
}


/* =========================================================
   NAV BUTTON
   ========================================================= */

.nav-btn {
  flex: 0 1 auto;

  height: 40px !important;
  min-width: 0 !important;

  padding: 0 12px !important;

  border-radius: 12px !important;

  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;

  flex-direction: row !important;

  gap: 6px !important;

  color: rgba(255, 255, 255, 0.78) !important;

  font-size: 14px;
  font-weight: 500;

  letter-spacing: 0.1px;

  white-space: nowrap;

  text-transform: none !important;

  overflow: hidden;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}


.nav-btn :deep(.v-btn__content) {
  display: inline-flex !important;

  align-items: center !important;
  justify-content: center !important;

  flex-direction: row !important;

  gap: 6px !important;

  width: auto !important;

  min-width: 0;

  white-space: nowrap;
}


/* ICON */

.nav-btn :deep(.v-icon) {
  flex: 0 0 20px !important;

  width: 20px !important;
  height: 20px !important;

  font-size: 20px !important;

  margin: 0 !important;

  line-height: 1 !important;
}


/* TEXT */

.nav-btn :deep(span) {
  display: inline-block !important;

  max-width: 100%;

  margin: 0 !important;

  font-size: 14px;

  line-height: 20px;

  white-space: nowrap;
}


/* DROPDOWN ARROW */

.nav-btn :deep(.nav-caret) {
  flex: 0 0 16px !important;

  width: 16px !important;
  height: 16px !important;

  font-size: 16px !important;

  margin-left: -2px !important;

  opacity: 0.55;
}


/* HOVER */

.nav-btn:hover {
  color: #fff !important;

  background: rgba(255, 255, 255, 0.07) !important;
}


/* ACTIVE */

.nav-btn.bottom-nav-active {
  color: #ffb700 !important;

  background:
    linear-gradient(
      135deg,
      rgba(255, 183, 0, 0.14),
      rgba(255, 94, 0, 0.10)
    ) !important;
}

.nav-btn.bottom-nav-active :deep(.v-icon),
.nav-btn.bottom-nav-active :deep(span) {
  color: #ffb700 !important;
}


/* =========================================================
   APPEND AREA
   Search + language + account
   ========================================================= */

.main-navbar :deep(.v-toolbar__append) {
  flex: 0 0 auto;

  display: flex !important;
  align-items: center !important;

  gap: 6px;

  min-width: 0;

  margin-left: auto;

  padding-left: 6px;
}


/* =========================================================
   SEARCH
   ========================================================= */

.search-wrapper {
  flex: 0 1 360px;

  width: 360px;
  max-width: 360px;

  min-width: 180px;

  display: flex;
  align-items: center;

  overflow: hidden;
}


.search-input {
  width: 100%;
  min-width: 0;
}


.search-input :deep(.v-field) {
  width: 100%;

  min-height: 40px !important;
  height: 40px !important;

  padding-top: 0 !important;
  padding-bottom: 0 !important;

  border-radius: 20px !important;

  background: rgba(255, 255, 255, 0.06) !important;

  border: 1px solid rgba(255, 255, 255, 0.1);

  box-sizing: border-box;

  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;
}


.search-input :deep(.v-field__input) {
  min-height: 40px !important;

  height: 40px;

  padding-top: 0 !important;
  padding-bottom: 0 !important;

  font-size: 14px;

  min-width: 0;
}


.search-input :deep(.v-field__append-inner) {
  padding-top: 0 !important;

  align-items: center !important;
}


.search-input :deep(.v-field--focused) {
  background: rgba(255, 255, 255, 0.09) !important;

  border-color: rgba(255, 183, 0, 0.6);

  box-shadow:
    0 0 0 3px rgba(255, 183, 0, 0.15);
}


/* =========================================================
   LANGUAGE / ACCOUNT ICON
   ========================================================= */

.nav-icon-btn {
  flex: 0 0 40px;

  width: 40px !important;
  min-width: 40px !important;

  height: 40px !important;
  min-height: 40px !important;

  padding: 0 !important;

  margin: 0 !important;

  border-radius: 12px !important;

  display: inline-flex !important;

  align-items: center !important;
  justify-content: center !important;

  color: rgba(255, 255, 255, 0.78) !important;
}


.nav-icon-btn:hover {
  color: #fff !important;

  background: rgba(255, 255, 255, 0.07) !important;
}


.nav-icon-btn :deep(.v-icon) {
  width: 22px !important;
  height: 22px !important;

  font-size: 22px !important;

  margin: 0 !important;
}


/* =========================================================
   ACCOUNT
   ========================================================= */

.account-btn {
  flex: 0 1 auto;

  width: auto !important;

  min-width: 40px !important;

  max-width: 180px;

  height: 40px !important;

  padding: 0 10px !important;

  display: inline-flex !important;

  align-items: center !important;
  justify-content: center !important;

  flex-direction: row !important;

  gap: 8px !important;

  overflow: hidden;
}


.account-btn :deep(.v-btn__content) {
  width: auto !important;
  min-width: 0;

  display: inline-flex !important;

  align-items: center !important;
  justify-content: center !important;

  flex-direction: row !important;

  gap: 8px !important;
}


/* ACCOUNT NAME */

.account-name {
  display: block;

  max-width: 100px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 14px;
  line-height: 20px;

  font-weight: 500;
}


/* =========================================================
   AVATAR
   ========================================================= */

.avatar-with-crown {
  position: relative;

  width: 26px;
  height: 26px;

  min-width: 26px;

  flex: 0 0 26px;

  display: inline-flex;

  align-items: center;
  justify-content: center;
}


.avatar-with-crown :deep(.v-avatar) {
  width: 26px !important;
  height: 26px !important;
}


.crown-icon {
  position: absolute;

  top: -6px;
  right: -7px;

  z-index: 2;
}


/* =========================================================
   DROPDOWN MENU
   ========================================================= */

.menu-glass {
  background: rgba(14, 14, 22, 0.94) !important;

  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);

  border: 1px solid rgba(255, 255, 255, 0.09);

  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.6);

  overflow: hidden;
}


.menu-link {
  display: flex !important;

  align-items: center;

  min-height: 32px;

  padding: 6px 10px;

  border-radius: 10px;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}


.menu-link:hover {
  background:
    linear-gradient(
      135deg,
      rgba(255, 183, 0, 0.16),
      rgba(255, 94, 0, 0.16)
    );

  color: #ffb700 !important;

  transform: translateX(3px);
}


/* =========================================================
   TABLET
   <= 1200px
   ========================================================= */

@media (max-width: 1200px) {

  .main-navbar :deep(.v-toolbar__content) {
    padding: 0 12px !important;

    gap: 6px;
  }


  .main-navbar :deep(.v-img) {
    width: 130px;
    max-width: 130px;
  }


  .nav-btn {
    padding: 0 9px !important;

    gap: 5px !important;

    font-size: 13px;
  }


  .nav-btn :deep(span) {
    font-size: 13px;
  }


  .nav-btn :deep(.v-icon) {
    width: 18px !important;
    height: 18px !important;

    font-size: 18px !important;

    flex-basis: 18px !important;
  }


  .search-wrapper {
    flex-basis: 280px;

    width: 280px;
    max-width: 280px;

    min-width: 160px;
  }


  .account-btn {
    max-width: 145px;
  }


  .account-name {
    max-width: 75px;
  }
}


/* =========================================================
   SMALL LAPTOP / TABLET
   <= 1050px

   Ở kích thước này ưu tiên không chồng chéo.
   ========================================================= */

@media (max-width: 1050px) {

  .main-navbar :deep(.v-toolbar__content) {
    gap: 5px;
  }


  .main-navbar :deep(.v-img) {
    width: 115px;
    max-width: 115px;
  }


  .main-navbar :deep(.v-toolbar-items) {
    gap: 2px;
  }


  .nav-btn {
    padding: 0 7px !important;

    gap: 4px !important;
  }


  .nav-btn :deep(span) {
    font-size: 12px;
  }


  .search-wrapper {
    flex-basis: 230px;

    width: 230px;
    max-width: 230px;

    min-width: 140px;
  }


  .account-btn {
    padding: 0 7px !important;

    gap: 5px !important;

    max-width: 120px;
  }


  .account-btn :deep(.v-btn__content) {
    gap: 5px !important;
  }


  .account-name {
    max-width: 65px;

    font-size: 12px;
  }
}


/* =========================================================
   TABLET
   <= 960px

   Header chuyển sang chế độ compact.
   ========================================================= */

@media (max-width: 960px) {

  .main-navbar {
    height: 60px !important;
    min-height: 60px !important;
  }


  .main-navbar :deep(.v-toolbar__content) {
    height: 60px !important;
    min-height: 60px !important;

    padding: 0 10px !important;
  }


  .main-navbar :deep(.v-img) {
    width: 105px;
    max-width: 105px;

    height: 42px;
    max-height: 42px;
  }


  /* Ẩn menu desktop để dùng drawer */

  .main-navbar :deep(.v-toolbar-items) {
    display: none !important;
  }


  .main-navbar :deep(.v-toolbar__append) {
    flex: 1 1 auto;

    margin-left: auto;

    justify-content: flex-end;

    gap: 5px;
  }


  .search-wrapper {
    flex: 1 1 auto;

    width: auto;
    max-width: 360px;

    min-width: 0;
  }


  .nav-icon-btn {
    flex: 0 0 38px;

    width: 38px !important;
    min-width: 38px !important;

    height: 38px !important;
  }


  .account-btn {
    flex: 0 0 38px;

    width: 38px !important;
    min-width: 38px !important;

    max-width: 38px;

    padding: 0 !important;
  }


  .account-name {
    display: none !important;
  }
}


/* =========================================================
   MOBILE
   <= 600px
   ========================================================= */

@media (max-width: 600px) {

  .main-navbar {
    height: 56px !important;
    min-height: 56px !important;
  }


  .main-navbar :deep(.v-toolbar__content) {
    height: 56px !important;
    min-height: 56px !important;

    padding: 0 7px !important;

    gap: 3px;
  }


  .main-navbar :deep(.v-app-bar-nav-icon) {
    flex: 0 0 38px;

    width: 38px !important;
    height: 38px !important;
  }


  .main-navbar :deep(.v-img) {
    width: 90px;
    max-width: 90px;

    height: 38px;
    max-height: 38px;
  }


  .main-navbar :deep(.v-toolbar__append) {
    gap: 3px;

    min-width: 0;
  }


  .search-wrapper {
    flex: 1 1 auto;

    width: auto;
    max-width: none;

    min-width: 0;
  }


  .search-input :deep(.v-field) {
    height: 38px !important;
    min-height: 38px !important;
  }


  .search-input :deep(.v-field__input) {
    height: 38px;

    min-height: 38px !important;

    font-size: 12px;
  }


  .nav-icon-btn {
    flex: 0 0 36px;

    width: 36px !important;
    min-width: 36px !important;

    height: 36px !important;
  }


  .nav-icon-btn :deep(.v-icon) {
    width: 20px !important;
    height: 20px !important;

    font-size: 20px !important;
  }


  .account-btn {
    flex: 0 0 36px;

    width: 36px !important;
    min-width: 36px !important;

    height: 36px !important;

    max-width: 36px;

    padding: 0 !important;
  }


  .avatar-with-crown {
    width: 24px;
    height: 24px;

    min-width: 24px;

    flex-basis: 24px;
  }


  .avatar-with-crown :deep(.v-avatar) {
    width: 24px !important;
    height: 24px !important;
  }
}


/* =========================================================
   VERY SMALL MOBILE
   <= 400px

   Giữ khoảng cách an toàn.
   ========================================================= */

@media (max-width: 400px) {

  .main-navbar :deep(.v-toolbar__content) {
    padding: 0 5px !important;

    gap: 2px;
  }


  .main-navbar :deep(.v-app-bar-nav-icon) {
    flex-basis: 34px;

    width: 34px !important;
    height: 34px !important;
  }


  .main-navbar :deep(.v-img) {
    width: 78px;
    max-width: 78px;
  }


  .nav-icon-btn {
    flex-basis: 34px;

    width: 34px !important;
    min-width: 34px !important;

    height: 34px !important;
  }


  .account-btn {
    flex-basis: 34px;

    width: 34px !important;
    min-width: 34px !important;

    height: 34px !important;

    max-width: 34px;
  }


  .search-input :deep(.v-field__input) {
    font-size: 11px;
  }
}


/* =========================================================
   FIX VUETIFY FLEX / OVERFLOW
   ========================================================= */

.main-navbar :deep(.v-toolbar__prepend),
.main-navbar :deep(.v-toolbar__append),
.main-navbar :deep(.v-toolbar-items),
.main-navbar :deep(.v-btn),
.main-navbar :deep(.v-menu) {
  box-sizing: border-box;
}


.main-navbar :deep(.v-menu) {
  min-width: 0;
}


/* =========================================================
   DRAWER
   ========================================================= */

.drawer-list :deep(.v-list-item) {
  min-height: 44px;

  width: 100%;

  box-sizing: border-box;
}


.drawer-list :deep(.v-list-item__prepend) {
  width: 36px;
  min-width: 36px;

  display: flex;

  align-items: center;
  justify-content: flex-start;
}


.drawer-list :deep(.v-list-item__prepend .v-icon) {
  margin: 0 !important;
}


.drawer-list :deep(.v-list-item-title) {
  min-width: 0;

  font-size: 14px;

  font-weight: 500;

  line-height: 20px;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;
}


.drawer-panel-title {
  display: flex;

  align-items: center;

  gap: 10px;

  min-width: 0;

  font-size: 14px;

  font-weight: 500;
}


.drawer-panel-title .v-icon {
  flex: 0 0 auto;
}


/* =========================================================
   ACCESSIBILITY / TOUCH
   ========================================================= */

@media (hover: none) {

  .nav-btn:hover,
  .nav-icon-btn:hover {
    background: transparent !important;
  }
}
/* =========================================================
   BOTTOM NAVBAR
   Luôn có màu nền rõ ràng, không bị ảnh/video phía dưới
   ========================================================= */

.bottom-navbar {
  pointer-events: auto;

  width: min(780px, calc(100vw - 24px)) !important;

  height: 78px !important;

  border-radius: 26px !important;

  /* Không dùng transparent */
  background:
    linear-gradient(
      180deg,
      rgba(18, 18, 28, 0.97),
      rgba(10, 10, 18, 0.97)
    ) !important;

  /* Làm nền chắc chắn hơn */
  backdrop-filter: blur(24px) saturate(1.5);
  -webkit-backdrop-filter: blur(24px) saturate(1.5);

  border: 1px solid rgba(255, 255, 255, 0.12) !important;

  box-shadow:
    0 14px 44px rgba(0, 0, 0, 0.65),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);

  padding: 8px !important;

  overflow: hidden;

  margin: 0 auto;

  position: fixed;

  bottom: 10px;
  left: 0;
  right: 0;

  z-index: 1005;

  will-change: transform;

  transition:
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s ease;
}


/* Thanh nội dung bên trong */
.bottom-navbar :deep(.v-bottom-navigation__content) {
  width: 100% !important;

  height: 100% !important;

  display: flex !important;

  align-items: stretch !important;

  justify-content: center !important;

  gap: 8px !important;

  background: transparent !important;
}


/* =========================================================
   BUTTON
   ========================================================= */

.bottom-nav-btn {
  position: relative;

  flex: 1 1 0 !important;

  min-width: 0 !important;

  max-width: 150px;

  height: 60px !important;

  border-radius: 18px !important;

  overflow: hidden;

  color: rgba(255, 255, 255, 0.78) !important;

  font-weight: 500;

  letter-spacing: 0.2px;

  background: transparent !important;

  display: flex !important;

  flex-direction: column !important;

  align-items: center !important;

  justify-content: center !important;

  gap: 4px !important;

  padding: 6px 10px !important;

  transition:
    background 0.25s ease,
    color 0.25s ease,
    transform 0.25s ease;
}


/* Nội dung Vuetify */
.bottom-nav-btn :deep(.v-btn__content) {
  width: 100% !important;

  height: 100% !important;

  display: flex !important;

  flex-direction: column !important;

  align-items: center !important;

  justify-content: center !important;

  gap: 3px !important;

  opacity: 1 !important;
}


/* Icon */
.bottom-nav-btn :deep(.v-icon) {
  flex: 0 0 auto !important;

  width: 22px !important;
  height: 22px !important;

  font-size: 22px !important;

  margin: 0 !important;

  color: rgba(255, 255, 255, 0.75) !important;

  transition:
    transform 0.25s ease,
    color 0.25s ease,
    filter 0.25s ease;
}


/* Text */
.bottom-nav-btn :deep(span) {
  display: block !important;

  margin: 0 !important;

  font-size: 11px;

  line-height: 14px;

  font-weight: 600;

  white-space: nowrap;

  text-transform: none !important;

  color: rgba(255, 255, 255, 0.78) !important;

  transition:
    color 0.25s ease,
    letter-spacing 0.25s ease;
}


/* =========================================================
   HOVER
   ========================================================= */

.bottom-nav-btn:hover {
  background:
    linear-gradient(
      135deg,
      rgba(255, 183, 0, 0.12),
      rgba(255, 94, 0, 0.08)
    ) !important;

  color: #fff !important;
}

.bottom-nav-btn:hover :deep(.v-icon) {
  color: #fff !important;

  transform: translateY(-1px);
}

.bottom-nav-btn:hover :deep(span) {
  color: #fff !important;
}


/* =========================================================
   ACTIVE
   ========================================================= */

.bottom-nav-btn.bottom-nav-active {
  background:
    linear-gradient(
      135deg,
      rgba(255, 183, 0, 0.20),
      rgba(255, 94, 0, 0.14)
    ) !important;

  border: 1px solid rgba(255, 183, 0, 0.16);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 4px 16px rgba(255, 183, 0, 0.08);
}


/* Icon active */
.bottom-nav-btn.bottom-nav-active :deep(.v-icon) {
  color: #ffb700 !important;

  transform: scale(1.12) translateY(-1px);

  filter:
    drop-shadow(0 0 8px rgba(255, 183, 0, 0.65));
}


/* Text active */
.bottom-nav-btn.bottom-nav-active :deep(span) {
  color: #fff !important;

  letter-spacing: 0.3px;
}


/* =========================================================
   HIDDEN
   ========================================================= */

.bottom-navbar--hidden {
  transform: translateY(160%);

  opacity: 0;

  pointer-events: none;
}

/* =========================================================
   AVATAR HEADER - HIỂN THỊ TOÀN BỘ ẢNH
   ========================================================= */

.main-navbar :deep(.v-avatar) {
  position: relative !important;

  width: 32px !important;
  height: 32px !important;
  min-width: 32px !important;
  min-height: 32px !important;

  flex: 0 0 32px !important;

  border-radius: 50% !important;
  overflow: hidden !important;

  background: rgba(255, 255, 255, 0.08) !important;

  border: 1px solid rgba(255, 255, 255, 0.22) !important;

  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.04),
    0 3px 10px rgba(0, 0, 0, 0.45);

  opacity: 1 !important;
}


/* =========================================================
   QUAN TRỌNG:
   Vuetify v-avatar :image sẽ tạo VImg bên trong
   ========================================================= */

.main-navbar :deep(.v-avatar .v-img) {
  width: 100% !important;
  height: 100% !important;

  border-radius: 50% !important;
  overflow: hidden !important;

  background: transparent !important;
}


/* Ảnh avatar thực tế của Vuetify */

.main-navbar :deep(.v-avatar .v-img__img) {
  width: 100% !important;
  height: 100% !important;

  object-fit: contain !important;
  object-position: center center !important;

  display: block !important;

  opacity: 1 !important;
  visibility: visible !important;
}


/* Nếu Vuetify sử dụng picture */

.main-navbar :deep(.v-avatar .v-img__picture) {
  width: 100% !important;
  height: 100% !important;

  object-fit: contain !important;
  object-position: center center !important;
}


/* =========================================================
   KHUNG AVATAR + CROWN
   ========================================================= */

.avatar-with-crown {
  position: relative;

  width: 32px;
  height: 32px;

  min-width: 32px;

  flex: 0 0 32px;

  display: inline-flex !important;

  align-items: center;
  justify-content: center;
}


/* Avatar bên trong */

.avatar-with-crown :deep(.v-avatar) {
  width: 32px !important;
  height: 32px !important;

  min-width: 32px !important;
  min-height: 32px !important;

  flex: 0 0 32px !important;
}


/* =========================================================
   CROWN
   ========================================================= */

.avatar-with-crown :deep(.crown-icon) {
  position: absolute !important;

  top: -7px !important;
  right: -7px !important;

  z-index: 5;

  filter:
    drop-shadow(0 1px 3px rgba(0, 0, 0, 0.65));
}


/* =========================================================
   HOVER
   ========================================================= */

.account-btn:hover :deep(.v-avatar) {
  border-color: rgba(255, 183, 0, 0.75) !important;

  box-shadow:
    0 0 0 2px rgba(255, 183, 0, 0.12),
    0 0 16px rgba(255, 183, 0, 0.22);
}


/* =========================================================
   FALLBACK ICON
   ========================================================= */

.main-navbar :deep(.v-icon.mdi-account-circle-outline) {
  color: rgba(255, 255, 255, 0.9) !important;
  opacity: 1 !important;
}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 600px) {

  .bottom-navbar {
    width: calc(100vw - 14px) !important;

    height: 70px !important;

    bottom: 8px !important;

    border-radius: 22px !important;

    padding: 5px !important;

    background:
      linear-gradient(
        180deg,
        rgba(18, 18, 28, 0.98),
        rgba(9, 9, 16, 0.98)
      ) !important;

    border-color: rgba(255, 255, 255, 0.12) !important;
  }


  .bottom-navbar :deep(.v-bottom-navigation__content) {
    gap: 2px !important;
  }


  .bottom-nav-btn {
    flex: 1 1 0 !important;

    width: auto !important;

    max-width: none !important;

    height: 58px !important;

    border-radius: 16px !important;

    padding: 5px 3px !important;

    gap: 2px !important;
  }


  .bottom-nav-btn :deep(.v-btn__content) {
    gap: 2px !important;
  }


  .bottom-nav-btn :deep(.v-icon) {
    width: 21px !important;
    height: 21px !important;

    font-size: 21px !important;
  }


  .bottom-nav-btn :deep(span) {
    font-size: 10px !important;

    line-height: 13px !important;
  }
}


/* =========================================================
   MOBILE RẤT NHỎ
   ========================================================= */

@media (max-width: 400px) {

  .bottom-navbar {
    width: calc(100vw - 10px) !important;

    bottom: 5px !important;

    border-radius: 19px !important;

    padding: 4px !important;
  }


  .bottom-navbar :deep(.v-bottom-navigation__content) {
    gap: 1px !important;
  }


  .bottom-nav-btn {
    height: 56px !important;

    border-radius: 14px !important;

    padding: 4px 2px !important;
  }


  .bottom-nav-btn :deep(.v-icon) {
    width: 20px !important;
    height: 20px !important;

    font-size: 20px !important;
  }


  .bottom-nav-btn :deep(span) {
    font-size: 9px !important;

    line-height: 12px !important;
  }
}

</style>
