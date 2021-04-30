import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {
        mSetVal(state, {name, value}) {
            state[name] = value
        },
    }
})
