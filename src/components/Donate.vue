<template>
  <div id="Donate">
    <div class="logo">
      <img src="../assets/logo.png" alt="" srcset="">
    </div>
    <main>
      <form>
        <input @blur="leaveName" name="userName" type="text" placeholder="兑换人姓名" v-model="userName">
        <input @blur="leaveInput" name="phone" type="number" placeholder="手机号" v-model="phone" oninput="if(value.length>5)value=value.slice(0,11)">
        <button type="button" class="bt" :disabled="disabled" @click="sendcode">{{btntxt}}</button>
        <input name="verify" type="number" placeholder="输入验证码" v-model="verify">
        <button type="button" class="bt" @click="query">查询</button>
        <input name="integral" type="number" placeholder="积分值" readonly="readonly" v-model="integral">
        <!-- <input name="integral" type="number" placeholder="积分值" v-model="integral"> -->
        <input @click="openIntegral" onfocus="this.blur();" name="donateIntegral" type="number" placeholder="请输入捐赠的积分" v-model="donateIntegral">
        <button type="button" @click="submit" :disabled="ban">确认兑换</button>
        <label @click="record">兑换记录</label>
      </form>
    </main>
    <mt-popup v-model="popupVisible" popup-transition="popup-fade" position="bottom">
      <div class="offSelect">
        <p @click="offSelect">取消</p>
        <p @click="offSelect">确定</p>
      </div>
      <mt-picker :slots="slots" @change="onValuesChange">
      </mt-picker>
    </mt-popup>
  </div>
</template>

<script>
  import {
    Indicator,
    Toast
  } from "mint-ui";
  export default {
    name: "donate",
    data() {
      return {
        time: 0,
        phone: '', //手机号
        verify: "", //验证码
        donateIntegral: "", //捐赠积分
        btntxt: "获取",
        disabled: false,
        integral: "", //查询积分
        acceptid: "", //验证手机返回的acceptid
        popupVisible: false,
        ban: false, //禁止点击确认捐赠积分
        slots: [{
          flex: 1,
          values: [],
          className: "slots",
          textAlign: "centent"
        }],
        reg: 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/, //手机正则
        userName: '', //兑换人姓名
      };
    },
    created() {
      console.log(this.$store);
    },
    methods: {
      // 用户离开姓名输入框
      leaveName() {
        if (!this.userName.replace(/[^\u4e00-\u9fa5 a-zA-Z]/g, '')) {
          Toast({
            message: '请输入中文名或英文名',
            duration: 1500
          });
        }
      },
      record() {
        this.$router.push({
          name: 'Record',
          params: {
            phone: this.phone
          }
        })
      },
      // 用户离开手机输入框的时候
      leaveInput() {
        if (this.phone == "") {
          Toast({
            message: '请输入手机号码',
            duration: 1500
          });
        } else if (!this.reg.test(this.phone)) {
          Toast({
            message: '手机格式不正确',
            duration: 1500
          });
        }
      },
      //选择捐赠的积分
      onValuesChange(picker, values) {
        this.donateIntegral = values.join();
      },
      // 关闭选择框
      offSelect() {
        this.popupVisible = false;
      },
      openIntegral() {
        if (this.integral < 84) {
          Toast({
            message: '积分必须大于84以上才可以捐赠',
            duration: 1500
          });
        } else {
          this.popupVisible = true;
          this.changeMoney(this.integral);
        }
      },
      changeMoney(e) {
        let y = Math.round(e / 84);
        if (y == 1) {
          this.slots[0].values.splice(0, this.slots[0].values.length);
          this.slots[0].values.push(`84`);
        } else {
          this.slots[0].values.splice(0, this.slots[0].values.length);
          for (let x = 1; x <= y; x++) {
            if (x * 84 <= this.integral) {
              this.slots[0].values.push(`${x * 84}`);
            }
          }
          this.slots[0].values.reverse();
        }
      },
      // 获取验证码
      sendcode() {
        if (this.phone == "") {
          Toast({
            message: '请输入手机号码',
            duration: 1500
          });
        } else if (!this.reg.test(this.phone)) {
          Toast({
            message: '手机格式不正确',
            duration: 1500
          });
        } else {
          this.time = 60;
          this.disabled = true;
          this.timer();
          // 请求数据获取验证码
          this.$http.get("/h5/intergral/sendIdentifyCodeSub", {
              params: {
                phone: this.phone
              }
            })
            .then(e => {
              this.acceptid = e.data.acceptid;
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
      // 查询
      query() {
        console.log('查询');
        this.popupVisible = false;
        if (this.verify == "") {
          Toast({
            message: '请输入验证码',
            duration: 1500
          });
        } else {
          // 请求数据查询积分
          this.$http.get("/h5/intergral/integralQrySub", {
            params: {
              phone: this.phone,
              code: this.verify,
              acceptid: this.acceptid
            }
          }).then(e => {
            this.integral = e.data.poiNum;
          });
        }
      },
      // 提交捐赠
      submit() {
        // console.log('提交');
        // console.log(this.phone);
        // var donateIntegral = this.donateIntegral / 84 * 100
        if (this.phone == '' || this.phone == null) {
          Toast({ message: '请输入手机号', duration: 1500 });
        } else if (this.verify == '') {
          Toast({ message: '请输入验证码', duration: 1500 });
        } else if (this.integral == '') {
          Toast({ message: '请查询是否可兑换的积分', duration: 1500 });
        } else if (this.donateIntegral == '') {
          Toast({ message: '请输兑换的积分', duration: 1500 });
        } else {
          this.ban = true
          Indicator.open({
            text: '加载中...',
            spinnerType: 'fading-circle'
          });
          // 请求捐赠数据
          this.$http.get('/h5/intergral/paySub', {
            params: {
              phone: this.phone,
              code: this.verify,
              acceptid: this.acceptid,
              money: this.donateIntegral,
              userName: this.userName // 新增
            }
          }).then(e => {
            Indicator.close();
            if (e.data.success == false) {
              Indicator.close();
              this.verify = ''
              this.acceptid = ''
              this.donateIntegral = ''
              Toast({ message: e.data.msg, duration: 1500 });
            } else {}
          })
        }
      },
    }
  };
</script>

<style>
  @import "../css/style.css";
</style>
