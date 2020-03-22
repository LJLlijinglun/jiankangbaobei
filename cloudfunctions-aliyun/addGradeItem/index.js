// 添加年级项
'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	//context中可获取客户端调用的上下文
	const collection = db.collection('grade_list') // 获取表'grade_list'的集合对象引用
	const res = await collection.add(event) //添加
	return res.data
	return res // 返回json给客户端
};
