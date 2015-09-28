define(function(require, exports, module) {
	var Utils = require('utils'),
		Grid = require('gridBootstrap'),
        form2json = require('form2json'),
        template = require('template'),
        dialog = require('boxBootstrap'),
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
            fixed_table_width:5000,
            have_scroll: true,
			cols: [{
				name: 'Order Number',
				index: 'orderNumber',
                width:3
            }, {
				name: 'Date',
				index: 'date',
                width:3
            }, {
                name: 'Material number',
                index: 'materialNumber',
                width:3
            }, {
                name: 'Product Code',
                index: 'productCode',
                width:3
            }, {
                name: 'Product Name',
                index: 'productName',
                width:3
            }, {
                name: 'Product category',
                index: 'productCategory',
                width:3
            }, {
                name: 'Product line – level 1',
                index: 'productLineLevel1',
                width:5
            }, {
                name: 'Product line – level 2',
                index: 'productLineLevel2',
                width:5
            }, {
                name: 'Color code',
                index: 'colorCode',
                width:3
            }, {
                name: 'Related Projects',
                index: 'relatedProjects',
                width:3
            }, {
                name: 'Content provider name',
                index: 'contentProviderName',
                width:4
            }, {
                name: 'Related TCL entity',
                index: 'relatedTCLEntiry',
                width:4
            }, {
                name: 'Customer name/user ID',
                index: 'customerName',
                width:4
            }, {
                name: 'Region',
                index: 'region',
                width:3
            }, {
                name: 'Country',
                index: 'country',
                width:3
            }, {
                name: 'Ship to country',
                index: 'shipToCountry',
                width:3
            }, {
                name: 'Year',
                index: 'year',
                width:3
            }, {
                name: 'Month',
                index: 'month',
                width:3
            }, {
                name: 'Quarter',
                index: 'quarter',
                width:3
            }, {
                name: 'MID',
                index: 'mid',
                width:3
            }, {
                name: 'Payment method',
                index: 'paymentMethod',
                width:3
            }, {
                name: 'Delivery status',
                index: 'deliveryStatus',
                width:3
            }, {
                name: 'Delivery note number',
                index: 'deliveryNoteNumber',
                width:4
            }, {
                name: 'Original currency',
                index: 'originalCurrency',
                width:3
			}, {
				name: 'Gross revenue in original',
				index: 'grossRevenueInOriginalCurrency',
                width:5
			}, {
				name: 'Cost in original currency',
				index: 'costInOriginalCurrency',
                width:5
            }, {
                name: 'Fixed Charges',
                index: 'fixedCharges',
                width:3
            }, {
                name: 'Variable Charges',
                index: 'variableCharges',
                width:3
            }, {
                name: 'Net revenue in original currency',
                index: 'netRevenueInOriginalCurrency',
                width:6
            }, {
                name: 'Gross revenue in USD',
                index: 'grossRevenueInUSD',
                width:4
            }, {
                name: 'Cost in USD',
                index: 'costInUSD',
                width:3
            }, {
                name: 'Fixed Charges in USD',
                index: 'fixedChargesInUSD',
                width:4
            }, {
                name: 'Variable Charges in USD',
                index: 'variableChargesInUSD',
                width:5
            }, {
                name: 'Net revenue in USD',
                index: 'netRevenueInUSD',
                width:3
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
            //导出
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

	function getUrl() {
		return global_config.serverRoot + '/queryStatisticalRecord?userId=' + Utils.object2param(userParam);
	}

    function exportExcel() {
        var a = document.createElement('a');
        a.href = global_config.serverRoot + '/downloadStatisticalRecord?userId=' + Utils.object2param(userParam);
        a.target = '_blank';
        a.height = 0;
        a.width = 0;
        document.body.appendChild(a);
        var e = document.createEvent('HTMLEvents');
        e.initEvent('click', true, false);
        a.dispatchEvent(e);
        a.remove();
    }

    function showPop(data) {
        data = data || {};
        var content = template('tpleditItem')(data);
        var pop = dialog.edit({
            title:"新增汇率",
            content:content,
            skin:'ui-dialog-edit-2',
            ok:function(){

                var $form =  $("#dialog_form");
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
        pop.show();
    }

    function doCreateItem(data, callback){
        $.post(global_config.serverRoot + "/exchangeRate/addOrUpdate", data, function(res){
            if(res.code == 0){
                callback(res);
            }
        }, 'json');
    }

	return {
		init: init
	};
});