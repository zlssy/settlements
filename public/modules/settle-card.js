define(function(require, exports, module) {
	var Utils = require('utils'),
		Box = require('boxBootstrap'),
		Grid = require('gridBootstrap'),
		Xss = require('xss'),

		listContainer = $('#grid_list'),
		addEditTpl = $('#addEditTpl').html(),
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

	function addAndUpdate(data) {
		var opt = {},
			id = '';

		opt.message = '<h4><b>' + (data ? '修改结算卡' : '新增结算卡') + '</b></h4><hr class="no-margin">' + addEditTpl;
		opt.buttons = {
			"save": {
				label: '<i class="ace-icon fa fa-check"></i> 保存',
				className: 'btn-sm btn-success',
				callback: function() {
					if (!validate()) {
						return false;
					} else {
						submitData(data);
					}
				}
			},
			"cancel": {
				label: '取消',
				className: 'btn-sm'
			}
		};
		showDialog(opt);
		data && fillData(data);
		$('.bootbox .datepicker').datepicker({
			autoclose: true
		});
		$('.bootbox input, .bootbox select').on('change', function(e) {
			validate($(this));
		});
	}

	function validate(el) {
		var pass = true;
		if (el) {
			var elp = el.parents('.form-group:first');
			if (el.data('date-format')) {
				if (!isDate(el.val())) {
					pass = false;
					elp.addClass('has-error');
				} else {
					elp.removeClass('has-error');
				}
			}
		} else {
			if (!this.sxsjDom) {
				this.sxsjDom = $('#sxsj');
				this.sxsjDomP = this.sxsjDom.parents('.form-group:first');
				this.xxsjDom = $('#xxsj');
				this.xxsjDomP = this.xxsjDom.parents('.form-group:first');
			}
			if (!isDate(this.sxsjDom.val())) {
				pass = false;
				this.sxsjDomP.addClass('has-error');
			} else {
				this.sxsjDomP.removeClass('has-error');
			}
			if (!isDate(this.xxsjDom.val())) {
				pass = false;
				this.xxsjDomP.addClass('has-error');
			} else {
				this.xxsjDomP.removeClass('has-error');
			}
		}
		return pass;
	}

	function isDate(d) {
		var r;
		try {
			r = !!Date.parse(d);
		} catch (e) {
			r = false;
		}
		return r;
	}

	function fillData(d) {
		var data = d[0] || {};
		if (data.merchantId) {
			$('#shbh').val(data.merchantId);
		}
		if (data.cardNumber) {
			$('#yhzh').val(data.cardNumber);
		}
		if (data.userName) {
			$('#khm').val(data.userName);
		}
		if (data.priority) {
			$('#yxj').val(data.priority);
		}
		if (data.status) {
			$('#zt').val(data.status);
		}
		if (data.cardType) {
			$('#lx').val(data.cardType);
		}
		if (data.effectiveDate) {
			$('#sxsj').val(data.effectiveDate);
		}
		if (data.expirationDate) {
			$('#xxsj').val(data.expirationDate);
		}
	}

	function submitData(d) {
		var id = d && d[0] && d[0].id || '',
			data = {
				id: id
			},
			merchantId = $('#shbh').val(),
			cardNumber = $('#yhzh').val(),
			userName = $('#khm').val(),
			priority = $('#yxj').val(),
			status = $('#zt').val(),
			cardType = $('#lx').val(),
			effectiveDate = $('#sxsj').val(),
			expirationDate = $('#xxsj').val();
		if (merchantId) {
			data.merchantId = merchantId;
		}
		if (cardNumber) {
			data.cardNumber = cardNumber;
		}
		if (userName) {
			data.userName = userName;
		}
		if (priority) {
			data.priority = priority;
		}
		if (status) {
			data.status = status;
		}
		if (cardType) {
			data.cardType = cardType;
		}
		if (effectiveDate) {
			data.effectiveDate = effectiveDate;
		}
		if (expirationDate) {
			data.expirationDate = expirationDate;
		}
		$.ajax({
			url: global_config.serverRoot + 'settleCard/addOrUpdate',
			method: 'post',
			data: data,
			success: function(json) {
				if ('0' == json.code) {
					_grid.loadData();
				} else {
					Box.alert('数据保存失败！');
				}
			},
			error: function(json) {
				Box.alert('数据保存失败~');
			}
		})
	}

	function viewHistory(row) {
		var id = row[0].id;
		$.ajax({
			url: global_config.serverRoot + '/settleCard/history?userId=' + '&id=' + id,
			success: function(json) {
				if ('0' == json.code) {
					showHistory(json.data.pageData);
				}
			},
			error: function(json) {
				// some report
			}
		})
	}

	function showHistory(data) {
		var html = ['<h4><b>操作历史</b></h4><hr class="no-margin">'],
			d;
		html.push('<table class="table table-striped table-bordered table-hover">');
		html.push('<thead><tr><th>操作人</th><th>操作时间</th><th>操作类型</th></tr></thead>');
		html.push('<tbody>');
		for (var i = 0; i < data.length; i++) {
			d = data[i];
			html.push('<tr>');
			html.push('<td>' + Xss.inHTMLData(d.operater) + '</td>');
			html.push('<td>' + d.date + '</td>');
			html.push('<td>' + d.type + '</td>');
			html.push('</tr>');
		}
		html.push('</tbody></table>');

		Box.alert(html.join(''));
	}

	function showDialog(opt) {
		Box.dialog(opt);
	}

	function getUrl() {
		return global_config.serverRoot + 'settleCard/list?userId=' + Utils.object2param(userParam);
	}

	function registerEvents() {
		$('#add-btn').on('click', function() {
			_grid.trigger('addCallback');
		});
		$('.datepicker').datepicker({
			autoclose: true
		});
		$(document.body).on('click', function(e) {
			var $el = $(e.target || e.srcElement),
				cls = $el.attr('class'),
				tag = $el.get(0).tagName.toLowerCase(),
				id = $el.attr('id');
			if (cls && cls.indexOf('fa-calendar') > -1) {
				$el.parent().siblings('input').focus();
			}
		});
	}

	exports.init = init;
});