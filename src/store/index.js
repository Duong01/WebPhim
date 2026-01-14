import { createStore } from 'vuex'
import mutations from "./mutations"
import state from "./state"
import loading from "./loading"

const store = createStore({
    state,
    mutations,
    modules: {
      loading,
    },
    
  })
export default store
