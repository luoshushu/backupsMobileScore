import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Signin from '@/components/Signin'
import ForgetPwd from '@/components/ForgetPwd'
import Donate from '@/components/Donate'
import Record from '@/components/Record'




Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/Login',
      name: 'Login',
      component:  Login,
       meta: {
         title: '移动积分兑换系统',
         index: 1
       }
    },
    {
      path: '/Signin',
      name: 'Signin',
      component:  Signin,
      meta: {
        title: '注册',
        index: 2
      }

    },
    {
      path: '/ForgetPwd',
      name: 'ForgetPwd',
      component:  ForgetPwd,
      meta: {
        title: '忘记密码',
        index: 3
      }
    },
    {
      path: '/',
      name: 'donate',
      meta:{
          requireAuth: true, 
          title:'兑换页面',
          index: 4
      },
      component: Donate,
  
    },
    {
      path: '/record',
      name: 'Record',
      meta:{
          requireAuth: true, 
          title:'兑换记录',
          index: 5
      },
      component: Record,
  
    },
 
  ]
})
