<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" style="flex-direction: column">
      <v-btn icon variant="text" class="ma-4" @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
         Back
      </v-btn>

      <v-col cols="12" sm="8" md="4">
        <v-card elevation="12" class="pa-6 rounded-xl">
          <v-card-title class="text-h5 text-center font-weight-bold">
            {{ $t('Đăng nhập') }}
          </v-card-title>

          <v-card-subtitle class="text-center mb-4">
            {{ $t('Chào mừng bạn quay lại! Vui lòng đăng nhập.') }}
          </v-card-subtitle>

          <v-form ref="loginFormRef" @submit.prevent="handleLogin">
            <!-- Email -->
            <v-text-field
              v-model="loginForm.Email"
              label="Email"
              prepend-inner-icon="mdi-email"
              :placeholder="$t('Nhập email')"
              type="email"
              clearable
              class="mb-3"
              :rules="emailRules"
              required
            />

            <!-- Password -->
            <v-text-field
              v-model="loginForm.Password"
              label="Mật khẩu"
              prepend-inner-icon="mdi-lock"
              :placeholder="$t('Nhập mật khẩu')"
              type="password"
              
              class="mb-3"
              required
            />

            <!-- Forgot password -->
            <div class="text-right mb-4">
              <router-link  class="text-caption text-decoration-underline">
                {{ $t('Quên mật khẩu?') }}
              </router-link>
            </div>

            <!-- Login button -->
            <v-btn
              type="submit"
              color="primary"
              block
              class="mb-4"
              size="large"
              :loading="loading"
              @click="handleLogin"
            >
              {{ $t('Đăng nhập') }}
            </v-btn>

            <!-- Divider -->
            <v-divider class="my-4"></v-divider>

            <!-- Sign up link -->
            <div class="text-center">
              <span>{{ $t('Chưa có tài khoản?') }}</span>
              <router-link to="/register" class="ml-1 text-decoration-underline font-weight-bold">
                {{ $t('Đăng ký') }}
              </router-link>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="mess" :timeout="5000" :color="color">
      {{ Message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { Login } from "@/model/api";

export default {
  name: "LoginPage",
  data() {
    return {
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
    goBack() {
      this.$router.go(-1);
    },

    handleLogin() {
  this.loading = true;

  Login(this.loginForm, (res) => {
    const data = res.data;

    if (data.status === "success") {
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
</style>
