<!-- 
  网上党课-党课详情-党课学习
 -->
<template>
  <div class="lectuers-learn block-wrap">
    <!-- header -->
    <div class="block-header">
      <van-nav-bar
        title="学习党课"
        left-text="返回"
        left-arrow
        @click-left="$router.push({name:'lecturesDetail',params:{}})"
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
        <div class="header"></div>
        <div class="content">
          <div v-if="learnData">
            <van-row gutter="20" class="content-header">
              <van-col span="16">{{learnData.lPeriodVoList[0].periodTitle+'的基础'}}</van-col>
              <van-col span="8">{{'时长：'+learnData.lPeriodVoList[0].periodHours+'小时'}}</van-col>
              <van-col span="24">
                <!-- 
                  poster属性用于指定一张图片，在当前视频数据无效时显示（预览图）
                  preload属性有三个可选择的值：none、metadata（部分预加载）、auto，默认为auto。
                  Autoplay属性用于设置视频是否自动播放，是一个布尔属性
                  loop属性用于指定视频是否循环播放，同样是一个布尔属性。 
                -->
                <video width="100%" height="200" :src="learnData.lPeriodVoList[0].videoAddress" poster="../../../../assets/img/no-video.jpg" autoplay="autoplay" preload="auto" loop="loop"></video>
              </van-col>
            </van-row>
            <van-row class="content-tabs">
              <van-tabs v-model="active" @click="onClick">
                <van-tab title="相关习题" class="content-tabs-exercises padt10">
                  <ul v-if="learnExercisesData.total>0">
                    <li v-for="(item,index) in learnExercisesData.rows" class="exercises-item">
                      <ul>
                        {{(index+1)+'. '+item.content+'？'}}
                        <li class="padl10" v-for="(childItem,index) in item.answerList">{{common.exerciseOptions(index+1)+'. '+childItem.content}}</li>
                      </ul>
                      <van-row gutter="20" class="">
                        <van-col span="7">{{'题型：'+(item.type===2?'多选题':'单选题')}}</van-col>
                        <van-col span="7">{{'来自：'+item.createName}}</van-col>
                        <van-col span="6">{{'分值：'+item.score+'分'}}</van-col>
                        <van-col span="4"><van-button type="primary" size="mini" class="fr mart3" @click="analysisBox = !analysisBox">解析</van-button></van-col>
                      </van-row>
                      <ul class="pad10 analysis-box" v-if='analysisBox'>
                        <li>{{'答案解析：'+item.analysis}}</li>
                        <li>
                          <p class="fl">正确答案：</p>
                          <p class="fl" v-for="(childItem,index) in item.answerList"><span v-if="childItem.exactness===true">{{common.exerciseOptions(index+1)+'，'}}</span></p>
                        </li>
                      </ul>
                    </li>
                    <div>
                      <van-pagination 
                        v-model="exercises.pageNum" 
                        :page-count="learnExercisesData.total"
                        mode="simple"
                        prev-text="上一题"
                        next-text="下一题"
                        @change="changePage"
                      />
                    </div>
                  </ul>
                  <div v-else class="no-data">暂无数据</div>
                </van-tab>
                <van-tab title="问答" class="content-tabs-comment padt10">
                  <ul class="comment-list marb10" v-if="learnQuestionsAnswersData">
                    <li class="list-item" v-for="item in learnQuestionsAnswersData">
                      <p class="item-info">
                        <i class="fa fa-user-circle marr3" aria-hidden="true"></i>
                        {{item.content+' 创建人：'+item.creatorName}}
                        <i class="fa fa-edit blue" aria-hidden="true" v-if="userId===item.creator" @click="question = null;  showEditQuestion = true;question = item.content;questionId = item.id"></i>
                      </p>
                      <div v-for="childItem in item.laList" v-if="oneLaList">
                        <p class="item-content">
                          &nbsp;&nbsp;{{'最新问答/创建人：'+childItem.creatorName}}
                          <i class="fa fa-edit blue" aria-hidden="true" v-if="userId===childItem.creator" @click="answer_ = null;  showEditAnswer_ = true;answer_ = childItem.content;answer_Id = item.id"></i>
                        </p>
                        <p class="item-content">&nbsp;&nbsp;{{childItem.content}}</p>
                      </div>
                      <div v-for="val in learnLaListData" v-if="moreLaList">
                        <p class="item-content">&nbsp;&nbsp;{{'最新问答/创建人：'+val.creatorName}}</p>
                        <p class="item-content">&nbsp;&nbsp;{{val.content}}</p>
                      </div>
                      <div class="item-footer">
                        <p class="fl">&nbsp;&nbsp;&nbsp;&nbsp;{{item.answerNum+'回答/'}}<span class="click" @click="getLearnQuestionsAnswersMore(item.id);moreLaList=true;oneLaList=false;">查看更多</span>/<span class="click" @click="answer = null;showAnswer = true;answerId=item.id">解答</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{{item.browseNum+'浏览'}}</span></p>
                        <p class="fr marr3">{{item.dayNum+'天前'}}</p>
                      </div>
                    </li>
                  </ul>
                  <div v-else class="no-data marb10">暂无问答</div>

                  <van-cell-group class="comment-box">
                    <van-field
                      v-model="questions_"
                      type="textarea"
                      placeholder="请提问..."
                      rows="5"
                      autosize
                    />
                  </van-cell-group>
                  <van-button type="primary" size="small" class="fr mart10 comment-btn" @click="publishQuestions(learnData.lPeriodVoList[0].periodId)">提交问题</van-button>
                </van-tab>
                <van-tab title="评论" class="content-tabs-comment padt10">
                  <ul class="comment-list marb10" v-if="learnCommentData.total>0">
                    <li class="list-item" v-for="item in learnCommentData.rows">
                      <p class="item-info">
                        <i class="fa fa-user-circle marr3" aria-hidden="true"></i>
                        {{item.creator+' '+common._convertDate(item.createTime, 'yyyy/MM/dd hh:mm:ss')}}
                      </p>
                      <p class="item-content">&nbsp;&nbsp;{{item.commentContent}}</p>
                    </li>
                  </ul>
                  <div v-else class="no-data marb10">暂无评论</div>

                  <van-cell-group class="comment-box">
                    <van-field
                      v-model="comment_"
                      type="textarea"
                      placeholder="请输入评论..."
                      rows="5"
                      autosize
                    />
                  </van-cell-group>
                  <van-button type="primary" size="small" class="fr mart10 comment-btn" @click="publishComment(learnData.lectureId)">发表评论</van-button>
                </van-tab>
                <van-tab title="笔记" class="content-tabs-comment padt10">
                  <div class="switch">
                    <span class="fr marr3 switch-blue" v-if="switchBlue">只看我的</span>
                    <span class="fr marr3 switch-gray" v-if="switchGray">只看我的</span>
                    <van-switch v-model="checked" size="20px" class="fr marr3" @change="switchChange"/>
                  </div>
                  <ul class="comment-list marb10" v-if="learnNoteData">
                    <li class="list-item" v-for="item in learnNoteData">
                      <p class="item-info">
                        <i class="fa fa-user-circle marr3" aria-hidden="true"></i>
                        {{item.createName+' '+common._convertDate(item.createTime, 'yyyy/MM/dd hh:mm:ss')}}
                        <i class="fa fa-edit blue" aria-hidden="true" v-if="userId===item.creator" @click="notes = null; getLearnNoteMore(item.id); showEditNotes = true;"></i>
                      </p>
                      <p class="item-content">&nbsp;&nbsp;{{item.content}}</p>
                      <div class="item-footer">
                        <p class="fl">&nbsp;&nbsp;&nbsp;&nbsp;<span class="click" @click="getLearnNoteMore(item.id);">查看全文</span></p>
                        <p class="fr marr3">{{item.dayNum+'天前'}}</p>
                      </div>
                    </li>
                  </ul>
                  <div v-else class="no-data marb10">暂无笔记</div>

                  <van-cell-group class="comment-box">
                    <van-field
                      v-model="note_"
                      type="textarea"
                      placeholder="请输入内容..."
                      rows="5"
                      autosize
                    />
                  </van-cell-group>
                  <van-button type="primary" size="small" class="fr mart10 comment-btn" @click="publishNote(learnData.lPeriodVoList[0].periodId)">提交笔记</van-button>
                </van-tab>
              </van-tabs>
            </van-row>
          </div>
          <div v-else class="no-data">暂无数据</div>
        </div>
        <div class="footer" v-if="learnData">
          <div class="footer-box">
            <p class="fl footer-item marr10">
              <van-icon name="like-o" class="marr3 fl mart3" v-if="learnData.isCollect==false" @click.stop="collect(learnData.lectureId)"/>
              <van-icon name="like" class="marr3 fl mart3" v-if="learnData.isCollect==true" @click.stop="collect(learnData.lectureId)"/>
              <span v-if="learnData.isCollect==true" class="fl">收藏</span>
              <span v-if="learnData.isCollect==false" class="fl">未收藏</span>
            </p>
            <p class="fl footer-item marr10">
              <i class="fa fa-thumbs-up marr3" aria-hidden="true" @click.stop="praise(learnData.lectureId)"></i>
              <span class="">{{'点赞数：'+learnData.lectureLike}}</span>
            </p>
            <p class="fl footer-item marr10">
              <i class="fa fa-bug marr3" aria-hidden="true" @click="bug = null;showBug = true;bugId = learnData.lectureId;"></i>
              <span class="">报错</span>
            </p>
          </div>
        </div>
      </van-pull-refresh>
    </div>
    <!-- footer -->
    <div class="block-footer"></div>

    <!-- 提交报错弹框 -->
    <van-dialog
      v-model="showBug"
      @confirm="postBug"
      show-cancel-button
      >
      <h4><i class="fa fa-bug marr3" aria-hidden="true"></i><span>报错</span></h4>
      <van-field
        v-model="bug"
        type="textarea"
        rows="5"
        autosize
        placeholder="请填写报错内容..."
      />
    </van-dialog>
    <!-- 提交答案弹框 -->
    <van-dialog
      v-model="showAnswer"
      @confirm="postAnswer"
      show-cancel-button
      >
      <h4><i class="fa fa-quora marr3" aria-hidden="true"></i><span>答案</span></h4>
      <van-field
        v-model="answer"
        type="textarea"
        rows="5"
        autosize
        placeholder="请填写内容..."
      />
    </van-dialog>
    <!-- 修改笔记弹框 -->
    <van-dialog
      v-model="showEditNotes"
      @confirm="editNotes"
      confirm-button-text = '修改'
      show-cancel-button
      >
      <h4><i class="fa fa-paint-brush marr3" aria-hidden="true"></i><span>笔记</span></h4>
      <van-field
        v-model="notes"
        type="textarea"
        rows="5"
        autosize
        placeholder="请填写内容..."
      />
    </van-dialog>
    <!-- 修改问题弹框 -->
    <van-dialog
      v-model="showEditQuestion"
      @confirm="editQuestion"
      confirm-button-text = '修改'
      show-cancel-button
      >
      <h4><i class="fa fa-question-circle marr3" aria-hidden="true"></i><span>问题</span></h4>
      <van-field
        v-model="question"
        type="textarea"
        rows="5"
        autosize
        placeholder="请填写内容..."
      />
    </van-dialog>
    <!-- 修改回答弹框 -->
    <van-dialog
      v-model="showEditAnswer_"
      @confirm="editAnswer_"
      confirm-button-text = '修改'
      show-cancel-button
      >
      <h4><i class="fa fa-quora marr3" aria-hidden="true"></i><span>回答</span></h4>
      <van-field
        v-model="answer_"
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
        checked:false,
        active:0,
  			id:this.$route.params.id,
        learnId:this.$route.params.learnId,

        learnData:null,
        learnExercisesData:{rows:[],total:0},
        learnQuestionsAnswersData:null,
        learnLaListData:null,
        learnCommentData:{rows:[],total:0},
        learnNoteData:null,
        learnNoteMoreData:null,

        exercises:{
          id:this.$route.params.learnId,
          pageSize:1,
          pageNum:1,
        },
        questions:{
          periodId:this.$route.params.learnId,
        },
        comment:{
          fromId: this.$route.params.id,
          fromType: '3',
        },
        note:{
          periodId: this.$route.params.learnId,
          type: '1',
        },

        analysisBox:false,
        oneLaList:true,
        moreLaList:false,
        switchBlue:false,
        switchGray:true,

        showBug:false,
        bug:null,
        bugId:null,

        showAnswer:false,
        answer:null,
        answerId:null,
        // orgCode:sessionStorage.getItem('userData')?JSON.parse(sessionStorage.getItem('userData')).orgCode:null,
        userId:sessionStorage.getItem('userData')?JSON.parse(sessionStorage.getItem('userData')).userId:null,

        showEditNotes:false,
        notes:null,
        notesId:null,

        showEditQuestion:false,
        question:null,
        questionId:null,

        showEditAnswer_:false,
        answer_:null,
        answer_Id:null,

        commentList:{rows:[],total:0},
        comment_:null,
        questions_:null,
        note_:null,
  		};
  	},
  	mounted(){
  		/*
  			初始化
  		 */
  		this.getLearn();
      this.getLearnExercises();
  	},
  	methods:{

      /*
        刷新
       */
      onRefresh() {
        setTimeout(() => {
          this.exercises.pageNum = 1;
          this.getLearn();
          this.getLearnExercises();
          this.$toast('刷新成功');
          this.isRefreshLoading = false;
        }, 500);
      },

      /*
        切换页码
       */
      changePage(val){
        this.exercises.pageNum = val;
        this.getLearnExercises();
      },

      /*
        笔记开关的切换
       */
      switchChange(val){
        console.log(this.note)
        if(val === true){
          this.note.type ='0';
          this.switchBlue=true;this.switchGray=false;
          this.getLearnNote();
        }else{
          this.note.type = '1';
          this.getLearnNote();
          this.switchBlue=false;this.switchGray=true;
        }  
      },

      /*
        点击切换状态
       */
      onClick(index, title){
        if(index===0){
          this.getLearnExercises();
        }else if(index===1){
          this.getLearnQuestionsAnswers();
          this.moreLaList=false;this.oneLaList=true;
        }else if(index===2){
          this.getLearnComment();
        }else if(index===3){
          this.switchBlue=false;this.switchGray=true;
          this.getLearnNote();
        }
      },

      /*
      	获取党课学习
       */
      getLearn(){
        this.isLoading = true;
      	this.axios.patch(`${this.common.basePath}/l_lecture/${this.id}/item/${this.learnId}/periodItem`).then( (response) => {
        	this.learnData = response.data.data;
          this.isLoading = false;
				}).catch( (error) => {
					this.$toast(error);
          this.isLoading = false;
				});
      },

      /*
        获取党课学习-相关习题
       */
      getLearnExercises(){
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/l_lecture/question/list`,{params:this.exercises}).then( (response) => {
          this.learnExercisesData = response.data.data;
          this.isLoading = false;
        }).catch( (error) => {
          this.$toast(error);
          this.isLoading = false;
        });
      },

      /*
        获取党课学习-问答
       */
      getLearnQuestionsAnswers(){
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/l_questions/l_questions/list`,{params:this.questions}).then( (response) => {
          this.learnQuestionsAnswersData = response.data.data;
          this.isLoading = false;
        }).catch( (error) => {
          this.$toast(error);
          this.isLoading = false;
        });
      },
      /*
        获取党课学习-问答-查看更多
       */
      getLearnQuestionsAnswersMore(id){
        this.axios.get(`${this.common.basePath}l_questions/l_questions/details`,{params:{id:id,}}).then( (response) => {
          this.learnLaListData = response.data.data.laList;
        }).catch( (error) => {
          this.$toast(error);
        });
      },

      /*
        获取党课学习-评论
       */
      getLearnComment(){
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/a_reviewes/list`,{params:this.comment}).then( (response) => {
          this.learnCommentData = response.data.data;
          this.isLoading = false;
        }).catch( (error) => {
          this.$toast(error);
          this.isLoading = false;
        });
      },

      /*
        获取党课学习-笔记
       */
      getLearnNote(){
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/l_note/choice/list`,{params:this.note}).then( (response) => {
          this.learnNoteData = response.data.data;
          this.isLoading = false;
        }).catch( (error) => {
          this.$toast(error);
          this.isLoading = false;
        });
      },
      /*
        获取党课学习-笔记-查看全文
       */
      getLearnNoteMore(id){
        this.axios.get(`${this.common.basePath}/l_note/l_note/details`,{params:{id:id}}).then( (response) => {
          this.learnNoteMoreData = response.data.data;
          this.notes = response.data.data.content;
        }).catch( (error) => {
          this.$toast(error);
        });
      },


      /*
        收藏党课
       */
      collect(id){
        this.axios.patch(`${this.common.basePath}/a_collection/${id}/2/collect/toggle`).then( (response) => {
          this.getLearn();
        }).catch( (error) => {
          this.$toast(error);
        });
      },

      /*
        点赞党课
       */
      praise(id){
        this.axios.patch(`${this.common.basePath}/l_lecture/${id}/toggle/like`).then( (response) => {
          this.getLearn();
        }).catch( (error) => {
          this.$toast(error);
        });
      },

      /*
        提交党课报错
       */
      postBug() {
        let form = {
          errorContent:this.bug,
          fromId:this.bugId,
          fromType:"3",
        }
        this.axios.post(`${this.common.basePath}/a_errors/error`,form).then( (response) => {
          this.$toast('报错成功！');
        }).catch( (error) => {
          this.$toast(error);
        });
      },

      /*
        提交答案
       */
      postAnswer() {
        let form = {
          content:this.answer,
          lQuestionId:this.answerId,
        }
        this.axios.post(`${this.common.basePath}/l_answers/l_answers/add`,form).then( (response) => {
          this.getLearnQuestionsAnswers();
          this.$toast('解答成功！');
        }).catch( (error) => {
          this.$toast(error);
        });
      },

      /*
        提交问题
       */
      publishQuestions(id){
        if(this.questions_ == null || this.questions_ == ''){
          this.$toast('尚未提问！');
          return;
        }
        let form = {
          content:this.questions_,
          periodId:id,
        }
        this.axios.post(`${this.common.basePath}/l_questions/l_questions/add`,form).then( (response) => {
          this.getLearnQuestionsAnswers();
          this.questions_ = null;
          this.$toast('提问成功！');
        }).catch( (error) => {
          this.$toast(error);
        });
      },
      /*
        修改自己的问题
       */
      editQuestion(){
        if(this.question == null || this.question == ''){
          this.$toast('内容不能为空！');
          return;
        }
        let form = {
          content:this.question,
          lQuestionId:this.questionId,
        }
        this.axios.patch(`${this.common.basePath}/l_questions/l_questions/update/${this.questionId}`,form).then( (response) => {
          this.getLearnQuestionsAnswers();
          this.$toast('修改问题成功！');
        }).catch( (error) => {
          this.$toast(error);
        });
      },
      /*
        修改自己的回答
       */
      editAnswer_(){
        if(this.answer_ == null || this.answer_ == ''){
          this.$toast('内容不能为空！');
          return;
        }
        let form = {
          content:this.answer_,
          lQuestionId:this.answer_Id,
        }
        this.axios.patch(`${this.common.basePath}/l_answers/l_answers/update/${this.answer_Id}`,form).then( (response) => {
          this.getLearnQuestionsAnswers();
          this.$toast('修改回答成功！');
        }).catch( (error) => {
          this.$toast(error);
        });
      },

      /*
        发表评论
       */
      publishComment(id){
        if(this.comment_ == null || this.comment_ == ''){
          this.$toast('尚未填写评论信息！');
          return;
        }
        let form = {
          commentContent:this.comment_,
          fromId:id,
          fromType:"3",
        }
        this.axios.post(`${this.common.basePath}/a_reviewes/review`,form).then( (response) => {
          this.getLearnComment();
          this.comment_ = null;
          this.$toast('评论成功！');
        }).catch( (error) => {
          this.$toast(error);
        });
      },

      /*
        提交笔记
       */
      publishNote(id){
        if(this.note_ == null || this.note_ == ''){
          this.$toast('尚未写笔记！');
          return;
        }
        let form = {
          content:this.note_,
          periodId:id,
        }
        this.axios.post(`${this.common.basePath}/l_note/l_note/add`,form).then( (response) => {
          this.getLearnNote();
          this.note_ = null;
          this.$toast('提交笔记成功！');
        }).catch( (error) => {
          this.$toast(error);
        });
      },
      /*
        修改自己当天内提交的笔记
       */
      editNotes(){
        if(this.notes == null || this.notes == ''){
          this.$toast('笔记不能为空！');
          return;
        }
        let form = {
          content:this.notes,
          periodId:this.learnNoteMoreData.periodId,
        }
        this.axios.patch(`${this.common.basePath}/l_note/l_note/update/${this.learnNoteMoreData.id}`,form).then( (response) => {
          this.getLearnNote();
          this.$toast('修改笔记成功！');
        }).catch( (error) => {
          this.$toast(error);
        });
      },
  	},

  }
</script>

<style scoped lang="less">
	.lectuers-learn{
		.header{
      
    }
    .content{
      overflow:hidden;
      width:98%;
      margin:0px auto 10px;
      padding:10px;
      box-sizing:border-box;
      .content-header{
        width:100%;
        line-height:30px;
      }
      .content-tabs{
        .switch{
          height:28px;
          .switch-blue{
            color: #409EFF;
          }
          .switch-gray{
            color: #666;
          }
        }
        width:100%;
        .content-tabs-exercises{
          overflow:hidden;
          .exercises-item{
            line-height:30px;
            border-bottom:1px solid #ebedf0;
            border-top:1px solid #ebedf0;
            margin-bottom:10px;
            width:100%;
            overflow:hidden;
            .analysis-box{
              border:1px solid #ebedf0;
              box-sizing:border-box;
              overflow:hidden;
              width:90%;
              margin:10px auto 10px;
              border-radius:4px;
            }
          }
        }
        .content-tabs-comment{
          .comment-list{
            overflow:hidden;
            border-bottom:1px solid #ebedf0;
            border-top:1px solid #ebedf0;
            .list-item{
              line-height:30px;
              .item-content{
                padding-left:20px;
              }
              .item-footer{
                overflow:hidden;
                color: #9E9E9E;
                .click{
                  cursor:pointer;
                  color: #409EFF;
                }
              }
            }
          }
          .comment-box{
            .van-cell.van-field{
              background:#f7f7f7;
            }
          }
          .comment-btn{
            margin-right:10px;
          }
        }
      }
    }
    .footer{
      overflow:hidden;
      margin-bottom:20px;
      .footer-box{
        width:240px;
        margin:0 auto;
        .footer-item{
          overflow:hidden;
        }
      }
      
    }
	}
</style>