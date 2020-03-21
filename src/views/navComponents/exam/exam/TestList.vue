<!-- 
  考试列表-考试详情（已结束）-考试试卷-试题列表（更多试题）
 -->
<template>
  <div class="test-list block-wrap" ref="contentWrap">
    <!-- header -->
    <div class="block-header">
      <van-nav-bar
        title="试题列表"
        left-text="返回"
        left-arrow
        @click-left="$router.push({name:'examPaper',params:{}})"
        @click-right="$router.push({name:'home',params:{}})"
        fixed
        border
        >
        <van-icon name="wap-home" slot="right" />
      </van-nav-bar>
    </div>
    <!-- content -->
    <div class="block-content">
      <van-pull-refresh v-model="isRefreshLoading" @refresh="onRefresh" class="content-box">
        <div v-if="testListData.total>0" class="content-box-item">
          <ul class="paper-list">
            <li class="paper-list-item" v-for="item in testListData.rows">
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
              </van-row>
            </li>
          </ul>
        </div>
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
        testListData:{rows:[],total:0},
        id:this.$route.params.t_id,
        analysisData:null,
        list:{
          knowledgeId:this.$route.params.t_id,
          pageNum:1,
          pageSize:5,
        }
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
          if(this.list.pageNum < this.testListData.total / this.list.pageSize){
            this.getTestList(false);
          } else{
            this.$toast('没有更多了');
          }
        }
         
        }  
      }, false)   

      //----- 初始化 ------- 
      this.getTestList(true);
    },
    methods:{
      /*
        刷新
       */
      onRefresh() {
        setTimeout(() => {
          this.list.pageNum = 1;
          this.getTestList(true);
          this.$toast('刷新成功');
          this.isRefreshLoading = false;
        }, 500);
      },

      /*
       * 查询试题列表，请求成功，或者失败，都将滚动状态isLoadMore设置为true
       * @params {bool} isRefresh true为重置数据 false累加数据
       */
      getTestList(isRefresh){ 
        // ------- 请求开始，将加载设置为true
        this.isLoading = true;
        this.axios.post(`${this.common.basePath}/questions/questions/choice/list`,this._queryParams(isRefresh)).then((response) => {
          // ---------- 当时加载更多是，就需要累加，否则直接覆盖
          if(!isRefresh) { 
            // ----------- 合并两个数组 ------------
            this.testListData.rows = this.testListData.rows.concat(response.data.data.rows);

            this.testListData.total = response.data.data.total;
          }else{
            // ---------- 查询第一页数据 ---------  
            this.testListData = response.data.data;
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
        查询试题解析
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
  .test-list{
    overflow: auto;
    .paper-list{
      overflow:hidden;
      .paper-list-item{
        overflow:hidden;
        border:1px solid #ebedf0;
        box-sizing:border-box;
        padding:10px;
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