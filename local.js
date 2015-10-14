module.exports = {
	port: '3000', //监听的端口号
	proxyPath: '/qf', //url根路径
	filePath: '/qf'//引用静态前端文件(js,css)路径

/*说明
不通过代理访问 或者 代理的路径为根目录时请如下配置
proxyPath: '',
filePath:  '',
*/
}