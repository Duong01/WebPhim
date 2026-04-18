<template>
  <v-container fluid>
    <!-- 🧭 Thanh bộ lọc tìm kiếm -->
    <div class="d-flex justify-start mb-6">
      <el-button type="primary" size="large" @click="showFilter = !showFilter">
        <v-icon left size="20" class="mr-1">
          mdi-filter-menu
        </v-icon>
        {{ showFilter ? $t("Ẩn bộ lọc") : $t("Lọc phim") }}
      </el-button>
    </div>
    <v-expand-transition>
      <div v-if="showFilter">
        <v-row justify="center" align="center">
          <!-- 🎞 Thể loại -->
          <v-col cols="12" sm="6" md="2" class="p-1">
            <v-select
              v-model="filters.category"
              :items="Categories"
              item-title="title"
              item-value="value"
              :label="$t('Thể loại')"
              clearable
              variant="outlined"
              density="compact"
              @keyup.enter="applyFilters"
            />
          </v-col>

          <!-- 🌍 Quốc gia -->
          <v-col cols="12" sm="6" md="2" class="p-1">
            <v-select
              v-model="filters.country"
              :items="Countries"
              item-title="title"
              item-value="value"
              :label="$t('Quốc gia')"
              clearable
              variant="outlined"
              density="compact"
              @keyup.enter="applyFilters"
            />
          </v-col>

          <!-- 📅 Năm -->
          <v-col cols="12" sm="6" md="2" class="p-1">
            <v-select
              v-model="filters.year"
              :items="years"
              :label="$t('Năm')"
              clearable
              variant="outlined"
              density="compact"
              @keyup.enter="applyFilters"
            />
          </v-col>

          <!-- 💬 Ngôn ngữ -->
          <v-col cols="12" sm="6" md="2" class="p-1">
            <v-select
              v-model="filters.lang"
              :items="languages"
              item-title="title"
              item-value="value"
              :label="$t('Ngôn ngữ')"
              clearable
              variant="outlined"
              density="compact"
              @keyup.enter="applyFilters"
            />
          </v-col>

          <!-- ↕️ Sắp xếp -->
          <v-col cols="12" sm="6" md="2" class="p-1">
            <v-select
              v-model="filters.sortOption"
              :items="sortOptions"
              item-title="title"
              item-value="value"
              :label="$t('Sắp xếp')"
              variant="outlined"
              density="compact"
              @keyup.enter="applyFilters"
            />
          </v-col>
          
          <v-col cols="12" sm="12" md="4" class="p-1">
            <v-text-field
              v-model="filters.keyword"
              :label="$t('Tìm tên phim...')"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              @keyup.enter="applyFilters"
            />
          </v-col>
          <!-- 🧭 Nút Lọc -->
          <v-col cols="12"  class="p-0">
            <v-btn
              color="success"
              class="filter-btn"
              size="large"
              @click="applyFilters"
            >
            <v-icon left size="25" class="mr-1">
              mdi-magnify
            </v-icon>
              {{$t('Lọc')}}
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>
    <v-divider class="my-4" />
  </v-container>
</template>

<script>
export default {
  name: "FilterMovie",
  emits: ["filter-changed"],
  data() {
    return {
      filters: {
        keyword:"",
        year: "",
        lang: "",
        category: "",
        country: "",
        sortOption: "modified.time"
      },


      showFilter: false,
      years: Array.from({ length: 20 }, (_, i) => `${2025 - i}`),
      languages: [
        { title: "VietSub", value: "vietsub" },
        { title: this.$t("Thuyết Minh"), value: "thuyet-minh" },
        { title: this.$t("Lồng Tiếng"), value: "long-tieng" },
      ],
      Categories: [
        { title: this.$t("Hành động"), value: "hanh-dong" },
        { title: this.$t("Cổ trang"), value: "co-trang" },
        { title: this.$t("Tình cảm"), value: "tinh-cam" },
        { title: this.$t("Chiến tranh"), value: "chien-tranh" },
        { title: this.$t("Viễn tưởng"), value: "vien-tuong" },
        { title: this.$t("Kinh dị"), value: "kinh-di" },
        { title: this.$t("Bí ấn"), value: "bi-an" },
        { title: this.$t("Phim 18+"), value: "phim-18" },
        { title: this.$t("Tâm lý"), value: "tam-ly" },
        { title: this.$t("Gia đình"), value: "gia-dinh" },
        { title: this.$t("Học đường"), value: "hoc-duong" },
        { title: this.$t("Hài hước"), value: "hai-huoc" },
        { title: this.$t("Chính kịch"), value: "chinh-kich" },
        { title: this.$t("Miền Tây"), value: "mien-tay" },
        { title: this.$t("Trẻ Em"), value: "tre-em" },
        { title: this.$t("Lịch Sử"), value: "lich-su" },
        { title: this.$t("Tài Liệu"), value: "tai-lieu" },
        { title: this.$t("Thể Thao"), value: "the-thao" },
        { title: this.$t("Phiêu Lưu"), value: "phieu-luu" },
        { title: this.$t("Âm Nhạc"), value: "am-nhac" },
        { title: this.$t("Hình Sự"), value: "hinh-su" },
        { title: this.$t("Võ Thuật"), value: "vo-thuat" },
        { title: this.$t("Khoa Học"), value: "khoa-hoc" },
        { title: this.$t("Thần Thoại"), value: "than-thoai" },
        { title: this.$t("Kinh Điển"), value: "kinh-dien" },
        { title: this.$t("Phim Ngắn"), value: "phim-ngan" }
        
      ],
      Countries: [
        { title: this.$t("Việt Nam"), value: "viet-nam" },
        { title: this.$t("Trung Quốc"), value: "trung-quoc" },
        { title: this.$t("Thái Lan"), value: "thai-lan" },
        { title: this.$t("Hồng Kông"), value: "hong-kong" },
        { title: this.$t("Pháp"), value: "phap" },
        { title: this.$t("Đức"), value: "duc" },
        { title: this.$t("Hà Lan"), value: "ha-lan" },
        { title: this.$t("Mexico"), value: "mexico" },
        { title: this.$t("Thụy điển"), value: "thuy-dien" },
        { title: this.$t("Philippines"), value: "philippines" },
        { title: this.$t("Hàn Quốc"), value: "han-quoc" },
        { title: this.$t("Ấn Độ"), value: "an-do" },
        { title: this.$t("Châu Phi"), value: "chau-phi" },
        { title: this.$t("Nhật Bản"), value: "nhat-ban" },
        { title: this.$t("Đài Loan"), value: "dai-loan" },
        { title: this.$t("Anh"), value: "anh" },
      ],
      sortOptions: [
        { title: this.$t("Năm ↓"), value: "year" },
        { title: this.$t("Thời gian cập nhật"), value: "modified.time" },
      ],
    };
  },
  methods:{
    applyFilters(){
      this.$emit("filter-changed", { ...this.filters });
      this.showFilter = false
    }
  }
};
</script>

<style></style>
