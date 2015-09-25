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
			cols: [{
				name: 'Order Number',
				index: 'orderNumber',
                width: 60
			}, {
				name: 'Date',
				index: 'date',
                width: 60
            }, {
                name: 'Material number',
                index: 'materialNumber'
            }, {
                name: 'Product Code',
                index: 'productCode'
            }, {
                name: 'Product Name',
                index: 'productName'
            }, {
                name: 'Product category',
                index: 'productCategory'
            }, {
                name: 'Product line – level 1',
                index: 'productLineLevel1'
            }, {
                name: 'Product line – level 2',
                index: 'productLineLevel2'
            }, {
                name: 'Color code',
                index: 'colorCode'
            }, {
                name: 'Related Projects',
                index: 'relatedProjects'
            }, {
                name: 'Content provider name',
                index: 'contentProviderName'
            }, {
                name: 'Related TCL entity',
                index: 'relatedTCLEntiry'
            }, {
                name: 'Customer name/user ID',
                index: 'customerName'
            }, {
                name: 'Region',
                index: 'region'
            }, {
                name: 'Country',
                index: 'country'
            }, {
                name: 'Ship to country',
                index: 'shipToCountry'
            }, {
                name: 'Year',
                index: 'year'
            }, {
                name: 'Month',
                index: 'month'
            }, {
                name: 'Quarter',
                index: 'quarter'
            }, {
                name: 'MID',
                index: 'mid'
            }, {
                name: 'Payment method',
                index: 'paymentMethod'
            }, {
                name: 'Delivery status',
                index: 'deliveryStatus'
            }, {
                name: 'Delivery note number',
                index: 'deliveryNoteNumber'
            }, {
                name: 'Original currency',
                index: 'originalCurrency'
			}, {
				name: 'Gross revenue in original',
				index: 'grossRevenueInOriginalCurrency'
			}, {
				name: 'Cost in original currency',
				index: 'costInOriginalCurrency'
            }, {
                name: 'Fixed Charges',
                index: 'fixedCharges'
            }, {
                name: 'Variable Charges',
                index: 'variableCharges'
            }, {
                name: 'Net revenue in original currency',
                index: 'netRevenueInOriginalCurrency'
            }, {
                name: 'Gross revenue in USD',
                index: 'grossRevenueInUSD'
            }, {
                name: 'Cost in USD',
                index: 'costInUSD'
            }, {
                name: 'Fixed Charges in USD',
                index: 'fixedChargesInUSD'
            }, {
                name: 'Variable Charges in USD',
                index: 'variableChargesInUSD'
            }, {
                name: 'Net revenue in USD',
                index: 'netRevenueInUSD'
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