<!-- 
	首页
 -->
<template>
  <div class="home block-wrap" ref="home">
    <!-- header -->
    <div class="block-header">
      <van-nav-bar
        title="首页"
        fixed
        border
        >
        <i class="fa fa-sign-out" aria-hidden="true" slot="right" @click="loginOut"></i>
      </van-nav-bar>
    </div>
    <!-- content -->
    <div class="block-content">
      <van-tabs v-model="active">
        <van-tab title="我的考试">
          <div class="menu">
            <van-button type="default" @click="$router.push({name:'examList',params:{}})" class="mart10 marl10">考试列表</van-button>
          </div>
        </van-tab>
        <van-tab title="网上党校">
          <div class="menu">
            <van-button type="default" @click="$router.push({name:'partyLectures',params:{}})" class="mart10 marl10">网上党课</van-button>
          </div>  
        </van-tab>
        <van-tab title="我的组织">
          <div class="menu">
            <van-button type="default" @click="$router.push({name:'companyOrganization',params:{}})" class="mart10 marl10">我的企业</van-button>
            <van-button type="default" @click="$router.push({name:'partyOrganization',params:{}})" class="mart10 marl10">我的党组织</van-button>
            <van-button type="default" @click="$toast('待开发')" class="mart10 marl10">我的工会组织</van-button>
            <van-button type="default" @click="$toast('待开发')" class="mart10 marl10">我的团组织</van-button>
          </div> 
        </van-tab>
        <van-tab title="我的任务">
          <div class="menu">
            <van-button type="default" @click="$router.push({name:'taskList',params:{}})" class="mart10 marl10">任务列表</van-button>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <!-- footer -->
    <div class="block-footer"></div>
  </div>
</template>

<script>
  export default {
  	data(){
  		return{
  			active:0,
  		};
  	},
  	mounted(){
  		
  	},
  	methods:{
      /*
        退出登陆
       */
      loginOut(){
        this.axios.get(`${this.common.basePath}/login/out`).then( (response) => {}).catch( (error) => {
          this.$toast('退出登录成功，请重新登录。');
          sessionStorage.removeItem("token")
          sessionStorage.removeItem("userData")
          sessionStorage.removeItem("assignee")
          sessionStorage.removeItem("historyPath")
        });
      },
  	},

  }
</script>

<style scoped lang="less">
	.home{
		.menu{

		}
	}
</style>