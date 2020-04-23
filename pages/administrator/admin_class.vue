<!-- 管理员管理班级信息 -->
<template>
	<view class="warp" style="margin-top:50rpx ;">
		<view align="center" style="margin-left:10rpx ;">管理专业班级信息</view>
		<form action="">
			<view class="uni-title  uni-common-pl">专业</view>
			<view class="uni-form-item dashed-bottom">
				<input id="major" class="uni-input" type="text" name="major" v-model="major" placeholder="请输入专业" />
			</view>
			<view class="uni-title  uni-common-pl">班级</view>
			<view class="uni-form-item dashed-bottom">
				<input id="name" class="uni-input" type="text" name="name" v-model="name" placeholder="请输入班级" />
			</view>
			<view class="uni-title  uni-common-pl">班级总人数</view>
			<view class="uni-form-item dashed-bottom" style="">
				<input id="student_sum" class="uni-input" type="number" name="student_sum" v-model="student_sum" placeholder="请输入班级总人数" />
			</view>
			<button @click="submit" form-type="submit" type="primary" size="mini"  class=" margin-top margin-lr">{{isedit?'修改':'添加'}}</button>
			<button @click="cancel"  type="primary" size="mini" class="button margin-top margin-lr">取消</button>
		</form>
		<view class="box" style="margin-top:50rpx ;">
			<t-table border="1" border-color="#e6e5e5">
				<t-tr font-size="12" color="#101411" align="center">
					<view style="width: 80rpx;">
						<t-th align="left">序号</t-th>
					</view>
					<t-th align="left">专业</t-th>
					<t-th align="left">班级</t-th>
					<t-th align="left">总人数</t-th>
					<t-th align="left">操作</t-th>
				</t-tr>
				<t-tr font-size="10" color="#494743" align="right" v-for="(item,index) of tableList" :key="item._id">
					<view style="width: 80rpx;">
						<t-td align="left">{{ item.order }}</t-td>
					</view>
					<t-td align="left">{{ item.major }}</t-td>
					<t-td align="left">{{ item.name }}</t-td>
					<t-td align="left">{{ item.student_sum }}</t-td>
					<t-td align="left">
						<button size="mini" style="padding: 10rpx;" type="primary" @click="edit(item)">修改</button>
						<button size="mini" style="padding: 10rpx;" type="warn" @click="del(item)">删除</button>
					</t-td>
				</t-tr>
			</t-table>
		</view>
	</view>
</template>

<script>
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';

	export default {
		components: {
			tTable,
			tTh,
			tTr,
			tTd
		},
		data() {
			return {
				tableList: [{
						_id: "", // string，自生成--未处理
						grade_id: 0, //所属年级ID
						major: '专业',
						name: '胜利1班', //班级名称，如"994班"、"信计02"等
						student_sum: 20, //当前班级总人数
						order: 0, //int，同年级下的排序
					},
					{
						_id: "", // string，自生成--未处理
						grade_id: 1, //所属年级ID
						major: '专业',
						name: '胜利2班', //班级名称，如"994班"、"信计02"等
						student_sum: 30, //当前班级总人数
						order: 1, //int，同年级下的排序
					},
					{
						_id: "", // string，自生成--未处理
						grade_id: 2, //所属年级ID
						major: '专业',
						name: '胜利3班', //班级名称，如"994班"、"信计02"等
						student_sum: 40, //当前班级总人数
						order: 2, //int，同年级下的排序
					}
				],
				//_id: "", // string，自生成--未处理
				grade_id: "", //所属年级ID
				major: "", //所属专业ID
				name: '', //班级名称，如"994班"、"信计02"等
				student_sum: '', //当前班级总人数
				order: '', //int，同年级下的排序
				isedit: false,
				list_item: {} //待修改项
			};
		},
		onLoad: function(e) {
			this.grade_id = e.grade_id
			this.init()
		},
		methods: {
			init() {
				uni.showLoading({
					title: '查询中，请稍等！'
				})
				this.tableList = []
				//获取班级列表
				uniCloud.callFunction({
						name: 'getClass',
						data: {
							grade_id: this.grade_id
						}
					})
					.then(res => {
						uni.hideLoading()
						console.log(res);
						this.tableList = res.result
					})
					.catch(err => {
						uni.hideLoading();
						console.error(err);
					});
			},
			submit() {
				// 专业
				if (this.major == '') {
					uni.showToast({
						icon: "none",
						title: "专业名称不允许为空！"
					});
					return false;
				}
				// 班级
				if (this.name == '') {
					uni.showToast({
						icon: "none",
						title: "班级名称不允许为空！"
					});
					return false;
				}
				// 班级总数
				if (this.student_sum == 0) {
					uni.showToast({
						icon: "none",
						title: "班级总人数不允许为0！"
					});
					return false;
				}
				uni.showLoading({
					title: '提交中..'
				})
				//利用this.isedit为true时，提示为修改。之后，把this.isedit修改为默认值false
				if (this.isedit == true) {
					// 修改
					let form = {
						id: this.list_item._id,
						data: {}
					}
					delete this.list_item._id //删除ID,更新内容不能带上ID
					this.list_item.major = this.major
					this.list_item.name = this.name
					this.list_item.student_sum = this.student_sum,
					form.data = this.list_item
					uni.showModal({
						title: '提示',
						content: '是否提交对该班级的修改？',
						success: (res) => {
							if (res.confirm) {
								uniCloud.callFunction({
										name: 'upClassItem',
										data: form
									})
									.then(res => {
										uni.hideLoading();
										// 重新获得列表
										this.init()
									})
									.catch(err => {
										uni.hideLoading();
										console.error(err);
									});
							}
						}
					})

				} else {
					// 添加
					var info = {
						major: this.major,
						name: this.name,
						student_sum: this.student_sum,
						order: this.tableList.length + 1,
						grade_id: this.grade_id
					}
					uni.showModal({
						title: '提示',
						content: '是否添加该专业班级？',
						success: (res) => {
							if (res.confirm) {
								uniCloud.callFunction({
										name: 'addClassItem',
										data: info
									})
									.then(res => {
										uni.hideLoading();
										// 重新获得列表
										this.init()
									})
									.catch(err => {
										uni.hideLoading();
										console.error(err);
									});
							}
						}
					})
				}
				// 点击提交之后，恢复默认值
				this.isedit = false;
				this.major = '';
				this.name = '';
				this.student_sum = '';
			},
			cancel() {
				// 点击取消之后，恢复默认值
				this.isedit = false;
				this.major = '';
				this.name = '';
				this.student_sum = '';
			},
			edit(list_item) {
				// 表格里显示出要修改的那一条信息
				this.major = list_item.major;
				this.name = list_item.name;
				this.student_sum = list_item.student_sum;
				// 此时直接点击提交后，调用的push方法，就不是修改，而是又增加一条信息
				this.isedit = true;
				// 待修改
				this.list_item = list_item
			},
			del(list_item) {
				// 此时的name是名字
				uni.showModal({
					title: '警告',
					content: '此操作会将该班级下所有学生及已有的健康报备数据全部删除！！！',
					success: (res) => {
						if (res.confirm) {
							// findIndex 遍历查找指定元素的数组下标。
							var idx = this.tableList.findIndex(item => {
								return item.major == list_item.major;
								return item.name == list_item.name;
								/* 相当于
								if(item.name == name){
								     return item;
								}*/
							})
							this.tableList.splice(idx, 1)

							//删除选中项
							uniCloud.callFunction({
									name: 'delClassItem',
									data: {
										_id: list_item._id
									}
								})
								.then(res => {
									console.log(res);
									// 重新获得列表
									this.init()
								})
								.catch(err => {
									uni.hideLoading();
									console.error(err);
								});
						}
					}
				})
			},
		}
	};
</script>

<style scoped>

</style>
