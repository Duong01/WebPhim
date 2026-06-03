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
          <span class="ml-1">Đăng nhập</span>
        </v-btn>

        <v-card class="pa-8 rounded-xl login-card cinematic-card" elevation="18">
          <!-- Logo / Title -->
          <div class="text-center mb-8">
            <v-icon size="54" color="deep-orange-accent-2">
              mdi-lock-reset
            </v-icon>

            <h1 class="login-title mt-4">
              Khôi phục mật khẩu
            </h1>

            <p class="login-subtitle">
              Nhập email của bạn để nhận liên kết đặt lại mật khẩu
            </p>
          </div>

          <!-- FORM -->
          <v-form ref="forgotFormRef" @submit.prevent="handleForgotPassword">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              color="deep-orange-accent-2"
              class="mb-3"
              :rules="emailRules"
              required
            />

            <v-text-field
              v-model="newPassword"
              label="Mật khẩu mới"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              color="deep-orange-accent-2"
              class="mb-3"
              required
            />

            <v-text-field
              v-model="confirmPassword"
              label="Xác nhận mật khẩu mới"
              :type="showConfirm ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-check"
              :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showConfirm = !showConfirm"
              :error="!!confirmPassword && confirmPassword !== newPassword"
              :error-messages="
                !!confirmPassword && confirmPassword !== newPassword
                  ? 'Mật khẩu không khớp'
                  : ''
              "
              variant="outlined"
              color="deep-orange-accent-2"
              class="mb-6"
              required
            />

            <v-btn
              type="submit"
              block
              size="large"
              class="login-btn"
              :loading="loading"
              :disabled="!isValid"
            >
              <v-icon start>mdi-email-fast-outline</v-icon>
              Gửi yêu cầu
            </v-btn>

            <v-divider class="my-6 opacity-50" />

            <div class="text-center text-caption">
              Nhớ mật khẩu rồi?
              <router-link
                to="/login"
                class="font-weight-bold text-orange-accent-2 ml-1"
              >
                Đăng nhập lại
              </router-link>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="4000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { ForgotPassword } from "@/model/api";


export default {
  name: "ForgotPasswordPage",
  data() {
    return {
      email: "",
      newPassword: "",
      confirmPassword: "",
      showPassword: false,
      showConfirm: false,
      loading: false,
      snackbar: false,
      snackbarMessage: "",
      snackbarColor: "success",
      emailRules: [
        (v) => !!v || "Email không được để trống",
        (v) => /.+@.+\..+/.test(v) || "Email không hợp lệ",
      ],
    };
  },
  computed: {
    isValid() {
      return (
        !!this.email &&
        /.+@.+\..+/.test(this.email) &&
        !!this.newPassword &&
        this.newPassword === this.confirmPassword
      );
    },
  },
  methods: {
    handleForgotPassword() {
      if (!this.isValid) return;
      this.loading = true;

        var formForgot = {
            Email : this.email,
            Password : this.newPassword
        }
      ForgotPassword(formForgot, (dat) => {
        if (dat.status == 200 && dat.data.status == true) {
          this.snackbar = true;
          this.snackbarMessage = "Đổi mật khẩu thành công!";
          this.snackbarColor = "success";
          this.loading = false;
          this.$router.push("/login");
        } else {
          this.snackbarMessage = dat.data.message || "Có lỗi xảy ra";
          this.snackbarColor = "error";
          this.snackbar = true;
          this.loading = false;
        }
      }, (err) => {
        this.snackbarMessage = err?.data?.message || "Có lỗi xảy ra";
        this.snackbarColor = "error";
        this.snackbar = true;
        this.loading = false;
      });

    //   setTimeout(() => {
    //     this.loading = false;
    //     this.snackbarMessage = "Đổi mật khẩu thành công!";
    //     this.snackbarColor = "success";
    //     this.snackbar = true;
        
    //     // Chuyển hướng về trang đăng nhập sau khi thông báo hoàn tất
    //     setTimeout(() => {
    //       this.$router.push("/login");
    //     }, 2000);
    //   }, 1500);
    },
    goBack() {
      this.$router.push("/login");
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
</style>