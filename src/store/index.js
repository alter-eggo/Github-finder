import Vue from 'vue'
import Vuex from 'vuex'
import gitUser from './gitUser.js'

Vue.use(Vuex)


export default new Vuex.Store({
  modules: {
    gitUser
  }
})
