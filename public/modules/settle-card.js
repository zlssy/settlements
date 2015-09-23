define(function(require, exports, module) {
	var Utils = require('utils'),
		Box = require('boxBootstrap'),
		Grid = require('gridBootstrap'),

		listContainer = $('#grid_list'),
		_grid,
		userParam = {};

	function init() {
		_grid = Grid.create({
			key: 'id',
			cols: [{
				name: '商户编号',
				index: 'id'
			}, {
				name: '状态',
				index: 'status'
			}, {
				name: '结算类型',
				index: 'settleCardType'
			}, {
				name: '开户行',
				index: 'issuer'
			}, {
				name: '银行账号',
				index: 'cardNumber'
			}, {
				name: '开户名',
				index: 'userName'
			}, {
				name: '优先级',
				index: 'priority'
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
					return '<div class="ui-pg-div align-center"><span class="ui-icon ace-icon fa fa-pencil blue" title="编辑"></span><span class="ui-icon ace-icon fa fa-search-plus grey" title="历史记录"></span></div>';
				}
			}],
			actions: {
				add: true
			},
			url: getUrl(),
			pagesize: 10,
			jsonReader: {
				root: 'data.pageData',
				page: 'data.pageNo',
				records: 'data.totalCnt'
			}
		});

		_grid.listen('addCallback', function(){
			console.log('add');
		});
		_grid.listen('editCallback', function(row){
			console.log(row);
		});
		_grid.listen('viewCallback', function(row){
			console.log('view', row);
		});
		listContainer.html(_grid.getHtml());
		_grid.load();
	}

	function getUrl() {
		return global_config.serverRoot + 'settleCard/list?userId=' + Utils.object2param(userParam);
	}

	exports.init = init;
});