import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios);
Vue.use(Vuex);

// root state object.
// each Vuex instance is just a single state tree.
const state = {
    loading: true,
    managers: [],
    baseUrl: '',
    scope: []
};

// mutations are operations that actually mutates the state.
// for debugging purposes.
const mutations = {

    updateBaseUrl(state, url) {
        state.baseUrl = url
    },

    updateScope(state, scope) {
        state.scope = scope;
    },

    updateManagers(state, posts) {
        state.managers = posts
    },

    changeLoadingState(state, loading) {
        state.loading = loading
    }
};

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {

    setBaseUrl({commit}, url) {
        commit('updateBaseUrl', url)
    },

    loadScope: async (context) => {
        let {data} = await axios.get(state.baseUrl+'/scope/', {});

        context.commit('updateScope', data.result);
        context.commit('changeLoadingState', false)
    }

};

// getters are functions
const getters = {

    baseUrl(state) {
        return state.baseUrl
    },

    scope(state) {
       return state.scope
    }

};

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})