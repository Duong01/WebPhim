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
  min-height: 100vh;
  background:
    radial-gradient(circle at 20% 12%, rgba(255, 183, 0, 0.09), transparent 45%),
    radial-gradient(circle at 82% 88%, rgba(255, 94, 0, 0.08), transparent 45%),
    linear-gradient(180deg, #0a0a12 0%, #07070c 100%);
}

.cinematic-card {
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.015)) !important;
  border: 1px solid rgba(255, 255, 255, 0.09) !important;
  border-radius: 22px !important;
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.6),
    0 0 44px rgba(255, 140, 0, 0.07) !important;
  backdrop-filter: blur(16px);
}

.register-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #f4f5f9;
}

.register-subtitle {
  font-size: 0.9rem;
  color: #a4a7b4;
  margin-top: 6px;
}

.register-btn {
  background: linear-gradient(135deg, #ffb700, #ff5e00) !important;
  color: #0a0a12 !important;
  font-weight: 700;
  letter-spacing: 0.4px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(255, 140, 0, 0.35);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease, filter 0.3s ease;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(255, 140, 0, 0.5);
  filter: brightness(1.05);
}

.back-btn {
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.25s ease, transform 0.25s ease;
}

.back-btn:hover {
  color: #ffb700;
  transform: translateX(-3px);
}

.avatar-wrapper {
  position: relative;
  width: 86px;
  height: 86px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, #ffb700, #ff5e00);
  box-shadow: 0 10px 28px rgba(255, 140, 0, 0.4);
}

.avatar-wrapper .v-avatar {
  border: 3px solid #0a0a12;
}

/* Form fields */
.cinematic-card :deep(.v-field) {
  border-radius: 12px;
  transition: box-shadow 0.25s ease, border-color 0.25s ease;
}

.cinematic-card :deep(.v-field--focused) {
  box-shadow: 0 0 0 2px rgba(255, 183, 0, 0.22);
}
</style>
