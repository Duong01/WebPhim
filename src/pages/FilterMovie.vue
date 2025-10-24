<template>
  <v-container fluid>
    <!-- 🧭 Thanh bộ lọc tìm kiếm -->
    <div class="d-flex justify-start mb-6">
      <el-button type="primary" size="large" @click="showFilter = !showFilter">
        <v-icon left size="20" class="mr-1">
          mdi-filter-menu
        </v-icon>
        {{ showFilter ? "Ẩn bộ lọc" : "Lọc phim" }}
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
              label="Thể loại"
              clearable
              variant="outlined"
              density="compact"
            />
          </v-col>

          <!-- 🌍 Quốc gia -->
          <v-col cols="12" sm="6" md="2" class="p-1">
            <v-select
              v-model="filters.country"
              :items="Countries"
              item-title="title"
              item-value="value"
              label="Quốc gia"
              clearable
              variant="outlined"
              density="compact"
            />
          </v-col>

          <!-- 📅 Năm -->
          <v-col cols="12" sm="6" md="2" class="p-1">
            <v-select
              v-model="filters.year"
              :items="years"
              label="Năm"
              clearable
              variant="outlined"
              density="compact"
            />
          </v-col>

          <!-- 💬 Ngôn ngữ -->
          <v-col cols="12" sm="6" md="2" class="p-1">
            <v-select
              v-model="filters.lang"
              :items="languages"
              item-title="title"
              item-value="value"
              label="Ngôn ngữ"
              clearable
              variant="outlined"
              density="compact"
            />
          </v-col>

          <!-- ↕️ Sắp xếp -->
          <v-col cols="12" sm="6" md="2" class="p-1">
            <v-select
              v-model="filters.sortOption"
              :items="sortOptions"
              item-title="title"
              item-value="value"
              label="Sắp xếp"
              variant="outlined"
              density="compact"
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
              Lọc
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
        year: "",
        lang: "",
        category: "",
        country: "",
        sortOption: "year"
      },


      showFilter: false,
      years: Array.from({ length: 20 }, (_, i) => `${2025 - i}`),
      languages: [
        { title: "VietSub", value: "vietsub" },
        { title: "Thuyết Minh", value: "thuyet-minh" },
        { title: "Lồng Tiếng", value: "long-tieng" },
      ],
      Categories: [
        { title: "Hành động", value: "hanh-dong" },
        { title: "Tình cảm", value: "tinh-cam" },
        { title: "Chiến tranh", value: "chien-tranh" },
        { title: "Viễn tưởng", value: "vien-tuong" },
        { title: "Kinh dị", value: "kinh-di" },
        { title: "Bí ấn", value: "bi-an" },
        { title: "Phim 18+", value: "phim-18" },
        { title: "Tâm lý", value: "tam-ly" },
        { title: "Gia đình", value: "gia-dinh" },
        { title: "Học đường", value: "hoc-duong" },
        { title: "Hài hước", value: "hai-huoc" },
        { title: "Chính kịch", value: "chinh-kich" },
      ],
      Countries: [
        { title: "Việt Nam", value: "viet-nam" },
        { title: "Trung Quốc", value: "trung-quoc" },
        { title: "Thái Lan", value: "thai-lan" },
        { title: "Hồng Kông", value: "hong-kong" },
        { title: "Pháp", value: "phap" },
        { title: "Đức", value: "duc" },
        { title: "Hà Lan", value: "ha-lan" },
        { title: "Mexico", value: "mexico" },
        { title: "Thụy điển", value: "thuy-dien" },
        { title: "Philippines", value: "philippines" },
        { title: "Hàn Quốc", value: "han-quoc" },
        { title: "Ấn Độ", value: "an-do" },
        { title: "Châu Phi", value: "chau-phi" },
        { title: "Nhật Bản", value: "nhat-ban" },
        { title: "Đài Loan", value: "dai-loan" },
        { title: "Anh", value: "anh" },
      ],
      sortOptions: [
        { title: "Năm ↓", value: "year" },
        { title: "Thời gian cập nhật", value: "modified.time" },
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
