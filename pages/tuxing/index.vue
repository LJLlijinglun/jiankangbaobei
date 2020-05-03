<template>
	<view class="qiun-columns">
		<view class="qiun-charts" >
			<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchstart="touchLineA"></canvas>
		</view>
	</view>
</template>

<script>
	// 引入uCharts 方法组件。
	import uCharts from '@/components/u-charts/u-charts.js';
	// 定义全局变量
	var _self;
	var canvaLineA=null;
	export default {
		data() {
			return {
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
			}
		},
		// 页面加载执行的函数
		onLoad() {
			_self = this;
			// uni.upx2px(750) 这是uni-app自带的自适应，以750的尺寸为基准。动态变化
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(500);
			this.getServerData();
		},
		methods: {
			// 获取数据，发请求
			getServerData(){
				uni.request({
					// 请求地址
					url: 'https://www.ucharts.cn/data.json',
					// 请求参数
					data:{
					},
					// 请求成功的回调函数
					success: function(res) {
						console.log(res.data.data.LineA,res.data.data.LineA.categories)
						let LineA={categories:[],series:[]};
						//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
						// 自己可以定义数据
						/*
						let LineA={categories:[],series:[]};
						LineA.categories=['2010','2012','2014','2016','2018','2020'];
						LineA.series=[{
							name:"南京",
							data:[12,15,10,18,6,13],
							color:'#409eff'
						},{
							name:"苏州",
							data:[15,6,13,18,8,14],
							color:'#e6a23c'
						},{
							name:"无锡",
							data:[13,12,13,16,9,10],
							color:'#f56c6c'
						}];
						*/ 
						LineA.categories=res.data.data.LineA.categories;
						LineA.series=res.data.data.LineA.series;
						// 找到id为canvasLineA的块
						_self.showLineA("canvasLineA",LineA);
					},
					// 请求失败的回调函数
					fail: () => {
						_self.tips="网络错误，小程序端请检查合法域名";
					},
				});
			},
			// 展示图标的函数 接收参数，一个块的id,一个数据
			showLineA(canvasId,chartData){
				canvaLineA=new uCharts({
					$this:_self,
					canvasId: canvasId,
					// 图标类型
					type: 'line',
					fontSize:11,
					legend:{show:true},
					dataLabel:false,
					dataPointShape:true,
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					// x轴显示的内容
					xAxis: {
						type:'grid',
						gridColor:'#CCCCCC',
						gridType:'dash',
						dashLength:8
					},
					// y轴显示的内容
					yAxis: {
						gridType:'dash',
						gridColor:'#CCCCCC',
						dashLength:8,
						splitNumber:5,
						min:10,
						max:180,
						format:(val)=>{return val.toFixed(0)+'元'}
					},
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					extra: {
						line:{
							type: 'straight'
						}
					}
				});
				
			},
			// 点击图表显示的内容
			touchLineA(e) {
				// 使用声明的变量canvaLineA
				canvaLineA.showToolTip(e, {
					format: function (item, category) {
						return category + ' ' + item.name + ':' + item.data 
					}
				});
			}
		}
	}
</script>

<style scoped>
	/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
	
	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
</style>