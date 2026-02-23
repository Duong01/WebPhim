import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 300000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

/* ======================
   REQUEST – GẮN JWT
====================== */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ======================
   RESPONSE – 401 LOGOUT
====================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API ERROR: ", error.response)
    if (error.status === 401) {
        alert(this.$t("Tài khoản của bạn đã hết hạn đăng nhập"))
        localStorage.removeItem("token");
        localStorage.removeItem("favoriteMovies");
        localStorage.removeItem("user");
        localStorage.removeItem("name");
        localStorage.removeItem("nameShow");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/* ======================
   COMMON METHODS
====================== */
function Post(url, params, success, error) {
  api
    .post(url, params)
    .then((res) => success(res))
    .catch((err) => error(err));
}

function Get(url, params, success, error) {
  api
    .get(url, { params })
    .then((res) => success(res))
    .catch((err) => error(err));
}

/* Dùng cho API ngoài nếu cần */
function GetNew(url, params, success, error) {
  api
    .get(url, { params })
    .then((res) => success(res.data))
    .catch((err) => error(err));
}

/* Upload file – CÓ JWT */
function PostFile(url, form, success, error) {
  api
    .post(url, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => success(res))
    .catch((err) => error(err));
}

const http = {
  Post,
  Get,
  GetNew,
  PostFile,
};

export default http;
