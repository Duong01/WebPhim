export function getFavorites() {
  const data = localStorage.getItem("favoriteMovies");
  return data ? JSON.parse(data) : [];
}

export function saveFavorites(list) {
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

export function toggleFavorite(movie) {
  const list = getFavorites();
  const index = list.findIndex((m) => m._id === movie.idMovie || m._id ===  movie._id);
  let linkUrl = "";
  if(movie.thumb_url){
    if(movie.thumb_url.includes("https://phimapi.com")){
      linkUrl = movie.thumb_url
    }
    else{
      linkUrl = "https://phimapi.com/"+ movie.thumb_url
    }
  }
  console.log(list)
  if (index === -1) {
    list.push({
      _id: movie.idMovie || movie._id,
      name: movie.name,
      page: movie.page || movie.episode_current,
      slug: movie.slug,
      thumb_url: linkUrl,
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
