<template>
  <v-container class="py-10" style="min-height: 80vh;">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="pa-8 bg-grey-darken-4 text-white" rounded="xl" elevation="10">
          <div class="text-center mb-8">
            <v-icon size="64" color="primary" class="mb-4">mdi-movie-open-play</v-icon>
            <h1 class="text-h3 font-weight-bold mb-2">{{$t('Giới thiệu về')}} <span style="background: linear-gradient(45deg, #ff8c00, #ffb200); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Phim360</span></h1>
            <p class="text-subtitle-1 text-grey-lighten-1">{{$t('Nền tảng xem phim trực tuyến hàng đầu dành cho người yêu điện ảnh.')}}</p>
          </div>
          
          <v-divider class="mb-8" color="grey-darken-2"></v-divider>

          <div class="text-body-1" style="line-height: 1.8;">
            <h2 class="text-h5 font-weight-bold text-primary mb-4">{{$t('Sứ mệnh của chúng tôi')}}</h2>
            <p class="mb-6 text-grey-lighten-2">
              <strong>Phim360</strong> {{$t('ra đời với mong muốn mang đến cho khán giả một không gian giải trí đỉnh cao, nơi bạn có thể thưởng thức những tác phẩm điện ảnh xuất sắc nhất từ khắp nơi trên thế giới. Chúng tôi không ngừng nỗ lực cập nhật các bộ phim bom tấn, phim truyền hình đặc sắc với chất lượng hình ảnh sắc nét và âm thanh sống động nhất.')}}
            </p>

            <h2 class="text-h5 font-weight-bold text-primary mb-4 mt-8">{{$t('Điểm nổi bật của Phim360')}} </h2>
            <v-list bg-color="transparent" class="mb-6">
              <v-list-item class="px-0">
                <template v-slot:prepend>
                  <v-icon color="success" class="mr-3">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="text-white font-weight-medium">{{$t('Kho phim khổng lồ')}}</v-list-item-title>
                <v-list-item-subtitle class="text-grey-lighten-1 mt-1">{{$t('Hàng ngàn bộ phim đa dạng thể loại từ hành động, tình cảm, hài hước đến kinh dị, viễn tưởng.')}}</v-list-item-subtitle>
              </v-list-item>
              
              <v-list-item class="px-0 mt-3">
                <template v-slot:prepend>
                  <v-icon color="success" class="mr-3">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="text-white font-weight-medium">{{$t('Chất lượng Full HD & 4K')}}</v-list-item-title>
                <v-list-item-subtitle class="text-grey-lighten-1 mt-1">{{$t('Trải nghiệm xem phim mượt mà không giật lag nhờ hệ thống máy chủ mạnh mẽ và tối ưu.')}}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item class="px-0 mt-3">
                <template v-slot:prepend>
                  <v-icon color="success" class="mr-3">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="text-white font-weight-medium">{{$t('Cập nhật nhanh chóng')}}</v-list-item-title>
                <v-list-item-subtitle class="text-grey-lighten-1 mt-1">{{$t('Các tập phim mới được đồng bộ liên tục 24/7 ngay sau khi được phát hành chính thức.')}}</v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <v-divider class="my-8" color="grey-darken-2"></v-divider>

            <h2 class="text-h5 font-weight-bold text-primary mb-4">{{$t('Liên hệ & Hỗ trợ')}}</h2>
            <p class="text-grey-lighten-2">
              {{t('Nếu bạn có bất kỳ góp ý, khiếu nại bản quyền hoặc cần hỗ trợ kĩ thuật, đừng ngần ngại liên hệ qua các kênh mạng xã hội hoặc qua Email của chúng tôi.')}}
              {{$t('Phim360 luôn luôn lắng nghe mọi ý kiến để cải thiện và mang lại trải nghiệm tuyệt vời nhất cho bạn.')}}
            </p>
            <div class="mt-4 d-flex align-center gap-3">
              <v-btn href="mailto:support@phim360.com" variant="tonal" color="white" prepend-icon="mdi-email">
                support@phim360.com
              </v-btn>
              <v-btn href="https://t.me/" target="_blank" variant="tonal" color="light-blue" prepend-icon="mdi-send">
                Telegram
              </v-btn>
            </div>
          </div>
          
          <div class="text-center mt-10">
            <v-btn color="primary" size="large" rounded="pill" to="/home" prepend-icon="mdi-play-circle" elevation="4">
              {{$t('Khám phá phim ngay')}}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AboutPage"
}
</script>