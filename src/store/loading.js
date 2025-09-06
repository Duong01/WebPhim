const state = {
  isLoading: false,
  timer: null,
};

const mutations = {
  SET_LOADING(state, payload) {
    state.isLoading = payload;
  },
  SET_TIMER(state, payload) {
    state.timer = payload;
  },
};

const actions = {
  startLoading({ commit, state, dispatch }) {
    commit("SET_LOADING", true);

    // clear timer cũ
    if (state.timer) {
      clearTimeout(state.timer);
    }

    // set timer 2 phút
    const timer = setTimeout(() => {
      dispatch("timeoutLoading");
    }, 120000);

    commit("SET_TIMER", timer);
  },
  stopLoading({ commit, state }) {
    commit("SET_LOADING", false);
    if (state.timer) {
      clearTimeout(state.timer);
      commit("SET_TIMER", null);
    }
  },
  timeoutLoading({ commit }) {
    commit("SET_LOADING", false);
    alert("⏳ Hết thời gian chờ (2 phút). Vui lòng thử lại!");
  },
};

const getters = {
  isLoading: (state) => state.isLoading,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
