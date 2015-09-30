define(function(require, exports, module) {
	var Utils = require('utils'),
		Box = require('boxBootstrap'),
		Grid = require('gridBootstrap'),
		Xss = require('xss'),

		listContainer = $('#grid_list'),
		addEditTpl = $('#addEditTpl').html(),
		_grid, doms = {},
		dictionaryCollection = {},
		userParam = {};

	function init() {
		_grid = Grid.create({
			key: 'id',
			cols: [{
				name: '商户编号',
				index: 'id'
			}, {
				name: '状态',
				index: 'settleCardStatus'
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
					return '<div class="ui-pg-div align-center"><span class="ui-icon ace-icon fa fa-pencil blue" title="编辑"></span><span class="ui-icon ace-icon fa fa-clock-o blue" title="历史记录"></span></div>';
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
			$('.ui-pg-div .fa-clock-o').on('click', function() {
				setTimeout(function() {
					viewHistory(_grid.getSelectedRow())
				}, 0);
			})
		});
		_grid.listen('addCallback', function() {
			addAndUpdate();
		});
		_grid.listen('editCallback', function(row) {
			addAndUpdate(row);
		});
		listContainer.html(_grid.getHtml());
		_grid.load();
		getDictionaryFromServer('settleCardType', function(json) {
			if ('0' == json.code) {
				dictionaryCollection.typeArr = json.data && json.data.dataArray || [];
				setSelect('typeArr', doms.cardType);
			}
		}, function(e) {
			// report
		});
		getDictionaryFromServer('settleCardStatus', function(json) {
			if ('0' == json.code) {
				dictionaryCollection.statusArr = json.data && json.data.dataArray || [];
				setSelect('statusArr', doms.status);
			}
		}, function(e) {
			// report and retry
		});
		registerEvents();
	}

	/**
	 * [addAndUpdate 添加、编辑功能]
	 * @param {[type]} data [description]
	 */
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
		setSelect('typeArr', $('#lx'));
		setSelect('statusArr', $('#zt'));
		data && fillData(data);
		$('.bootbox .datepicker').datetimepicker({
			autoclose: true,
			todayHighlight: true
		});
		$('.bootbox input, .bootbox select').on('change', function(e) {
			validate($(this));
		});
	}

	/**
	 * [validate 检验函数]
	 * @param  {[HTML Element]} el [要校验的元素，不传递则全部检查]
	 * @return {[Boolean]}    [description]
	 */
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

	/**
	 * [isDate 检查数据是否是日期类型]
	 * @param  {[String]}  d [要检查的字符串]
	 * @return {Boolean}   [返回值]
	 */
	function isDate(d) {
		return Utils.isDate(d);
	}

	/**
	 * [fillData 编辑时，填充数据]
	 * @param  {[Object]} d [选中行数据]
	 * @return {[type]}   [description]
	 */
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

	/**
	 * [submitData 最终的数据提交]
	 * @param  {[Object]} d [选中行的数据]
	 * @return {[type]}   [description]
	 */
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

	/**
	 * [viewHistory 查看历史记录]
	 * @param  {[Array]} row [选中行的数组]
	 * @return {[type]}     [description]
	 */
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

	/**
	 * [showHistory 展示历史操作信息]
	 * @param  {[Array]} data [要展示的数据]
	 * @return {[type]}      [description]
	 */
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

	/**
	 * [showDialog 展示对话框]
	 * @param  {[type]} opt [参数]
	 * @return {[type]}     [description]
	 */
	function showDialog(opt) {
		Box.dialog(opt);
	}

	/**
	 * [getUrl 获取查询url]
	 * @return {[type]} [description]
	 */
	function getUrl() {
		return global_config.serverRoot + 'settleCard/list?userId=' + Utils.object2param(userParam);
	}

	function getDictionaryFromServer(type, callback, errorback) {
		var emptyFn = function() {},
			cb = callback || emptyFn,
			ecb = errorback || emptyFn;
		$.ajax({
			url: global_config.serverRoot + 'dataDictionary/dropdownlist?userId=' + '&type=' + type,
			success: cb,
			error: ecb
		});
	}

	function setSelect(gArr, dom, selected) {
		var data = dictionaryCollection[gArr],
			s = '',
			context = this,
			args = Array.prototype.slice.call(arguments, 0),
			fn = arguments.callee;
		if (!data) {
			setTimeout(function() {
				console.log('retry');
				fn.apply(context, args);
			}, 10);
			return;
		}
		for (var i = 0; i < data.length; i++) {
			if (selected == data[i].innerValue) {
				s = ' selected = "selected"';
			} else {
				s = '';
			}
			dom.append('<option value="' + data[i].innerValue + '"' + s + '>' + Xss.inHTMLData(data[i].label) + '</option>');
		}
	}

	/**
	 * [registerEvents 注册事件]
	 * @return {[type]} [description]
	 */
	function registerEvents() {
		doms.commercialIds = $('#commercialIds');
		doms.issuer = $('#issuer');
		doms.userName = $('#userName');
		doms.cardNumber = $('#cardNumber');
		doms.cardType = $('#cardType');
		doms.status = $('#status');
		doms.effectiveDateStart = $('#effectiveDateStart');
		doms.effectiveDateEnd = $('#effectiveDateEnd');
		doms.expirationDateStart = $('#expirationDateStart');
		doms.expirationDateEnd = $('#expirationDateEnd');

		$('#add-btn').on('click', function() {
			_grid.trigger('addCallback');
		});
		$('.datepicker').datetimepicker({
			autoclose: true,
			todayHighlight: true
		});
		$(document.body).on('click', function(e) {
			var $el = $(e.target || e.srcElement),
				cls = $el.attr('class'),
				tag = $el.get(0).tagName.toLowerCase(),
				id = $el.attr('id');
			if (cls && cls.indexOf('fa-calendar') > -1) {
				$el.parent().siblings('input').focus();
			}
			if (cls && cls.indexOf('fa-check') > -1 || (id && 'query-btn' == id)) {
				if (getParams()) {
					_grid.setUrl(getUrl());
					_grid.loadData();
				}
			}
			if (cls && cls.indexOf('fa-undo') > -1 || (id && 'reset-btn' == id)) {
				userParam = {};
				doms.commercialIds.val('');
				doms.issuer.val('');
				doms.userName.val('');
				doms.cardNumber.val('');
				doms.cardType.val(0);
				doms.status.val(0);
				doms.effectiveDateStart.val('');
				doms.effectiveDateEnd.val('');
				doms.expirationDateStart.val('');
				doms.expirationDateEnd.val('');
			}
		});

	}

	function getParams() {
		var newchange = false,
			newParam = {},
			commercialId = doms.commercialIds.val(),
			issuer = doms.issuer.val(),
			userName = doms.userName.val(),
			cardNumber = doms.cardNumber.val(),
			cardType = doms.cardType.val(),
			status = doms.status.val(),
			effectiveDateStart = doms.effectiveDateStart.val(),
			effectiveDateEnd = doms.effectiveDateEnd.val(),
			expirationDateStart = doms.expirationDateStart.val(),
			expirationDateEnd = doms.expirationDateEnd.val();
		if (commercialId) {
			newParam.commercialId = encodeURIComponent(commercialId);
		}
		if (issuer) {
			newParam.issuer = encodeURIComponent(issuer);
		}
		if (userName) {
			newParam.userName = encodeURIComponent(userName);
		}
		if (cardNumber) {
			newParam.cardNumber = encodeURIComponent(cardNumber);
		}
		if (cardType) {
			newParam.cardType = cardType;
		}
		if (status) {
			newParam.status = status;
		}
		if (isDate(effectiveDateStart)) {
			newParam.effectiveDateStart = effectiveDateStart;
		}
		if (isDate(effectiveDateEnd)) {
			newParam.effectiveDateEnd = effectiveDateEnd;
		}
		if (isDate(expirationDateStart)) {
			newParam.expirationDateStart = expirationDateStart;
		}
		if (isDate(expirationDateEnd)) {
			newParam.expirationDateEnd = expirationDateEnd;
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
			Box.alert('您的查询条件并没有做任何修改.');
			return false;
		}
		return true;
	}

	exports.init = init;
});