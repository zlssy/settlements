define(function(require, exports, module) {
    var art_dialog = require('dialog');
	function init() {
        uploadfile();
	}

    function uploadfile() {
        $('#uploadFile').fileupload({
            url: global_config.serverRoot + "/reconciliation",
            start: function () {
                art_dialog.loading.start("uploading");
            },
            done: function (e, data) {
                console.log(data);
            },
            always:function(e, data){
                art_dialog.loading.end();
                if(data.result && data.result.code != 0){
                    dialog.error('Failed', data.result.msg);
                }

            }
        })
    }

	return {
		init: init
	};
});