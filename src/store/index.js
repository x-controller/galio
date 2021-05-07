import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {
        // 灵活设置状态值
        mSetVal(state, {name, value}) {
            state[name] = value
        },
    }
})
