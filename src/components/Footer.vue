<template>
  <v-footer class="bg-grey-darken-4 text-grey-lighten-1 pa-0 d-flex flex-column footer-container">
    
    <!-- Tags / SEO Keywords Ribbon -->
    <div class="w-100 bg-black pa-4 border-b border-white-10" style="border-bottom: 1px solid rgba(255,255,255,0.05) !important;">
      <v-container class="pa-0">
        <div class="d-flex flex-wrap gap-2 align-center justify-center justify-md-start">
          <span class="text-caption font-weight-bold text-white mr-2 d-none d-md-inline-block">
            <v-icon start size="small" color="primary">mdi-tag-multiple</v-icon> {{ $t('Từ khóa nổi bật:') }}
          </span>
          <router-link
            v-for="(tag, index) in tags"
            :key="index"
            :to="tag.link"
            custom
            v-slot="{ navigate }"
          >
            <v-chip
              @click="navigate"
              variant="outlined"
              color="grey-darken-1"
              size="small"
              class="tag-chip text-caption"
              aria-label="Xem thêm"
            >
              {{ tag.label }}
            </v-chip>
          </router-link>
        </div>
      </v-container>
    </div>

    <!-- Main Footer Content -->
    <v-container class="py-10">
      <v-row>
        <!-- Cột 1: Logo + Mô tả + Social -->
        <v-col cols="12" lg="4" md="12" class="pr-lg-8 mb-6 mb-lg-0">
          <div class="text-h4 font-weight-bold mb-4">
            <span class="font-italic text-white">Phim</span><span class="logo-gradient">360</span>
          </div>
          <p class="text-body-2 mb-6" style="line-height: 1.6;">
            <strong class="text-white">Phim360</strong> - {{ $t('Trang xem phim Online với giao diện hiện đại, thân thiện người dùng.') }}
            {{ $t('Nguồn phim được tổng hợp tự động từ các website lớn với đa dạng thể loại và quốc gia, cập nhật liên tục 24/7.') }}
          </p>
          
          <!-- Social Icons -->
          <h5 class="text-subtitle-2 text-white font-weight-bold mb-3">{{ $t('Kết nối với chúng tôi') }}</h5>
          <div class="d-flex gap-3">
            <v-btn icon="mdi-facebook" href="https://www.facebook.com/" target="_blank" variant="tonal" color="blue" size="small" class="social-btn"></v-btn>
            <v-btn icon="mdi-youtube" href="https://www.youtube.com/" target="_blank" variant="tonal" color="red" size="small" class="social-btn"></v-btn>
            <v-btn icon="mdi-instagram" href="https://www.instagram.com/" target="_blank" variant="tonal" color="pink" size="small" class="social-btn"></v-btn>
            <v-btn icon href="https://t.me/" target="_blank" variant="tonal" color="light-blue" size="small" class="social-btn" title="Telegram">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.18-.08-.05-.19-.02-.27 0-.11.03-1.84 1.18-5.21 3.45-.49.33-.94.5-1.35.49-.45-.01-1.32-.26-1.96-.46-.79-.24-1.41-.37-1.36-.79.03-.22.34-.44.93-.68 3.63-1.58 6.06-2.63 7.28-3.13 3.47-1.41 4.19-1.66 4.66-1.67.1 0 .33.02.46.14.11.1.14.24.15.34-.01.06-.01.12-.02.21z"/>
              </svg>
            </v-btn>
            <v-btn icon="mdi-twitter" href="https://twitter.com/" target="_blank" variant="tonal" color="white" size="small" class="social-btn"></v-btn>
          </div>
        </v-col>

        <!-- Cột 2: Thể loại -->
        <v-col cols="6" sm="4" lg="2">
          <h4 class="footer-heading text-white mb-4">{{ $t('Thể loại') }}</h4>
          <ul class="footer-links pa-0">
            <li v-for="item in genres" :key="item.link" class="mb-2">
              <router-link :to="`/the-loai/${item.link}`" class="footer-link text-body-2">
                <v-icon size="x-small" class="mr-1">mdi-chevron-right</v-icon>{{ item.lable }}
              </router-link>
            </li>
          </ul>
        </v-col>

        <!-- Cột 3: Quốc gia -->
        <v-col cols="6" sm="4" lg="2">
          <h4 class="footer-heading text-white mb-4">{{ $t('Quốc gia') }}</h4>
          <ul class="footer-links pa-0">
            <li v-for="item in countries" :key="item.link" class="mb-2">
              <router-link :to="`/quoc-gia/${item.link}`" class="footer-link text-body-2">
                <v-icon size="x-small" class="mr-1">mdi-chevron-right</v-icon>{{ item.lable }}
              </router-link>
            </li>
          </ul>
        </v-col>

        <!-- Cột 4: Thông tin / Hỗ trợ -->
        <v-col cols="6" sm="4" lg="2">
          <h4 class="footer-heading text-white mb-4">{{ $t('Hỗ trợ') }}</h4>
          <ul class="footer-links pa-0">
            <li class="mb-2"><router-link to="/gioi-thieu" class="footer-link text-body-2"><v-icon size="x-small" class="mr-1">mdi-information-outline</v-icon>{{ $t('Giới thiệu') }}</router-link></li>
            <li class="mb-2"><router-link to="/gioi-thieu" class="footer-link text-body-2"><v-icon size="x-small" class="mr-1">mdi-email-outline</v-icon>{{ $t('Liên hệ') }}</router-link></li>
            <li class="mb-2"><router-link to="/gioi-thieu" class="footer-link text-body-2"><v-icon size="x-small" class="mr-1">mdi-shield-check-outline</v-icon>{{ $t('Chính sách riêng tư') }}</router-link></li>
            <li class="mb-2"><router-link to="/gioi-thieu" class="footer-link text-body-2"><v-icon size="x-small" class="mr-1">mdi-copyright</v-icon>{{ $t('Khiếu nại bản quyền') }}</router-link></li>
            <li class="mb-2"><router-link to="/gioi-thieu" class="footer-link text-body-2"><v-icon size="x-small" class="mr-1">mdi-help-circle-outline</v-icon>{{ $t('FAQ') }}</router-link></li>
          </ul>
        </v-col>

        <!-- Cột 5: Download App -->
        <v-col cols="12" sm="12" lg="2" class="mt-6 mt-lg-0">
          <h4 class="footer-heading text-white mb-4">{{ $t('Tải ứng dụng') }}</h4>
          <div class="d-flex flex-row flex-lg-column gap-3">
            <v-btn v-if="canShowInstallButton" @click="handleInstall" variant="outlined" color="success" height="48" class="app-btn flex-grow-1 justify-start px-3">
              <v-icon start size="x-large">mdi-download</v-icon>
              <div class="d-flex flex-column text-left ml-1" style="line-height: 1.2;">
                <span class="text-caption" style="font-size: 0.65rem !important; color: #aaa;">Install</span>
                <span class="font-weight-bold text-body-2">Our App</span>
              </div>
            </v-btn>
            
            <v-btn href="https://www.apple.com/app-store/" target="_blank" variant="outlined" color="white" height="48" class="app-btn flex-grow-1 justify-start px-3">
              <v-icon start size="x-large">mdi-apple</v-icon>
              <div class="d-flex flex-column text-left ml-1" style="line-height: 1.2;">
                <span class="text-caption" style="font-size: 0.65rem !important; color: #aaa;">Download on the</span>
                <span class="font-weight-bold text-body-2">App Store</span>
              </div>
            </v-btn>
            
            <v-btn href="https://play.google.com/store/games" target="_blank" variant="outlined" color="white" height="48" class="app-btn flex-grow-1 justify-start px-3">
              <v-icon start size="x-large">mdi-google-play</v-icon>
              <div class="d-flex flex-column text-left ml-1" style="line-height: 1.2;">
                <span class="text-caption" style="font-size: 0.65rem !important; color: #aaa;">GET IT ON</span>
                <span class="font-weight-bold text-body-2">Google Play</span>
              </div>
            </v-btn>
          </div>
          
          <!-- iOS Install Dialog -->
          <v-dialog v-model="showIOSDialog" max-width="400">
            <v-card>
              <v-card-title class="text-center">
                <v-icon start color="primary" size="large">mdi-iphone</v-icon>
                Cài đặt Ứng Dụng trên iPhone
              </v-card-title>
              <v-card-text class="text-body-2">
                <p class="mb-3"><strong>Bước 1:</strong> Tap nút <v-icon size="small">mdi-share</v-icon> ở thanh dưới</p>
                <p class="mb-3"><strong>Bước 2:</strong> Cuộn xuống và chọn "Add to Home Screen"</p>
                <p class="mb-3"><strong>Bước 3:</strong> Nhập tên app và chọn "Add"</p>
                <p class="text-caption text-grey">Ứng dụng sẽ được cài đặt như một app thực trên thiết bị của bạn!</p>
              </v-card-text>
              <v-card-actions class="justify-center">
                <v-btn variant="outlined" @click="showIOSDialog = false">Đóng</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>

    <!-- Bottom Copyright Line -->
    <div class="w-100 bg-black pa-4 text-center">
      <p class="text-caption text-grey-darken-1 mb-0">
        © {{ new Date().getFullYear() }} Phim360. All Rights Reserved. Designed for Movie Lovers.
      </p>
    </div>
  </v-footer>
</template>

<script>
export default {
  name: 'FooterPage',
  data() {
    return {
      showIOSDialog: false,
      tags: [
        { label: this.$t('Phim mới'), link: '/phim-moi' },
        { label: this.$t('Phim hay'), link: '/phim-hay' },
        { label: this.$t('Phim mới chill'), link: '/danh-sach/phim-moi-chill' },
        { label: this.$t('Phim 18'), link: '/danh-sach/phim-18' },
        { label: this.$t('Truyện tranh 18'), link: '/danh-sach/truyen-tranh-18' },
        { label: this.$t('Nettruyen'), link: '/danh-sach/net-truyen' },
        { label: this.$t('Nettruyen ngôn tình'), link: '/danh-sach/net-truyen-ngon-tinh' },
        { label: this.$t('Hiện đại'), link: '/danh-sach/hien-dai' }
      ],
      genres: [
        {lable: this.$t('Chính kịch'), link:'chinh-kich'},  
        {lable: this.$t('Cổ Trang'), link:'co-trang'},  
        {lable: this.$t('Tình Cảm'), link:'tinh-cam'},  
        {lable: this.$t('Phim Bộ'), link:'phim-bo'},  
        {lable: this.$t('Hành Động'), link:'hanh-dong'},
        {lable: this.$t('Học đường'), link:'hoc-duong'},
      ],
      countries: [
        {lable: this.$t('Âu Mỹ'), link:'au-my'},  
        {lable: this.$t('Hàn Quốc'), link:'han-quoc'},  
        {lable: this.$t('Trung Quốc'), link:'trung-quoc'},  
        {lable: this.$t('Nhật Bản'), link:'nhat-ban'},  
        {lable: this.$t('Ấn Độ'), link:'an-do'},  
        {lable: this.$t('Việt Nam'), link:'viet-nam'}  
      ]
    };
  },
  computed: {
    installPrompt() {
      return this.$store.state.installPrompt;
    },
    isIOS() {
      return this.$store.state.isIOS;
    },
    isAndroid() {
      return this.$store.state.isAndroid;
    },
    canInstall() {
      return this.$store.state.canInstall;
    },
    canShowInstallButton() {
      return this.installPrompt !== null || this.isIOS || this.isAndroid;
    }
  },
  methods: {
    slugify(str) {
      return str.toLowerCase()
        .trim().replace(/\s+/g, '-');
    },
    handleInstall() {
      if (this.isIOS) {
        this.showIOSDialog = true;
      } else if (this.installPrompt) {
        this.installApp();
      }
    },
    installApp() {
      if (this.installPrompt) {
        this.installPrompt.prompt();
        this.installPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          this.$store.commit('setInstallPrompt', null);
        });
      }
    }
  }
};
</script>

<style scoped>
.footer-container {
  position: relative;
}

.footer-container::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, #3d4d52, #93abc7, #312f30, #ceb392, #6b6659);
  z-index: 10;
}

.logo-gradient {
  background: linear-gradient(45deg, #ff8c00, #ffb200);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 12px rgba(255, 140, 0, 0.3);
}

.footer-links li {
  list-style: none;
}

.footer-link {
  text-decoration: none;
  color: inherit;
  transition: color 0.2s ease, text-shadow 0.2s ease;
  display: inline-flex;
  align-items: center;
}

.footer-link:hover {
  color: #ffb200;
  text-shadow: 0 0 8px rgba(255, 178, 0, 0.4);
}

.footer-link .v-icon {
  transition: transform 0.2s ease;
}

.footer-link:hover .v-icon {
  transform: translateX(4px);
}

.footer-heading {
  font-size: 1.1rem;
  position: relative;
  display: inline-block;
}

.footer-heading::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  height: 2px;
  width: 40px;
  background: linear-gradient(90deg, #ff8c00, #ff007f);
  border-radius: 2px;
}

.tag-chip {
  transition: all 0.3s ease;
  cursor: pointer;
}

.tag-chip:hover {
  background: linear-gradient(45deg, #ff8c00, #ff007f) !important;
  border-color: transparent !important;
  color: #fff !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 0, 127, 0.3);
}

.social-btn {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.social-btn:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 6px 16px rgba(255, 255, 255, 0.2);
}

.app-btn {
  text-transform: none !important;
  letter-spacing: normal !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
  transition: all 0.3s ease;
}

.app-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4) !important;
}
</style>
