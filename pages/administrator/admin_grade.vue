<!-- 管理员管理年级信息 -->
<template>
	<view class="warp" style="margin-top:50rpx ;">
		<view align="center" style="margin-left:10rpx ;">管理高校年级信息</view>
		<form action="">
			<view class="uni-title  uni-common-pl">学校</view>
			<view class="uni-form-item dashed-bottom">
				<input id="School" class="uni-input" type="text" name="School" v-model="School" placeholder="请输入学校" />
			</view>
			<view class="uni-title  uni-common-pl">学院</view>
			<view class="uni-form-item dashed-bottom">
				<input id="college" class="uni-input" type="text" name="college" v-model="college" placeholder="请输入学院" />
			</view>
			<view class="uni-title  uni-common-pl">年级</view>
			<view class="uni-form-item dashed-bottom">
				<input id="name" class="uni-input" type="text" name="name" v-model="name" placeholder="请输入年级" />
			</view>
			<button @click="submit" form-type="submit" type="primary" size="mini" class="button margin-top margin-lr">{{isedit?'修改':'添加'}}</button>
			<button @click="cancel"  type="primary" size="mini" class="button margin-top margin-lr">取消</button>
		</form>
		<view class="box" style="margin-top:50rpx ;">
			<!-- HTML表格 -->
			<t-table border="1" border-color="#e6e5e5">
				<!-- 表头 -->
				<t-tr font-size="14" color="#101411" align="center">
					<view style="width: 75rpx;">
						<t-th align="left">序号</t-th>
					</view>
					<t-th align="left">学校</t-th>
					<t-th align="left">学院</t-th>
					<!-- <view style="width: 90rpx;"> -->
					    <t-th align="left">年级</t-th>
					<!-- </view> -->
					<view style="width: 250rpx;">
						<t-th align="left">操作</t-th>
					</view>
				</t-tr>
				<!-- 表头 -->
				<t-tr font-size="12" color="#101411" align="right" v-for="(item,index) of tableList" :key="item._id">
					<view style="width: 75rpx;">
							<t-td align="left">{{item.order }}</t-td>
					</view>
					<t-td align="left">{{ item.School }}</t-td>
					<t-td align="left">{{ item.college }}</t-td>
					<!-- <view style="width: 90rpx;"> -->
					<t-td align="left">{{ item.name }}</t-td>
					<!-- </view> -->
					<!-- operation -->
					<view style="width: 250rpx;">
							<t-td align="left">
									<button size="mini" style="padding: 10rpx;" @click="navTo('/pages/administrator/admin_class?grade_id='+ item._id)"
									 type="primary">查看
									</button>
									<button size="mini" style="padding: 10rpx;" type="primary" @click="edit(item)">修改</button>
									<button size="mini" style="padding: 10rpx;" type="warn" @click="del(item)">删除</button>
							</t-td>
					</view>
					<!-- operation -->
				</t-tr>
			</t-table>
			<!-- HTML表格 -->
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
						School:'学校',
						college:'学院',
						name: '大一', //一年级、二年级等
						order: 0, //年级排序
					},
					{
						_id: "", // string，自生成--未处理
						School:'学校',
						college:'学院',
						name: '大二',
						order: 1, //年级排序
					},
					{
						_id: "", // string，自生成--未处理
						School:'学校',
						college:'学院',
						name: '大三', //一年级、二年级等
						order: 2, //年级排序
					},
					{
						_id: "", // string，自生成--未处理
						School:'学校',
						college:'学院',
						name: '大四', //一年级、二年级等
						order: 3, //年级排序
					}
				],
				//_id: '', // string，自生成--未处理
				School:'',
				college:'',
				name: '', //一年级、二年级等
				order: '', //年级排序
				isedit: false,
				list_item: {} //待修改项
			};
		},
		onLoad: function() {
			this.init()
		},
		methods: {
			init() {
				uni.showLoading({
					title: '查询中，请稍等！'
				})
				this.tableList = []
				//获取年级列表
				uniCloud.callFunction({
						name: 'getGradeList',
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
				// 年级
				if (this.name == '') {
					uni.showToast({
						icon: "none",
						title: "年级名称不允许为空！"
					});
					return false;
				}
				uni.showLoading({
					title: '提交中..'
				})
				// 学校
				if (this.School == '') {
					uni.showToast({
						icon: "none",
						title: "学校名称不允许为空！"
					});
					return false;
				}
				uni.showLoading({
					title: '提交中..'
				})
				// 学院
				if (this.college == '') {
					uni.showToast({
						icon: "none",
						title: "学院名称不允许为空！"
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
					this.list_item.School = this.School
					this.list_item.college = this.college
					this.list_item.name = this.name
					form.data = this.list_item
					uni.showModal({
						title: '提示',
						content: '是否提交对该年级的修改？',
						success: (res) => {
							if (res.confirm) {
								uniCloud.callFunction({
										name: 'upGradeItem',
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
						School: this.School,
						college: this.college,
						name: this.name,
						order: this.tableList.length + 1
					}
					uni.showModal({
						title: '提示',
						content: '是否添加该年级？',
						success: (res) => {
							if (res.confirm) {
								uniCloud.callFunction({
										name: 'addGradeItem',
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
				this.School = '';
				this.college = '';
				this.name = '';
			},
			cancel() {
				// 点击取消之后，恢复默认值
				this.isedit = false;
				this.School = '';
				this.college = '';
				this.name = '';
			},
			navTo(url) {
				uni.navigateTo({
					url
				})
			},
			edit(list_item) {
				// 表格里显示出要修改的那一条信息
				this.School = list_item.School;
				this.college = list_item.college;
				this.name = list_item.name;
				// 此时直接点击提交后，调用的push方法，就不是修改，而是又增加一条信息
				this.isedit = true;
				// 待修改
				this.list_item = list_item


			},
			del(list_item) {
				// 此时的name是名字
				uni.showModal({
					title: '警告',
					content: '此操作会将该年级下关联的所有班级全部删除！！！',
					success: (res) => {
						if (res.confirm) {
							// findIndex 遍历查找指定元素的数组下标。
							var idx = this.tableList.findIndex(item => {
								return item.School == list_item.School;
								return item.college == list_item.college;
								return item.name == list_item.name;
								/* 相当于
								if(item.name == name){
								     return item;
								}*/
							})
							this.tableList.splice(idx, 1)

							//删除选中项
							uniCloud.callFunction({
									name: 'delGradeItem',
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
