<template>
  <div id="Login">
    <div class="logo">
      <img src="../assets/logo.png" alt="">
    </div>
    <main>
      <form>
        <input type="number" name="phone" v-model="phone" placeholder="手机号" oninput="if(value.length>1)value=value.slice(0,11)">
        <input style="display:none;" type="password" name="password" v-model="password" autocomplete="off" placeholder="密码" oninput="if(value.length>5)value=value.slice(0,16)">
        <input type="password" name="password" v-model="password" autocomplete="off" placeholder="密码" oninput="if(value.length>5)value=value.slice(0,16)">
        <button type="button" @click="login">登录</button>
        <div>
          <span @click="register">注册</span>
          <span @click="forgetPwd">忘记密码</span>
          <div>
            <input type="checkbox" id="myCheck" checked v-model="state">
            <label for="myCheck"></label>记住密码
          </div>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
 import {Toast} from 'mint-ui';
  export default {
    name: 'Login',
    data() {
      return {
        state: true, //记住密码
        phone: '', //手机号码
        password:'', //密码
        reg: 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/, //匹配手机号码
      }
    },
    created() {
      // console.log(this.$store);
    },
    mounted() {
    
      let newPhone = this.$route.params.phone
      let newPassword = this.$route.params.password
      if ( (newPhone != '' && newPhone != undefined) || (newPassword != '' && newPassword != undefined) ) {
        this.phone = newPhone
        this.password = newPassword
      }else{
        this.getCookie()        
      }
    },
    methods: {
      
      // 登录
      login() {
        // console.log(this.$store);

        // 用户是否勾选记住密码
        if (this.state == true) {
          this.setCookie(this.phone, this.password, 7)
        } else {this.clearCookie()} 
        if (this.phone == "") {
          Toast({ message: '请输入手机号码', duration: 1500 });
          return;
        } else if (!this.reg.test(this.phone)) {
          Toast({ message: '手机格式不正确', duration: 1500 });
          return;
        } else if(this.password == '') {
          Toast({ message: '请输入密码', duration: 1500 });
        }else{

          // 请求数据
          this.$http.post("/h5/public/login", { 
                username: this.phone,
                password: this.password
            }).then(e=>{
                console.log(e); 
                this.$store.commit('setToken',e.data);
                // 请求后台成功把手机号 token 到期时间 存到localStorage
                let token_expire = Date.parse( e.data.expire);
                localStorage.Phone = this.phone
                localStorage.token = e.data.token 
                localStorage.expire = token_expire
                localStorage.success = e.data.success 
                this.$router.push({path: '/'})
                if(e.data.success === false){
                  Toast({ message: e.data.msg, duration: 1500 });
                }
              })
        }

      },
      // 注册
      register() {
        this.$router.push({path: '/Signin'});
      },
      //忘记密码
      forgetPwd(){
         this.$router.push({path: '/ForgetPwd'});
        console.log('忘记密码');
      },
      // 设置cookie
      setCookie(phone, pwd, exdays) {
        var exdate = new Date(); //获取时间        
        exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
        window.document.cookie = "userPhone" + "=" + phone + ";path=/;expires=" + exdate.toGMTString()
        window.document.cookie = "userPwd" + "=" + pwd + ";path=/;expires=" + exdate.toGMTString()
      },
      //读取cookie
      getCookie() {
        if (document.cookie.length > 0) {
          var arr = document.cookie.split('; ') //注意:后面有个空格 .坑
          for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('=')
            if (arr2[0] == 'userPhone') {
              this.phone = arr2[1]
            } else if (arr2[0] == 'userPwd') {
              console.log(arr2[1]);
              if(arr2[1] != 'function Number() { [native code] }'){
                this.password = arr2[1]
              }
            }
          }
        }
      },
      // 清空Cookie
      clearCookie() {
        this.setCookie("", "", -1);
      }
    }
  }
</script>

<style>
  @import "../css/style.css";
</style>
