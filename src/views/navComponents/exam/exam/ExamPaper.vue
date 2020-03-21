<!-- 
  考试列表-考试详情（已结束）-考试试卷
 -->
<template>
  <div class="exam-paper block-wrap">
    <!-- header -->
    <div class="block-header">
      <van-nav-bar
        title="考试试卷"
        left-text="返回"
        left-arrow
        @click-left="$router.push({name:'examDetail',params:{}})"
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
        <ul v-if="examPaperDetailPaperData" class="content-box">
          <li class="content-box-item">{{'考试主题：'+(examPaperDetailPaperData.theme?examPaperDetailPaperData.theme:"")}}</li>
          <li class="content-box-item">{{'考试要求：'+examPaperDetailPaperData.requirement}}</li>
          <li class="content-box-item">
            试题列表：
            <ul class="paper-list">
              <li class="paper-list-item" v-if="examPaperDetailPaperData.questionsList.length>0" v-for="item in examPaperDetailPaperData.questionsList">
                <p class="question-header">{{item.content}}</p>
                <div class="question-content">
                  <ul class="content-options fl">
                    <li v-for="(childItem,index) in item.answerList">{{common.exerciseOptions(index+1)+'. '+childItem.content}}</li>
                  </ul>
                  <img :src="item.picture" alt="" width="100px" class="content-img fr marr3">
                </div>
                <van-row gutter="20" class="question-footer">
                  <van-col span="8">{{"题型："+(item.type===2?'多选题':'单选题')}}</van-col>
                  <van-col span="8">{{'创建者：'+item.createName}}</van-col>
                  <van-col span="8">{{'分值：'+item.score}}</van-col>
                  <van-col span="12"><van-button type="default" size='mini' @click="analysisData = null;getAnalysis(item.id);showPopup = true;">查看解析</van-button></van-col>
                  <van-col span="12"><van-button type="primary" size='mini' @click="$router.push({name:'testList',params:{t_id:item.knowledgeId}})">查看更多</van-button></van-col>
                </van-row>
              </li>
              <div v-else class="no-data">暂无数据</div>
            </ul>
          </li>
        </ul>
        <div v-else class="no-data">暂无数据</div>
      </van-pull-refresh>
      
    </div>
    <!-- footer -->
    <div class="block-footer"></div>
    
    <!-- 弹出层 -->
    <van-popup v-model="showPopup" position="bottom" :overlay="false">
      <div class="analysis-popup">
        <p class="popup-title"><i class="fa fa-quora fl marr3 mart3" aria-hidden="true"></i><span class="fl">试题解析</span><van-icon name="close" class="fr marr3" @click="analysisData = null;showPopup = false;"/></p>
        <div class="popup-content">
          {{' '+(analysisData?analysisData.analysis:'暂无解析')}}
        </div>
      </div>
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
        examPaperDetailPaperData:null,
        id:this.$route.params.p_id,
        analysisData:null,
  		};
  	},
  	mounted(){
  		/*
        初始化  
       */
      this.getExamPaperDetail();
  	},
  	methods:{
      /*
        刷新
       */
      onRefresh() {
        setTimeout(() => {
          this.getExamPaperDetail();
          this.$toast('刷新成功');
          this.isRefreshLoading = false;
        }, 500);
      },

      /* 
        获取试卷详情
      */
      getExamPaperDetail(){
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/test_papers/test_papers/details`,{params:{id:this.id}}).then( (response) => {
          this.examPaperDetailPaperData = response.data.data;
          this.isLoading = false;
        }).catch( (error) => {
          this.$toast(error);
          this.isLoading = false;
        });
      },
      /* 
        查询试卷详情-试题解析
      */
      getAnalysis(id){
        this.axios.get(`${this.common.basePath}/questions/questions/details`,{params:{id:id}}).then( (response) => {
          this.analysisData = response.data.data;
        }).catch( (error) => {
          this.$toast(error);
        });
      },
  	},

  }
</script>

<style scoped lang="less">
	.exam-paper{
		.paper-list{
      overflow:hidden;
      .paper-list-item{
        overflow:hidden;
        border:1px solid #ebedf0;
        box-sizing:border-box;
        padding:10px;
        margin-left:10px;
        margin-bottom:10px;
        .question-header{
          overflow:hidden;
        }
        .question-content{
          overflow:hidden;
          .content-options{

          }
          .content-img{

          }
        }
        .question-footer{
          overflow:hidden;
        }
      }
    }
    .analysis-popup{
      border-top:1px solid #ccc;
      overflow:hidden;
      .popup-title{
        overflow:hidden;
        padding: 10px;
        border-bottom: 1px solid #ccc;
      }
      .popup-content{
        min-height:200px;
        padding:10px 20px;
        box-sizing:border-box;
      }
    }
	}
</style>