define(function(require, exports, module) {
	var Utils = require('utils'),
		Grid = require('grid-bootstrapui'),

		content = $('#content'),
		listContainer = $('#grid_list'),
		userParam = {},
		_grid;

	function init() {
		loadData();
	}

	function loadData() {
		_grid = Grid.create({
			key: 'merchantId',
			cols: [{
				name: '商户ID',
				index: 'merchantId'
			}, {
				name: '流水号',
				index: 'accountNumber'
			}, {
				name: '清算日期',
				index: 'clearingDate'
			}, {
				name: '交易金额',
				index: 'tradeAmount'
			}, {
				name: '交易笔数',
				index: 'tradeTrans'
			}, {
				name: '退还金额',
				index: 'refundAmount'
			}, {
				name: '退换笔数',
				index: 'refundTrans'
			}, {
				name: '成本',
				index: 'cost'
			}, {
				name: '服务费',
				index: 'serviceCharge'
			}, {
				name: '清算量',
				index: 'settleAmount'
			}, {
				name: '收益',
				index: 'profit'
			}, {
				name: '状态',
				index: 'status'
			}],
			actions:{
				add:true,
				edit:true,
				del:true,
				view:true,
				refresh:true
			},
			url: global_config.serverRoot + 'clearing/list?userId=' + Utils.object2param(userParam),
			pagesize: 10,
			jsonReader: {
				root: 'data.pageData',
				page: 'data.pageNo',
				records: 'data.totalCount'
			}
		});

		listContainer.html(_grid.getHtml());
		_grid.listen('refreshCallback', function(v){
			console.log(v);
		});
		_grid.load();
		registerEvents();
	}

	function registerEvents() {
		var evtListener = function(e) {
			var $el = $(e.target || e.srcElement),
				cls = $el.attr('class'),
				tag = $el.get(0).tagName.toLowerCase();
			if (cls && cls.indexOf('fa-calendar') > -1) {
				$el.parent().siblings().focus();
			}
		};

		$(document.body).on('click', evtListener);
		$('.datepicker').datepicker({
			autoclose: true,
			todayHighlight: true
		});
	}

	return {
		init: init
	};
});