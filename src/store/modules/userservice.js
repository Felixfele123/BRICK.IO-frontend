import axios from 'axios';

const state = {
    userdata: [],
    loginResponse: null,
    gameActive: false,
    refreshData: true
  };
  
  const getters = {
    allUserdata: state => state.userdata,
    loginResponse: state => state.response,
    gameActive: state => state.gameActive,
    refreshData: state => state.refreshData
  };


const actions = {

//fetch userdata from database (based on client-token)
  async fetchUserdata({commit}){
    const response = await axios({
        method: 'get',
        url: 'http://localhost:3456/userdata',
        withCredentials: true
      });
      commit('setUserdata', response.data);
      console.log(response.data) 
},
//Login request from cliens
  async loginUser({commit}, userEmail){
    const res = await axios({
          method: 'post',
          url: 'http://localhost:3456/login',
          data: {
            email: userEmail
          },
          withCredentials: true
        });
        console.log(userEmail)
        commit('setLoginResponse', res.data);
  },
  async confLogin({commit}, code){
      const res = await axios({
          method: 'post',
          url: 'http://localhost:3456/confirmation',
          data: {
            code: code
          },
          withCredentials: true
        });
        console.log(res)
        commit('setLoginResponse', res.data);
        localStorage.setItem('username', res.data[0].username);
  },
  async regUser({commit}, userdata){
      const res = await axios({
          method: 'post',
          url: 'http://localhost:3456/registration',
          data: {
            email: userdata.email,
            username: userdata.username
          },
          withCredentials: true
        });
        console.log(res)
        commit('setLoginResponse', res.data);
  },
  async confReg({commit}, code){
      const res = await axios({
          method: 'post',
          url: 'http://localhost:3456/regConfirmation',
          data: {
            code: code,
          },
          withCredentials: true
        });
        commit('setLoginResponse', res.data);
        localStorage.setItem('username', res.data[0].username);
  },
  async insertData({commit}, data){
    console.log(data.xp)
    console.log(data.coins)
      const res = await axios({
          method: 'post',
          url: 'http://localhost:3456/updateUserdata',
          data: {
            xp: data.xp,
            coins: data.coins
          },
          withCredentials: true
        });
        commit('setLoginResponse', res.data);
         console.log(res)
  },
};

const mutations = {
  setUserdata: (state, userdata) => (state.userdata = userdata),
  setLoginResponse: (state, response) => (state.loginResponse = response),
  setGameActive: (state, bool) => (state.gameActive = bool),
  setRefreshData: (state, bool) => (state.refreshData = bool)
};
export default {
    state,
    getters,
    actions,
    mutations
}