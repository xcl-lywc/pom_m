import vue from 'vue';

import router from '.././router'
const Vue = new vue({router}); //注册router, 实例中调用

export default {
  basePath: `${window.location.origin}/api`,
  // webSocketSever: `${window.location.host}/api/websocket`,
  // ws: {}, //webSocket对象
  elementPagination:{     //elementUi中的分页所需数据
      pageSizes: [10, 20, 30],
      pageSizeDefault: 5,   //初始条数
      pageNumDefault:1,      //初始页码
  },
  /**
  * 将时间戳转换为某年某月某日 00：00：00
  * @params {string/number} timeSetback 时间戳
  * @params {string} format 时间格式
  */
  _convertDate(timeSetback, format){
    return timeSetback ? new Date(timeSetback).Format(format) : '暂无';
  },
	/*
	* 习题选项
	*/
	exerciseOptions(index){
		switch(index){
			case 1:
				return 'A';
				break;
			case 2:
				return 'B';
				break;
			case 3:
				return 'C';
				break;
			case 4:
				return 'D';
				break;
			case 5:
				return 'E';
				break;
			case 6:
				return 'F';
				break;
			case 7:
				return 'G';
				break;
			case 8:
				return 'H';
				break;
			case 9:
				return 'I';
				break;
			case 11:
				return 'J';
				break;
			case 12:
				return 'K';
				break;
			case 13:
				return 'L';
				break;
			case 14:
				return 'M';
				break;
			case 15:
				return 'N';
				break;
			case 16:
				return 'O';
				break;
			case 17:
				return 'P';
				break;
			case 18:
				return 'Q';
				break;
			case 20:
				return 'R';
				break;
		};
	},
	/*
	* 对照表匹配code
	* （对照表为数组,code为匹配信息）
	*/
	matchingCTables(arr,code){
		for(var i = 0;i<arr.length;i++){
			if(arr[i].code === code){
				return arr[i].value;
			}else{
				return code;
			}
		}
	},
	/*
	* 对照表匹配key
	* （对照表为数组,key为匹配信息）
	*/
	matchingTables(arr,key){
		for(var i = 0;i<arr.length;i++){
			if(arr[i].key === key){
				return arr[i].value;
			}else{
				return key;
			}
		}
	},
  /*
   * 根据附件地址下载附件
   */
  downloadFileByUrl(fileUrl){
    window.open(fileUrl);
  },
  /**
   * 通用方法用于返回之前浏览的页面, 当path丢失时返回首页
   * @return {[type]} [description]
   */
  backForward () {
    let path = sessionStorage.getItem("historyPath") || "/"
    Vue.$router.push({path: path})
  },
  /**
   * 判断当前时间是否在创建当天内
   * beginTime, endTime, nowTime时间戳
   */
  time_range(beginTime, endTime, nowTime){
    if((nowTime>=beginTime)||(nowTime<=endTime)){
      return 'yes';
    }else{
      return 'no';
    }
  },
}

/*
*   格式化日期格式
*/
Date.prototype.Format = function (fmt) {
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}