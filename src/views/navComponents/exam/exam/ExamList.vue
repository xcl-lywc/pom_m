<!-- 
	考试列表
 -->
<template>
  <div class="exam-list block-wrap" ref="contentWrap">
  	<!-- header -->
    <div class="block-header">
      <van-nav-bar
        title="考试列表"
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
	  	<van-tabs v-model="active" @click="onClick">
	  		<van-pull-refresh v-model="isRefreshLoading" @refresh="onRefresh">
				  <van-tab title="待参与">
				  	<div v-if="examList" v-for="item in examList.rows" class="item">
				  		<van-row gutter="20" class="item-row">
						  	<van-col span="8">{{item.theme}}</van-col>
						  	<van-col span="8">{{'创建者：'+item.userName}}</van-col>
						  	<van-col span="8">{{common._convertDate(item.createTime, 'yyyy/MM/dd hh:mm')}}</van-col>
							</van-row>
							<van-row class="item-row">
						 	 <van-col>{{'考试时间：'+common._convertDate(item.beginTime, 'yyyy/MM/dd hh:mm')+'~'+common._convertDate(item.endTime, 'yyyy/MM/dd hh:mm')}}</van-col>
							</van-row>
							<van-row gutter="20" class="item-row">
						  	<van-col span="6">
						  		<i class="fa fa-users"></i>
						  		{{item.totalUser}}
						  	</van-col>
						  	<van-col span="6">
						  		<i class="fa fa-comments"></i>
						  		{{item.commentNum}}
						  	</van-col>
						  	<van-col span="6">
						  		<span>总分：</span>
						  		{{item.score}}
						  	</van-col>
						  	<van-col span="6">
						  		<van-button type="primary" size='small' @click="$router.push({name:'examStart',params:{s_id:item.examId}})">开始考试</van-button>
						  	</van-col>
							</van-row>	
				  	</div>
				  	<div v-if="examList.total===0" class="no-data">暂无数据</div>
				  </van-tab>
				  <van-tab title="已参与">
				  	<div v-if="examList" v-for="item in examList.rows" class="item">
				  		<van-row gutter="20" class="item-row">
						  	<van-col span="8">{{item.theme}}</van-col>
						  	<van-col span="8">{{'创建者：'+item.userName}}</van-col>
						  	<van-col span="8">{{common._convertDate(item.createTime, 'yyyy/MM/dd hh:mm')}}</van-col>
							</van-row>
							<van-row class="item-row">
						 	 <van-col>{{'考试时间：'+common._convertDate(item.beginTime, 'yyyy/MM/dd hh:mm')+'~'+common._convertDate(item.endTime, 'yyyy/MM/dd hh:mm')}}</van-col>
							</van-row>
							<van-row gutter="20" class="item-row">
						  	<van-col span="6">
						  		<i class="fa fa-users"></i>
						  		{{item.totalUser}}
						  	</van-col>
						  	<van-col span="6">
						  		<i class="fa fa-comments"></i>
						  		{{item.commentNum}}
						  	</van-col>
						  	<van-col span="6">
						  		<span>总分：</span>
						  		{{item.score}}
						  	</van-col>
						  	<van-col span="6">
						  		<!-- <van-button type="primary" size='small'>开始考试</van-button> -->
						  	</van-col>
							</van-row>	
				  	</div>
				  	<div v-if="examList.total===0" class="no-data">暂无数据</div>
				  </van-tab>
				  <van-tab title="已结束">
				  	<div v-if="examList" v-for="item in examList.rows" class="item">
				  		<van-row gutter="20" class="item-row">
						  	<van-col span="8">{{item.theme}}</van-col>
						  	<van-col span="8">{{'创建者：'+item.userName}}</van-col>
						  	<van-col span="8">{{common._convertDate(item.createTime, 'yyyy/MM/dd hh:mm')}}</van-col>
							</van-row>
							<van-row class="item-row">
						 	 <van-col>{{'考试时间：'+common._convertDate(item.beginTime, 'yyyy/MM/dd hh:mm')+'~'+common._convertDate(item.endTime, 'yyyy/MM/dd hh:mm')}}</van-col>
							</van-row>
							<van-row gutter="20" class="item-row">
						  	<van-col span="6">
						  		<i class="fa fa-users"></i>
						  		{{item.totalUser}}
						  	</van-col>
						  	<van-col span="6">
						  		<i class="fa fa-comments"></i>
						  		{{item.commentNum}}
						  	</van-col>
						  	<van-col span="6">
						  		<span>总分：</span>
						  		{{item.score}}
						  	</van-col>
						  	<van-col span="6">
						  		<van-button type="primary" size='small' @click="$router.push({name:'examDetail',params:{id:item.examId}})">查看详情</van-button>
						  	</van-col>
							</van-row>	
				  	</div>
				  	<div v-if="examList.total===0" class="no-data">暂无数据</div>
				  </van-tab>
			  </van-pull-refresh>
			</van-tabs>
		</div>
		<!-- footer -->
    <div class="block-footer"></div>
    <!-- 加载状态 -->
    <div v-show="isLoading" class="fullScreen-loding"><van-loading type="spinner" color="white"/></div>
  </div>
</template>

<script>
  export default {
  	data(){
  		return{
  			isLoading:false,//是否加载
  			isRefreshLoading: false,//是否刷新加载
  			active:0,
  			examList:{total: 0, rows: []},
  			list:{
  				status:1,
          userId:sessionStorage.getItem('userData')?JSON.parse(sessionStorage.getItem('userData')).userId:null,
          pageSize: 5,
          pageNum:  1,
  			},
  		};
  	},
  	mounted(){

  		// ------ 滚动加载更多 -------
      // 通过$refs获取dom元素
      let box = this.$refs.contentWrap;
      // 监听这个dom的scroll事件
      box.addEventListener('scroll', () => {
      // 滑动到底部50的时候操作数据
      if(box.clientHeight + 50 >= box.scrollHeight - box.scrollTop ) {
        // ------ 值为true表示可以再次请求
        if(this.scrollLoadSw){
          this.scrollLoadSw = false;
          if(this.list.pageNum < this.examList.total / this.list.pageSize){
            this.getExamList(false);
          } else{
            this.$toast('没有更多了');
          }
        }
         
        }  
      }, false)   

      //----- 初始化 ------- 
      this.getExamList(true);
  	},
  	methods:{

  		/*
  			刷新
  		 */
  		onRefresh() {
	      setTimeout(() => {
	      	this.list.pageNum = 1;
	      	this.getExamList(true);
	        this.$toast('刷新成功');
	        this.isRefreshLoading = false;
	      }, 500);
	    },

	    /*
       * 查询各个状态的考试列表，请求成功，或者失败，都将滚动状态isLoadMore设置为true
       * @params {bool} isRefresh true为重置数据 false累加数据
       */
      getExamList(isRefresh){ 
        // ------- 请求开始，将加载设置为true
        this.isLoading = true;
        this.axios.post(`${this.common.basePath}/exames/exames/list`,this._queryParams(isRefresh)).then((response) => {
          // ---------- 当时加载更多是，就需要累加，否则直接覆盖
          if(!isRefresh) { 
            // ----------- 合并两个数组 ------------
            this.examList.rows = this.examList.rows.concat(response.data.data.rows);

            this.examList.total = response.data.data.total;
          }else{
            // ---------- 查询第一页数据 ---------  
            this.examList = response.data.data;
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
      		this.getExamList(true);
      	}else if(index===1){
      		this.list.pageNum = 1;
      		this.list.status = 2;
      		this.getExamList(true);
      	}else if(index===2){
      		this.list.pageNum = 1;
      		this.list.status = 3;
      		this.getExamList(true);
      	}
      },
  	},

  }
</script>

<style scoped lang="less">
	.exam-list{
		overflow:auto;
		.item{
			padding:10px;
			width:calc(100vw - 4px);
			margin:10px auto;
			border:1px solid #ddd;
			box-sizing:border-box;
			border-radius:4px;
			.item-row{
				line-height:32px;
			}
		}
	}
</style>