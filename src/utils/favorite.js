export function getFavorites() {
  const data = localStorage.getItem("favoriteMovies");
  return data ? JSON.parse(data) : [];
}

export function saveFavorites(list) {
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

export function toggleFavorite(movie) {
  const list = getFavorites();
  const index = list.findIndex((m) => m._id === movie.idMovie);
  console.log(list)
  if (index === -1) {
    list.push({
      _id: movie.idMovie,
      name: movie.name,
      page: movie.page,
      slug: movie.slug,
      thumb_url: movie.thumb_url,
      lang: movie.lang,
      origin_name: movie.origin_name,
      year: movie.year
    });
    alert("🎬 Lưu vào danh sách thành công!")
  } else {
    list.splice(index, 1);
    alert("❌ Đã xóa khỏi danh sách!")
  }

  saveFavorites(list);
  return list;
}

export function isFavorite(movieId) {
  const list = getFavorites();
  return list.some((m) => m._id === movieId);
}
