<!-- 
  网上党课
 -->
<template>
  <div class="party-lectures block-wrap" ref="contentWrap">
    <!-- header -->
    <div class="block-header">
      <van-nav-bar
        title="网上党课"
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
    <!-- 返回顶部 -->
    <div class="back-top" v-if="isShowBackTop" @click="$refs.contentWrap.scrollTop = 0;">
      <i class="fa fa-long-arrow-up" aria-hidden="true"></i>
    </div>
    <!-- content -->
    <div class="block-content">
    	<div class="search">
        <div class="search-date search-item">
          <p class="search-item-title">发布时间：</p>
          <p class="search-item-input">
            <input type="text" v-model="startDate" placeholder="请选择开始时间" @focus="showSData=true">
            <span>~</span>
            <input type="text" v-model="endDate" placeholder="请选择结束时间" @focus="showEData=true">
            <i class="fa fa-times-circle clear" @click="clearDate"></i>
          </p>
        </div>
        <div class="search-teacher search-item">
          <p class="search-item-title">讲师：</p>
          <p class="search-item-input">
            <input type="text" v-model="list.docent" placeholder="请输入讲师">
          </p>
        </div>
        <div class="search-key-btn search-item">
          <p class="search-item-title">党课关键字：</p>
          <p class="search-item-input">
            <input type="text" v-model="list.keyWords" placeholder="请输入党课关键字"  class="fl">
            <van-button type="primary" size="small" class="fr btn" @click="clearData();getLecturesList(true);">搜索</van-button>
          </p>
        </div>
      </div>
      <div class="list mart10" v-if="lecturesList">
        <van-pull-refresh v-model="isRefreshLoading" @refresh="onRefresh">
          <van-row>
            <div v-for="item in lecturesList.rows" class="list-item"  @click="$router.push({name:'lecturesDetail',params:{id:item.lectureId}})">
              <van-col class="fill-width">
                <van-row gutter="20" class="item-row">
                  <van-col span="21">{{item.lectureIntroduction}}</van-col>
                  <van-col span="3">
                    <van-icon name="like-o" class="fr icon" v-if="item.isCollect==false" @click.stop="collect(item.lectureId)"/>
                    <van-icon name="like" class="fr icon" v-if="item.isCollect==true" @click.stop="collect(item.lectureId)"/>
                  </van-col>
                </van-row>
                <van-row class="item-img">
                  <img :src="item.lectureCovers" alt="无法显示">
                </van-row>
                <van-row gutter="20" class="item-row">
                  <van-col span="12">{{'讲师：'+item.lectureDocent}}</van-col>
                  <van-col span="12"><span class="fr">{{common._convertDate(item.created, 'yyyy/MM/dd')}}</span></van-col>
                </van-row>
                <van-row gutter="20" class="item-row">
                  <van-col span="12">
                    <i class="fa fa-user-circle fl icon marr3" aria-hidden="true"></i>
                    <span class="fl">{{'已有'+item.lectureLike+'个人参与'}}</span>
                  </van-col>
                  <van-col span="12">
                    <span class="fr">{{item.lectureLike+'个赞'}}</span>
                    <i class="fa fa-thumbs-up fr icon marr3" aria-hidden="true"></i>
                  </van-col>
                </van-row>
              </van-col>
            </div>
            <div v-if="lecturesList.total===0" class="no-data">暂无数据</div>
          </van-row>
        </van-pull-refresh>
      </div>
    </div>
    <!-- footer -->
    <div class="block-footer"></div>
    
    <!-- 日期的弹出层 -->
    <van-popup v-model="showSData" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        @confirm="onConfirmSDate"
      />
    </van-popup>
    <van-popup v-model="showEData" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        @confirm="onConfirmEDate"
      />
    </van-popup>
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
        showSData:false,//开始时间的弹框
        showEData:false,//结束时间的弹框
        startDate:null,//开始时间的值
        endDate:null,//结束时间的值
        currentDate: new Date(),
        isShowBackTop:false,
        lecturesList:{total: 0, rows: []},
  			list:{
          collect: false,
          lectureOrgCode: sessionStorage.getItem('userData')?JSON.parse(sessionStorage.getItem('userData')).partyOrgCode:null,
          startDate: null,
          endDate: null,
          docent: null,
          keyWords: null,
          pageSize: 5,
          pageNum: 1,
        },
  		};
  	},
  	mounted(){

      // ------ 滚动加载更多 -------
      // 通过$refs获取dom元素
      let box = this.$refs.contentWrap;
      // 监听这个dom的scroll事件
      box.addEventListener('scroll', () => {
        //出现返回顶部按钮
        if(box.scrollTop>=200){
          this.isShowBackTop = true;
        }else{
          this.isShowBackTop = false;
        } 
      // 滑动到底部50的时候操作数据
      if(box.clientHeight + 50 >= box.scrollHeight - box.scrollTop ) {
        // ------ 值为true表示可以再次请求
        if(this.scrollLoadSw){
          this.scrollLoadSw = false;
          if(this.list.pageNum < this.lecturesList.total / this.list.pageSize){
            this.getLecturesList(false);
          } else{
            this.$toast('没有更多了');
          }
        }
         
        }  
      }, false)   

      //----- 初始化 ------- 
      this.getLecturesList(true);
  	},
  	methods:{

      /*
        刷新
       */
      onRefresh() {
        setTimeout(() => {
          this.list.pageNum = 1;
          this.getLecturesList(true);
          this.$toast('刷新成功');
          this.isRefreshLoading = false;
        }, 500);
      },

      /*
       * 查询党课列表，请求成功，或者失败，都将滚动状态isLoadMore设置为true
       * @params {bool} isRefresh true为重置数据 false累加数据
       */
      getLecturesList(isRefresh){ 
        // ------- 请求开始，将加载设置为true
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/l_lecture/list`,{params:this._queryParams(isRefresh)}).then((response) => {
          // ---------- 当时加载更多是，就需要累加，否则直接覆盖
          if(!isRefresh) { 
            // ----------- 合并两个数组 ------------
            this.lecturesList.rows = this.lecturesList.rows.concat(response.data.data.rows);

            this.lecturesList.total = response.data.data.total;
          }else{
            // ---------- 查询第一页数据 ---------  
            this.lecturesList = response.data.data;
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
        确认开始日期
      */
      onConfirmSDate(value){
        this.list.startDate = value.getTime();
        this.startDate = this.common._convertDate(value, 'yyyy/MM/dd');
        this.showSData = false;
      },
      /* 
        确认结束日期
      */
      onConfirmEDate(value){
        this.list.endDate = value.getTime();
        this.endDate = this.common._convertDate(value, 'yyyy/MM/dd');
        this.showEData = false;
      },

      /*
        清空关键字、讲师数据
       */
      clearData(){
        this.list.keyWords==='' ? this.list.keyWords = null : this.list.keyWords;
        this.list.docent==='' ? this.list.docent = null : this.list.docent;
        this.list.startDate==='' ? this.list.startDate = null : this.list.startDate;
        this.list.endDate==='' ? this.list.endDate = null : this.list.endDate;
      },
      /*
        清除发布时间
       */
      clearDate(){
        this.startDate = null;
        this.endDate = null;
        this.list.startDate = null;
        this.list.endDate = null;
      },

      /*
        收藏党课
       */
      collect(id){
        this.axios.patch(`${this.common.basePath}/a_collection/${id}/2/collect/toggle`).then( (response) => {
          this.getLecturesList(true);
        }).catch( (error) => {
          this.$toast(error);
        });
      },
  	},

  }
</script>

<style scoped lang="less">
	.party-lectures{
    overflow:auto;
		.search{
      .search-date{
        .clear{
          color:#666;
        }
      }
      .search-key-btn{
        .search-item-input{
          input{
            width:50%;
          }
          .btn{
            border-radius:4px;
          }
        }
      }
      .search-item{
        line-height:30px;
        overflow:hidden;
        padding:0 10px;
        .search-item-title{
          color:#333;
          font-weight:300;
        }
        .search-item-input{

        }
      }
    }
    .list{
      .list-item{
        margin:10px auto 10px;
        width:98%;
        padding:10px;
        overflow:hidden;
        background:#f7f7f7;
        box-sizing:border-box;
        border-radius:5px;
        .item-row{
          width:100%;
          line-height:32px;
          .icon{line-height:32px;}
        }
        .item-img{
          width:100%;
          img{
            width:98%;
            margin:5px auto;
            height:200px;
          }
        }
      }
    }
	}
</style>