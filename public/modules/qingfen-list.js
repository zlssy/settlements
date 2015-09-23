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

	function init() {
		loadData();
	}

	function loadData() {
		_grid = Grid.create({
			key: 'merchantId',
			checkbox: false,
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
		var newParam = {},
			newchange = false,
			qfstart = doms.qfstart.val(),
			qfend = doms.qfend.val(),
			jystart = doms.jystart.val(),
			jyend = doms.jyend.val(),
			qfstatus = doms.qfstatus.val(),
			commercialId = doms.commercialId.val(),
			commercialName = doms.commercialName.val(),
			account = doms.account.val();

		if (qfstart) {
			newParam.clearingDateStart = qfstart;
		}
		if (qfend) {
			newParam.clearingDateEnd = qfend;
		}
		if (jystart) {
			newParam.tranDateStart = jystart;
		}
		if (jyend) {
			newParam.tranDateEnd = jyend;
		}
		if (qfstatus) {
			newParam.status = qfstatus;
		}
		if (commercialId) {
			newParam.commercialId = commercialId;
		}
		if (commercialName) {
			newParam.commercialName = encodeURIComponent(commercialName);
		}
		if (account) {
			newParam.account = account;
		}

		for (var k in newParam) {
			if (newParam[k] != userParam[k]) {
				newchange = true;
				break;
			}
		}
		if (newchange) {
			userParam = newParam;
		} else {
			alert('您的查询条件并没有做任何修改.');
			return false;
		}
		return true;
	}

	function getUrl() {
		return global_config.serverRoot + 'clearing/list?userId=' + Utils.object2param(userParam);
	}

	return {
		init: init
	};
});