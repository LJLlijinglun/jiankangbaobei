<template>
	<view class="content">
		<view class="text-area">
			<view class="orgimg">
				<image src="../../static/jiankan.jpg" mode="widthFix" style="width: 100%;"></image>
			</view>
			<view class="buttonGroup" style="width: 300upx;margin-top: 150upx;">
				<navigator url="../list/index" class="linkBtn" >
					最新疫情消息
				</navigator>
			</view>
			<view style="margin-top: 50upx;margin-bottom: 70upx;">
				<text class="title">{{school}}学生健康报备系统</text>
			</view>
			<div class="tipText">
				<text>{{userText}}您好</text>
			</div>

		</view>
		<!-- 学生家长 -->
		<view class="buttonGroup" v-if="userType === 1 || userType === 2">
			<navigator url="../student_bind/student_bind" class="linkBtn" >
				绑定学生信息
			</navigator>
			<navigator url="../student/student_day" class="linkBtn">
				今日健康报备
			</navigator>
		</view>
		<!-- 老师 -->
		<view class="buttonGroup" v-if="userType === 0">
			<!-- <view class="welcome">老师，您好</view> -->
			<navigator url="../teacher_bind/teacher_bind" class="linkBtn">
				绑定管理班级
			</navigator>
			<navigator url="/pages/list/list" class="linkBtn">
				查看报备数据
			</navigator>
		</view>
		<!-- 管理员 -->
		<view class="buttonGroup" v-if="userType === 3">
			<navigator url="../administrator/admin_grade" class="linkBtn">
				学院年级管理
			</navigator>
			<navigator url="../administrator/admin_class" class="linkBtn">
				专业班级管理
			</navigator>
		</view>

		<button class="cu-btn bg-blue lg" @click="logout">退出登录</button>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				school: '',
				userType: 4,
				userText: '',
			}
		},
		onLoad:function(){
			this.school = uni.getStorageSync('school')
		},
		onShow() {
			if (uni.getStorageSync('token')) {
				this.getUserInfo()
			} else {
				uni.navigateTo({
					url: '../login/login'
				})
			}
		},
		methods: {
			logout() {
				//用户退出，清楚缓存信息
				uni.removeStorageSync('token')
				uni.removeStorageSync("userType")
				uni.removeStorageSync("uid")
				uni.removeStorageSync("class_id")
				uni.removeStorageSync("stu_num")
				uni.removeStorageSync("stu_name")

				uni.navigateTo({
					url: '/pages/login/login'
				});
			},
			setUserText(userType) {
				const userOptionDB = {
					0: '老师',
					1: '学生',
					2: '家长',
					3: '管理员',
				}
				return userOptionDB[userType];
			},
			getUserInfo() {
				console.log("getUserInfo begin")
				uni.showLoading({
					title: '加载中...'
				});

				let token = uni.getStorageSync('token')

				if (token) {
					uniCloud.callFunction({
						name: 'validateToken',
						data: {
							token: uni.getStorageSync('token')
						}
					}).then((res) => {
						console.log("validateToken", res.result.data)
						try {
							const {
								userType,
								school
							} = res.result.data;
							this.school = school;
							this.userType = userType;
							this.userText = this.setUserText(userType)
						} catch (e) {
							throw new Error("参数错误请重新登录");
						}
						uni.hideLoading()
					}).catch((err) => {
						uni.hideLoading()
						uni.showModal({
							content: '请求云函数发生错误，' + err.message,
							showCancel: false
						})
					})
				} else {
					uni.navigateTo({
						url: "../login/login"
					})
				}
			}
		}
	}
</script>

<style>
	.orgimg {
		 margin-bottom: -120upx;
		 margin-top: 30upx;
		 /* margin-left: 35upx; */
		 width:700upx;
		 height: 300upx;},
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 100rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		text-align: center;
	}

	.tipText {
		text-align: left;
		margin: 40upx 0;
	}

	.title {
		font-size: 20px;
		text-align: center;
		font-weight: bold;
		margin-bottom: 30upx;
		padding: 20px 0px;

	}

	.buttonGroup {
		width: 100%;
		margin-bottom: 40upx;
	}

	.buttonGroup .linkBtn {
		font-size: 30upx;
		display: block;
		line-height: 80upx;
		margin: 0 auto;
		width: 90%;
		text-align: center;
		margin-bottom: 20upx;
		border-radius: 40upx;
		box-shadow: 0 3px 5px rgba(5, 26, 180, 0.35);
		font-weight: bold;
		background: linear-gradient(135deg, #576FEC 0%, #576FEC 76%, #536DEC 76%);
		color: #fff;
	}

	.welcome {
		padding-left: 22px;
		margin-bottom: 35px;
	}
</style>
