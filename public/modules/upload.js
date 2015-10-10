define(function(require, exports, module){

	function init(){
		$('#form').attr('action', 'http://testtclpay.tclclouds.com/' + global_config.serverRoot + '/settleCard/import');
		$('#file').ace_file_input({
			style: 'well',
			btn_choose: '点击/拖拽上传文件',
			btn_change: '已选文件如下：',
			droppable: true
		});
	}

	exports.init = init;
});