define(function(require, exports, module) {
	var Utils = require('utils'),
		Box = require('boxBootstrap'),
		Grid = require('gridBootstrap'),

		userParam = {},
		listContainer = $('#grid_list'),
		_grid;

	function init() {
		_grid = Grid.create({
			key: 'id',
			cols: [{
				name: '商户编号',
				index: 'accountNumber'
			}, {
				name: '结算卡算则方式',
				index: 'settleCardMethod'
			}, {
				name: '结算类型',
				index: 'settleRuleType'
			}, {
				name: '状态',
				index: 'settleRuleStatus'
			}, {
				name: '创建日期',
				index: 'creationDate'
			}, {
				name: '生效日期',
				index: 'effectiveDate'
			}, {
				name: '失效日期',
				index: 'expirationDate'
			}, {
				name: '操作',
				index: '',
				format: function(v) {
					return '<div class="ui-pg-div align-center"><span class="ui-icon ace-icon fa fa-pencil blue" title="编辑"></span><span class="ui-icon ace-icon fa fa-search-plus blue" title="查看"></span><span class="ui-icon ace-icon fa fa-clock-o blue" title="历史记录"></span></div>';
				}
			}],
			url: getUrl(),
			pagesize: 10,
			jsonReader: {
				root: 'data.pageData',
				page: 'data.pageNo',
				records: 'data.totalCnt'
			}
		});

		_grid.listen('renderCallback', function() {
			$('.ui-pg-div *[title]').tooltip({
				container: 'body'
			});
		});
		_grid.listen('addCallback', function() {
			addAndUpdate();
		});
		_grid.listen('editCallback', function(row) {
			addAndUpdate(row);
		});
		_grid.listen('viewCallback', function(row) {
			viewHistory(row);
		});
		listContainer.html(_grid.getHtml());
		_grid.load();
		registerEvents();
	}

	function getUrl() {
		return global_config.serverRoot + 'settleRule/list?userId=' + Utils.object2param(userParam);
	}

	function registerEvents(){
		
	}

	exports.init = init;
});