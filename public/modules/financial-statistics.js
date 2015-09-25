define(function(require, exports, module) {
	var Utils = require('utils'),
		Grid = require('gridBootstrap'),
        form2json = require('form2json'),
        template = require('template'),
        dialog = require('boxBootstrap'),
		content = $('#content'),
		listContainer = $('#grid_list'),
        $form = $("#dataForm"),
		userParam = {},
		_grid;

	function init() {
		loadData();
	}

	function loadData() {
		_grid = Grid.create({
			key: 'merchantId',
			checkbox: false,
			cols: [{
				name: '源币种',
				index: 'merchantId'
			}, {
				name: '目标币种',
				index: 'accountNumber'
			}, {
				name: '汇率',
				index: 'clearingDate'
			}, {
				name: '状态',
				index: 'tradeAmount'
			}, {
				name: '创建时间',
				index: 'tradeTrans'
			}],
			url: getUrl(),
			pagesize: 10,
			jsonReader: {
				root: 'data.pageData',
				page: 'data.pageNo',
				records: 'data.totalCount'
			}
		});

		listContainer.html(_grid.getHtml());
		_grid.listen('refreshCallback', function(v) {
			console.log(v);
		});
		_grid.load();
		registerEvents();
	}

	function registerEvents() {
		var evtListener = function(e) {
			var $el = $(e.target || e.srcElement),
				cls = $el.attr('class') || '',
				id = $el.attr('id') || '',
				tag = $el.get(0).tagName.toLowerCase();
			if (cls && cls.indexOf('fa-calendar') > -1) {
				$el.parent().siblings().focus();
			}
            //查询
            if (id == 'query-btn') {
                userParam = $form.form2json();
                if (userParam) {
                    //post请求展示数据
                    _grid.setUrl(getUrl());
                    _grid.loadData();
                }
			}
            //重置
			if (cls && cls.indexOf('fa-undo') > -1 || (id && 'reset-btn' == id)) {
				userParam = {};
				$form.each("*[name]", function (i, k) {
                    k.val("")
                })
			}
            //新增
            if (id == 'add-btn') {
                showPop();
            }
		};

		$(document.body).on('click', evtListener);
		$('.datepicker').datepicker({
			autoclose: true,
			todayHighlight: true
		});
	}

	function getUrl() {
		return global_config.serverRoot + '/exchangeRate/list?userId=' + Utils.object2param(userParam);
	}

    function showPop(data) {
        data = data || {};
        var content = template('tpleditItem')(data);
        var pop = dialog.edit({
            title:"新增汇率",
            content:content,
            skin:'ui-dialog-edit-2',
            ok:function(){

                var $form =  $("#dialog_form");
                if(!formValid($form)){
                    return false;
                }
                var val = $form.form2json();
                doCreateItem(val, function(){
                    _grid.loadData();
                    pop.remove();
                });
                return false;
            },
            cancel:function(){
            }
        });
        pop.show();
    }

    function doCreateItem(data, callback){
        $.post(global_config.serverRoot + "/exchangeRate/addOrUpdate", data, function(res){
            if(res.code == 0){
                callback(res);
            }
        }, 'json');
    }

	return {
		init: init
	};
});