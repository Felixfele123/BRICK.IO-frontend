import Vuex from 'vuex';
import Vue from 'vue';
import userservice from './modules/userservice'
//import game from './modules/game'

Vue.use(Vuex);


export default new Vuex.Store({
    modules: {
        userservice,
    }
})