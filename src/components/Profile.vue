<template>
  <v-container fluid class="register-bg fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="10" md="6" lg="4">
        <!-- Back -->
        <v-btn icon variant="text" class="back-btn mb-4" @click="goBack">
          <v-icon size="22">mdi-arrow-left</v-icon>
          <span class="ml-1">{{ $t("Trang chủ") }}</span>
        </v-btn>

        <v-card class="pa-8 rounded-xl cinematic-card" elevation="18">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="avatar-wrapper mx-auto mb-4">
               <v-avatar size="80" color="grey-darken-3">
                 <v-img v-if="profileForm.Avatar" :src="profileForm.Avatar"></v-img>
                 <v-icon v-else size="40">mdi-account</v-icon>
               </v-avatar>
            </div>
            
            <h1 class="register-title">
              {{ $t("Chỉnh sửa hồ sơ") }}
            </h1>
            <p class="register-subtitle">
              {{ $t("Cập nhật thông tin cá nhân của bạn") }}
            </p>
          </div>

          <!-- FORM -->
          <v-form ref="form" @submit.prevent="submitProfile">
            <v-text-field
              v-model="profileForm.EmpName"
              :label="$t('Tên hiển thị')"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              color="deep-orange-accent-2"
              class="mb-3"
              required
            />

            <v-text-field
              v-model="profileForm.BirthDay"
              :label="$t('Ngày sinh')"
              type="date"
              prepend-inner-icon="mdi-calendar"
              variant="outlined"
              color="deep-orange-accent-2"
              class="mb-3"
            />

            <v-text-field
              v-model="profileForm.Email"
              :label="$t('Email')"
              type="email"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              color="deep-orange-accent-2"
              class="mb-3"
              :rules="emailRules"
              required
            />
            
            <v-text-field
              v-model="profileForm.PasswordOld"
              :label="$t('Mật khẩu hiện tại')"
              :type="showPasswordOld ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPasswordOld ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPasswordOld = !showPasswordOld"
              variant="outlined"
              color="deep-orange-accent-2"
              class="mb-3"
              :rules="profileForm.PasswordOld ? [v => !!v || $t('Vui lòng nhập mật khẩu hiện tại')] : []"
            />

            <v-text-field
              v-model="profileForm.Password"
              :label="$t('Mật khẩu mới (để trống nếu không đổi)')"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              color="deep-orange-accent-2"
              class="mb-3"
            />

            <v-text-field
              v-model="confirmPassword"
              :label="$t('Xác nhận mật khẩu mới')"
              :type="showConfirm ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock-check"
              :append-inner-icon="showConfirm ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showConfirm = !showConfirm"
              :error="confirmPassword && confirmPassword !== profileForm.Password"
              :error-messages="
                confirmPassword && confirmPassword !== profileForm.Password
                  ? $t('Mật khẩu không khớp')
                  : ''
              "
              variant="outlined"
              color="deep-orange-accent-2"
              class="mb-3"
            />

            <v-text-field
              v-model="profileForm.Phone"
              :label="$t('Số điện thoại')"
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
              <v-icon start>mdi-content-save</v-icon>
              {{ $t("Lưu thay đổi") }}
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script>
import { UpdateProfile } from "@/model/api"; 

export default {
  name: "ProfilePage",
  data() {
    return {
      profileForm: {
        ID: '',
        EmpName: '',
        BirthDay: '',
        Email: '',
        Password: '',
        Phone: '',
        Avatar: '',
        PasswordOld:''
      },
      confirmPassword: '',
      showPassword: false,
      showConfirm: false,
      showPasswordOld: false,
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
      if (this.profileForm.Password) {
        return !!this.profileForm.PasswordOld && 
               this.confirmPassword === this.profileForm.Password &&
               !!this.profileForm.EmpName &&
               !!this.profileForm.Email;
      }
      return !!this.profileForm.EmpName && !!this.profileForm.Email;
    },
  },
  mounted() {
    this.loadUserData();
  },
  methods: {
    loadUserData() {
      const user = this.$store.state.empInfor || localStorage.getItem("name");
      if (user) {
        this.profileForm.ID = user.ID || '';
        this.profileForm.EmpName = user.EmpName || user.Name || localStorage.getItem('nameShow') || '';
        this.profileForm.Email = user.Email || '';
        this.profileForm.Phone = user.Phone || '';
        this.profileForm.Avatar = user.Avatar || user.Avartar || localStorage.getItem('Avatar') || '';
        
        if (user.BirthDay) {
          try {
            const date = new Date(user.BirthDay);
            this.profileForm.BirthDay = date.toISOString().split('T')[0];
          } catch (e) {
            this.profileForm.BirthDay = '';
          }
        }
      } else {
        this.snackbarMessage = this.$t('Vui lòng đăng nhập');
        this.snackbarColor = 'error';
        this.snackbar = true;
        setTimeout(() => {
          this.$router.push('/login');
        }, 1500);
      }
    },
    submitProfile() {
      this.loading = true;
      if (!this.isValid) return;
      
      const updateData = { ...this.profileForm };
      
      // Nếu không nhập mật khẩu mới, loại bỏ trường mật khẩu khỏi dữ liệu gửi đi
      if (!updateData.Password) {
        delete updateData.Password;
        delete updateData.PasswordOld;
      }

      if (typeof UpdateProfile === 'function') {
        UpdateProfile(updateData, (dat) => {
          if (dat.status == 200 && dat.data.status == true) {
            this.snackbar = true;
            this.snackbarMessage = this.$t('Cập nhật hồ sơ thành công!');
            this.snackbarColor = "success";
            
            const updatedUser = { ...this.$store.state.empInfor, ...updateData };
            this.$store.commit("setEmpInfor", updatedUser);
            if (updateData.EmpName) localStorage.setItem('nameShow', updateData.EmpName);
            
            // Xóa trắng mật khẩu trên form sau khi cập nhật thành công
            this.profileForm.Password = '';
            this.profileForm.PasswordOld = '';
            this.confirmPassword = '';
          } else {
            this.snackbarMessage = dat.data.message || this.$t('Cập nhật thất bại');
            this.snackbarColor = "error";
            this.snackbar = true;
          }
          this.loading = false;
        }, (err) => {
          this.snackbarMessage = err?.data?.message || this.$t('Có lỗi xảy ra');
          this.snackbarColor = "error";
          this.snackbar = true;
          this.loading = false;
          console.log(err);
        });
      } else {
        setTimeout(() => {
          this.snackbar = true;
          this.snackbarMessage = this.$t('Cập nhật hồ sơ thành công! (Chưa thiết lập hàm UpdateProfile API)');
          this.snackbarColor = "success";
          this.loading = false;
        }, 1000);
      }
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

.avatar-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
}
</style>