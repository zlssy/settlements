define(function(require, exports, module) {
	var Utils = require('utils'),
		Grid = require('gridBootstrap'),
        form2json = require('form2json'),
        template = require('template'),
        dialog = require('boxBootstrap'),
		content = $('#content'),
        renderSelect = require("renderSelect"),
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
                width:100
            }, {
				name: 'Date',
				index: 'date',
                width:100
            }, {
                name: 'Material number',
                index: 'materialNumber',
                width:100
            }, {
                name: 'Product Code',
                index: 'productCode',
                width:100
            }, {
                name: 'Product Name',
                index: 'productName',
                width:100
            }, {
                name: 'Product category',
                index: 'productCategory',
                width:100
            }, {
                name: 'Product line – level 1',
                index: 'productLineLevel1',
                width:100
            }, {
                name: 'Product line – level 2',
                index: 'productLineLevel2',
                width:100
            }, {
                name: 'Color code',
                index: 'colorCode',
                width:100
            }, {
                name: 'Related Projects',
                index: 'relatedProjects',
                width:100
            }, {
                name: 'Content provider name',
                index: 'contentProviderName',
                width:100
            }, {
                name: 'Related TCL entity',
                index: 'relatedTCLEntiry',
                width:100
            }, {
                name: 'Customer name/user ID',
                index: 'customerName',
                width:100
            }, {
                name: 'Region',
                index: 'region',
                width:100
            }, {
                name: 'Country',
                index: 'country',
                width:100
            }, {
                name: 'Ship to country',
                index: 'shipToCountry',
                width:100
            }, {
                name: 'Year',
                index: 'year',
                width:100
            }, {
                name: 'Month',
                index: 'month',
                width:100
            }, {
                name: 'Quarter',
                index: 'quarter',
                width:100
            }, {
                name: 'MID',
                index: 'mid',
                width:100
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
				root: 'records',
                page: 'totalPage',
                records: 'currentItemsCount'
			}
		});

		listContainer.html(_grid.getHtml());
		_grid.listen('refreshCallback', function(v) {
			console.log(v);
		});
		_grid.load();
        renderSelect($form);
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
        $('.datepicker').datetimepicker({
            format: 'yyyy-mm-dd hh:ii:ss',
            autoclose: true,
            todayHighlight: true,
            minuteStep:1
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





define(function(require, exports, module) {
    var Utils = require('utils'),
        Grid = require('gridBootstrap'),
        form2json = require('form2json'),
        template = require('template'),
        dialog = require('boxBootstrap'),
        content = $('#content'),
        renderSelect = require("renderSelect"),
        listContainer = $('#grid_list'),
        $form = $("#dataForm"),
        userParam = {},
        Table = require('whygrid'),
        tool = require("why"),
        rooturl = global_config.serverRoot.replace(/\/+$/,''),
        apis = {
            list : rooturl + '/queryWrongRecord',
            down : rooturl + '/downloadWrongRecord'
        },
        _grid;

    function init() {
        loadData();
    }

    function loadData() {
        T = Table('#grid_list',apis.list,{
            checkRow: false,
            seachForm: '#dataForm',
            oldApi:true,
            pagenav:true,
            cols: [{
                name: 'Order Number',
                index: 'orderNumber',
                width:100
            }, {
                name: 'Date',
                index: 'date',
                width:100
            }, {
                name: 'Material number',
                index: 'materialNumber',
                width:150
            }, {
                name: 'Product Code',
                index: 'productCode',
                width:100
            }, {
                name: 'Product Name',
                index: 'productName',
                width:100
            }, {
                name: 'Product category',
                index: 'productCategory',
                width:120
            }, {
                name: 'Product line – level 1',
                index: 'productLineLevel1',
                width:200
            }, {
                name: 'Product line – level 2',
                index: 'productLineLevel2',
                width:200
            }, {
                name: 'Color code',
                index: 'colorCode',
                width:100
            }, {
                name: 'Related Projects',
                index: 'relatedProjects',
                width:120
            }, {
                name: 'Content provider name',
                index: 'contentProviderName',
                width:150
            }, {
                name: 'Related TCL entity',
                index: 'relatedTCLEntiry',
                width:150
            }, {
                name: 'Customer name/user ID',
                index: 'customerName',
                width:150
            }, {
                name: 'Region',
                index: 'region',
                width:100
            }, {
                name: 'Country',
                index: 'country',
                width:100
            }, {
                name: 'Ship to country',
                index: 'shipToCountry',
                width:150
            }, {
                name: 'Year',
                index: 'year',
                width:100
            }, {
                name: 'Month',
                index: 'month',
                width:100
            }, {
                name: 'Quarter',
                index: 'quarter',
                width:100
            }, {
                name: 'MID',
                index: 'mid',
                width:100
            }, {
                name: 'Payment method',
                index: 'paymentMethod',
                width:120
            }, {
                name: 'Delivery status',
                index: 'deliveryStatus',
                width:120
            }, {
                name: 'Delivery note number',
                index: 'deliveryNoteNumber',
                width:150
            }, {
                name: 'Original currency',
                index: 'originalCurrency',
                width:120
            }, {
                name: 'Gross revenue in original',
                index: 'grossRevenueInOriginalCurrency',
                width:200
            }, {
                name: 'Cost in original currency',
                index: 'costInOriginalCurrency',
                width:200
            }, {
                name: 'Fixed Charges',
                index: 'fixedCharges',
                width:100
            }, {
                name: 'Variable Charges',
                index: 'variableCharges',
                width:120
            }, {
                name: 'Net revenue in original currency',
                index: 'netRevenueInOriginalCurrency',
                width:250
            }, {
                name: 'Gross revenue in USD',
                index: 'grossRevenueInUSD',
                width:200
            }, {
                name: 'Cost in USD',
                index: 'costInUSD',
                width:80
            }, {
                name: 'Fixed Charges in USD',
                index: 'fixedChargesInUSD',
                width:150
            }, {
                name: 'Variable Charges in USD',
                index: 'variableChargesInUSD',
                width:200
            }, {
                name: 'Net revenue in USD',
                index: 'netRevenueInUSD',
                width:150
            }],
            getBaseSearch: function(){
                var s = tool.QueryString.parse(location.hash.replace(/^\#/g,''));
                if(typeof s.startDate  == 'undefined' && typeof s.endDate == "undefined"){
                    s.startDate = tool.dateFormat(new Date(new Date() - (1000*60*60*24*30)),"yyyy-MM-dd 00:00");
                    s.endDate = tool.dateFormat(new Date(),"yyyy-MM-dd 00:00");
                    if($("#startDate").val() == "" && $("#endDate").val() == ""){
                        $("#startDate").val(s.startDate);
                        $("#endDate").val(s.endDate);
                    }
                }
                return s;
            }
        });
        T.load();
        renderSelect($form.find("[dict-name=payChannel]"), {
            "value" : "code",
            "label" : "label_en"
        });
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
        $('.datepicker').datetimepicker({
            format: 'yyyy-mm-dd hh:ii:00',
            autoclose: true,
            todayHighlight: true,
            minuteStep:1
        });
    }

    function exportExcel() {
        var search = T.getSearch();
        if(typeof search !== "object"){
            search = tool.QueryString.parse(search);
        }
        delete search.pageNumber;
        delete search.PerPageItemsCount;
        var url = apis.down + "?" + tool.QueryString.stringify(search);
        window.open(url)
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