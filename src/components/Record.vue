<template>
  <div id="Record">
    <!-- <div class="noTextBox noTextRecord">
          <div class="noText" v-if="RecordData.length === 0">
            <img src="../assets/logo.png" alt="">
            <p>暂无捐赠记录</p>
            <p>已捐赠？</p>
            <input type="number" @click="enterPhone" v-model="phoneNumber" @blur="leaveData" placeholder="输入手机号码查看" oninput="if(value.length>5)value=value.slice(0,11)">
          </div>
        </div> -->
    <!-- @click="lazy(item.userId)" -->
    <!-- @click="lazy" -->
  
    <div class="recordBox" v-for="(item, index) in RecordData">
      <div class="recordImg">
        <img src="../assets/logo.png" alt="">
      </div>
      <div class="recordText">
        <div>
          <h3>{{item.phone}}</h3>
          <p class="p1" v-if="item.isOffset == 0">未知</p>
          <p class="p2" v-if="item.isOffset == 1">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </p>
          <p class="p3" v-if="item.isOffset == 2">已兑换</p>
        </div>
        <p>兑换积分：
          <span>{{item.money}}</span>
        </p>
        <p>{{item.time}}</p>
      </div>
    </div>

    <div class="return">
      <p v-show="showTop" @touchstart="goTop">
        <i class="iconfont icon-top"></i>
      </p>
      <p @click="goHome">
        <i class="iconfont icon-shouye"></i>
      </p>
    </div>

    <!-- v-show="showLoading" -->
    <div class="loading" ref="Loading" v-show="showLoading">
      <span v-show="showIcon" class="iconfont icon-loading"></span>
      <p v-show="Baseline">———— 我是有底线的 ————</p>
    </div>
  </div>
</template>

<script>
  import {
    MessageBox,
    Toast,
    Indicator
  } from 'mint-ui';
  export default {
    name: 'Record',
    data() {
      return {
        RecordData: [], // 数据渲染
        showLoading: false, // 是否显示加载loading
        index: 10,
        Baseline: false, //是否显示底线
        showIcon:true, //是否显示Loading的icon
        isFinish: false,
        dataLength:Number, // 数据的长度
        total:Number, // 总数据
        showTop:false,//是否显示回到顶部按钮
        
      }
    },
    created() {
      this.init()
    },
    watch: {
    },
    methods: {
      // 返回首页
      goHome(){
        this.$router.push({name:'donate'})
      },
      //回到顶部
      goTop(){
      let top = setInterval(() => {
        let ScrollBar = document.getElementById('Record').scrollTop -= 100
        if(ScrollBar <=0 ){
           window.clearInterval(top) 
           }
      }, 10);
      },
      // 上滑加载
      lazy() {
     //元素到文档的距离 - 滚动条 < 视窗高度     
      let scroll = document.getElementById('Record').scrollTop // 滚动条位置 
      let elementTop = this.$refs.Loading.offsetTop //元素到文档的距离
      let windowHeight = window.innerHeight //视窗高度
        console.log(scroll);
        this.showTop = true
        if(scroll == 0 ){ this.showTop = false}
        if ( this.dataLength === this.total) {
            console.log('加载完成了');
            this.isFinish = true
            this.Baseline = true
            this.showIcon = false
            if (this.showLoading) return; 
          }
     
        if ((elementTop - scroll + 46) < windowHeight) {
          setTimeout(() => {
            this.init()
            this.showLoading = true
          }, 1500);
        }
      },
      // 请求数据
      init() {
        this.showLoading = true
        this.$http.get("/h5/intergral/list", {
          params: {
            page: 0, //页码
            limit: this.index, // 每页条数
            order: ''
          }
        }).then(e => {
          this.dataLength = e.data.data.list.length
          this.total = e.data.data.total
          console.log( this.total);
          console.log( this.dataLength);
          if (e.data.data.list.length === 0) {
            this.showLoading = false
            Toast({
              message: '暂无兑换记录',
              duration: 1500
            })
          }
          this.index += 10
          this.RecordData = e.data.data.list
          e.data.data.list.forEach((element, index) => {
            this.RecordData[index].phone = element.phone.substr(0, 3) + '****' + element.phone.substr(7, 11)
    
          })
        }).catch(error => {
        })
      }
    },
    mounted() {
      document.getElementById('Record').addEventListener('scroll', this.lazy)
    },
  }
</script>

<style>
  @import '../css/style.css';
</style>
