define(function(require, exports, module) {
	function init() {
        $('#uploadFile').fileupload({
            url: global_config.serverRoot + "/reconciliation" + "?payTool=1&dateStr=2015-5-1",
            done: function (e, data) {
                console.log(data);
            }
        })
	}


	return {
		init: init
	};
});