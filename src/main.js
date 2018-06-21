// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios' //axios请求
import store from './vuex/store.js';
 import {Toast} from 'mint-ui';
// MintUI
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
axios.defaults.baseURL = 'http://inte.signalpha.xyz';  //全局配置请求地址
axios.interceptors.response.use(
  response => {
    // console.log(response);
    switch (response.data.code) {
      case 401:
          // store.commit(types.LOGOUT);
          // axios.defaults.headers.common['token'] = null
          router.replace({
            path: 'login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
          Toast({ message: response.data.msg, duration: 1500 });          
        break;
      case 500:
          Toast({ message: response.data.msg, duration: 1500 });          
        break;
    
      default:
        break;
    }
    return response;
  });


router.beforeEach((to, from, next) => {
  console.log(to);
  this.hideWXtabbar
  // 注册和登录界面不需要token 其它都需要
  if (to.path === '/login' || to.path === '/Signin' || to.path === '/ForgetPwd') {
    // console.log('不加token');
    localStorage.clear(); //清空缓存
    axios.defaults.headers.common['token'] = ''
  }else{
    axios.defaults.headers.common['token'] = localStorage.token
  }

  // 将路由的标题放进index.html中的title
  if (to.meta.title) {
      document.title = to.meta.title
    }
    if (to.meta.requireAuth) {
      // console.log(store.getters.isLogin);
      if (store.getters.isLogin) {
        next();
      } else {
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        })
      }
    } else {
      next()
      
    }

});

Vue.prototype.$http = axios
Vue.use(MintUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})


