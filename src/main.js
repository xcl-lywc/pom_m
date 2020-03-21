//引入rem.js文件
import './rem'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'
import './plugins/mint.js'
import './plugins/vant.js'
import './plugins/element.js'//用于树状图

import './assets/style/common.less'
import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false

//引用公用js
import commonJS from "./plugins/common.js"
Vue.prototype.common = commonJS;


// 全局引入axios 并配置
import axios from 'axios'
import qs from 'qs'

axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
Vue.prototype.axios = axios;

/******************axios拦截器****************/
if(sessionStorage.getItem("token")) {
  Vue.prototype.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`;
}
Vue.prototype.axios.interceptors.response.use(function (response) {
  //请求成功的拦截
  if (response.config.responseType != "blob") {  //非文件类型不进行处理
    if(Object.prototype.toString.call(response.data) === '[object Object]'){//response.data是对象
      if (response.data.meta.code == "401") {
        // 抛出未登录异常, 并定时跳转至登录页
        setTimeout(() => {
          window.location.href = window.location.origin + "/#/login"
        }, 1500)
        return Promise.reject("未登陆或登陆信息失效!")
      } else if (response.data.meta.code != 0) {
        // 抛出请求失的异常
        
        return Promise.reject(response.data.meta.message)
      } else {
        // 无异常直接返回
        return response
      }
    }else if(Object.prototype.toString.call(response.data) === '[object String]'){//response.data是字符串（这里用来处理图片流文件）
      return response.data
    }else{
      if (response.data.meta.code == "401") {
        // 抛出未登录异常, 并定时跳转至登录页
        setTimeout(() => {
          window.location.href = window.location.origin + "/#/login"
        }, 1500)
        return Promise.reject("未登陆或登陆信息失效!")
      } else if (response.data.meta.code != 0) {
        // 抛出请求失的异常
        
        return Promise.reject(response.data.meta.message)
      } else {
        // 无异常直接返回
        return response
      }
    }
    
  } else { //文件类型直接返回
    return response
  }
  return response
}, function (error) {
  if (error.response.status == "403") {
    return Promise.reject("权限不足!")
  } else {
    return Promise.reject("请求失败!");
  }
});

new Vue({
  router,
//store,
  render: function (createElement) {
    let routeMeta = this.$route.meta
    let props = {}
    // 控制是否显示 带导航的布局 || 空白布局
    if (routeMeta && routeMeta.showNav) {
      props.layout = 'nav-layout'
    } else {
      props.layout = 'blank-layout'
    }
    return createElement(App, {props})
  }
}).$mount('#app')