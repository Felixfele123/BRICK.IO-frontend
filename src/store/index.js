import Vuex from 'vuex';
import Vue from 'vue';
import userservice from './modules/userservice'

Vue.use(Vuex);


export default new Vuex.Store({
    modules: {
        userservice
    }
})