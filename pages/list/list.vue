<!-- 每日健康统计汇总 -->
<template>
	<view>
	<!-- Search -->
		<view class="search" :style="{ backgroundColor: backgroundColor }">
			<view class="content" :style="{ 'border-radius': radius + 'px', border: border }">
				<view class="content-box" :class="{ center: mode === 2 }">
					<text class="icon icon-search">&#xe61c;</text>
					<input class="input" :class="{ center: !active && mode === 2 }" :focus="isFocus" :placeholder="placeholder" v-model="inputVal" @focus="focus" @blur="blur" />
					<!-- <view v-if="!active && mode === 2" class="input sub" @click="getFocus">请输入搜索内容</view> -->
					<text v-if="isDelShow" class="icon icon-del" @click="clear">&#xe644;</text>
				</view>
				<view v-show="(active && show && button === 'inside') || (isDelShow && button === 'inside')" class="searchBtn" @click="search">搜索</view>
			</view>
			<view v-if="button === 'outside'" class="button" :class="{ active: show || active }" @click="search">
				<view class="button-item">{{ !show ? searchName : '搜索' }}</view>
			</view>
		</view>
	
	
	<view class="body">
		<view class="collect">
			已统计
			<span>{{ stat }}</span>
			人，
			缺
			<span>{{ lack }}</span>
			人
			<view @click="selectTime = true" class="select">
				当前所选时间:
				<span>{{ time }}</span>
			</view>
		</view>
		<view class="Statistics">
			疑似症状
			<span>{{ stat }}</span>
			人，
			疑似症状
			<span>{{ stat }}</span>
			人
		</view>
		
		<t-table border="1" border-color="#e6e5e5">
			<t-tr font-size="10" color="#101411">
				<t-th align="left">学号</t-th>
				<t-th align="left">姓名</t-th>
				<t-th align="left">健康状态</t-th>
				<t-th align="left">当前位置</t-th>
				<t-th align="left">今日体温</t-th>
				<t-th align="left">接触鄂人</t-th>
				<t-th align="left">疑似症状</t-th>
				
			</t-tr>
			<t-tr font-size="9" :style="{ color: item.temperature > 37 || item.contact_like_virus == 1 || item.Suspected_symptoms == 1 ? '#f00' : '#000' }"
			:class="{ listBgc: index % 2 == 0, listOne: index == 0, listFinally: index == stat - 1 }"
			v-for="(item, index) in arr"
			:key="index">
				<t-td class="id">{{ item.stu_num }}</t-td>
				<t-td class="name">{{ item.stu_name }}</t-td>
				<t-td class="name" >
                    <view :style="{color:item.health == '良好'?'#1aad19':'#f00'}">{{ item.health }}</view>
                </t-td>
				<t-td>{{ item.current_location == 2 ? '外地(湖北)' : item.current_location == 1 ? '外地（除湖北）' : '本地' }}</t-td>
				<t-td>{{ item.temperature }}</t-td>
				<t-td>{{ item.contact_virus == 0 ? '未接触' : '有接触' }}</t-td>
				<t-td>{{ item.have_symptom == 0 ? '无' : '有' }}</t-td>
			</t-tr>
		</t-table>
		<view v-if="selectTime == true" class="time">
			<view class="masking" @click="selectTime = false"></view>
			<uni-calendar class="calendars" :insert="true" :lunar="true" :start-date="'2019-3-2'" :end-date="'2019-5-20'" @change="change"></uni-calendar>
		</view>
		<view v-if="arr.length == 0" class="null">该日期未登记健康状态</view>
	</view>
</view>
</template>

<script>
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue';
import tTable from '@/components/t-table/t-table.vue';
import tTh from '@/components/t-table/t-th.vue';
import tTr from '@/components/t-table/t-tr.vue';
import tTd from '@/components/t-table/t-td.vue';
import icons from '@/components/uni-icons/uni-icons.vue';

const myDate = new Date();
let time2 = myDate.getFullYear() + '/' + (myDate.getMonth() + 1) + '/' + (myDate.getDate() + 1);
export default {
	// Search
	props: {
			mode: {
				type: Number,
				default: 1
			},
			button: {
				type: String,
				default: 'outside'
			},
			show: {
				type: Boolean,
				default: true
			},
			radius: {
				type: String,
				default: '60'
			},
			placeholder: {
				type: String,
				default: '请输入搜索内容'
			},
			backgroundColor: {
				type: String,
				default: '#fff'
			},
			border: { type: String, default: '1px #f5f5f5 solid' }
			
		},
	
	
	data() {
		return {
			// Search
			active: false,
			inputVal: '',
			searchName: '取消',
			isDelShow: false,
			isFocus: false,
			// Search
						
			class_id: "", //  班级标志
			num: -1,
			time: '', //  当前选择的时间
			selectTime: false, //  选择时间弹框
			stat: 0, //  已统计人数
			lack: 0, //  缺少
			arr: [] //  学生的每日健康统计数组
		};
	},
	components: {
		uniCalendar,
		tTable,
		tTh,
		tTr,
		tTd,
		icons
	},
	onLoad(data) {
		if (uni.getStorageSync('token')) {
			this.class_id = uni.getStorageSync("class_id")
			this.time = myDate.getFullYear() + '/' + (myDate.getMonth() + 1) + '/' + myDate.getDate();
			this.http();
		}else{
			uni.navigateTo({
				url:'../login/login'
			})
		}
	},
	methods: {
		// Search
		focus() {
					this.active = true;
				},
				blur() {
					this.isFocus = false;
					if (!this.inputVal) {
						this.active = false;
					}
				},
				clear() {
					this.inputVal = '';
					this.active = false;
					this.$emit('search', '');
				},
				getFocus() {
					this.isFocus = true;
				},
				search() {
					if (!this.inputVal) return;
					console.log(this.inputVal);
					this.$emit('search', this.inputVal);
				},
		
		
		
		change(e) {
			console.log(e);
			time2 = e.year + '/' + e.month + '/' + (e.date + 1);
			let str = e.year + '/' + e.month + '/' + e.date;
			if (this.time != str) {
				this.time = str;
				this.http();
			}
			this.selectTime = false;
		},
		http() {
			uni.showLoading({
				title: '处理中...'
			});
			let start = new Date(this.time).getTime();
			let start2 = new Date(time2).getTime();
			uniCloud.callFunction({
					name: 'query_reports',
					data: {
						class_id: uni.getStorageSync("class_id"),
						time: start,
						time2: start2
					}
				})
				.then(res => {
					uni.hideLoading();
					console.log(res);
					this.stat = res.result.arr.length;
					this.arr = res.result.arr;
					if (res.result.student_sum != '未获取到该班级信息') {
						this.lack = res.result.student_sum - this.stat;
					} else {
						uni.showToast({
							title: res.result.student_sum,
							icon: 'none',
							duration: 2000
						});
					}
					let objectArraySort = function(keyName) {
						return function(objectN, objectM) {
							var valueN = objectN[keyName];
							var valueM = objectM[keyName];
							if (valueN > valueM) return 1;
							else if (valueN < valueM) return -1;
							else return 0;
						};
					};
					this.arr.sort(objectArraySort('stu_num'));
				})
				.catch(err => {
					uni.hideLoading();
					console.error(err);
				});
		}
	},
	// Search 监听事件
	watch: {
			inputVal(newVal) {
				if (newVal) {
					this.searchName = '搜索';
					this.isDelShow = true;
				} else {
					this.searchName = '取消';
					this.isDelShow = false;
				}
			}
		}
	
	
};
</script>

<style lang="scss">
	// Search
	.search {
		display: flex;
		width: 100%;
		border-bottom: 1px #f5f5f5 solid;
		box-sizing: border-box;
		padding: 15upx;
		font-size: $uni-font-size-base;
		background: #fff;
		.content {
			display: flex;
			align-items: center;
			width: 100%;
			height: 60upx;
			border: 1px #ccc solid;
			background: #fff;
			overflow: hidden;
			transition: all 0.2s linear;
			border-radius: 30px;
	 
			.content-box {
				width: 100%;
				display: flex;
				align-items: center;
				background-color:#F4F4F4;
				&.center {
					justify-content: center;
				}
				.icon {
					padding: 0 15upx;
					
					&.icon-del {
						font-size: 38upx;
						
					}
				}
				.input {
					width: 100%;
					max-width: 100%;
					line-height: 60upx;
					height: 60upx;
					color:#333;
					font-size:28upx;
					// transition: all 0.2s linear;
					&.center {
						width: 200upx;
					}
					&.sub {
						// position: absolute;
						width: auto;
						color: grey;
					}
				}
			}
			.searchBtn {
				height: 100%;
				flex-shrink: 0;
				padding: 0 30upx;
				background: $uni-color-success;
				line-height: 60upx;
				color: #fff;
				border-left: 1px #ccc solid;
				transition: all 0.3s;
			}
		}
	 
		.button {
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			flex-shrink: 0;
			width: 0;
			transition: all 0.2s linear;
			white-space: nowrap;
			overflow: hidden;
			&.active {
				padding-left: 15upx;
				width: 100upx;
				color: #8BC34A;
			}
		}
	}
	@font-face {
		font-family: 'iconfont';
		src: url('https://at.alicdn.com/t/font_989023_efq0mtli526.ttf') format('truetype');
	}
	.icon {
		font-family: iconfont;
		font-size: 32upx;
		font-style: normal;
		color: #999;
	}
	// Search
	
	
.body {
	background-color: #fff;
	padding: 20rpx 0;
	margin-top: -30rpx;
}
.collect {
    padding: 22px;
	line-height: 80rpx;
	span {
		color: #f00;
	}
}
.Statistics {
    padding: 22px;
	// line-height: 1rpx;
	margin-top: -80upx;
	span {
		color: #f00;
	}
}
.select {
	display: inline-block;
	margin-left: 20rpx;
	color: #000 !important;
}

// .list {
// 	width: 95%;
// 	margin: 0 auto;
// 	color: #999;
// 	border: 1px solid #999;
// 	padding-bottom: 20rpx;
// }

.listBgc {
	background-color: rgb(245, 245, 244);
}
.listOne {
	border-radius: 20rpx 20rpx 0 0;
}

.listFinally {
	border-radius: 0 0 20rpx 20rpx;
}

.top {
	padding-left: 12rpx;
	font-size: 26rpx;
	view {
		display: inline-block;
		line-height: 80rpx;
	}
	.id {
	}
	.name {
		margin-left: 20rpx;
	}
}

.time {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
}
.masking {
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background-color: #000;
	opacity: 0.6;
}
.calendars {
	position: fixed;
	top: 12%;
	left: 0;
	right: 0;
}

.null {
	position: fixed;
	top: 40%;
	left: 50%;
	transform: translateX(-50%);
	font-size: 36rpx;
	color: #ccc;
}
</style>
