<template>
  <v-container fluid class="login-bg fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <!-- Back -->
        <v-btn
          icon
          variant="text"
          class="back-btn mb-4"
          @click="goBack"
        >
          <v-icon size="22">mdi-arrow-left</v-icon>
          <span class="ml-1">Trang trước</span>
        </v-btn>

        <v-card class="pa-8 rounded-xl login-card cinematic-card" elevation="18">
          <!-- Logo / Title -->
          <div class="text-center mb-8">
            <v-icon size="54" color="deep-orange-accent-2">
              mdi-movie-open-play
            </v-icon>

            <h1 class="login-title mt-4">
              Đăng nhập để tiếp tục
            </h1>

            <p class="login-subtitle">
              Hàng ngàn bộ phim & series đang chờ bạn khám phá
            </p>
          </div>

          <!-- Google -->
          <div id="googleBtn" class="mb-6 d-flex justify-center"></div>

          <div class="divider-text mb-6">
            <span>hoặc đăng nhập bằng tài khoản</span>
          </div>

          <!-- FORM -->
          <v-form ref="loginFormRef" @submit.prevent="handleLogin">
            <v-text-field
              v-model="loginForm.Email"
              label="Email"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              color="deep-orange-accent-2"
              class="mb-3"
              required
            />

            <v-text-field
              v-model="loginForm.Password"
              label="Mật khẩu"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              color="deep-orange-accent-2"
              required
            />

            <div class="text-right mb-4">
              <router-link class="text-caption text-orange-accent-2">
                Quên mật khẩu?
              </router-link>
            </div>

            <v-btn
              type="submit"
              block
              size="large"
              class="login-btn"
              :loading="loading"
            >
              <v-icon start>mdi-play-circle</v-icon>
              Bắt đầu xem phim
            </v-btn>

            <v-divider class="my-6 opacity-50" />

            <div class="text-center text-caption">
              Chưa có tài khoản?
              <router-link
                to="/register"
                class="font-weight-bold text-orange-accent-2 ml-1"
              >
                Đăng ký ngay
              </router-link>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="mess" :color="color" timeout="4000">
      {{ Message }}
    </v-snackbar>
  </v-container>
</template>


<script>
import { Login, LoginGoogle } from "@/model/api";
import { googleSdkLoaded } from "vue3-google-login";

export default {
  name: "LoginPage",
  data() {
    return {
      showPassword: false,
      loginForm: { Email: "", Password: "" },
      Message: "",
      color: "",
      mess: false,
      loading: false,

      // 🔥 Google Login state
      googleInited: false,
      googleLogging: false,
    };
  },

  mounted() {
    googleSdkLoaded((google) => {
      google.accounts.id.initialize({
        client_id:
          "637267486434-t4hh87i10u44oo2m7mo0p3aelebqivo6.apps.googleusercontent.com",
        callback: this.handleGoogleLogin,
      });

      // 🔥 RENDER BUTTON CHÍNH THỨC
      google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "pill",
          width: 320,
        }
      );
    });
  },

  methods: {
    // ======================
    // GOOGLE LOGIN
    // ======================
    loginWithGoogle() {
      if (!this.googleInited || this.googleLogging) return;

      this.googleLogging = true;

      window.google.accounts.id.prompt((notification) => {
        if (
          notification.isNotDisplayed() ||
          notification.isSkippedMoment()
        ) {
          this.googleLogging = false;
        }
      });
    },

    handleGoogleLogin(response) {
      this.googleLogging = false;

      const googleIdToken = response?.credential;

      if (!googleIdToken) {
        this.Message = "Không lấy được token Google";
        this.color = "error";
        this.mess = true;
        return;
      }

      this.loginGoogleApi(googleIdToken);
    },

    loginGoogleApi(googleToken) {
      this.loading = true;

      LoginGoogle(
        { Token: googleToken },
        (dat) => {
          console.log(dat)
          if (dat.data.status === "success") {

            // xoa du lieu cu
            localStorage.removeItem("token");
            localStorage.removeItem("favoriteMovies");
            localStorage.removeItem("user");
            localStorage.removeItem("name");
            localStorage.removeItem("nameShow");


            localStorage.setItem("token", dat.data.data.token);
            //localStorage.setItem("user", JSON.stringify(dat.data.data.user));
            
            localStorage.setItem("name", dat.data.data.user.ID);
            localStorage.setItem("nameShow", dat.data.data.user.EmpName);

            this.$store.commit("setEmpInfor", dat.data.data.user);
            this.$store.commit("setAvatar", dat.data.data.user.Avartar);

            const redirect = this.$route.query.redirect || "/home";
            this.$router.replace(redirect);
          } else {
            this.Message = dat.data.message;
            this.color = "error";
            this.mess = true;
          }
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      );
    },

    // ======================
    // LOGIN THƯỜNG
    // ======================
    handleLogin() {
      this.loading = true;

      Login(
        this.loginForm,
        (res) => {
          const data = res.data;

          if (data.status === "success") {
            localStorage.removeItem("token");
            localStorage.removeItem("favoriteMovies");
            localStorage.removeItem("user");
            localStorage.removeItem("name");
            localStorage.removeItem("nameShow");

            const { token, user } = data.data;

            localStorage.setItem("token", token);
            localStorage.setItem("name", user.ID);
            localStorage.setItem("nameShow", user.EmpName);
            //localStorage.setItem("user", JSON.stringify(user));

            this.$store.commit("setEmpInfor", user);

            const redirect = this.$route.query.redirect || "/home";
            this.$router.replace(redirect);
          } else {
            this.Message = data.message;
            this.color = "error";
            this.mess = true;
          }

          this.loading = false;
        },
        () => {
          this.Message = "Có lỗi xảy ra";
          this.color = "error";
          this.mess = true;
          this.loading = false;
        }
      );
    },

    goBack() {
      if (window.history.length > 1) {
        this.$router.back();
      } else {
        this.$router.push("/home");
      }
    },
  },
};
</script>


<style scoped>
.login-bg {
  background:
    radial-gradient(circle at top, rgba(255,140,0,0.15), transparent 40%),
    linear-gradient(135deg, #0f0f0f, #1c1c1c);
}

.cinematic-card {
  background: rgba(20, 20, 20, 0.88);
  border: 1px solid rgba(255, 140, 0, 0.15);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.8),
    inset 0 0 0 1px rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
}

.login-title {
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #ffffff;
}

.login-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 6px;
}

.login-btn {
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.login-btn:hover {
  filter: brightness(1.1);
}

.back-btn {
  color: rgba(255, 255, 255, 0.7);
}

.divider-text {
  position: relative;
  text-align: center;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.divider-text::before,
.divider-text::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 35%;
  height: 1px;
  background: rgba(255, 255, 255, 0.15);
}

.divider-text::before {
  left: 0;
}

.divider-text::after {
  right: 0;
}

</style>

