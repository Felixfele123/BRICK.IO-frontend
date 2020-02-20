import Vuex from 'vuex';
import Vue from 'vue';
import userdata from './modules/userdata'

Vue.use(Vuex);


export default new Vuex.Store({
    modules: {
        userdata
    }
})