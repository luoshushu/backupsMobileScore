<template>
  <div id="Succeed">
    <main class="main">
      <h3>捐赠成功</h3>
      <p>您已成功捐赠
        <span>1000</span>积分</p>
      <p>
        由衷的感谢您，您的善意之举给了他们新希望，也让每个参与捐款的人看到了希望的曙光，我相信，有大家的祝福和无私的奉献，一定会使他们恢复健康。
      </p>
      <button>
        <router-link to="/" apend>知道了</router-link>
      </button>
      <div class="share">
          <input type="checkbox" id="myCheck" checked>
          <label for="myCheck"></label>分享到微信朋友圈
      </div>
    </main>

    <div class="shade"></div>
  </div>
</template>
<script>
  export default {
    name: "Succeed",
    data() {
      return {

      }
    }
  }

</script>
<style>
  @import '../css/style.css';

</style>
