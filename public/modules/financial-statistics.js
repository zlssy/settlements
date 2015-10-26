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
            list : rooturl + '/queryStatisticalRecord',
            down : rooturl + '/downloadStatisticalRecord'
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
            var $el = $(e.target || e.srcElement);
            //新增
            if ($el.closest('#add-btn').length) {
                showPop();
            }
            //导出
            if ($el.closest('#export-btn').length) {
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