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
    if (state.timer) clearTimeout(state.timer)
  
    const delayTimer = setTimeout(() => {
      commit("SET_LOADING", true)
    }, 150)
  
    const timeoutTimer = setTimeout(() => {
      dispatch("timeoutLoading")
    }, 120000)
  
    commit("SET_TIMER", { delayTimer, timeoutTimer })
  },
  stopLoading({ commit, state }) {
    if (state.timer) {
      clearTimeout(state.timer.delayTimer)
      clearTimeout(state.timer.timeoutTimer)
    }
    commit("SET_LOADING", false)
    commit("SET_TIMER", null)
  },
  timeoutLoading({ commit }) {
    commit("SET_LOADING", false);
    alert("⏳ Hết thời gian chờ (2 phút). Vui lòng thử lại!");
  },

  checkResume({ state, commit }) {
    const now = Date.now()
    const MAX_IDLE = 60 * 60 * 1000 // 60 phút

    if (now - state.lastActive > MAX_IDLE) {

      window.location.reload()
      return
    }

    commit("UPDATE_ACTIVE_TIME")
  }
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
