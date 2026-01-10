<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center" style="flex-direction: column">
        

      <v-col cols="12" sm="10" md="6" lg="4">
        <v-btn icon variant="text" class="ma-4" @click="goBack">
            <v-icon>mdi-arrow-left</v-icon>
             Go Home
        </v-btn>
        <v-card class="pa-6 rounded-xl" elevation="12">
          
          <!-- Tiêu đề -->
          <v-card-title class="text-h5 font-weight-bold text-center">
            {{$t('Đăng ký tài khoản')}}
          </v-card-title>
          <v-card-subtitle class="text-center mb-4">
            {{$t('Điền thông tin bên dưới để tạo tài khoản')}}
          </v-card-subtitle>

          <v-form ref="form" @submit.prevent="submitRegister">
            <v-text-field
              v-model="registerForm.EmpName"
              :label="$t('Tên hiển thị')"
              prepend-inner-icon="mdi-account"
              required
              class="mb-3"
            />
            
            <v-text-field
              v-model="registerForm.BirthDay"
              :label="$t('Ngày sinh')"
              prepend-inner-icon="mdi-account"
              required
              type="date"
              class="mb-3"
            />

            <v-text-field
              v-model="registerForm.Email"
              label="Email"
              prepend-inner-icon="mdi-email"
              type="email"
              required
              class="mb-3"
              :rules="emailRules"
            />

            <v-text-field
              v-model="registerForm.Password"
              :label="$t('Mật khẩu')"
              prepend-inner-icon="mdi-lock"
              type="password"
              required
              class="mb-3"
            />

            <v-text-field
            v-model="confirmPassword"
            :label="$t('Xác nhận mật khẩu')"
            prepend-inner-icon="mdi-lock-check"
            type="password"
            :error="confirmPassword && confirmPassword !== registerForm.password"
            :error-messages="confirmPassword && confirmPassword !== registerForm.password ? $t('Mật khẩu không khớp') : ''"
            required
            class="mb-3"
            />
            <v-text-field
              v-model="registerForm.Phone"
              :label="$t('Số điện thoại')"
              prepend-inner-icon="mdi-lock"
              required
              class="mb-3"
            />

            <v-checkbox
              v-model="agree"
              :label="$t('Tôi đồng ý với Điều khoản & Chính sách')"
              class="mb-4"
              required
            />

            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              :loading="loading"
              :disabled="!isValid"
            >
              {{$t('Đăng ký')}}
            </v-btn>
          </v-form>

          <div class="text-center mt-6">
            <span>Đã có tài khoản?</span>
            <router-link to="/login" class="ml-1 text-decoration-underline font-weight-bold">
              {{$t('Đăng nhập')}}
            </router-link>
          </div>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
  {{ snackbarMessage }}
</v-snackbar>
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
      this.confirmPassword === this.registerForm.Password &&
      this.agree
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
