<!-- 
  任务列表（未完成）-转交任务
 -->
<template>
  <div class="deliver-task block-wrap" ref="contentWrap">
    <!-- header -->
    <div class="block-header">
      <van-nav-bar
        title="转交任务"
        left-text="返回"
        left-arrow
        @click-left="$router.push({name:'taskList',params:{}})"
        @click-right="$router.push({name:'home',params:{}})"
        fixed
        border
        >
        <van-icon name="wap-home" slot="right" />
      </van-nav-bar>
    </div>
    <!-- content -->
    <div class="block-content">
    	<van-pull-refresh v-model="isRefreshLoading" @refresh="onRefresh">
         
      </van-pull-refresh>
      <!-- <div v-else class="no-data">暂无数据</div> -->
    </div>
    <!-- footer -->
    <div class="block-footer"></div>
    
    <!-- 弹出层 -->
    <van-popup v-model="showPopup" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
      />
    </van-popup>
    <!-- 弹框 -->
    <van-dialog
      v-model="showDialog"
      @confirm=""
      show-cancel-button
      >
      <van-field
        v-model="value"
        type="textarea"
        rows="5"
        autosize
        placeholder="请填写内容..."
      />
    </van-dialog>
    <!-- 加载状态 -->
    <div v-show="isLoading" class="fullScreen-loding"><van-loading type="spinner" color="white" /></div>
  </div>
</template>

<script>
  export default {
  	data(){
  		return{
        isLoading:false,//是否加载
        isRefreshLoading: false,//是否刷新加载
        showPopup:false,//弹出层
        showDialog:false,//弹框
        value:null,
        currentDate: new Date(),
  		};
  	},
  	mounted(){
  		/*
        初始化  
       */
      this.getTree();
  	},
  	methods:{
      /*
        刷新
       */
      onRefresh() {
        setTimeout(() => {
          this.getTree();
          this.$toast('刷新成功');
          this.isRefreshLoading = false;
        }, 500);
      },

      /*
        获取人员组织树
       */
      getTree(){
        // this.isLoading = true;
        // this.axios.get(`${this.common.basePath}/hr_users/info/${userId}`).then( (response) => {
        //   this.taskDetail = response.data.data;
        //   this.isLoading = false;
        // }).catch( (error) => {
        //   this.$toast(error);
        //   this.isLoading = false;
        // });
      },

      /*
        转交任务
       */
      deliverTask(){
        // this.isLoading = true;
        // this.axios.get(`${this.common.basePath}/hr_users/info/${userId}`).then( (response) => {
        //   this.taskDetail = response.data.data;
        //   this.isLoading = false;
        // }).catch( (error) => {
        //   this.$toast(error);
        //   this.isLoading = false;
        // });
      },
  	},

  }
</script>

<style scoped lang="less">
	.deliver-task{
		overflow:auto;
	}
</style>