define(function(require, exports, module) {
	var Table = require('whygrid');
	var Box = window.Box = require('boxBootstrap');
	var tool = require("why");
	var D = window.D = require("dialog");
	var rooturl = global_config.serverRoot.replace(/\/+$/,'');
	var apis = {
			list : rooturl + '/queryTradeRecord',
			down : rooturl + '/downloadTradeRecord'
		}
	var T;
	var errfun = function(e){
		var msg = typeof e == 'object' ? e.statusText || e.msg || "未知错误!" : e;
		Box.alert(msg);
	}
	$(function(){
		T = Table('#grid_list',apis.list,{
			checkRow: false,
			seachForm: '#sform',
			prmNames:{page:"pageNumber",rows:"PerPageItemsCount",sort:"sort",order:"order"},
			jsonReader:{root:'records',page:'data.pageNo',size:'currentItemsCount',records:'totalPage'},// totalCnt totalCount
			pagenav:true,
			cols: [{
					name: '商户订单编号',index: 'merchantOrderId',
				},{
					name: '交易流水号',index: 'payOrderId',
				},{
					name: '支付工具',index: 'payTool',
				},{
					name: '订单日期',index: 'orderTime',
				},{
					name: '产品代码',index: 'productID',
				},{
					name: '产品名称',index: 'productName',
				},{
					name: '商户编号',index: 'merchantID',
				},{
					name: '商户名称',index: 'merchantName',
				},{
					name: '货币种类',index: 'currency',
				},{
					name: '订单金额',index: 'orderAmount',
				},{
					name: '订单状态',index: 'orderStatus',
				},
			],
			funFixtd: function(x,y,col,data){
				if(col.index == 'comm'){
					var html = '';
					html += '<a data-comm="edit" class="btn btn-xs btn-link">' + '查看/修改' + '</a>'; 
					//html += '<a data-comm="edit" class="btn btn-xs btn-link">' + '' + '</a>'; 
					//html += '<a data-comm="del" class="btn btn-xs btn-link">' + '删除' + '</a>'; 
					return html;
				}
			}
		});
		bin_comm();
		T.load();
		//菜单自动定位
		tool.autonav('#sidebar ul.submenu>li','active').parents('ul.submenu').parent().addClass('active open');
		$('.datepicker').datepicker({
			autoclose: true,
			todayHighlight: false
		})
		
		// $("#startDate,#endDate").attr('title','双击清除').on("dblclick",function(){$(this).val('')})
		// $("#startDate" ).datepicker({
		// 	//defaultDate: "+1w",
		// 	changeMonth: true,
		// 	changeYear: true,
		// 	onClose: function( selectedDate ) {
		// 		$( "#endDate" ).datepicker( "option", "minDate", selectedDate );
		// 	}
		// })
		// $("#endDate" ).datepicker({
		// 	//defaultDate: "+1w",
		// 	changeMonth: true,
		// 	changeYear: true,
		// 	onClose: function( selectedDate ) {
		// 		$( "#startDate" ).datepicker( "option", "maxDate", selectedDate );
		// 	}
		// })
	})

	//数据操作
    function datacomm(comm,ids,data){
        var comms = {
            'show':{api:apis.show}
            //,'del':{api:apis.del}
        }
        var obj = comms[comm];
        if(obj){
            var ids_data = {'ids':ids};
            $.post(obj.api,$.extend({},ids_data,obj.data,data),null,'json').then(function(data){
            	if(data.code != 0){throw data.message}
                Box.alert('操作成功!')
                T.load();
            }).then(null,errfun)
        }else Box.alert('未知操作!')
    }

	//绑定功能按钮
	function bin_comm(){
		//添加按钮；
		$('#export-btn').on('click',function(){
			var search = T.getSearch()
			if(typeof search !== "object"){
				search = tool.QueryString.parse(search);
			}
			delete search.pageNumber;
			delete search.PerPageItemsCount;
			window.open(apis.down + "?" + tool.QueryString.stringify(search))
		})
	}
});