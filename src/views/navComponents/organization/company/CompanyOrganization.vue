<!-- 
  我的组织-我的企业-列表
 -->
<template>
  <div class="company-organization block-wrap" ref="contentWrap">
    <!-- header -->
    <div class="block-header">
      <van-nav-bar
        title="我的企业"
        left-text="返回"
        left-arrow
        @click-left="$router.push({name:'home',params:{}})"
        @click-right="$router.push({name:'home',params:{}})"
        fixed
        border
        >
        <van-icon name="wap-home" slot="right" />
      </van-nav-bar>
    </div>
    <!-- content -->
    <div class="block-content">
    	<div class="block-title">我的企业结构</div>
      <van-pull-refresh v-model="isRefreshLoading" @refresh="onRefresh">
         <el-tree 
          :data="companyTree" 
          :props="defaultProps" 
          @node-click="handleNodeClick"
          default-expand-all
          :expand-on-click-node="false">
          <span slot-scope="{ node, data }">{{data.name+" "}}<van-icon name="star" v-if="data.type === '4'"/></span>  
        </el-tree>
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
        orgId:sessionStorage.getItem('userData')?JSON.parse(sessionStorage.getItem('userData')).orgId:null,
        companyTree:[],
        defaultProps: {
          children: 'childrens',
          label: 'name'
        }
  		};
  	},
  	mounted(){
  		/*
        初始化  
       */
      this.getCompany();
  	},
  	methods:{
      /*
        刷新
       */
      onRefresh() {
        setTimeout(() => {
          this.companyTree = [];
          this.getCompany();
          this.$toast('刷新成功');
          this.isRefreshLoading = false;
        }, 500);
      },

      /*
        获取我的企业
       */
      getCompany(){
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/org_units/top/single/tree`,{params:{id:this.orgId}}).then( (response) => {
          this.companyTree.push(response.data.data);
          this.isLoading = false;
        }).catch( (error) => {
          this.$toast(error);
          this.isLoading = false;
        });
      },

      /*
        查看详情
       */
      handleNodeClick(data,node,nodeCompent){
        this.$router.push({name:'companyDetail',params:{id:data.id}});
      },

  	},

  }
</script>

<style scoped lang="less">
  .el-tree{
    min-height:500px;
  }
	.company-organization{
    overflow:auto;
	}
</style>