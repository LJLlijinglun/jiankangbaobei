<!-- 每日健康统计汇总 -->
<template>
	<view>
		<uni-search-bar @confirm="search" @input="input" ></uni-search-bar>
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
			<span>{{ Suspected }}</span>
			人，
			14天之内接触过湖北人员总人数
			<span>{{ Contact }}</span>
			人
		</view>
		
		<t-table border="1" border-color="#e6e5e5">
			<t-tr font-size="10" color="#101411">
				
				<t-th align="left">学号</t-th>
				
				<t-th align="left">姓名</t-th>
				
				<t-th align="left">健康状态</t-th>
				<t-th align="left">当前位置</t-th>
				<t-th align="left">今日体温</t-th>
				<view style="width: 127upx;">
				<t-th align="left">接触湖北人</t-th>
				</view>
				<t-th align="left">疑似症状</t-th>
				
			</t-tr>
			<t-tr font-size="9"
			:class="{listFinally: index == stat - 1 }"
			v-for="(item, index) in arr"
			:key="index">
				<t-td class="id">{{ item.stu_num }}</t-td>
				<t-td class="name">{{ item.stu_name }}</t-td>
				<t-td>
                    <view class="Name" :style="{color:item.health == '良好'?'#000':'#f00'}">{{ item.health }}</view>
                </t-td>
				<t-td>
					<view class="Name" :style="{color:item.current_location==2 ? '#f00' : '#000'}">{{ item.current_location == 2 ? '外地(湖北)' : item.current_location == 1 ? '外地（除湖北）' : '本地' }}</view>
				</t-td>
				<t-td>
					<view class="Name" :style="{ color: item.temperature >=37.2 ? '#f00' : '#000'}">{{ item.temperature }}</view>
				</t-td>
				<t-td>
				    <view style="width: 100upx;" class="Name" :style="{color:item.contact_virus == '0' ? '#000' : '#f00'}">{{ item.contact_virus == 0 ? '未接触' : '有接触'}}</view>
				</t-td>
				<t-td>
					<view class="Name" :style="{color:item.have_symptom == '0' ? '#000' : '#f00'}">{{ item.have_symptom == 0 ? '无' : '有' }}</view>
				</t-td>
			</t-tr>
		</t-table>
		<view v-if="selectTime == true" class="time">
			<view class="masking" @click="selectTime = false"></view>
			<uni-calendar class="calendars" :insert="true" :lunar="true" :start-date="'2019-3-2'" :end-date="'2019-5-20'" @change="change"></uni-calendar>
		</view>
		<view v-if="arr.length == 0" class="null">该日期未登记健康状态</view>
	</view>
	<view style="margin-top: 20upx;">
	<uni-pagination></uni-pagination>
	</view>
</view>

</template>

<script>
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue';
import uniPagination from '@/components/uni-pagination/uni-pagination.vue'
import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
import tTable from '@/components/t-table/t-table.vue';
import tTh from '@/components/t-table/t-th.vue';
import tTr from '@/components/t-table/t-tr.vue';
import tTd from '@/components/t-table/t-td.vue';
import icons from '@/components/uni-icons/uni-icons.vue';

const myDate = new Date();
let time2 = myDate.getFullYear() + '/' + (myDate.getMonth() + 1) + '/' + (myDate.getDate() + 1);
export default {
	
	data() {
		return {
						
			class_id: "", //  班级标志
			num: -1,
			time: '', //  当前选择的时间
			selectTime: false, //  选择时间弹框
			stat: 0, //  已统计人数
			lack: 0, //  缺少
			Suspected:0,
			Contact:0,
			arr: [] //  学生的每日健康统计数组
		};
	},
	components: {
		uniCalendar,
		tTable,
		tTh,
		tTr,
		tTd,
		icons,
		uniSearchBar,
		uniPagination
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
					// console.log(res.result.student_sum);
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
	
	
	
};
</script>

<style lang="scss">
	
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
.color {
	font-size: 1rpx;
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
.Name {
	font-size: 19upx;
}
</style>
