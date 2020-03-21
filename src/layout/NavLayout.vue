<template>
  <div id="wapper">
		<div class="header-wrap"></div>
    <div class="content-wrap">
      <router-view></router-view>
    </div>
    <div class="footer-wrap"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        
      };
    },
    components: {
    
    },
    watch: {
			
    },
    created () {
      
    },
    mounted(){
    },
    methods: {
			
    },
    
  }
</script>

<style scoped lang="less">
  #wapper{
    .header-wrap{
      z-index: 99;
      position: relative;
      top:0;
      box-shadow: 0 -2px 10px #e4e4e4;
    }
    .content-wrap {
      width: 100%;
      overflow-y: auto;
    }
    .footer-wrap{

    }
  }
  
</style>
