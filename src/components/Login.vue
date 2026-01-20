<template>
  <v-container fluid class="login-bg fill-height">

    

    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-btn
      icon
      variant="text"
      class="back-btn"
      @click="goBack"
    >
      <v-icon size="24">mdi-arrow-left</v-icon>
      Back
    </v-btn>
        <v-card class="pa-8 rounded-xl login-card" elevation="14">

          <!-- Logo / Title -->
          <div class="text-center mb-6">
            <v-icon size="48" color="primary">mdi-movie-open</v-icon>
            <h2 class="mt-2 font-weight-bold">{{ $t('Đăng nhập') }}</h2>
            <p class="text-caption text-grey">
              {{ $t('Chào mừng bạn quay lại') }}
            </p>
          </div>
          <v-btn
            block
            size="large"
            variant="outlined"
            class="mt-4"
            @click="loginWithGoogle"
          >
            <v-icon start color="red">mdi-google</v-icon>
            {{ $t('Đăng nhập bằng Google') }}
          </v-btn>
          <!-- FORM -->
          <v-form ref="loginFormRef" @submit.prevent="handleLogin">
            <v-text-field
              v-model="loginForm.Email"
              label="Email"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
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
              required
            />

            <div class="text-right mb-4">
              <router-link class="text-caption text-primary">
                {{ $t('Quên mật khẩu?') }}
              </router-link>
            </div>

            <v-btn
              type="submit"
              block
              size="large"
              color="primary"
              :loading="loading"
            >
              <v-icon start>mdi-login</v-icon>
              {{ $t('Đăng nhập') }}
            </v-btn>

            <v-divider class="my-6" />

            <div class="text-center text-caption">
              {{ $t('Chưa có tài khoản?') }}
              <router-link to="/register" class="font-weight-bold text-primary ml-1">
                {{ $t('Đăng ký') }}
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
import { Login,LoginGoogle } from "@/model/api";
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
      emailRules: [
      v => !!v || this.$t('Email không được để trống'),
      v => /.+@.+\..+/.test(v) || this.$t('Email không hợp lệ'),
    ],
    };
  },
  
  methods: {

    loginWithGoogle() {
    googleSdkLoaded((google) => {
      google.accounts.id.initialize({
        client_id: "637267486434-t4hh87i10u44oo2m7mo0p3aelebqivo6.apps.googleusercontent.com",
        callback: this.handleGoogleLogin,
      });

      google.accounts.id.prompt(); // mở popup login
    });
  },
  handleGoogleLogin(response) {
    // 🔥 response.credential = GOOGLE ID TOKEN (JWT)
    const googleIdToken = response.credential;

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

  LoginGoogle(googleToken, (data) => {
    if (data.status === "success") {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      this.$store.commit("setEmpInfor", data.data.user);

      const redirect = this.$route.query.redirect || "/home";
      this.$router.replace(redirect);
    } else {
      this.Message = data.message;
      this.color = "error";
      this.mess = true;
    }
    this.loading = false;
  }, () => {
    this.loading = false;
  })
},


    goBack() {
      if (window.history.length > 1) {
      this.$router.back();
    } else {
      this.$router.push("/home");
    }
    },

    handleLogin() {
  this.loading = true;

  Login(this.loginForm, (res) => {
    const data = res.data;

    if (data.status === "success") {
      // Xoa du lieu cu
        localStorage.removeItem("token");
        localStorage.removeItem("favoriteMovies");
        localStorage.removeItem("user");


      const { token, user } = data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      this.$store.commit("setEmpInfor", user);

      this.Message = this.$t("Đăng nhập thành công");
      this.color = "success";
      this.mess = true;

      const redirect = this.$route.query.redirect || "/home";
      this.$router.replace(redirect);
    } else {
      this.Message = data.message;
      this.color = "error";
      this.mess = true;
    }

    this.loading = false;
    }, () => {
      this.Message = this.$t("Có lỗi xảy ra");
      this.color = "error";
      this.mess = true;
      this.loading = false;
    });
  }
  },
};
</script>


<style scoped>
.login-bg {
  background: linear-gradient(135deg, #54585f, #413333);
}

.login-card {
  backdrop-filter: blur(8px);
}

.back-btn {
  width: auto;
  color: rgb(218, 190, 190);
}
</style>

