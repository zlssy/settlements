define(function(require, exports, module) {
	var Utils = require('utils'),
		Grid = require('gridBootstrap'),
        form2json = require('form2json'),
        template = require('template'),
        art_dialog = require('dialog'),
        formValid = require("bv_valid"),
        renderSelect = require("renderSelect"),
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
				index: 'srcCurrencyCode',
                width:40
			}, {
				name: '目标币种',
				index: 'targetCurrencyCode'
			}, {
				name: '汇率',
				index: 'exchangeRate'
			}, {
				name: '状态',
				index: 'status'
			}, {
				name: '创建时间',
				index: 'creationDate'
			}],
			url: getUrl(),
			pagesize: 10,
			jsonReader: {
				root: 'data.pageData',
				page: 'data.pageNo',
				records: 'data.totalCnt'
			}
		});
		listContainer.html(_grid.getHtml());
		_grid.listen('refreshCallback', function(v) {
			console.log(v);
		});
		_grid.load();
        renderSelect($form);
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
		$('.datepicker').datetimepicker({
            format: 'yyyy-mm-dd hh:ii:ss',
			autoclose: true,
			todayHighlight: true,
            minuteStep:1
		});
	}

	function getUrl() {
		return global_config.serverRoot + '/exchangeRate/list?userId=' + Utils.object2param(userParam);
	}

    function showPop(data) {
        data = data || {};
        var content = template('tpleditItem')(data);
        var pop = art_dialog.edit({
            title:"新增汇率",
            content:content,
            skin:'ui-dialog-edit-2',
            ok:function(){

                var $form =  $el.find("form");
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
        var $el = $(pop.node);
        renderSelect($el);
        pop.show();
    }

    function doCreateItem(data, callback){
        $.post(global_config.serverRoot + "/exchangeRate/addOrUpdate", data, function(res){
            if(res.code == 0){
                callback(res);
            } else {
                art_dialog.error('错误', res.msg);
            }
        }, 'json');
    }

	return {
		init: init
	};
});