define(function(require, exports, module) {
	var Utils = require('utils'),
		Box = require('boxBootstrap'),
		Grid = require('gridBootstrap'),
		Xss = require('xss'),

		userParam = {},
		doms = {
			commercialId: $('#commercialId'),
			type: $('#type'),
			status: $('#status'),
			cardType: $('#cardType'),
			createTimeStart: $('#createTimeStart'),
			createTimeEnd: $('#createTimeEnd'),
			effectiveDateStart: $('#effectiveDateStart'),
			effectiveDateEnd: $('#effectiveDateEnd'),
			expirationDateStart: $('#expirationDateStart'),
			expirationDateEnd: $('#expirationDateEnd')
		},
		addEditTpl = $('#addEditTpl').html(),
		viewTpl = $('#viewTpl').html(),
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
			$('.ui-pg-div .fa-clock-o').on('click', function(e) {
				setTimeout(function() {
					viewHistory(_grid.getSelectedRow());
				}, 0);
			});
		});
		_grid.listen('addCallback', function() {
			addAndUpdate();
		});
		_grid.listen('editCallback', function(row) {
			addAndUpdate(row);
		});
		_grid.listen('viewCallback', function(row) {
			view(row);
		});
		listContainer.html(_grid.getHtml());
		_grid.load();
		registerEvents();
	}

	/**
	 * [addAndUpdate 添加、编辑功能]
	 * @param {[type]} data [description]
	 */
	function addAndUpdate(data) {
		var opt = {
				modal: true,
				dragable: true,
				title: '<h4><b>' + (data ? '修改结算规则' : '新增结算规则') + '</b></h4>',
				title_html: true
			},
			id = '';

		opt.message = addEditTpl;
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
		Box.dialog(opt);
		data && fillData(data);
		$('.bootbox .datepicker').datepicker({
			autoclose: true
		});
		$('.bootbox input, .bootbox select').on('change', function(e) {
			validate($(this));
		});
	}

	function submitData(row) {
		var data = {},
			fmerchantId = $("#fmerchantId").val(),
			faccountNumber = $("#faccountNumber").val(),
			fminimum = $("#fminimum").val(),
			fserviceCharge = $("#fserviceCharge").val(),
			fminimumFree = $("#fminimumFree").val(),
			fperiod = $("#fperiod").val(),
			flongestSettle = $("#flongestSettle").val(),
			feffectiveDate = $("#feffectiveDate").val(),
			fexpirationDate = $("#fexpirationDate").val(),
			ftZeroLimit = $("#ftZeroLimit").val(),
			finstantLimit = $("#finstantLimit").val(),
			ftZeroHolidayLimit = $("#ftZeroHolidayLimit").val(),
			ftOneHolidayLimit = $("#ftOneHolidayLimit").val(),
			fstatus = $('input[name="fstatus"]').val();

		data.id = row && row[0] && row[0].id || '';
		if (fmerchantId) {
			data.fmerchantId = fmerchantId;
		}
		if (faccountNumber) {
			data.faccountNumber = faccountNumber;
		}
		if (fminimum) {
			data.fminimum = fminimum;
		}
		if (fserviceCharge) {
			data.fserviceCharge = fserviceCharge;
		}
		if (fminimumFree) {
			data.fminimumFree = fminimumFree;
		}
		if (fperiod) {
			data.fperiod = fperiod;
		}
		if (flongestSettle) {
			data.flongestSettle = flongestSettle;
		}
		if (feffectiveDate) {
			data.feffectiveDate = feffectiveDate;
		}
		if (fexpirationDate) {
			data.fexpirationDate = fexpirationDate;
		}
		if (ftZeroLimit) {
			data.ftZeroLimit = ftZeroLimit;
		}
		if (finstantLimit) {
			data.finstantLimit = finstantLimit;
		}
		if (ftZeroHolidayLimit) {
			data.ftZeroHolidayLimit = ftZeroHolidayLimit;
		}
		if (ftOneHolidayLimit) {
			data.ftOneHolidayLimit = ftOneHolidayLimit;
		}
		if (fstatus) {
			data.status = status;
		}

		$.ajax({
			url: global_config.serverRoot + 'settleRule/addOrUpdate',
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
	 * [fillData 填充数据]
	 * @param  {[Object]} data [要填充的数据]
	 * @return {[type]}      [description]
	 */
	function fillData(data) {
		data = data[0] || {};
		if (data.merchantId) {
			$("#fmerchantId").val(data.merchantId)
		}
		if (data.accountNumber) {
			$("#faccountNumber").val(data.accountNumber)
		}
		if (data.minimum) {
			$("#fminimum").val(data.minimum)
		}
		if (data.serviceCharge) {
			$("#fserviceCharge").val(data.serviceCharge)
		}
		if (data.minimumFree) {
			$("#fminimumFree").val(data.minimumFree)
		}
		if (data.period) {
			$("#fperiod").val(data.period)
		}
		if (data.longestSettle) {
			$("#flongestSettle").val(data.longestSettle)
		}
		if (data.effectiveDate) {
			$("#feffectiveDate").val(data.effectiveDate)
		}
		if (data.expirationDate) {
			$("#fexpirationDate").val(data.expirationDate)
		}
		if (data.tZeroLimit) {
			$("#ftZeroLimit").val(data.tZeroLimit)
		}
		if (data.instantLimit) {
			$("#finstantLimit").val(data.instantLimit)
		}
		if (data.tZeroHolidayLimit) {
			$("#ftZeroHolidayLimit").val(data.tZeroHolidayLimit)
		}
		if (data.tOneHolidayLimit) {
			$("#ftOneHolidayLimit").val(data.tOneHolidayLimit)
		}
		if (data.status) {
			$('#fstatus').val(data.status);
		}
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
				if (Utils.isDate(el.val())) {
					elp.removeClass('has-error');
				} else {
					pass = false;
					elp.addClass('has-error');
				}
			} else if (el.data('int')) {
				if ($.isNumeric(el.val())) {
					elp.removeClass('has-error');
				} else {
					pass = false;
					elp.addClass('has-error');
				}
			}
		} else {
			$('.bootbox input').each(function(i, v) {
				var $el = $(this),
					$p = $el.parents('.form-group:first'),
					isInt = $el.data('int'),
					isDate = $el.hasClass('datepicker');
				if (isDate) {
					if (Utils.isDate($el.val())) {
						$p.removeClass('has-error');
					} else {
						pass = false;
						$p.addClass('has-error');
					}
				}
				if (isInt) {
					if ($.isNumeric($el.val())) {
						$p.removeClass('has-error');
					} else {
						pass = false;
						$p.addClass('has-error');
					}
				}
			});
		}
		return pass;
	}

	/**
	 * [view 查看详情]
	 * @param  {[Array]} row [行信息]
	 * @return {[type]}     [description]
	 */
	function view(row) {
		var d = row[0] || {},
			opt = {
				modal: true,
				dragable: true,
				title: '<h4><b>查看结算规则</b></h4>',
				title_html: true
			};
		opt.message = Utils.formatJson(viewTpl, {
			data: d
		});
		opt.buttons = {
			'ok': {
				label: '确定',
				className: 'btn-sm btn-success'
			}
		};
		Box.dialog(opt);
	}

	function viewHistory(row) {
		var id = row[0].id;
		$.ajax({
			url: global_config.serverRoot + '/settleRule/history?userId=' + '&id=' + id,
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

	function getUrl() {
		return global_config.serverRoot + 'settleRule/list?userId=' + Utils.object2param(userParam);
	}

	function registerEvents() {
		$('.datepicker').datepicker({
			autoclose: true
		});
		$('#add-btn').on('click', function() {
			_grid.trigger('addCallback');
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
				doms.commercialId.val('');
				doms.type.val(0);
				doms.status.val(0);
				doms.cardType.val(0);
				doms.createTimeStart.val('');
				doms.createTimeEnd.val('');
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
			commercialId = doms.commercialId.val(),
			type = doms.type.val(),
			status = doms.status.val(),
			cardType = doms.cardType.val(),
			createTimeStart = doms.createTimeStart.val(),
			createTimeEnd = doms.createTimeEnd.val(),
			effectiveDateStart = doms.effectiveDateStart.val(),
			effectiveDateEnd = doms.effectiveDateEnd.val(),
			expirationDateStart = doms.expirationDateStart.val(),
			expirationDateEnd = doms.expirationDateEnd.val();
		if (commercialId) {
			newParam.commercialId = encodeURIComponent(commercialId);
		}
		if (type) {
			newParam.type = type;
		}
		if (status) {
			newParam.status = status;
		}
		if (cardType) {
			newParam.cardType = encodeURIComponent(cardType);
		}
		if (Utils.isDate(createTimeStart)) {
			newParam.createTimeStart = createTimeStart;
		}
		if (Utils.isDate(createTimeEnd)) {
			newParam.createTimeEnd = createTimeEnd;
		}
		if (Utils.isDate(effectiveDateStart)) {
			newParam.effectiveDateStart = effectiveDateStart;
		}
		if (Utils.isDate(effectiveDateEnd)) {
			newParam.effectiveDateEnd = effectiveDateEnd;
		}
		if (Utils.isDate(expirationDateStart)) {
			newParam.expirationDateStart = expirationDateStart;
		}
		if (Utils.isDate(expirationDateEnd)) {
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