<!-- 
  网上党课-党课详情
 -->
<template>
  <div class="lectures-detail block-wrap">
    <!-- header -->
    <div class="block-header">
      <van-nav-bar
        title="党课详情"
        left-text="返回"
        left-arrow
        @click-left="$router.push({name:'partyLectures',params:{}})"
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
          <div v-if="detailData">
            <van-row gutter="20" class="content-header">
              <van-col span="24">{{'课程名称：'+detailData.lectureTitle}}</van-col>
              <van-col span="24">
                <p>{{'时长：'+detailData.totalHours+'小时'}}</p>
                <p>{{'学习人数：'+detailData.totalPerson+'人'}}</p>
                <div><p class="fl marr3">评分：</p><van-rate v-model="detailData.score" class="fl marr3" :size="15" readonly/><p class="fl">{{detailData.score+'分'}}</p></div>
               
              </van-col>
            </van-row>
            <van-row class="content-img">
              <img :src="detailData.lectureCovers" alt="" class="fill-width">
            </van-row>
            <van-row class="content-tabs">
              <van-tabs v-model="active" @click="onClick">
                <van-tab title="简介" class="content-tabs-brief padt10">
                  <div class="brief-item">{{'课程名称：'+detailData.lectureTitle}}</div>
                  <div class="brief-item">{{'讲师：'+detailData.lectureDocent}}</div>
                  <div class="brief-item">{{'创建时间：'+common._convertDate(detailData.created, 'yyyy/MM/dd hh:mm:ss')}}</div>
                  <div class="brief-item">{{'简介：'+detailData.lectureIntroduction}}</div>
                </van-tab>
                <van-tab title="课时安排" class="content-tabs-class padt10">
                  <ul v-if="detailData.lPeriodVoList.length>0">
                    <li v-for="(item,index) in detailData.lPeriodVoList" class="class-item">
                      {{"第"+(index+1)+'节课：'+item.periodTitle+' 时长：'+item.periodHours+'小时'}}
                      <van-button type="primary" size="mini" class="fr mart3" @click="$router.push({name:'lectuersLearn',params:{id:detailData.lectureId,learnId:item.periodId,}})">去学习</van-button>
                    </li>
                  </ul>
                  <div v-else class="no-data">暂无课时</div>
                </van-tab>
                <van-tab title="相关评论" class="content-tabs-comment padt10">
                  <ul class="comment-list marb10" v-if="commentList.total>0">
                    <li class="list-item" v-for="item in commentList.rows">
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
                      v-model="comment"
                      type="textarea"
                      placeholder="请输入评论..."
                      rows="5"
                      autosize
                    />
                  </van-cell-group>
                  <van-button type="primary" size="small" class="fr mart10 comment-btn" @click="publishComment(detailData.lectureId)">发表评论</van-button>
                </van-tab>
                <van-tab title="讲述知识点" class="content-tabs-know padt10">
                  <div v-if="detailData.knowList"></div>
                  <div v-else class="no-data">暂无数据</div>
                </van-tab>
              </van-tabs>
            </van-row>
          </div>
          <div v-else class="no-data">暂无数据</div>
        </div>
        <div class="footer" v-if="detailData">
          <div class="footer-box">
            <p class="fl footer-item marr10">
              <van-icon name="like-o" class="marr3 fl mart3" v-if="detailData.isCollect==false" @click.stop="collect(detailData.lectureId)"/>
              <van-icon name="like" class="marr3 fl mart3" v-if="detailData.isCollect==true" @click.stop="collect(detailData.lectureId)"/>
              <span v-if="detailData.isCollect==true" class="fl">收藏</span>
              <span v-if="detailData.isCollect==false" class="fl">未收藏</span>
            </p>
            <p class="fl footer-item marr10">
              <i class="fa fa-thumbs-up marr3" aria-hidden="true" @click.stop="praise(detailData.lectureId)"></i>
              <span class="">{{'点赞数：'+detailData.lectureLike}}</span>
            </p>
            <p class="fl footer-item marr10">
              <i class="fa fa-bug marr3" aria-hidden="true" @click="bug = null;showBug = true;bugId = detailData.lectureId;"></i>
              <span class="">报错</span>
            </p>
          </div>
        </div>
      </van-pull-refresh>
    </div>
    <!-- footer -->
    <div class="block-footer"></div>
    
    <!-- bug的弹框 -->
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
  			id:this.$route.params.id,
        detailData:null,
        comment:null,
        showBug:false,
        bug:null,
        bugId:null,
        commentList:{rows:[],total:0},
  		};
  	},
  	mounted(){
  		/*
  			初始化
  		 */
  		this.getDetail();
  	},
  	methods:{

      /*
        刷新
       */
      onRefresh() {
        setTimeout(() => {
          this.getDetail();
          this.$toast('刷新成功');
          this.isRefreshLoading = false;
        }, 500);
      },

      /*
        点击切换状态
       */
      onClick(index, title){
        if(index===0){
          
        }else if(index===1){
          
        }else if(index===2){
          this.getCommentList();
        }else if(index===3){
          
        }
      },

      /*
      	获取详情
       */
      getDetail(){
        this.isLoading = true;
      	this.axios.patch(`${this.common.basePath}/l_lecture/${this.id}/item`).then( (response) => {
        	this.detailData = response.data.data;
          this.isLoading = false;
				}).catch( (error) => {
					this.$toast(error);
          this.isLoading = false;
				});
      },

      /*
        获取评论列表
       */
      getCommentList(){
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/a_reviewes/list`,{params:{status: '2',fromId:this.detailData.lectureId,fromType:'3'}}).then( (response) => {
          this.commentList = response.data.data;
          this.isLoading = false;
        }).catch( (error) => {
          this.$toast(error);
          this.isLoading = false;
        });
      },

      /*
        收藏党课
       */
      collect(id){
        this.axios.patch(`${this.common.basePath}/a_collection/${id}/2/collect/toggle`).then( (response) => {
          this.getDetail();
        }).catch( (error) => {
          this.$toast(error);
        });
      },

      /*
        点赞党课
       */
      praise(id){
        this.axios.patch(`${this.common.basePath}/l_lecture/${id}/toggle/like`).then( (response) => {
          this.getDetail();
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
        发表党课评论
       */
      publishComment(id){
        if(this.comment == null || this.comment == ''){
          this.$toast('尚未填写评论信息！');
          return;
        }
        let form = {
          commentContent:this.comment,
          fromId:id,
          fromType:"3",
        }
        this.axios.post(`${this.common.basePath}/a_reviewes/review`,form).then( (response) => {
          this.getCommentList();
          this.comment == null;
          this.$toast('评论成功！');
        }).catch( (error) => {
          this.$toast(error);
        });
      },

      
  	},

  }
</script>

<style scoped lang="less">
	.lectures-detail{
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
      .content-img{
        width:100%;
      }
      .content-tabs{
        width:100%;
        .content-tabs-brief{
          .brief-item{
            line-height:30px;
            overflow:hidden;
          }
        }
        .content-tabs-class{
          .class-item{
            line-height:30px;
            border-bottom:1px solid #ebedf0;
            border-top:1px solid #ebedf0;
            margin-bottom:10px;
            width:100%;
            overflow:hidden;
          }
        }
        .content-tabs-comment{
          .comment-list{
            overflow:hidden;
            .list-item{
              line-height:30px;
              overflow:hidden;
              .item-content{
                padding-left:20px;
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
        .content-tabs-know{

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