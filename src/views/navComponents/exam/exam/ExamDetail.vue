<!-- 
  考试列表-考试详情（已结束）
 -->
<template>
  <div class="exam-detail block-wrap">
    <!-- header -->
    <div class="block-header">
      <van-nav-bar
        title="考试详请"
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
    <div class="block-content">
    	<van-pull-refresh v-model="isRefreshLoading" @refresh="onRefresh">
         <ul v-if="examDetailData" class="content-box">
           <li class="content-box-item">{{'考试主题：'+(examDetailData.theme?examDetailData.theme:"")}}</li>
           <li class="content-box-item">{{'考试要求：'+examDetailData.requirement}}</li>
           <li class="content-box-item">{{'考试时间：'+(common._convertDate(examDetailData.beginTime, 'yyyy/MM/dd hh:mm'))+"~"+(common._convertDate(examDetailData.endTime, 'yyyy/MM/dd hh:mm'))}}</li>
           <li class="content-box-item">
            <span>考试名称：</span>
            <span class="blue" @click="$router.push({name:'examPaper',params:{p_id:examDetailData.testPaper.id}})">{{examDetailData.testPaper.theme}}</span>
           </li>
           <li class="content-box-item">
             <span>参与情况：</span>
              <van-tabs @click="onClick" v-model="active">
                <van-tab title="已考">
                  <ul v-if="examList.total>0" class="test-list">
                    <li class="list-item">
                      <p class="item-col fl item-header">姓名</p>
                      <p class="item-col fl item-header">得分</p>
                      <p class="item-col fl item-header">操作</p>
                    </li>
                    <li v-for="item in examList.rows" class="list-item">
                      <p class="item-col fl">{{item.userName}}</p>
                      <p class="item-col fl">{{item.score}}</p>
                      <p class="item-col fl"><van-button type="primary" size='mini' @click="$router.push({name:'examDetail',params:{}})">查看</van-button></p>
                    </li>
                    <div id="pages">
                      <van-pagination 
                        v-model="list.pageNum" 
                        :total-items="examList.total"
                        :items-per-page="list.pageSize"
                        :show-page-size="3" 
                        force-ellipses
                        @change="changePage"
                      />
                    </div>
                  </ul>
                  <div v-else class="no-data">暂无数据</div>
                </van-tab>
                <van-tab title="未考">
                  <ul v-if="examList.total>0" class="test-list">
                    <li class="list-item">
                      <p class="item-col fl item-header">姓名</p>
                      <p class="item-col fl item-header">得分</p>
                      <p class="item-col fl item-header">操作</p>
                    </li>
                    <li v-for="item in examList.rows" class="list-item">
                      <p class="item-col fl">{{item.userName}}</p>
                      <p class="item-col fl">{{item.score}}</p>
                      <p class="item-col fl"><van-button type="primary" size='mini' @click="$router.push({name:'examDetail',params:{}})">查看</van-button></p>
                    </li>
                    <div id="pages">
                      <van-pagination 
                        v-model="list.pageNum" 
                        :total-items="examList.total"
                        :items-per-page="list.pageSize"
                        :show-page-size="3" 
                        force-ellipses
                        @change="changePage"
                      />
                    </div>
                  </ul>
                  <div v-else class="no-data">暂无数据</div>
                </van-tab>
              </van-tabs>
           </li>
         </ul>
         <div v-else class="no-data">暂无数据</div>
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
  export default {
  	data(){
  		return{
        isLoading:false,//是否加载
        isRefreshLoading: false,//是否刷新加载
        active:0,
        showPopup:false,//弹出层
        showDialog:false,//弹框
        value:null,
        currentDate: new Date(),
        id:this.$route.params.id,
        examDetailData:null,
        examList:{rows:[],total:0},
        list:{
          examId: this.$route.params.id,
          pageSize: 5,
          pageNum: 1,
          status: 1,
        }
  		};
  	},
  	mounted(){
  		/*
        初始化  
       */
      this.getExamDetail();
      this.getExamList();
  	},
  	methods:{
      /*
        刷新
       */
      onRefresh() {
        setTimeout(() => {
          this.list.pageNum = 1;
          this.getExamDetail();
          this.getExamList();
          this.$toast('刷新成功');
          this.isRefreshLoading = false;
        }, 500);
      },

      /*
        切换页码
       */
      changePage(val){
        this.list.pageNum = val;
        this.getExamList();
      },

      /* 
        获取考试详情
      */
      getExamDetail(){
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/exames/exames/details`,{params:{id:this.id}}).then( (response) => {
          this.examDetailData = response.data.data;
          this.isLoading = false;
        }).catch( (error) => {
          this.$toast(error);
          this.isLoading = false;
        });
      },

      /* 
        获取已考/未考列表
      */
      getExamList(){
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/examinees/examinees/list`,{params:this.list}).then( (response) => {
          this.examList = response.data.data;
          this.isLoading = false;
        }).catch( (error) => {
          this.$toast(error);
          this.isLoading = false;
        });
      },
      /*
        点击切换状态
       */
      onClick(index, title){
        if(index===0){
          this.list.pageNum = 1;
          this.list.status = 1;
          this.getExamList();
        }else if(index===1){
          this.list.pageNum = 1;
          this.list.status = 2;
          this.getExamList();
        }
      },

  	},

  }
</script>

<style scoped lang="less">
	.exam-detail{
		.test-list{
      overflow:hidden;
      .list-item{
        width:100%;
        line-height:30px;
        overflow:hidden;
        border-bottom:1px solid #ebedf0;
        .item-col{
          width:33%;
          
        }
        .item-header{
          font-weight:900;
        }
      }
    }
	}
</style>