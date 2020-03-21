<!-- 
  任务列表-任务详情
 -->
<template>
  <div class="task-detail block-wrap" ref="contentWrap">
    <!-- header -->
    <div class="block-header">
      <van-nav-bar
        title="任务详情"
        left-text="返回"
        left-arrow
        @click-left="$router.push({name:'taskList',params:{}})"
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
        <div class="brief">
          <div class="block-title brief-title">任务简介</div>
          <div class="content-box" v-if="taskDetailBrief">
            <div class="content-box-item">{{'任务名称：'+(taskDetailBrief.content?taskDetailBrief.content:'暂无')}}</div>
            <div class="content-box-item">{{'任务分类：'+(taskDetailBrief.processType?taskDetailBrief.processType:'暂无')}}</div>
            <div class="content-box-item">{{'任务创建：'+(common._convertDate(taskDetailBrief.createTime, 'yyyy/MM/dd hh:mm:ss'))+' ('+(taskDetailBrief.creator?taskDetailBrief.creator:'暂无')+')'}}</div>
            <div class="content-box-item">{{'任务截止：'+(common._convertDate(taskDetailBrief.endTime, 'yyyy/MM/dd hh:mm:ss'))}}</div>
            <div class="content-box-item">
              <span>任务描述：</span>
              <div v-for="(item, index) in JSON.parse(taskDetailBrief.formData)" :key="index">
                <span>&nbsp;&nbsp;&nbsp;{{(index+1)+'. '}}</span>
                <span>{{item.name}}:</span>
                <span v-if=" item.type == 'text' ">{{item.value}}</span>
                <span v-if=" item.type == 'img' "><img style="max-width: 200px" :src="item.value" /></span>
                <a v-if=" item.type == 'file' " :href="item.value">{{item.original}}</a>
              </div>
            </div>

          </div>
          <div v-else class="no-data">暂无数据</div>
        </div>
        <div class="sub">
          <div class="block-title">子任务列表</div>
          <div class="content-box sub-item" v-if="taskDetailSub" v-for="item in taskDetailSub">
            <div class="content-box-item">{{'任务名称：'+(item.taskName?item.taskName:'暂无')}}</div>
            <div class="content-box-item">{{'所属阶段：'+(item.taskVoList.length?item.taskVoList[0].processTaskName:'暂无')}}</div>
            <div class="content-box-item">{{'任务创建：'+(common._convertDate(item.createTime, 'yyyy/MM/dd hh:mm:ss'))+' ('+(item.assignee?item.assignee:'暂无')+')'}}</div>
            <div class="content-box-item">{{'任务截止：'+(common._convertDate(item.endTime, 'yyyy/MM/dd hh:mm:ss'))}}</div>
          </div>
          <div v-if="taskDetailSub.length===0" class="no-data">暂无数据</div>
        </div>
        <div class="history">
          <div class="block-title">历史记录</div>
          <van-tabs @click="onClick" v-model="active" v-if="taskDetailBrief">
            <van-tab title="全部">
              <div class="history-item">
                <p class="history-item-title">流 程：</p>
                <van-steps direction="vertical" class="proccess" v-if="taskDetailHistory.total>0">
                  <van-step>
                    <h4>开始</h4>
                    <p>{{(common._convertDate(taskDetailBrief.createTime, 'yyyy/MM/dd hh:mm:ss'))}}</p>
                  </van-step>
                  <div v-for="item in taskDetailHistory.rows">
                    <van-step>
                      <h4>{{(item.commentContent?item.commentContent:'暂无')}}</h4>
                      <p>{{(common._convertDate(item.createTime, 'yyyy/MM/dd hh:mm:ss'))+' ('+(item.creator?item.creator:'暂无')+')'}}</p>
                      <p><van-button type="primary" size="mini" class="marl10 mart3" @click="historyDetail = null;showDialog = true;historyDetail = JSON.parse(item.formData)">查看</van-button></p>
                    </van-step>
                  </div>
                  <van-step v-if="taskDetailBrief.taskVoList ? taskDetailBrief.taskVoList.length ? true : false : false">
                    <h4>{{taskDetailBrief.taskVoList[0].processTaskName}}</h4>
                    <p><van-button type="primary" size="mini mart10 marl10">去完成</van-button></p>
                  </van-step>
                  <van-step v-if="taskDetailBrief.status == 2">
                    <h4>结束</h4>
                    <p>{{(common._convertDate(taskDetailBrief.endTime, 'yyyy/MM/dd hh:mm:ss'))}}</p>
                  </van-step>
                </van-steps>
                <div v-if="taskDetailHistory.total===0" class="no-data">暂无数据</div>
              </div>
              <div class="history-item content-box">
                <p class="history-item-title">回 复：</p>
                <div class="reply">
                  <el-upload
                    class="upload-demo"
                    :headers="{Authorization: 'Bearer ' + userData.token}"
                    :action="`${common.basePath}/file/${userData.orgId}/uplode`"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :before-upload="beforeUpload"
                    :on-success="handleSuccess"
                    :show-file-list="false"
                    :limit="100">
                    <el-button size="mini" type="primary">上传附件</el-button>
                    <div slot="tip" class="el-upload__tip">附件大小不能超过 100MB!</div>
                  </el-upload>
                  <div v-if="taskDetailBrief.taskPrivateFile.length>0" class="content-box-item">
                    <p v-for="(itemFile, indxFile) in taskDetailBrief.taskPrivateFile" class="content-box-item">
                      <span>{{itemFile.name}}</span>
                    </p>
                  </div>
                  <div v-if="taskDetailBrief.taskPrivateFile.length===0" class="no-data">暂无附件</div>
                  <van-field
                    v-model="value"
                    type="textarea"
                    rows="5"
                    autosize
                    placeholder="请填写内容..."
                    class="bg-gray"
                  />
                  <van-button type="primary" size="mini mart3 fr" @click="reply">回复</van-button>
                </div>
              </div>
            </van-tab>
            <van-tab title="流程">
              <div class="history-item">
                <!-- <p class="history-item-title">流 程：</p> -->
                <van-steps direction="vertical" class="proccess" v-if="taskDetailHistory.total>0">
                  <van-step>
                    <h4>开始</h4>
                    <p>{{(common._convertDate(taskDetailBrief.createTime, 'yyyy/MM/dd hh:mm:ss'))}}</p>
                  </van-step>
                  <div v-for="item in taskDetailHistory.rows">
                    <van-step>
                      <h4>{{(item.commentContent?item.commentContent:'暂无')}}</h4>
                      <p>{{(common._convertDate(item.createTime, 'yyyy/MM/dd hh:mm:ss'))+' ('+(item.creator?item.creator:'暂无')+')'}}</p>
                      <p><van-button type="primary" size="mini" class="marl10 mart3">查看</van-button></p>
                    </van-step>
                  </div>
                  <van-step v-if="taskDetailBrief.taskVoList ? taskDetailBrief.taskVoList.length ? true : false : false">
                    <h4>{{taskDetailBrief.taskVoList[0].processTaskName}}</h4>
                    <p><van-button type="primary" size="mini mart10 marl10">去完成</van-button></p>
                  </van-step>
                  <van-step v-if="taskDetailBrief.status == 2">
                    <h4>结束</h4>
                    <p>{{(common._convertDate(taskDetailBrief.endTime, 'yyyy/MM/dd hh:mm:ss'))}}</p>
                  </van-step>
                </van-steps>
                <div v-if="taskDetailHistory.total===0" class="no-data">暂无数据</div>
              </div>
            </van-tab>
            <van-tab title="回复">
              <div class="history-item content-box">
                <!-- <p class="history-item-title">回 复：</p> -->
                <div class="reply">
                  <el-upload
                    class="upload-demo"
                    :headers="{Authorization: 'Bearer ' + userData.token}"
                    :action="`${common.basePath}/file/${userData.orgId}/uplode`"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :before-upload="beforeUpload"
                    :on-success="handleSuccess"
                    :show-file-list="false"
                    :limit="100">
                    <el-button size="mini" type="primary">上传附件</el-button>
                    <div slot="tip" class="el-upload__tip">附件大小不能超过 100MB!</div>
                  </el-upload>
                  <div v-if="taskDetailBrief.taskPrivateFile.length>0" class="content-box-item">
                    <p v-for="(itemFile, indxFile) in taskDetailBrief.taskPrivateFile" class="content-box-item">
                      <span>{{itemFile.name}}</span>
                    </p>
                  </div>
                  <div v-if="taskDetailBrief.taskPrivateFile.length===0" class="no-data">暂无附件</div>
                  <van-field
                    v-model="value"
                    type="textarea"
                    rows="5"
                    autosize
                    placeholder="请填写内容..."
                    class="bg-gray"
                  />
                  <van-button type="primary" size="mini mart3 fr" @click="reply">回复</van-button>
                </div>
              </div>
            </van-tab>
          </van-tabs>
        </div>
        <div class="proccess-img">
          <div class="block-title">流程进度</div>
          <div class="content-box proccess-img-box" v-if="taskDetailSchedule">
            <img :src="taskDetailSchedule" alt="无法显示" style="max-width:100%">
          </div>
          <div v-else class="no-data">暂无数据</div>
        </div>
      </van-pull-refresh>
    </div>
    <!-- footer -->
    <div class="block-footer"></div>
 
    <!-- 弹框 -->
    <van-dialog
      v-model="showDialog"
      @confirm=""
      show-cancel-button
      >
      <div v-for="item in historyDetail" v-if="item.type != 'inputButton'">
        <span>{{item.title+'： '}}</span>
        <span v-if="item.type == 'inputText' || item.type == 'inputNumber' || item.type == 'textarea'">{{item.value}}</span>  
        <span v-if=" item.type == 'tree' " v-for="(itemTree, indexTree) in item.value">{{itemTree}},</span>
        <span v-if="item.type == 'date'">{{common._convertDate(item.value, 'yyyy/MM/dd hh:mm:ss')}}</span>
        <span v-if="item.type == 'dateRange'">{{common._convertDate(item.value[0], 'yyyy/MM/dd hh:mm:ss')}} ~ {{common._convertDate(item.value[1], 'yyyy/MM/dd hh:mm:ss')}}
        </span>
        <span v-if=" item.type == 'ueditor' " v-html="item.value"></span>
        <div v-if=" item.type == 'payCode' " class="pad10"><img :src="item.codeUrl" style="max-width:100px;"/></div>
        <van-checkbox v-if=" item.type == 'skipApproval' " v-model="item.value">跳过审批</van-checkbox>
      </div> 
    </van-dialog>
    <!-- 加载状态 -->
    <div v-show="isLoading" class="fullScreen-loding"><van-loading type="spinner" color="white" /></div>
  </div>
</template>

<script>
  export default {
  	data(){
  		return{
        active:0,
        isLoading:false,//是否加载
        isRefreshLoading: false,//是否刷新加载
        showDialog:false,//弹框
        value:null,
        id:this.$route.params.id,
        instanceId:this.$route.params.instanceId,
        userData:sessionStorage.getItem('userData')?JSON.parse(sessionStorage.getItem('userData')):null,//userData
        taskDetailBrief:null,
        taskDetailHistory:{rows:[],total:0},
        historyDetail:null,
        taskDetailSub:[],
        taskDetailSchedule:null, 
        list:{
          fromId: this.$route.params.id,
          fromType: 2,
          status: null,
        },	
      };
  	},
  	mounted(){
  	 /*
      初始化 
     */	
      this.getTaskDetailBrief();
      this.getTaskDetailHistory();
      this.getTaskDetailSub();
      this.getTaskDetailSchedule();
  	},
  	methods:{
      /*
        刷新
       */
      onRefresh() {
        setTimeout(() => {
          this.getTaskDetailBrief();
          this.getTaskDetailHistory();
          this.getTaskDetailSub();
          this.getTaskDetailSchedule();
          this.$toast('刷新成功');
          this.isRefreshLoading = false;
        }, 500);
      },

      /*
        获取任务详情-任务简介
       */
      getTaskDetailBrief(){
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/t_tasks/${this.id}/detail`).then( (response) => {
          this.taskDetailBrief = response.data.data;
          this.isLoading = false;
        }).catch( (error) => {
          this.$toast(error);
          this.isLoading = false;
        });
      },
      /*
        获取任务详情-历史记录
       */
      getTaskDetailHistory(){
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/t_tasks/review/list`,{params:this.list}).then( (response) => {
          this.taskDetailHistory = response.data.data;
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
          this.list.status = null;
          this.getTaskDetailHistory();
        }else if(index===1){
          this.list.status = 2;
          this.getTaskDetailHistory();
        }else if(index===2){
          this.list.status = 1;
          this.getTaskDetailHistory();
        }
      },
      /*
        获取任务详情-子任务
       */
      getTaskDetailSub(){
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/t_tasks/childs`,{params:{id:this.id}}).then( (response) => {
          this.taskDetailSub = response.data.data;
          this.isLoading = false;
        }).catch( (error) => {
          this.$toast(error);
          this.isLoading = false;
        });
      },
      /*
        获取任务详情-流程进度
       */
      getTaskDetailSchedule(){
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/activiti/img`,{params:{processInstanceId:this.instanceId}}).then( (response) => {
          this.taskDetailSchedule = window.URL.createObjectURL(new Blob([response]))
          this.isLoading = false;
        }).catch( (error) => {
          this.$toast(error);
          this.isLoading = false;
        });
      },

      /*
        文件上传
       */
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      /*
       * 附件上传之前后，验证的数据大小和类型
       */
      beforeUpload(file){
        const isLt100M = file.size / 1024 / 1024 < 100;
        if (!isLt100M) {
          this.$toast('上传附件大小不能超过 100MB!');
        }
        return isLt100M;
      },
      /*
       * 附件上传成功后，保存数据给数据库
       */
      handleSuccess(res, file){
        this.isLoading = true;
        this.axios.patch(`${this.common.basePath}/t_tasks/file/upload`,{id: this.id, privateFileIds: [res.data]}).then( (response) => {
          this.getTaskDetailBrief();
          this.isLoading = false;
        }).catch( (error) => {
          this.$toast(error);
          this.isLoading = false;
        });
      },

      /*
        回复
       */
      reply(){
        if(this.value == null||this.value == ''){
           this.$toast('未填写内容！');
           return;
        }
        let form = {
          commentContent:this.value,
          fromId:this.id,
          fromType:"2"
        }
        this.isLoading = true;
        this.axios.post(`${this.common.basePath}/t_tasks/review`,form).then( (response) => {
          this.getTaskDetailHistory();
          this.isLoading = false;
        }).catch( (error) => {
          this.$toast(error);
          this.isLoading = false;
        });
      },

  	},

  }
</script>

<style scoped lang="less">
	.task-detail{
		overflow:auto;
    .brief{
      .brief-title{
        margin-top:0;
      }
    }
    .sub{
      overflow:hidden;
      .sub-item{
        border:1px solid #ddd;
        box-sizing:border-box;
        padding:10px;
        margin:5px auto;
      }
    }
    .history{
      overflow:hidden;
      .history-item{
        overflow:hidden;
        .history-item-title{
          padding: 10px 0 5px 20px;
          font-size: 16px;
          color: #333;
        }
        .proccess{

        }
        .reply{
          padding:10px;
        }
      }
    }
    .proccess-img{
      .proccess-img-box{
        overflow-x:auto;
      }
    }
	}
</style>