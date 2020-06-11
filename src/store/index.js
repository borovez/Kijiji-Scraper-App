import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex);

// Load store modules dynamically.
const requireContext = require.context('./modules', false, /.*\.js$/)

const modules = requireContext.keys()
  .map(file =>
    [file.replace(/(^.\/)|(\.js$)/g, ''), requireContext(file)]
  )
  .reduce((modules, [name, module]) => {
    if (module.namespaced === undefined) {
      module.namespaced = true
    }
    return { ...modules, [name]: module }
  }, {})

const store = new Vuex.Store({
  modules,
  plugins: [new VuexPersistence({
    supportCircular: true,
  }).plugin]
})

export default store


