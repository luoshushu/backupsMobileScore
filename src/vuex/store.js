import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

var state = {
  isData:Boolean, // 是否请求成功
  phone:'',  // 手机
  token:'',  //token
  expire:''  // 到期时间
  
}

let getters = {
   getToken(state) {
     return state.token;
   },
    isLogin() {
      // let now_time = Date.parse(new Date());
      // console.log('now_time : ', now_time, 'expire : ', parseInt(localStorage.expire));
      // if (localStorage.token != '' && parseInt(localStorage.expire) > now_time) {
      //   return true;  
      // } else {
      //   return false;
      // }
      if (localStorage.token != '' && state.isData == true) {
        return true;  
      } else {
        return false;
      }
    }
}

const mutations = {
  changeLogin(state, data) {
    state.isLogin = data;
  },
  setToken(state, payload) {
    state.expire = payload.expire;
    state.token = payload.token;
    state.isData = payload.success
  },
  
  
};
console.log(state);

export default new Vuex.Store({
  state,
  getters,
  mutations
})