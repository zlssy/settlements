define(function(require, exports, module) {
	var Utils = require('utils'),
		Grid = require('gridBootstrap'),

		content = $('#content'),
		listContainer = $('#grid_list'),
		userParam = {},
		doms = {
			qfstart: $('input[name="qfstart"]'),
			qfend: $('input[name="qfend"]'),
			jystart: $('input[name="jystart"]'),
			jyend: $('input[name="jyend"]'),
			qfstatus: $('#qfstatus'),
			commercialId: $('#commercialId'),
			commercialName: $('#commercialName'),
			account: $('#account')
		},
		_grid;

	var apis = {
			list : global_config.serverRoot + '/dataDictionary/list',
			add : global_config.serverRoot + '/dataDictionary/addOrUpdate',
			update : global_config.serverRoot + '/dataDictionary/addOrUpdate',
			show : global_config.serverRoot + '/dataDictionary/detail',
			dropdownlist : global_config.serverRoot + '/dataDictionary/dropdownlist'
		}
	function init() {
		loadData();
	}

	function loadData() {
		_grid = Grid.create({
			key: 'merchantId',
			checkbox: false,
			cols: [{
				name: '字典类型编码',
				index: 'type'
			}, {
				name: '字典类型名称',
				index: 'label'
			}, {
				name: '操作',
				index: 'clearingDate'
			}],
			url: apis.list,
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
		//registerEvents();
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
			if (cls && cls.indexOf('fa-check') > -1 || (id && 'query-btn' == id)) {
				if (getParams()) {
					console.log(userParam);
					_grid.setUrl(getUrl());
					_grid.loadData();
				}
			}
			if (cls && cls.indexOf('fa-undo') > -1 || (id && 'reset-btn' == id)) {
				userParam = {};
				doms.qfstart.val('');
				doms.qfend.val('');
				doms.jystart.val('');
				doms.jyend.val('');
				doms.qfstatus.val(0);
				doms.commercialId.val('');
				doms.commercialName.val('');
				doms.account.val('');
			}
			if (cls && cls.indexOf('fa-file-excel-o') > -1 || (id && 'export-btn' == id)) {
				exportExcel();
			}
		};

		$(document.body).on('click', evtListener);
		$('.datepicker').datepicker({
			autoclose: true,
			todayHighlight: true
		});
	}

	function exportExcel() {
		var a = document.createElement('a');
		a.href = global_config.serverRoot + 'clearing/export?userId=' + Utils.object2param(userParam);
		a.target = '_blank';
		a.height = 0;
		a.width = 0;
		document.body.appendChild(a);
		var e = document.createEvent('HTMLEvents');
		e.initEvent('click', true, false);
		a.dispatchEvent(e);
		a.remove();
	}

	function getParams() {
		
	}

	return {
		init: init
	};
});