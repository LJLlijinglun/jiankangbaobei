// 老师绑定班级信息 
'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const gradeList = db.collection('grade_list') //  获取年级表
	const classList = db.collection('class_list') //  获取班级表
	const teachers = db.collection('teachers') //  获取老师信息表
	let data = {}
	//event为客户端上传的参数
	if (event.grade_id == null) {
		let gradeData = await gradeList.get()
		data = gradeData.data
	} else if (event.class_info == null) {
		let classData = await classList.where({
			// 获取班级表的总数
			grade_id: dbCmd.eq(event.grade_id)
		}).get()
		data = classData.data
	} else {
        
        let teacherObj = await teachers.where({
			tokenSecret: event.token
		}).get()
        
        
        let uid = event.uid
        if(uid){
            teachers.doc(uid).update({
                class_info:event.class_info
            })
        }
        
        console.log("teacherObj",teacherObj)
        
        // if(teacherObj.data){
        //     teacherObj.update({
        //         class_info:event.class_info
        //     })
        // }
        
        
		// let classData = await teachers.where({
		// 	// 获取班级表的总数
		// 	tokenSecret: dbCmd.eq(event.token)
		// }).update({
		// 	class_info: event.class_info
		// })
		data = {
			// classData: classData
		}
	}

	//返回数据给客户端
	return data
};
