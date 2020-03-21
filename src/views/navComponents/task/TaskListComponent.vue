<!-- 
  任务列表模版
 -->
<template>
  <div class="task-list-template">
    <!-- header -->
    <div class="block-header"></div>
    <!-- content -->
    <div class="task-content mart10">
      <div v-if="taskList.total>0">
        <div class="content-box task-box" v-for="item in taskList.rows">
          <div class="content-box-item ellipsis">{{(item.taskType?item.taskType:'暂无')+'：'+(item.content?item.content:'暂无')}}</div>
          <div class="content-box-item">{{item.assignee?item.assignee:'暂无'}}</div>
          <div class="content-box-item">{{(common._convertDate(item.createTime, 'yyyy/MM/dd hh:mm:ss'))+"~"+(common._convertDate(item.endTime, 'yyyy/MM/dd hh:mm:ss'))}}</div>
          <div class="content-box-item"></div>
          <van-row gutter="20">
            <van-col span="12"><p class="padt5"><i class="fa fa-tasks marr3" aria-hidden="true"></i>{{item.allTask}}</p></van-col>
            <van-col span="12">
              <van-button type="info" size="small" class="fr" @click="$router.push({name:'deliverTask',params:{d_id:0}})" v-if="isShowDeliverTaskBtn">转交任务</van-button>
              <van-button type="primary" size="small" class="marr3 fr" @click="$router.push({name:'taskDetail',params:{id:item.id,instanceId:item.instanceId}})">查看详情</van-button>
            </van-col>
          </van-row>
        </div>
      </div>
      <div v-else class="no-data">暂无数据</div>
    </div>
    <!-- footer -->
    <div class="block-footer"></div>
    
    <!-- 弹出层 -->
    <van-popup v-model="showPopup" position="right" :overlay="true"></van-popup>
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
    props:{
      isShowDeliverTaskBtn:Boolean,
      taskList:{
        type:null,
        required:true,
      },
    },
  	data(){
  		return{
        isLoading:false,//是否加载
        showPopup:false,//弹出层
        showDialog:false,//弹框
        value:null,
  		};
  	},
  	mounted(){
  		
  	},
  	methods:{
      
  	},

  }
</script>

<style scoped lang="less">
	.task-list-template{
		overflow:auto;
    .task-content{
      overflow:hidden;
      .task-box{
        border:1px solid #ddd;
        margin: 0px auto 10px;
        width: 95%;
      } 
    }
	}
</style>