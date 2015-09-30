define(function(require, exports, module) {
	function init() {
        $('#uploadFile').fileupload({
            url: global_config.serverRoot + "/reconciliation",
            done: function (e, data) {
                console.log(data);
            }
        })
	}


	return {
		init: init
	};
});