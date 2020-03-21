<!-- 
  任务列表
 -->
<template>
  <div class="task-list block-wrap" ref="contentWrap">
    <!-- header -->
    <div class="block-header">
      <van-nav-bar
        title="任务列表"
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
    	<van-pull-refresh v-model="isRefreshLoading" @refresh="onRefresh">
        <van-tabs @click="onClick" v-model="active" ref="tabs">
          <van-tab title="未完成的">
            <task-list v-bind:taskList="taskList" v-bind:isShowDeliverTaskBtn="true"></task-list>
          </van-tab>
          <van-tab title="已完成的">
            <task-list v-bind:taskList="taskList" v-bind:isShowDeliverTaskBtn="false"></task-list>
          </van-tab>
          <van-tab title="我执行的">
            <task-list v-bind:taskList="taskList" v-bind:isShowDeliverTaskBtn="false"></task-list>
          </van-tab>
          <van-tab title="我发出的">
            <task-list v-bind:taskList="taskList" v-bind:isShowDeliverTaskBtn="false"></task-list>
          </van-tab>
          <van-tab title="抄送我的">
            <task-list v-bind:taskList="taskList" v-bind:isShowDeliverTaskBtn="false"></task-list>
          </van-tab>
        </van-tabs> 
      </van-pull-refresh>
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
  import TaskList from "../../task/TaskListComponent.vue";
  export default {
    components: {
      "task-list":   TaskList,
    },
  	data(){
  		return{
        active: 0,
        isLoading:false,//是否加载
        isRefreshLoading: false,//是否刷新加载
        showPopup:false,//弹出层
        showDialog:false,//弹框
        value:null,
        currentDate: new Date(),
        taskList:{rows:[],total:0},
        userId:sessionStorage.getItem('userData')?JSON.parse(sessionStorage.getItem('userData')).userId:null,
        list:{
          status: 1,
          assignee: null,
          creator: null,
          copy: null,
          pageSize: 5,
          pageNum: 1,
        },
  		};
  	},
  	mounted(){

  		// ------ 滚动加载更多 -------
      // 通过$refs获取dom元素
      let box = this.$refs.contentWrap;
      let tabs = this.$refs.tabs;
      // 监听这个dom的scroll事件
      box.addEventListener('scroll', () => {
        // ------ 固定tabs在顶部 -------
        if(box.scrollTop>=45){
          tabs.$el.childNodes[0].style.position = "fixed";
          tabs.$el.childNodes[0].style.top = box.scrollTop+'px';
        }else{
          tabs.$el.childNodes[0].style.position = "absolute";
          tabs.$el.childNodes[0].style.top = '0px';
        } 
        // 滑动到底部50的时候操作数据
        if(box.clientHeight + 50 >= box.scrollHeight - box.scrollTop ) {
          // ------ 值为true表示可以再次请求
          if(this.scrollLoadSw){
            this.scrollLoadSw = false;
            if(this.list.pageNum < this.taskList.total / this.list.pageSize){
              this.getTaskList(false);
            } else{
              this.$toast('没有更多了');
            }
          }
         
        }  
      }, false)   

      //----- 初始化 ------- 
      this.getTaskList(true);
  	},
  	methods:{
      /*
        刷新
       */
      onRefresh() {
        setTimeout(() => {
          let index = this.active;
          if(index===0){
            this.list.pageNum = 1;
            this.list.status = 1;
            this.list.assignee = null;
            this.list.creator = null;
            this.list.copy = null;
            this.getTaskList(true);
          }else if(index===1){
            this.list.pageNum = 1;
            this.list.status = 2;
            this.list.assignee = null;
            this.list.creator = null;
            this.list.copy = null;
            this.getTaskList(true);
          }else if(index===2){
            this.list.pageNum = 1;
            this.list.status = null;
            this.list.assignee = this.userId;
            this.list.creator = null;
            this.list.copy = null;
            this.getTaskList(true);
          }else if(index===3){
            this.list.pageNum = 1;
            this.list.status = null;
            this.list.assignee = null;
            this.list.creator = this.userId;
            this.list.copy = null;
            this.getTaskList(true);
          }else if(index===4){
            this.list.pageNum = 1;
            this.list.status = null;
            this.list.assignee = null;
            this.list.creator = null;
            this.list.copy = this.userId;
            this.getTaskList(true);
          }
          this.$toast('刷新成功');
          this.isRefreshLoading = false;
        }, 500);
      },

      /*
       * 查询各个状态的任务列表，请求成功，或者失败，都将滚动状态isLoadMore设置为true
       * @params {bool} isRefresh true为重置数据 false累加数据
       */
      getTaskList(isRefresh){ 
        // ------- 请求开始，将加载设置为true
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/t_tasks/list`,{params:this._queryParams(isRefresh)}).then((response) => {
          // ---------- 当时加载更多是，就需要累加，否则直接覆盖
          if(!isRefresh) { 
            // ----------- 合并两个数组 ------------
            this.taskList.rows = this.taskList.rows.concat(response.data.data.rows);

            this.taskList.total = response.data.data.total;
          }else{
            // ---------- 查询第一页数据 ---------  
            this.taskList = response.data.data;
          }
          // ------- 请求完毕，将滚动开关设置为true
          this.scrollLoadSw = true;
          // ------- 请求完毕，将加载设置为false
          this.isLoading = false;
        }).catch((error) => {
          this.$toast(error);
          // ------- 请求完毕，将滚动开关设置为true
          this.scrollLoadSw = true;
          // ------- 请求完毕，将加载设置为false
          this.isLoading = false;
        });
      },
      _queryParams(isRefresh){
        isRefresh ? this.list.pageNum = 1 : this.list.pageNum ++;
        return this.list;
      },

      /*
        点击切换状态
       */
      onClick(index, title){
        if(index===0){
          this.list.pageNum = 1;
          this.list.status = 1;
          this.list.assignee = null;
          this.list.creator = null;
          this.list.copy = null;
          this.getTaskList(true);
        }else if(index===1){
          this.list.pageNum = 1;
          this.list.status = 2;
          this.list.assignee = null;
          this.list.creator = null;
          this.list.copy = null;
          this.getTaskList(true);
        }else if(index===2){
          this.list.pageNum = 1;
          this.list.status = null;
          this.list.assignee = this.userId;
          this.list.creator = null;
          this.list.copy = null;
          this.getTaskList(true);
        }else if(index===3){
          this.list.pageNum = 1;
          this.list.status = null;
          this.list.assignee = null;
          this.list.creator = this.userId;
          this.list.copy = null;
          this.getTaskList(true);
        }else if(index===4){
          this.list.pageNum = 1;
          this.list.status = null;
          this.list.assignee = null;
          this.list.creator = null;
          this.list.copy = this.userId;
          this.getTaskList(true);
        }
      },

  	}

  }
</script>

<style scoped lang="less">
	.task-list{
		overflow:auto;
	}
</style>