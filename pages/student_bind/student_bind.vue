<!-- 绑定学生信息 -->
<template>
    <view class="margin-lr">
        <view class="uni-list" style="margin-top: 30px;">
			<view class="uni-list-cell">
			    <view class="uni-list-cell-left">
			        选择学校
			    </view>
			    <view class="uni-list-cell-db">
			        <picker @change="bindPickerChange" :value="gradeIndex" :range="gradeArr" range-key="name">
			            <view class="uni-input">{{gradeName}}</view>
			        </picker>
			    </view>
			</view>
			<view class="uni-list-cell">
			    <view class="uni-list-cell-left">
			        选择学院
			    </view>
			    <view class="uni-list-cell-db">
			        <picker @change="bindPickerChange" :value="gradeIndex" :range="gradeArr" range-key="name">
			            <view class="uni-input">{{gradeName}}</view>
			        </picker>
			    </view>
			</view>
            <view class="uni-list-cell">
                <view class="uni-list-cell-left">
                    选择年级
                </view>
                <view class="uni-list-cell-db">
                    <picker @change="bindPickerChange" :value="gradeIndex" :range="gradeArr" range-key="name">
                        <view class="uni-input">{{gradeName}}</view>
                    </picker>
                </view>
            </view>

            <view class="uni-list-cell">
                <view class="uni-list-cell-left">
                    选择专业班级
                </view>
                <view class="uni-list-cell-db">
                    <picker @change="bindClassChange" :value="classIndex" :range="classArr" range-key="name">
                        <view class="uni-input">{{className}}</view>
                    </picker>
                </view>
            </view>
        </view>
        
        <view class="uni-title  uni-common-pl margin-top">学号</view>
        <view class="uni-form-item dashed-bottom">
            <input class="uni-input" type="text" name="stu_num" value="" placeholder="请输入学号" v-model="stu_num" />
        </view>
        
        
        <view class="uni-title  uni-common-pl">姓名</view>
        <view class="uni-form-item dashed-bottom">
            <input class="uni-input" type="text" name="stu_name" value="" placeholder="请输入学生姓名" v-model="stu_name" />
        </view>
       
        <view class="buttonGroup">
            <button type="primary" style="margin-bottom: 30rpx;" @click="bind">确定</button>
			<button class="linkBtn" type="primary" @click="go_back">返回</button>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
               userType:1,
               teacher_id: '5e369bd594a3c6004d0524b7', //  老师的id
               classList: [], //所有班级列表
               gradeArr: [], //  年级
               gradeName:'',
               gradeIndex: "", //年级索引
               classArr: [], //  特定年级下的班级
               classIndex: "", //班级索引
               className:'',
               stu_num:"",
               stu_name:""//学生姓名
            }
        },
        onLoad() {
            this.userType = uni.getStorageSync("userType")
            //获取班级列表
            uniCloud.callFunction({
                name: 'getClassList',
            })
            .then(res => {
                console.log(res);
                this.classList = res.result
                this.gradeArr = res.result.gradeList
				if (uni.getStorageSync('class_id')) {
					uni.showModal({
						title:'提示',
						content:'您已经设置过班级信息了，真的要重新绑定吗？',
						success: (res) => {
							if (res.cancel) {
								this.go_back()
							}
						}
					})
				}
            })
            .catch(err => {
                uni.hideLoading();
                console.error(err);
            });
        },
        methods: {
            bindPickerChange: function(e) {
                console.log(e.target.value)
                this.gradeIndex = e.target.value
                this.gradeName = this.gradeArr[this.gradeIndex].name
                this.classArr = this.classList[this.gradeArr[this.gradeIndex]._id]
            },

            bindClassChange: function(e) {
                this.classIndex = e.target.value
                this.className = this.classArr[this.classIndex].name
            },

            bind: function() {
                uni.showLoading({})
                uniCloud.callFunction({
                    name: 'StudentBind',
                    data: {
                        grade_id: this.gradeArr[this.gradeIndex]._id,
                        class_info: this.classArr[this.classIndex]._id,
                        token: uni.getStorageSync("token"),
                        uid: uni.getStorageSync("uid"),
                        userType: uni.getStorageSync("userType"),
                        stu_num:this.stu_num,
                        stu_name:this.stu_name
                    }
                })
                .then(res => {
                    uni.hideLoading();
                    console.log(res);
					uni.setStorageSync('stu_num',this.stu_num)
					uni.setStorageSync('stu_name',this.stu_name)
					uni.setStorageSync('class_id',this.classArr[this.classIndex]._id)
                    uni.showToast({
                        title: '绑定成功',
                        duration: 2000,
                        success() {
                            uni.navigateTo({
                                url:'/pages/index/index'
                            })
                        }
                    });
                })
                .catch(err => {
                    uni.hideLoading();
                    console.error(err);
                });
            },
			go_back: function() {
				if (getCurrentPages().length > 1) {
					uni.navigateBack();
				} else {
					uni.switchTab({
						url: '../index/index'
					})
				}
			},
        }
    };
</script>

<style>
.buttonGroup{
	margin-top: 80rpx;
	/* margin-bottom: 100rpx; */
}
.buttonGroup .linkBtn{
	/* margin-top: 80rpx; */
	/* margin-bottom: 100rpx; */
	background: linear-gradient(135deg, #576FEC 0%, #576FEC 76%, #536DEC 76%);
}
</style>
