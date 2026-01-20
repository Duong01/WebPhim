<template>
  <v-container fluid class="register-bg fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="6" lg="4">
        <!-- Back -->
        <v-btn icon variant="text" class="back-btn mb-4" @click="goBack">
          <v-icon size="22">mdi-arrow-left</v-icon>
          <span class="ml-1">Trang chủ</span>
        </v-btn>

        <v-card class="pa-8 rounded-xl cinematic-card" elevation="18">
          <!-- Header -->
          <div class="text-center mb-8">
            <v-icon size="54" color="deep-orange-accent-2">
              mdi-account-plus
            </v-icon>

            <h1 class="register-title mt-4">
              Tạo tài khoản miễn phí
            </h1>

            <p class="register-subtitle">
              Mở khóa thế giới phim ảnh không giới hạn
            </p>
          </div>

          <!-- FORM -->
          <v-form ref="form" @submit.prevent="submitRegister">
            <v-text-field
              v-model="registerForm.EmpName"
              label="Tên hiển thị"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              color="deep-orange-accent-2"
              class="mb-3"
              required
            />

            <v-text-field
              v-model="registerForm.BirthDay"
              label="Ngày sinh"
              type="date"
              prepend-inner-icon="mdi-calendar"
              variant="outlined"
              color="deep-orange-accent-2"
              class="mb-3"
              required
            />

            <v-text-field
              v-model="registerForm.Email"
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
              v-model="registerForm.Password"
              label="Mật khẩu"
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
              label="Xác nhận mật khẩu"
              :type="showConfirm ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-check"
              :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showConfirm = !showConfirm"
              :error="confirmPassword && confirmPassword !== registerForm.Password"
              :error-messages="
                confirmPassword && confirmPassword !== registerForm.Password
                  ? 'Mật khẩu không khớp'
                  : ''
              "
              variant="outlined"
              color="deep-orange-accent-2"
              class="mb-3"
              required
            />

            <v-text-field
              v-model="registerForm.Phone"
              label="Số điện thoại"
              prepend-inner-icon="mdi-phone"
              variant="outlined"
              color="deep-orange-accent-2"
              class="mb-5"
            />

            <!-- CTA -->
            <v-btn
              type="submit"
              block
              size="large"
              class="register-btn"
              :loading="loading"
              :disabled="!isValid"
            >
              <v-icon start>mdi-play-circle</v-icon>
              Tạo tài khoản & bắt đầu xem phim
            </v-btn>
          </v-form>

          <v-divider class="my-6 opacity-50" />

          <div class="text-center text-caption">
            Đã có tài khoản?
            <router-link
              to="/login"
              class="font-weight-bold text-orange-accent-2 ml-1"
            >
              Đăng nhập ngay
            </router-link>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>


<script>
import { Register } from "@/model/api";
export default {
  name: "RegisterPage",
  data() {
    return {
      registerForm: {
        FirstName: 'test',
        LastName: 'test',
        BirthDay: '',
        EmpName: '',
        Email: '',
        Password: '',
        Phone: ''
      },
      confirmPassword: '',
      agree: false,
      showPassword: false,
    showConfirm: false,
      snackbar: false,
        snackbarMessage: '',
        snackbarColor: 'success',
        loading: false,
        emailRules: [
            v => !!v || this.$t('Email không được để trống'),
            v => /.+@.+\..+/.test(v) || this.$t('Email không hợp lệ'),
        ],
    };
  },
  computed: {
    isValid() {
    return (
      this.registerForm.EmpName &&
      this.registerForm.Email &&
      this.registerForm.Password &&
      this.confirmPassword === this.registerForm.Password
    );
  },
    
  },
  methods: {
    submitRegister() {
     this.loading = true;
      if (!this.isValid) return;
        Register(this.registerForm,(dat) =>{
            console.log(dat)
            if(dat.status == 200 && dat.data.status == true){
                this.snackbar = true;
                this.snackbarMessage = this.$t('Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.');
                this.snackbarColor = "success";
                this.loading = false;
                setTimeout(() => {
                    this.$router.push('/login');
                }, 3000);

            }
            else{
                this.snackbarMessage = dat.data.message;
                this.snackbarColor = "error";
                this.snackbar = true;
                this.loading = false;
            }

        },(err) =>{
            this.snackbarMessage = err.data.message;
            this.snackbarColor = "error";
            this.snackbar = true;
            this.loading = false;
            console.log(err)
        })
    },
    goBack() {
      this.$router.push("/home");
    },
  },
};
</script>

<style scoped>
.register-bg {
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

.register-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
}

.register-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 6px;
}

.register-btn {
  background: linear-gradient(135deg, #ff9800, #ff5722);
  color: white;
  font-weight: 600;
  letter-spacing: 0.4px;
}

.register-btn:hover {
  filter: brightness(1.1);
}

.back-btn {
  color: rgba(255, 255, 255, 0.7);
}

</style>
