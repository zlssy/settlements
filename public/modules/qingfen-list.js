define(function(require, exports, module) {
	var utils = require('utils'),
		content = $('#content'),
		listContainer = $('#grid_list_body'),
		firstRowTemplate = $('#first_row_template').html(),
		rowTemplate = $('#row_template').html(),
		userParam = {};

	function init() {
		loadDataA();
	}

	function loadData() {
		var grid_selector = "#grid";
		var pager_selector = "#pager";

		$(window).on('resize.jqGrid', function() {
			$(grid_selector).jqGrid('setGridWidth', $(".page-content").width());
		});

		$(grid_selector).jqGrid({
			url: global_config.serverRoot + 'clearing/list?userId=' + utils.object2param(userParam), // 获取数据地址
			datatype: 'json', // 获取数据的响应格式
			mtype: 'post', // 上传数据的方式
			loadonce: false,
			editurl: global_config.serverRoot + 'clearing/edit', // 添加or编辑数据的地址
			// data: grid_data,
			// datatype: 'local',
			height: 400,
			colNames: ['商户ID', '流水号', '清算日期', '交易金额', '交易笔数', '退还金额', '退换笔数', '成本', '服务费', '清算量', '收益', '状态'],
			colModel: [{
				name: 'merchantId',
				index: 'merchantId',
				width: 60,
				sortable: false,
				editable: true
			}, {
				name: 'accountNumber',
				index: 'accountNumber',
				width: 60,
				sortable: false,
				editable: true
			}, {
				name: 'clearingDate',
				index: 'clearingDate',
				width: 90,
				sortable: false,
				editable: true,
				sorttype: "date",
				unformat: pickDate
			}, {
				name: 'tradeAmount',
				index: 'tradeAmount',
				width: 50,
				sortable: false,
				sort: 'int',
				editable: true
			}, {
				name: 'tradeTrans',
				index: 'tradeTrans',
				width: 50,
				sortable: false,
				sort: 'int',
				editable: true
			}, {
				name: 'refundAmount',
				index: 'refundAmount',
				width: 50,
				sortable: false,
				sort: 'int',
				editable: true
			}, {
				name: 'refundTrans',
				index: 'refundTrans',
				width: 50,
				sortable: false,
				sort: 'int',
				editable: true
			}, {
				name: 'cost',
				index: 'cost',
				width: 50,
				sortable: false,
				sort: 'int',
				editable: true
			}, {
				name: 'serviceCharge',
				index: 'serviceCharge',
				width: 50,
				sortable: false,
				sort: 'int',
				editable: true
			}, {
				name: 'settleAmount',
				index: 'settleAmount',
				width: 50,
				sortable: false,
				sort: 'int',
				editable: true
			}, {
				name: 'profit',
				index: 'profit',
				width: 50,
				sortable: false,
				sort: 'int',
				editable: true
			}, {
				name: 'status',
				index: 'status',
				width: 80,
				sortable: false,
				editable: true,
				edittype: "select",
				editoptions: {
					value: "1:待结算;2:结算中;3:已结算;4:已归档"
				}
			}],
			viewrecords: true,
			rowNum: 10,
			// rowList: [20, 30, 40],
			pager: pager_selector,
			altRow: true,
			multiselect: true,
			multiboxonly: true,
			loadComplete: function() {
				var table = this;
				setTimeout(function() {
					styleCheckbox(table);

					updateActionIcons(table);
					updatePagerIcons(table);
					enableTooltips(table);
				}, 0);
			},
			jsonReader: {
				root: 'data.pageData',
				page: 'data.pageNo',
				total: 'data.pageCnt'
			}
		});

		jQuery(grid_selector).jqGrid('navGrid', pager_selector, { //navbar options
			edit: false,
			editicon: 'ace-icon fa fa-pencil blue',
			add: false,
			addicon: 'ace-icon fa fa-plus-circle purple',
			del: false,
			delicon: 'ace-icon fa fa-trash-o red',
			search: false,
			searchicon: 'ace-icon fa fa-search orange',
			refresh: true,
			refreshicon: 'ace-icon fa fa-refresh green',
			view: true,
			viewicon: 'ace-icon fa fa-search-plus grey',
		}, {
			//edit record form
			//closeAfterEdit: true,
			//width: 700,
			recreateForm: true,
			beforeShowForm: function(e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			}
		}, {
			//new record form
			//width: 700,
			closeAfterAdd: true,
			recreateForm: true,
			viewPagerButtons: false,
			beforeShowForm: function(e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar')
					.wrapInner('<div class="widget-header" />')
				style_edit_form(form);
			}
		}, {
			//delete record form
			recreateForm: true,
			beforeShowForm: function(e) {
				var form = $(e[0]);
				if (form.data('styled')) return false;

				form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
				style_delete_form(form);

				form.data('styled', true);
			},
			onClick: function(e) {
				//alert(1);
			}
		}, {
			//search form
			recreateForm: true,
			afterShowSearch: function(e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
				style_search_form(form);
			},
			afterRedraw: function() {
				style_search_filters($(this));
			},
			multipleSearch: true,
			/**
			multipleGroup:true,
			showQuery: true
			*/
		}, {
			//view record form
			recreateForm: true,
			beforeShowForm: function(e) {
				var form = $(e[0]);
				form.closest('.ui-jqdialog').find('.ui-jqdialog-title').wrap('<div class="widget-header" />')
			}
		});

		$(window).triggerHandler('resize.jqGrid');

		function beforeDeleteCallback(e) {
			var form = $(e[0]);
			if (form.data('styled')) return false;

			form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
			style_delete_form(form);

			form.data('styled', true);
		}

		function beforeEditCallback(e) {
			var form = $(e[0]);
			form.closest('.ui-jqdialog').find('.ui-jqdialog-titlebar').wrapInner('<div class="widget-header" />')
			style_edit_form(form);
		}

		function aceSwitch(cellvalue, options, cell) {
			setTimeout(function() {
				$(cell).find('input[type=checkbox]')
					.addClass('ace ace-switch ace-switch-5')
					.after('<span class="lbl"></span>');
			}, 0);
		}
		//enable datepicker
		function pickDate(cellvalue, options, cell) {
			setTimeout(function() {
				$(cell).find('input[type=text]')
					.datetimepicker({
						use24hours: true,
						pickDate: true,
						picTime: true
					});
			}, 0);
		}

		function style_edit_form(form) {
			//enable datepicker on "sdate" field and switches for "stock" field
			form.find('input[name=clearingDate]').datetimepicker({
				use24hours: true,
				pickDate: true,
				picTime: true
			})

			form.find('input[name=stock]').addClass('ace ace-switch ace-switch-5').after('<span class="lbl"></span>');
			//don't wrap inside a label element, the checkbox value won't be submitted (POST'ed)
			//.addClass('ace ace-switch ace-switch-5').wrap('<label class="inline" />').after('<span class="lbl"></span>');


			//update buttons classes
			var buttons = form.next().find('.EditButton .fm-button');
			buttons.addClass('btn btn-sm').find('[class*="-icon"]').hide(); //ui-icon, s-icon
			buttons.eq(0).addClass('btn-primary').prepend('<i class="ace-icon fa fa-check"></i>');
			buttons.eq(1).prepend('<i class="ace-icon fa fa-times"></i>')

			buttons = form.next().find('.navButton a');
			buttons.find('.ui-icon').hide();
			buttons.eq(0).append('<i class="ace-icon fa fa-chevron-left"></i>');
			buttons.eq(1).append('<i class="ace-icon fa fa-chevron-right"></i>');
		}

		function style_delete_form(form) {
			var buttons = form.next().find('.EditButton .fm-button');
			buttons.addClass('btn btn-sm btn-white btn-round').find('[class*="-icon"]').hide(); //ui-icon, s-icon
			buttons.eq(0).addClass('btn-danger').prepend('<i class="ace-icon fa fa-trash-o"></i>');
			buttons.eq(1).addClass('btn-default').prepend('<i class="ace-icon fa fa-times"></i>')
		}

		function style_search_filters(form) {
			form.find('.delete-rule').val('X');
			form.find('.add-rule').addClass('btn btn-xs btn-primary');
			form.find('.add-group').addClass('btn btn-xs btn-success');
			form.find('.delete-group').addClass('btn btn-xs btn-danger');
		}

		function style_search_form(form) {
			var dialog = form.closest('.ui-jqdialog');
			var buttons = dialog.find('.EditTable')
			buttons.find('.EditButton a[id*="_reset"]').addClass('btn btn-sm btn-info').find('.ui-icon').attr('class', 'ace-icon fa fa-retweet');
			buttons.find('.EditButton a[id*="_query"]').addClass('btn btn-sm btn-inverse').find('.ui-icon').attr('class', 'ace-icon fa fa-comment-o');
			buttons.find('.EditButton a[id*="_search"]').addClass('btn btn-sm btn-purple').find('.ui-icon').attr('class', 'ace-icon fa fa-search');
		}

		function styleCheckbox(table) {}

		function updateActionIcons(table) {}

		function updatePagerIcons(table) {
			var replacement = {
				'ui-icon-seek-first': 'ace-icon fa fa-angle-double-left bigger-140',
				'ui-icon-seek-prev': 'ace-icon fa fa-angle-left bigger-140',
				'ui-icon-seek-next': 'ace-icon fa fa-angle-right bigger-140',
				'ui-icon-seek-end': 'ace-icon fa fa-angle-double-right bigger-140'
			};
			$('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function() {
				var icon = $(this);
				var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

				if ($class in replacement) icon.attr('class', 'ui-icon ' + replacement[$class]);
			})
		}

		function enableTooltips(table) {
			$('.navtable .ui-pg-button').tooltip({
				container: 'body'
			});
			$(table).find('.ui-pg-div').tooltip({
				container: 'body'
			});
		}

		registerEvents();
	}

	function loadDataA(){
		$.ajax({
			url:global_config.serverRoot + 'clearing/list?userId=' + utils.object2param(userParam),
			success: function(json){
				if('0' == json.code){
					var html = utils.formatJson(rowTemplate, {
						data: json.data.pageData
					});
					listContainer.append(firstRowTemplate).append(html);
				}
			}
		});
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