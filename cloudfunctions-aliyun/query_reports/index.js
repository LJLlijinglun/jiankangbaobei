//  每日健康统计汇总
'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const dailyReportLog = db.collection('daily_report_log') //  获取统计数据表
	const classList = db.collection('class_list') //  获取班级表

	
	
	let overall = await classList.where({
		// 获取班级表的总数 event为客户端上传的参数
		_id: dbCmd.eq(event.student_sum)
	}).get()
	let report = await dailyReportLog.where({
		// 请求当前时间 所上传健康数据的统计
		class_id: dbCmd.eq(event.arr),
		create_time: dbCmd.gte(event.time).and(dbCmd.lt(event.time2))
	}).get()

	let data = {
		student_sum: overall.data[0] ? overall.data[0].student_sum : '未获取到该班级信息',
		arr: report.data,
	}

	// const res = await classList.add(obj)
	//返回数据给客户端
	return data
};
