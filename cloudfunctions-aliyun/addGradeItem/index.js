// 添加年级项
'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const collection = db.collection('grade_list') // 获取表'grade_list'的集合对象
	const res = await collection.add(event) //添加
	return res.data
	return res // 返回json给客户端
};
