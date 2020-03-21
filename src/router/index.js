import Vue from 'vue'
import Router from 'vue-router'

import Home from  '@/views/Home.vue'
import Login from '@/views/Login.vue'


import navComponentsIndex from '@/views/navComponents/Index.vue'

/*我的考试*/
import MyExamIndex from '@/views/navComponents/exam/Index.vue'
/*我的考试---考试列表*/
import ExamIndex from   '@/views/navComponents/exam/exam/Index.vue'
/*我的考试---考试列表---列表*/
import ExamList from    '@/views/navComponents/exam/exam/ExamList.vue'
/*我的考试---考试列表---列表（待参与）---开始考试*/
import ExamStart from   '@/views/navComponents/exam/exam/ExamStart.vue'
/*我的考试---考试列表---列表（已结束）---考试详情*/
import ExamDetail from  '@/views/navComponents/exam/exam/ExamDetail.vue'
/*我的考试---考试列表---列表（已结束）---考试详情---考试试卷*/
import ExamPaper from   '@/views/navComponents/exam/exam/ExamPaper.vue'
/*我的考试---考试列表---列表（已结束）---考试详情---考试试卷---试题列表*/
import TestList from    '@/views/navComponents/exam/exam/TestList.vue'

/*网上党校*/
import LecturesIndex from      '@/views/navComponents/lectuers/Index.vue'
/*网上党校---网上党课*/
import PartyLecturesIndex from '@/views/navComponents/lectuers/lectuers/Index.vue'
/*网上党校---网上党课---列表*/
import PartyLectures from      '@/views/navComponents/lectuers/lectuers/PartyLectures.vue'
/*网上党校---网上党课---列表---党课详情*/
import LecturesDetail from     '@/views/navComponents/lectuers/lectuers/LecturesDetail.vue'
/*网上党校---网上党课---列表---党课详情---学习党课*/
import LectuersLearn from      '@/views/navComponents/lectuers/lectuers/LectuersLearn.vue'

/*我的组织*/
import OrganizationIndex from   '@/views/navComponents/organization/Index.vue'
/*我的组织---我的企业*/
import CompanyIndex from        '@/views/navComponents/organization/company/Index.vue'
/*我的组织---我的企业---我的企业列表*/
import CompanyOrganization from '@/views/navComponents/organization/company/CompanyOrganization.vue'
/*我的组织---我的企业---我的企业列表---企业详情*/
import CompanyDetail from       '@/views/navComponents/organization/company/CompanyDetail.vue'
/*我的组织---我的党组织*/
import PartyIndex from          '@/views/navComponents/organization/party/Index.vue'
/*我的组织---我的党组织---我的党组织列表*/
import PartyOrganization from   '@/views/navComponents/organization/party/PartyOrganization.vue'
/*我的组织---我的党组织---我的党组织列表---党组织详情*/
import PartyDetail from         '@/views/navComponents/organization/party/PartyDetail.vue'
/*我的组织---我的工会组织*/
import LabourIndex from         '@/views/navComponents/organization/labour/Index.vue'
/*我的组织---我的工会组织---我的工会组织列表*/
import LabourOrganization from  '@/views/navComponents/organization/labour/LabourOrganization.vue'
/*我的组织---我的工会组织---我的工会组织列表---工会组织详情*/
import LabourDetail from        '@/views/navComponents/organization/labour/LabourDetail.vue'
/*我的组织---我的团组织*/
import GroupIndex from          '@/views/navComponents/organization/group/Index.vue'
/*我的组织---我的团组织---我的团组织列表*/
import GroupOrganization from   '@/views/navComponents/organization/group/GroupOrganization.vue'
/*我的组织---我的团组织---我的团组织列表---团组织详情*/
import GroupDetail from         '@/views/navComponents/organization/group/GroupDetail.vue'

/*我的任务*/
import MyTaskIndex from '@/views/navComponents/task/Index.vue'
/*我的任务---任务列表*/
import TaskIndex from   '@/views/navComponents/task/task/Index.vue'
/*我的任务---任务列表---列表*/
import TaskList from    '@/views/navComponents/task/task/TaskList.vue'
/*我的任务---任务列表---列表---详情*/
import TaskDetail from    '@/views/navComponents/task/task/TaskDetail.vue'
/*我的任务---任务列表---列表（未完成）---转交任务*/
import DeliverTask from '@/views/navComponents/task/task/DeliverTask.vue'

Vue.use(Router)

export default new Router({
  routes: [
  	// --------------------------------------------------我的任务
		{
      path: '/task',
      name: 'myTaskIndex',
      component:MyTaskIndex,
			meta: {
				showNav: true,
			},
			children:[
				{
					path: '/task_list',
					name: 'taskList',
					component: TaskList,
					redirect: '',
					meta: {
						showNav: true,
					}
				},
				{
					path: '/task_list/:id/:instanceId',
					name: 'taskDetail',
					component: TaskDetail,
					redirect: '',
					meta: {
						showNav: true,
					}
				},
				{
					path: '/task_list/:d_id',
					name: 'deliverTask',
					component: DeliverTask,
					redirect: '',
					meta: {
						showNav: true,
					}
				},
			]
    },
  	// --------------------------------------------------我的组织
		{
			path: '/organization',
			name: 'organizationIndex',
			component: OrganizationIndex,
			redirect: '',
			meta: {
				showNav: true,
			},
			children:[
					{
						path: '/company_list',
						name: 'companyOrganization',
						component: CompanyOrganization,
						redirect: '',
						meta: {
							showNav: true,
						},
					},
					{
						path: '/company_list/:id',
						name: 'companyDetail',
						component: CompanyDetail,
						redirect: '',
						meta: {
							showNav: true,
						},
					},
					{
						path: '/party_list',
						name: 'partyOrganization',
						component: PartyOrganization,
						redirect: '',
						meta: {
							showNav: true,
						},
					},
					{
						path: '/party_list/:id',
						name: 'partyDetail',
						component: PartyDetail,
						redirect: '',
						meta: {
							showNav: true,
						},
					},
					{
						path: '/labour_list',
						name: 'labourOrganization',
						component: LabourOrganization,
						redirect: '',
						meta: {
							showNav: true,
						},
					},
					{
						path: '/labour_detail',
						name: 'labourDetail',
						component: LabourDetail,
						redirect: '',
						meta: {
							showNav: true,
						},
					},
					{
						path: '/group_list',
						name: 'groupOrganization',
						component: GroupOrganization,
						redirect: '',
						meta: {
							showNav: true,
						},
					},
					{
						path: '/group_detail',
						name: 'groupDetail',
						component: GroupDetail,
						redirect: '',
						meta: {
							showNav: true,
						},
					},
			]
		},
		// --------------------------------------------------我的考试
		{
      path: '/exam',
      name: 'myExamIndex',
      component:MyExamIndex,
			meta: {
				showNav: true,
			},
			children:[
				{
					path: '/exam_list',
					name: 'examList',
					component: ExamList,
					redirect: '',
					meta: {
						showNav: true,
					}
				},
				{
					path: '/exam_list/:s_id',
					name: 'examStart',
					component: ExamStart,
					redirect: '',
					meta: {
						showNav: true,
					}
				},
				{
					path: '/exam_list/:id',
					name: 'examDetail',
					component: ExamDetail,
					redirect: '',
					meta: {
						showNav: true,
					}
				},
				{
					path: '/exam_list/:id/:p_id',
					name: 'examPaper',
					component: ExamPaper,
					redirect: '',
					meta: {
						showNav: true,
					}
				},
				{
					path: '/exam_list/:id/:p_id/:t_id',
					name: 'testList',
					component: TestList,
					redirect: '',
					meta: {
						showNav: true,
					}
				},	
			]
    },
    // --------------------------------------------------网上党校
		{
      path: '/lectures',
      name: 'lecturesIndex',
      component:LecturesIndex,
			meta: {
				showNav: true,
			},
			children:[
				{
					path: '/lectures_list',
					name: 'partyLectures',
					component: PartyLectures,
					redirect: '',
					meta: {
						showNav: true,
					}
				},
				{
					path: '/lectures_list/:id',
					name: 'lecturesDetail',
					component: LecturesDetail,
					redirect: '',
					meta: {
						showNav: true,
					},
				},
				{
					path: '/lectures_list/:id/:learnId',
					name: 'lectuersLearn',
					component: LectuersLearn,
					redirect: '',
					meta: {
						showNav: true,
					}
				},
				
			]
    },
    // --------------------------------------------------首页
  	{
      path: '/',
      name: 'home',
      component: Home,
			meta: {
				showNav: true,
			},
    },
    // --------------------------------------------------登陆
		{
			path: '/login',
			name: 'Login',
			component: Login,
			meta: {
				showNav: false,
			}
		},
		
  ]
})
