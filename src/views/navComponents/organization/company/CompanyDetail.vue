<!-- 
  我的组织-我的企业-列表-详情
 -->
<template>
  <div class="company-detail block-wrap" ref="contentWrap">
    <!-- header -->
    <div class="block-header">
      <van-nav-bar
        title="企业部门详情"
        left-text="返回"
        left-arrow
        @click-left="$router.push({name:'companyOrganization',params:{}})"
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
        <van-tabs v-model="active" @click="onClick" ref="tabs">
          <van-tab title="组织简介">
            <div class="content-box brief" v-if="organizationBrief">
              <div class="content-box-item marb10">
                <h4 class="title">1. 公司/部门名称</h4>
                <p class="content">{{organizationBrief.name?organizationBrief.name:'暂无'}}</p>
              </div>
              <div class="content-box-item marb10">
                <h4 class="title">2. 公司头像</h4>
                <p class="content">
                  <img :src="organizationBrief.photo" alt="暂无头像" class="head-img" />
                </p>
              </div>
              <div class="content-box-item marb10">
                <h4 class="title">3. 成立时间</h4>
                <p class="content">{{common._convertDate(organizationBrief.buildTime.date_time, 'yyyy/MM/dd hh:mm:ss')}}</p>
              </div>
              <div class="content-box-item marb10">
                <h4 class="title">4. 公司/部门描述</h4>
                <p class="content">{{organizationBrief.description?organizationBrief.description:'暂无'}}</p>
              </div>
              <div class="content-box-item marb10">
                <h4 class="title">5. 预设团组织</h4>
                <p class="content">{{organizationBrief.groupIdName.name?organizationBrief.groupIdName.name:'暂无'}}</p>
              </div>
              <div class="content-box-item marb10">
                <h4 class="title">6. 预设工会组织</h4>
                <p class="content">{{organizationBrief.guildIdName.name?organizationBrief.guildIdName.name:'暂无'}}</p>
              </div>
              <div class="content-box-item marb10">
                <h4 class="title">7. 地址</h4>
                <p class="content">{{organizationBrief.address?organizationBrief.address:'暂无'}}</p>
              </div>
              <div class="content-box-item marb10">
                <h4 class="title">8. 邮箱</h4>
                <p class="content">{{organizationBrief.mailbox?organizationBrief.mailbox:'暂无'}}</p>
              </div>
              <div class="content-box-item marb10">
                <h4 class="title">9. 电话</h4>
                <p class="content">{{organizationBrief.phone?organizationBrief.phone:'暂无'}}</p>
              </div>
            </div>
            <div v-else class="no-data">暂无数据</div>
          </van-tab>
          <van-tab title="企业花名册">
            <div class="content-box roster" v-if="businessRoster.total > 0 ">
              <div v-for="item in businessRoster.rows">
                <ul class="content-box-item roster-item">
                  <li>
                    <span v-if="item.account">{{'账号：'+item.account}}</span>
                    <span v-else>账号：暂无</span>
                  </li>
                  <van-row gutter="20">
                    <van-col span="12">
                      <span v-if="item.name">{{'姓名：'+item.name}}</span>
                      <span v-else>姓名：暂无</span>
                    </van-col>
                    <van-col span="12">
                      <span v-if="item.sex">{{'性别：'+common.matchingTables(tables[0].list,item.sex)}}</span>
                      <span v-else>性别：暂无</span>
                    </van-col>
                  </van-row>
                  <van-row gutter="20">
                    <van-col span="12">
                      <span v-if="item.nation">{{'民族：'+common.matchingTables(tables[1].list,item.nation)}}</span>
                      <span v-else>民族：暂无</span>
                    </van-col>
                    <van-col span="12">
                      <span v-if="item.nationPlace">{{'籍贯：'+common.matchingTables(tables[8].list,item.nationPlace)}}</span>
                      <span v-else>籍贯：暂无</span>
                    </van-col>
                  </van-row>
                  <van-row gutter="20">
                    <van-col span="12">
                      <span v-if="item.borthday">{{'出生年月：'+item.borthday}}</span>
                      <span v-else>出生年月：暂无</span>
                    </van-col>
                    <van-col span="12">
                      <span v-if="item.education">{{'文化程度：'+common.matchingTables(tables[2].list,item.education)}}</span>
                      <span v-else>文化程度：暂无</span>
                    </van-col>
                  </van-row>
                  <van-row gutter="20">
                    <van-col span="12">
                      <span v-if="item.genenalPartyBranchgName">{{'党内职务：'+item.genenalPartyBranchgName}}</span>
                      <span v-else>党内职务：暂无</span>
                    </van-col>
                    <van-col span="12">
                      <span v-if="item.genenalPartyBranchgName">{{'行政职务：'+item.genenalPartyBranchgName}}</span>
                      <span v-else>行政职务：暂无</span>
                    </van-col>
                  </van-row>
                  <van-row gutter="20">
                    <van-col span="12">
                      <span v-if="item.genenalPartyBranchgName">{{'专业技术职称：'+item.genenalPartyBranchgName}}</span>
                      <span v-else>专业技术职称：暂无</span>
                    </van-col>
                    <van-col span="12">
                      <span v-if="item.workBorth">{{'参加工作时间：'+common._convertDate(item.workBorth.date_time , 'yyyy/MM/dd')}}</span>
                      <span v-else>参加工作时间：暂无</span>
                    </van-col>
                  </van-row>
                  <van-row gutter="20">
                    <van-col span="12">
                      <span v-if="item.partyBorth">{{'入党时间：'+common._convertDate(item.partyBorth.date_time , 'yyyy/MM/dd')}}</span>
                      <span v-else>入党时间：暂无</span>
                    </van-col>
                    <van-col span="12">
                      <i class="fa fa-eye view-detail" aria-hidden="true" @click='showPopup = true;getUserBaseInfo(item.userId);'></i>
                    </van-col>
                  </van-row>
                </ul>
              </div>
            </div>
            <div v-else class="no-data">暂无数据</div>
          </van-tab>
          <van-tab title="班子管理">
            <div class="content-box team" v-if="teamManagement">
              <div v-for="item in teamManagement" class="team-item">
                <van-row gutter="20" class="team-item-top">
                  <van-col span="6">
                    <img v-if="item.picture" :src="item.picture" alt="无法显示" class="fill-width head-img">
                    <span v-else>暂无头像</span>
                  </van-col>
                  <van-col span="18">
                    <span class="name">{{item.name?item.name:'暂无'}}</span>
                    <span class="position">{{common.matchingCTables(tables[6].list,item.positionName)}}</span>
                  </van-col>
                </van-row>
                <van-row class="team-item-bottom">{{item.description?item.description:'暂无'}}</van-row>
              </div>
            </div>
            <div v-else class="no-data">暂无数据</div>  
          </van-tab>
        </van-tabs> 
      </van-pull-refresh>
    </div>
    <!-- footer -->
    <div class="block-footer"></div>
    
    <!-- 弹出层 -->
    <van-popup v-model="showPopup" position="right" :overlay="true">
      <div style="width:100vw;">
        <user-detail v-bind:userBaseInfo="userBaseInfo" :showPopup="showPopup" @changeShowPopup="changeShowPopup"></user-detail>
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
  import UserDetail from "../../organization/UserDetailComponent.vue";
  export default {
    components: {
      "user-detail":   UserDetail,
    },
  	data(){
  		return{
        active:0,
        isLoading:false,//是否加载
        isRefreshLoading: false,//是否刷新加载
        showPopup:false,//弹出层
        showDialog:false,//弹框
        value:null,
        currentDate: new Date(),
        id:this.$route.params.id,
        tables:sessionStorage.getItem('comparisonTable')?JSON.parse(sessionStorage.getItem('comparisonTable')):null,//对照表
        organizationBrief:null,
        businessRoster:{rows:[],total:0},
        teamManagement:null,
        list:{
          pageSize:5,
          pageNum:1,
        },
        userBaseInfo:null,
  		};
  	},
  	mounted(){

      // ------ 固定tabs在顶部 -------
      // 通过$refs获取dom元素
      let box = this.$refs.contentWrap;
      let tabs = this.$refs.tabs;
      // 监听这个dom的scroll事件
      box.addEventListener('scroll', () => {
        if(box.scrollTop>=100){
          tabs.$el.childNodes[0].style.position = "fixed";
          tabs.$el.childNodes[0].style.top = box.scrollTop+'px';
        }else{
          tabs.$el.childNodes[0].style.position = "absolute";
          tabs.$el.childNodes[0].style.top = '0px';
        }  
      }, false);
  		/*
        初始化  
       */
      this.getOrganizationBrief();
  	},
  	methods:{

      /**
       *触发子组件 用户详情弹层消失 的事件
       */
      changeShowPopup(data){
        this.showPopup = data;//改变了父组件的值
      },

      /*
        刷新
       */
      onRefresh() {
        setTimeout(() => {
          
          if(this.active == 0){
            this.getOrganizationBrief();
          }else if(this.active == 1){
            this.list.pageNum = 1;
            this.getBusinessRoster(true);
          }else if(this.active == 2){
            this.getTeamManagement();
          }
          
          this.$toast('刷新成功');
          this.isRefreshLoading = false;
        }, 500);
      },

      /*
        切换tab
       */
      onClick(index, title) {
        if(index===0){
          this.getOrganizationBrief();  
        }else if(index===1){ 
          // ------ 滚动加载更多 -------
          // 通过$refs获取dom元素
          let box = this.$refs.contentWrap;
          let tabs = this.$refs.tabs;
          // 监听这个dom的scroll事件
          box.addEventListener('scroll', () => {
            console.log(box.scrollTop)
            if(box.scrollTop>=100){
              tabs.$el.childNodes[0].style.position = "fixed";
              tabs.$el.childNodes[0].style.top = box.scrollTop+'px';
            }
            // 滑动到底部50的时候操作数据
            if(box.clientHeight + 50 >= box.scrollHeight - box.scrollTop ) {
              // ------ 值为true表示可以再次请求
              if(this.scrollLoadSw){
                this.scrollLoadSw = false;
                if(this.list.pageNum < this.businessRoster.total / this.list.pageSize){
                  this.getBusinessRoster(false);
                } else{
                  this.$toast('没有更多了');
                }
              }
             
            }  
          }, false);  

          //----- 初始化 ------- 
          this.getBusinessRoster(true);
        }else if(index===2){
          this.getTeamManagement(); 
        }
      },

      /*
        获取企业部门详情---组织简介
       */
      getOrganizationBrief(){
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/org_units/${this.id}/orgunit`).then( (response) => {
          this.organizationBrief = response.data.data;
          this.isLoading = false;
        }).catch( (error) => {
          this.$toast(error);
          this.isLoading = false;
        });
      },
      /*
       * 查询企业部门详情---企业花名册，请求成功，或者失败，都将滚动状态isLoadMore设置为true
       * @params {bool} isRefresh true为重置数据 false累加数据
       */
      getBusinessRoster(isRefresh){ 
        // ------- 请求开始，将加载设置为true
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/hr_users/userList/${this.id}`,{params:this._queryParams(isRefresh)}).then((response) => {
          // ---------- 当时加载更多是，就需要累加，否则直接覆盖
          if(!isRefresh) { 
            // ----------- 合并两个数组 ------------
            this.businessRoster.rows = this.businessRoster.rows.concat(response.data.data.rows);

            this.businessRoster.total = response.data.data.total;
          }else{
            // ---------- 查询第一页数据 ---------  
            this.businessRoster = response.data.data;
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
        获取企业部门详情---班子管理
       */
      getTeamManagement(){
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/party_orgs/leader`,{params:{id:this.id,type:'orgunit'}}).then( (response) => {
          this.teamManagement = response.data.data;
          this.isLoading = false;
        }).catch( (error) => {
          this.$toast(error);
          this.isLoading = false;
        });
      },

      /*
        获取用户信息---个人基本信息
       */
      getUserBaseInfo(userId){
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/hr_users/info/${userId}`).then( (response) => {
          this.userBaseInfo = response.data.data;
          this.isLoading = false;
        }).catch( (error) => {
          this.$toast(error);
          this.isLoading = false;
        });
      },

  	},

  }
</script>

<style lang="less" scoped>
	.company-detail{
    overflow:auto;
		.brief{
      overflow:hidden;
      .title{
        background:#ddd;
        padding:10px 0px 10px 20px;
        height:16px;
        line-height:16px;
      }
      .content{
        color:#666;
        max-height:200px;
        padding-left:12px;
        overflow:auto;
        .head-img{
          width:100px;
          height:100px;
        }
      }
    }
    .roster{
      overflow:hidden;
      .roster-item{
        border: 1px solid #e4e2e2;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 10px;
        color: #333;
        position: relative;
        .view-detail{
          position: absolute;
          right: 20px;
          bottom: 20px;
          font-size:20px;
        }
      }
    }
    .team{
      overflow:hidden;
      .team-item{
        margin-bottom:20px;
        border-bottom: 1px solid #ddd;
        .team-item-top{
          .head-img{
            height:80px;
            border-radius:5px;
          }
          .name{
            font-size:24px;
            font-weight:900;
          }
          .position{
            color:#666;
          }
        }
        .team-item-bottom{
          overflow:hidden;
          line-height:30px;
          color:#666;
        }
      }
    }
	}
</style>