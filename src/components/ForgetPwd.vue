<template>
  <div id="forgetPwd">
    <div class="logo">
      <img src="../assets/logo.png" alt="">
    </div>
    <main>
      <form>
        <input type="number" name="phone" v-model="phone" placeholder="手机号" oninput="if(value.length>5)value=value.slice(0,11)">
        <button class="bt" type='button' :disabled="disabled" @click="sendcode">{{btntxt}}</button>
        <input type="number" name="validation" v-model="validation" placeholder="验证码">
        <input type="password" name="newPssword" @blur="leaveConfirm" v-model="newPssword" placeholder="密码" oninput="if(value.length>5)value=value.slice(0,16)">
        <input type="password" name="confirmPassword" v-model="confirmPassword" placeholder="确认密码" oninput="if(value.length>5)value=value.slice(0,16)">
 <!-- @blur="leaveConfirm" -->
        <button type="button" @click="signin">确认修改</button>
      </form>
    </main>
  </div>
</template>

<script>
 import {Toast, } from 'mint-ui';
  export default {
    name: 'ForgetPwd',
    data() {
      return {
        phone:'',// 手机号码
        validation:'',//验证码
        newPssword:'',//密码
        confirmPassword:'',//确认密码
        reg: 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/, //匹配手机号码
        btntxt:'获取',//获取验证码
        disabled: false, //禁止重复点击获取
        time:0, // 开始时间
        UUID:''
      }
    },
    methods:{
      // UUID算法
      guid(){
      return 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
        });
      },
      // 确认修改
      signin(){
        console.log(this.phone);
        console.log(this.newPssword);
        console.log(this.confirmPassword.length);

      //this.$router.push({name:'Login',params:{phone:this.phone ,password:this.confirmPassword}})
        if(this.phone == ''){
          Toast({ message: '请输入手机号', duration: 1500 });
          }else
        if(!this.reg.test(this.phone)){
          Toast({ message: '手机格式不正确', duration: 1500 })
        }else
        if(this.validation == ''){
          Toast({ message: '请输入验证码', duration: 1500 });
        }else
        if(this.newPssword == ''){
          Toast({ message: '请输入密码', duration: 1500 });
        }else
        if(this.newPssword != this.confirmPassword){
          Toast({ message: '两次输入密码不一致！', duration: 1500 })
        }else
        {
          // 请求数据
          this.$http.post('/h5/public/updatePassword',{
              code: this.validation,
              password:this.confirmPassword,
              phone: this.phone,
              uuid: this.UUID,
              shareCode:'1',
          }).then(e=>{
            console.log(e);
            Toast({ message: '密码修改成功', duration: 1500 })
            this.$router.push({name:'Login',params:{phone:this.phone ,password:this.confirmPassword}})
          })
        }
      },
      // 用户离开确认密码
      leaveConfirm(){
        if(this.newPssword.length < 6){
          Toast({ message: '请输入6位数以上的密码', duration: 1500 });
        }
      },

       // 获取验证码
      sendcode() {
          this.UUID = this.guid()
        if (this.phone == "") {
        Toast({ message: '请输入手机号', duration: 1500 });
        } else if (!this.reg.test(this.phone)) {
        Toast({ message: '手机格式不正确', duration: 1500 });
        } else {
          this.time = 60;
          this.disabled = true;
          this.timer();
          // 请求数据获取验证码
          this.$http.get("/h5/public/smscode", {
              params: {
                phone: this.phone,
                uuid: this.UUID
              }
            }).then(e => {
              // 请求成功
              console.log(e);
            });
        }
      },
      // 倒计时
      timer() {
        if (this.time > 0) {
          this.time--;
          this.btntxt = this.time + "s";
          setTimeout(this.timer, 1000);
        } else {
          this.time = 0;
          this.btntxt = "获取";
          this.disabled = false;
        }
      },
    }
  }

</script>

<style>
  @import "../css/style.css";

</style>

