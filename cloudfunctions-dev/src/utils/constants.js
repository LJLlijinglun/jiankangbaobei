const loginConfig = {
	AppId: 'wx727786d6c583ae1f', //微信小程序AppId
	AppSecret: 'dd0e6e3286bcdc093d87179911dad9dd' //微信小程序AppSecret
}

const passSecret = 'Tinalijinglun1749553634' //用于用户数据库密码加密的密钥，使用一个比较长的随机字符串即可

//上面三个字段非常重要！！！

const tokenExp = 7200000

export {
	loginConfig,
	passSecret,
	tokenExp
}
