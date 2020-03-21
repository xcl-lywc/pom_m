<!-- 
  用户详情
 -->
<template>
  <div class="user-detail block-wrap" ref="contentWrap">
    <!-- header -->
    <div class="block-header">
      <van-nav-bar
        title="用户详情"
        left-text="返回"
        left-arrow
        @click-left="displayPopup();"
        fixed
        border
        >
      </van-nav-bar>
    </div>
    <!-- content -->
    <div class="block-content">
      <div v-if="userBaseInfo" class="content-box">
        <div class="base-info content-box-item">
          <h4 class="info-title">个人基本信息</h4>
          <div class="info-content">
            <div class="base-info-item">
              <van-row gutter="20">
                <van-col span="8">
                  <img v-if="userBaseInfo.picture" :src="userBaseInfo.picture" alt="无法显示" class="fill-width">
                  <span v-else>暂无图片</span>
                </van-col>
                <van-col span="16">
                  <van-row gutter="20">
                    <van-col span="24">{{'工号：'+(userBaseInfo.account?userBaseInfo.account:'暂无')}}</van-col>
                    <van-col span="24">{{'姓名：'+(userBaseInfo.name?userBaseInfo.name:'暂无')}}</van-col>
                    <van-col span="24">{{'公司：'+(userBaseInfo.orgName?userBaseInfo.orgName:'暂无')}}</van-col>
                    <van-col span="24">{{'党委：'+(userBaseInfo.partyCommitteeName?userBaseInfo.partyCommitteeName:'暂无')}}</van-col>
                    <van-col span="24">{{'支部：'+(userBaseInfo.partyBranchName?userBaseInfo.partyBranchName:'暂无')}}</van-col>
                    <van-col span="24">{{'党小组：'+(userBaseInfo.partyGroupName?userBaseInfo.partyGroupName:'暂无')}}</van-col>
                  </van-row>
                </van-col>
              </van-row>
              <van-row>{{'描述：'+(userBaseInfo.desc?userBaseInfo.desc:'暂无')}}</van-row>
            </div>

            <van-row gutter="20">
              <div class="base-info-item">
                <p class="base-info-item-title_">身份信息</p>
                <van-col span="12">{{'性别：'+common.matchingTables(tables[0].list,userBaseInfo.sex)}}</van-col>
                <van-col span="12">{{'民族：'+common.matchingTables(tables[1].list,userBaseInfo.nation)}}</van-col>
                <van-col span="12">{{'籍贯：'+common.matchingTables(tables[8].list,userBaseInfo.nationPlace)}}</van-col>
                <van-col span="12">{{'出生日期：'+(userBaseInfo.borthday?userBaseInfo.borthday:"暂无")}}</van-col>
                <van-col span="24">{{'身份证号：'+(userBaseInfo.idNumber?userBaseInfo.idNumber:'暂无')}}</van-col>
                <van-col span="12">{{'婚姻状况：'+common.matchingTables(tables[3].list,userBaseInfo.maritalStatus)}}</van-col>
                <van-col span="12">{{'政治面貌：'+common.matchingTables(tables[5].list,userBaseInfo.outLook)}}</van-col>
              </div>
              
              <div class="base-info-item">
                <p class="base-info-item-title_">进入时间</p>
                <van-col span="24">{{'进入中铁二局时间：'+(userBaseInfo.joinPartisanDate?common._convertDate(userBaseInfo.joinPartisanDate.date_time , 'yyyy/MM/dd'):'暂无')}}</van-col>
                <van-col span="24">{{'进入本公司时间：'+(userBaseInfo.joinComplanyTime?common._convertDate(userBaseInfo.joinComplanyTime.date_time , 'yyyy/MM/dd'):'暂无')}}</van-col>
              </div>

              <div class="base-info-item">
                <p class="base-info-item-title_">学历/学位/外语</p>
                <van-col span="24">{{'初始学历：'+common.matchingTables(tables[2].list,userBaseInfo.initialDegree)}}</van-col>
                <van-col span="24">{{'初始学历毕业时间：'+(userBaseInfo.initialTime?common._convertDate(userBaseInfo.initialTime.date_time , 'yyyy/MM/dd'):'暂无')}}</van-col>
                <van-col span="24">{{'初始学历毕业院校：'+(userBaseInfo.initialSchool?userBaseInfo.initialSchool:'暂无')}}</van-col>
                <van-col span="24">{{'最高学历：'+common.matchingTables(tables[2].list,userBaseInfo.highestDegree)}}</van-col>
                <van-col span="24">{{'最高学历毕业时间：'+(userBaseInfo.highestTime?common._convertDate(userBaseInfo.highestTime.date_time , 'yyyy/MM/dd'):'暂无')}}</van-col>
                <van-col span="24">{{'最高学历毕业院校：'+(userBaseInfo.highestSchool?userBaseInfo.highestSchool:'暂无')}}</van-col>
                <van-col span="12">{{'最高学位：'+common.matchingTables(tables[12].list,userBaseInfo.education)}}</van-col>
                <van-col span="12">{{'外语语种：'+common.matchingTables(tables[16].list,userBaseInfo.fgLanguage)}}</van-col>
                <van-col span="12">{{'外语等级：'+common.matchingTables(tables[4].list,userBaseInfo.englishLevel)}}</van-col>
              </div>

              <div class="base-info-item">
                <p class="base-info-item-title_">技术职称/执业资格/岗位性质/职务</p>
                <van-col span="24">{{'技术职称：'+common.matchingTables(tables[15].list,userBaseInfo.tPost)}}</van-col>
                <van-col span="24">{{'技术职称获得时间:：'+(userBaseInfo.techPostTime?common._convertDate(userBaseInfo.techPostTime.date_time , 'yyyy/MM/dd'):'暂无')}}</van-col>
                <van-col span="24">{{'执业资格：'+(userBaseInfo.technicalJob?userBaseInfo.technicalJob:'暂无')}}</van-col>
                <van-col span="24">{{'执业资格获得时间：'+(userBaseInfo.technicalJobTime?common._convertDate(userBaseInfo.technicalJobTime.date_time , 'yyyy/MM/dd'):'暂无')}}</van-col>
                <van-col span="24">{{'岗位性质：'+common.matchingTables(tables[9].list,userBaseInfo.position)}}</van-col>
                <van-col span="24">{{'党内职务：'+(userBaseInfo.partyJob?userBaseInfo.partyJob:'暂无')}}</van-col>
                <van-col span="24">{{'行政职务：'+(userBaseInfo.administrationJob?userBaseInfo.administrationJob:'暂无')}}</van-col>
              </div>

              <div class="base-info-item">
                <p class="base-info-item-title_">联系信息</p>
                <van-col span="12">{{'移动电话：'+(userBaseInfo.mobilNumber?userBaseInfo.mobilNumber:'暂无')}}</van-col>
                <van-col span="24">{{'固定电话(区号)：'+(userBaseInfo.areaCodel?userBaseInfo.areaCodel:'暂无')+"+ (电话) "+(userBaseInfo.phoneNumber?userBaseInfo.phoneNumber:'暂无')}}</van-col>
                <van-col span="12">{{'家庭地址：'+(userBaseInfo.address?userBaseInfo.address:'暂无')}}</van-col>
                <van-col span="12">{{'邮政编码：'+(userBaseInfo.emailCode?userBaseInfo.emailCode:'暂无')}}</van-col>
              </div>

              <div class="base-info-item">
                <van-col span="24">
                  <p class="base-info-item-title">青年组织及职务</p>
                  <van-row gutter="20" v-if="userBaseInfo.groupInfo">
                    <van-col span="24">{{'1. 入团时间：'+(userBaseInfo.groupInfo.key1?common._convertDate(userBaseInfo.groupInfo.key1.date_time , 'yyyy/MM/dd'):'暂无')}}</van-col>
                    <van-col span="24">{{'2. 现在团委名称：'+(userBaseInfo.groupInfo.key2?userBaseInfo.groupInfo.key2:'暂无')}}</van-col>
                    <van-col span="24">{{'3. 现在团委职务：'+(userBaseInfo.groupInfo.key3?userBaseInfo.groupInfo.key3:'暂无')}}</van-col>
                    <van-col span="24">{{'4. 现在团支部名称：'+(userBaseInfo.groupInfo.key4?userBaseInfo.groupInfo.key4:'暂无')}}</van-col>
                    <van-col span="24">{{'5. 现在团支部职务：'+(userBaseInfo.groupInfo.key5?userBaseInfo.groupInfo.key5:'暂无')}}</van-col>
                  </van-row>
                  <van-row v-else gutter="20">
                    <van-col span="24">1. 入团时间：暂无</van-col>
                    <van-col span="24">2. 现在团委名称：暂无</van-col>
                    <van-col span="24">3. 现在团委职务：暂无</van-col>
                    <van-col span="24">4. 现在团支部名称：暂无</van-col>
                    <van-col span="24">5. 现在团支部职务：暂无</van-col>
                  </van-row>
                </van-col>
                <van-col span="24">
                  <p class="base-info-item-title">工会组织及职务</p>
                  <van-row gutter="20" v-if="userBaseInfo.guildInfo">
                    <van-col span="24">{{'1. 入团时间：'+(userBaseInfo.guildInfo.key1?common._convertDate(userBaseInfo.guildInfo.key1.date_time , 'yyyy/MM/dd'):'暂无')}}</van-col>
                    <van-col span="24">{{'2. 现在工会（三级）名称：'+(userBaseInfo.guildInfo.key2?userBaseInfo.guildInfo.key2:'暂无')}}</van-col>
                    <van-col span="24">{{'3. 现在工会（三级）职务：'+(userBaseInfo.guildInfo.key3?userBaseInfo.guildInfo.key3:'暂无')}}</van-col>
                    <van-col span="24">{{'4. 现在工会（四级）名称：'+(userBaseInfo.guildInfo.key4?userBaseInfo.guildInfo.key4:'暂无')}}</van-col>
                    <van-col span="24">{{'5. 现在工会（四级）职务：'+(userBaseInfo.guildInfo.key5?userBaseInfo.guildInfo.key5:'暂无')}}</van-col>
                  </van-row>
                  <van-row v-else gutter="20">
                    <van-col span="24">1. 入会时间：暂无</van-col>
                    <van-col span="24">2. 现在工会（三级）名称：暂无</van-col>
                    <van-col span="24">3. 现在工会（三级）职务：暂无</van-col>
                    <van-col span="24">4. 现在工会（四级）名称：暂无</van-col>
                    <van-col span="24">5. 现在工会（四级）职务：暂无</van-col>
                  </van-row>
                </van-col>
              </div>

            </van-row>
          </div>
        </div>
      </div>
      <div v-else class="no-data">暂无数据</div>
    </div>
    <!-- footer -->
    <div class="block-footer"></div>
    
    <!-- 加载状态 -->
    <div v-show="isLoading" class="fullScreen-loding"><van-loading type="spinner" color="white" /></div>
  </div>
</template>

<script>
  export default {
    props:{
      showPopup: Boolean,  //定义传值的类型
      userBaseInfo:{
        type:null,
        required:true,
      },
    },
  	data(){
  		return{
        isLoading:false,//是否加载
        isRefreshLoading: false,//是否刷新加载
        tables:sessionStorage.getItem('comparisonTable')?JSON.parse(sessionStorage.getItem('comparisonTable')):null,//对照表
  		};
  	},
  	mounted(){
  	},
  	methods:{
      /*
       点击让弹层消失
      */
      displayPopup() {
        this.$emit('changeShowPopup',false);//displayPopup事件触发后，自动触发changeShowPopup事件
      },
  	},

  }
</script>

<style scoped lang="less">
	.user-detail{
		overflow:auto;
    .base-info{
      overflow:hidden;
      .info-content{
        overflow:hidden;
        .base-info-item{
          overflow:hidden;
          border-bottom:1px solid #ddd;
          margin: 2px auto;
          .base-info-item-title{
            color:#1989fa;
          }
          .base-info-item-title_{
            color:#1989fa;
            padding-left:3%;
          }
        }
      }
      .info-title{
        background:#ddd;
        padding:10px 0px 10px 20px;
        height:16px;
        line-height:16px;
        margin:10px auto;
      }
    }
	}
</style>