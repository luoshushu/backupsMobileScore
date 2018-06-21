<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="child-view"></router-view>
    </transition>

  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        transitionName: 'slide-right'

      }
    },
    watch: {
      $route(to, from) {
        if (to.meta.index > 0) {
          if (to.meta.index < from.meta.index) {
            this.transitionName = 'slide-right';
          } else {
            this.transitionName = 'slide-left';
          }
        } else if (to.meta.index == 0 && from.meta.index > 0) {
          this.transitionName = 'slide-right';
        }
      }
    }
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  #app {
    position: relative;
    width: 100%;
  }

  .child-view {
    position: absolute;
    width: 100%;
    transition: all .5s cubic-bezier(.55, 0, .1, 1);
  }

  .slide-left-enter,
  .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
  }

  .slide-left-leave-active,
  .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100%, 0);
  }

</style>
