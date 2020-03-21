<template>
  <div id="app">
		<div class="content-wrap">
			<!-- 根据需要显示不同的布局情况 -->
   		<component :is="layout"></component>
		</div>
  </div>
</template>

<script>
	import BlankLayout from "./layout/BlankLayout.vue";
	import NavLayout from "./layout/NavLayout.vue";
	export default {
		name: 'App',
		props: {
			layout: {
				type: String,
				default: "nav-layout"
			}
		},
		components: {
			"nav-layout":   NavLayout,
			"blank-layout": BlankLayout
		},
		data() {
			return {
				
			};
		},
		watch: {
			"$route": {
				handler (to, from) {
					if(from.path) {
						sessionStorage.setItem("historyPath", from.path)
					}
				},
				deep: true
			}
		},
		mounted(){
			/* 
				判断是否登陆 
			*/
			let self = this
			window.app = this
			if(sessionStorage.getItem("token")) {
				
			}else{
				this.$router.push({path: '/login'});
			}
		}
	}
</script>

<style>
	#app {
		
	}
</style>
