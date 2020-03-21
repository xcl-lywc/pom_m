<!-- 
  考试列表-开始考试（带参与）
 -->
<template>
  <div class="exam-start block-wrap">
    <!-- header -->
    <div class="block-header">
      <van-nav-bar
        title="开始考试"
        left-text="返回"
        left-arrow
        @click-left="$router.push({name:'examList',params:{}})"
        @click-right="$router.push({name:'home',params:{}})"
        fixed
        border
        >
        <van-icon name="wap-home" slot="right" />
      </van-nav-bar>
    </div>
    <!-- content -->
    <div class="block-content"></div>
    <!-- footer -->
    <div class="block-footer"></div>
  </div>
</template>

<script>
  export default {
  	data(){
  		return{
  			id:this.$route.params.s_id,
  			orgCode:sessionStorage.getItem('userData')?JSON.parse(sessionStorage.getItem('userData')).orgCode:null,
  		};
  	},
  	mounted(){
  		/*
  			初始化
  		 */
  		this.startExam();
  	},
  	methods:{

      /*
      	开始考试
       */
      startExam(){
      	let formData = {
      		formData:1,
					id:this.id,
					instanceId:1,
					taskId:1,
      	}
      	this.axios.patch(`${this.common.basePath}/examinees/join/update/from_org/${this.orgCode}`,formData).then( (response) => {
        	
				}).catch( (error) => {
					this.$toast(error);
				});
      },
  	},

  }
</script>

<style scoped lang="less">
	.exam-start{
		
	}
</style>