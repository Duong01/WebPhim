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
          text
          class="bottom-nav-btn"
          :to="{ path: '/home' }"
          :class="{ 'bottom-nav-active': $route.path === '/home' }"
        >
        <v-icon size="18">mdi-fire</v-icon>
          {{ $t("Trang chủ") }}
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
              text
              class="bottom-nav-btn"
              v-bind="props"
              @click="getTheLoai"
              :loading="loadingTheLoai"
              :disabled="loadingTheLoai"
            >
            <v-icon start size="18">mdi-shape</v-icon>
              {{ $t("Thể loại") }}
              <v-icon right>mdi-menu-down</v-icon>
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
              text
              class="bottom-nav-btn"
              v-bind="props"
              @click="getQuocGia"
              :loading="loadingQuocGia"
              :disabled="loadingQuocGia"
            >
            <v-icon start size="18">mdi-earth</v-icon>
              {{ $t("Quốc gia") }}
              <v-icon right>mdi-menu-down</v-icon>
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
          text
          class="bottom-nav-btn"
          :to="{ path: '/phim-chieu-rap' }"
          :class="{ 'bottom-nav-active': $route.path === '/phim-chieu-rap' }"
        >
        <v-icon start size="18">mdi-calendar</v-icon>
          {{ $t("Chiếu rạp") }}
        
        </v-btn>
        <v-btn
          text
          class="bottom-nav-btn"
          :to="{ path: '/movie-schedule' }"
          :class="{ 'bottom-nav-active': $route.path === '/movie-schedule' }"
        >
        <v-icon start size="18">mdi-calendar</v-icon>
          {{ $t("Lịch chiếu") }}
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

      <!-- Theme -->
      <v-btn
        icon
        class="bottom-nav-btn"
        title="Theme"
        @click="changeTheme"
        v-show="$vuetify.display.mdAndUp"
      >
        <v-icon>mdi-white-balance-sunny</v-icon>
      </v-btn>
      <!-- Ngôn ngữ -->
      <v-menu offset-y v-if="$vuetify.display.mdAndUp">
        <template #activator="{ props }">
          <v-btn class="bottom-nav-btn" icon v-bind="props" :title="$t('Ngôn ngữ')">
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
          <v-btn class="bottom-nav-btn" icon v-bind="props" :title="$t('Tài khoản')">
            <v-avatar :image="avatar" v-if="avatar != ''"></v-avatar>
              <v-icon v-else>mdi-account-circle</v-icon> {{ account }}
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
            <div class="avatar-with-crown">
              <v-avatar :image="avatar" v-if="avatar != ''"></v-avatar>
              <v-icon size="20" v-else>mdi-account-circle</v-icon>
              <v-icon v-if="isFanCung" class="crown-icon" color="yellow-darken-2" size="18">mdi-crown</v-icon>
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
        bg-color="transparent"
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
      <v-list nav dense>
        <!-- Mục chính -->
        <v-list-item
          :to="{ path: '/home' }"
          :class="{ 'bottom-nav-active': $route.path === '/home' }"
        >
          <v-list-item-title>
            <v-icon size="16">mdi-fire</v-icon>
            {{ $t("Trang chủ") }}</v-list-item-title>
        </v-list-item>

        <v-list-item
          :to="{ path: '/phim-bo' }"
          :class="{ 'bottom-nav-active': $route.path === '/phim-bo' }"
        >
          <v-list-item-title>
            <v-icon size="16">mdi-movie</v-icon>
            {{ $t("Phim Bộ") }}
            </v-list-item-title>
        </v-list-item>

        <v-list-item
          :to="{ path: '/phim-le' }"
          :class="{ 'bottom-nav-active': $route.path === '/phim-le' }"
        >
          <v-list-item-title>
        <v-icon size="16">mdi-movie</v-icon>
            {{ $t("Phim Lẻ") }}
            </v-list-item-title>
        </v-list-item>

        <!-- THỂ LOẠI (submenu) -->
        <v-expansion-panels multiple>
          <v-expansion-panel>
            <v-expansion-panel-title
              @click="getTheLoai"
              :loading="loadingTheLoai"
              :disabled="loadingTheLoai"
            >
            <v-icon start size="18">mdi-shape</v-icon>
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
                  <v-list-item-title>
                    <v-icon size="16" class="mr-1">mdi-filmstrip</v-icon>
                    {{ genre.name }}
                    </v-list-item-title>
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
            <v-icon start size="16">mdi-earth</v-icon>
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
            :class="{ 'bottom-nav-active': $route.path === '/tv-shows' }"
          >
            <v-list-item-title>
              <v-icon size="16">mdi-movie</v-icon>
              {{ $t("TV Show") }}
              </v-list-item-title>
          </v-list-item>
          <v-list-item
            :to="{ path: '/hoat-hinh' }"
            :class="{ 'bottom-nav-active': $route.path === '/hoat-hinh' }"
          >
            <v-list-item-title>
              <v-icon size="16">mdi-movie</v-icon>
              {{ $t("Hoạt hình") }}
              </v-list-item-title>
          </v-list-item>
          
          <v-list-item
            :to="{ path: '/movie-schedule' }"
            :class="{ 'bottom-nav-active': $route.path === '/movie-schedule' }"
          >
            <v-list-item-title><v-icon start size="18">mdi-calendar</v-icon>{{ $t("Lịch chiếu") }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            :to="{ path: '/phim-chieu-rap' }"
            :class="{ 'bottom-nav-active': $route.path === '/phim-chieu-rap' }"
          >
            <v-list-item-title><v-icon start size="18">mdi-calendar</v-icon>{{ $t("Chiếu rạp") }}</v-list-item-title>
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
    
    this.InitLang();
  },
};
</script>

<style scoped>
/* =========================
   NAVBAR — glass cinema
========================= */
.main-navbar {
  background: linear-gradient(180deg, rgba(7, 7, 12, 0.92), rgba(7, 7, 12, 0.78)) !important;
  backdrop-filter: blur(18px) saturate(1.4);
  -webkit-backdrop-filter: blur(18px) saturate(1.4);
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
}

/* Viền gradient mảnh dưới navbar */
.main-navbar::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 183, 0, 0.55), rgba(255, 94, 0, 0.55), transparent);
  opacity: 0.8;
  pointer-events: none;
}

/* =========================
   MENU DROPDOWN — glass
========================= */
.menu-glass {
  background: rgba(14, 14, 22, 0.92) !important;
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.09);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}

.menu-link {
  padding: 6px 10px;
  border-radius: 10px;
  transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;
}

.menu-link:hover {
  background: linear-gradient(135deg, rgba(255, 183, 0, 0.16), rgba(255, 94, 0, 0.16));
  color: #ffb700 !important;
  transform: translateX(3px);
}

.suggestion-item {
  border-radius: 10px;
  margin: 2px 6px;
  transition: background 0.2s ease;
}

.suggestion-item:hover {
  background: rgba(255, 255, 255, 0.07);
}

/* =========================
   SEARCH
========================= */
.search-wrapper {
  flex: 1;
  max-width: 420px;
  min-width: 200px;
}

@media (max-width: 960px) {
  .search-wrapper {
    max-width: 100%;
  }
}

.search-input {
  width: 100%;
}

.search-input :deep(.v-field) {
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
}

.search-input :deep(.v-field--focused) {
  background: rgba(255, 255, 255, 0.09) !important;
  border-color: rgba(255, 183, 0, 0.6);
  box-shadow: 0 0 0 3px rgba(255, 183, 0, 0.15);
}

.text-green {
  color: #00e165 !important;
}

.v-spacer {
  flex-grow: 0 !important;
}

/* =========================
   ACCOUNT
========================= */
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

.avatar-with-crown {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.crown-icon {
  position: absolute;
  top: -5px;
  right: -5px;
}

/* =========================
   BOTTOM NAVBAR — floating dock
========================= */

.bottom-navbar {
  pointer-events: auto;

  width: min(780px, calc(100vw - 24px)) !important;

  border-radius: 26px !important;

  background: rgba(12, 12, 20, 0.78) !important;

  backdrop-filter: blur(24px) saturate(1.5);
  -webkit-backdrop-filter: blur(24px) saturate(1.5);

  border: 1px solid rgba(255, 255, 255, 0.09);

  box-shadow:
    0 14px 44px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);

  padding: 8px;

  overflow: hidden;
  margin: 0 auto;

  will-change: transform;
  position: fixed;
  bottom: 10px;
  left: 0;
  right: 0;
  z-index: 1005;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
}

/* Content */

.bottom-navbar .v-bottom-navigation__content {
  justify-content: center !important;

  gap: 8px;

  width: 100%;
}

/* Hidden */

.bottom-navbar--hidden {
  transform: translateY(160%);
  opacity: 0;
  pointer-events: none;
}

/* BUTTON */

/* =========================
   BOTTOM NAV BUTTON
========================= */

.bottom-nav-btn {
  position: relative;

  border-radius: 18px !important;

  overflow: hidden;

  transition:
    all 0.28s cubic-bezier(0.22, 1, 0.36, 1);

  color: rgba(255, 255, 255, 0.72) !important;

  font-weight: 500;
  letter-spacing: 0.2px;

  min-width: 0 !important;

  /* Quan trọng */
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;

  gap: 3px !important;

  padding: 6px 10px !important;
}

/* Vuetify thường đặt content bên trong button */
.bottom-nav-btn :deep(.v-btn__content) {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;

  gap: 3px !important;

  width: 100%;
  height: 100%;
}

/* ICON */
.bottom-nav-btn :deep(.v-icon) {
  flex: 0 0 auto !important;

  margin: 0 !important;

  width: 22px;
  height: 22px;

  transition:
    transform 0.3s ease,
    color 0.3s ease;
}

/* TEXT */
.bottom-nav-btn :deep(span) {
  display: block !important;

  margin: 0 !important;

  font-size: 11px;
  line-height: 14px;

  font-weight: 600;

  white-space: nowrap;

  text-transform: none;

  transition: all 0.25s ease;
}

/* ACTIVE */
.bottom-nav-active .v-icon {
  transform: scale(1.18) translateY(-1px);

  color: #ffb700 !important;

  filter: drop-shadow(
    0 0 8px rgba(255, 183, 0, 0.65)
  );
}

.bottom-nav-active span {
  color: white;

  letter-spacing: 0.3px;
}

/* MOBILE */
@media (max-width: 600px) {
  .bottom-navbar {
    width: calc(100% - 14px) !important;

    bottom: 8px;

    border-radius: 22px !important;

    padding: 5px !important;
  }

  .bottom-navbar .v-bottom-navigation__content {
    gap: 2px !important;
  }

  .bottom-nav-btn {
    border-radius: 16px !important;

    padding: 5px 4px !important;

    gap: 2px !important;
  }

  .bottom-nav-btn :deep(.v-btn__content) {
    gap: 2px !important;
  }

  .bottom-nav-btn :deep(span) {
    font-size: 10px;

    line-height: 13px;
  }

  .bottom-nav-btn :deep(.v-icon) {
    width: 22px;
    height: 22px;
  }
}

</style>
