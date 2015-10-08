define(function(require, exports, module) {
	var Table = require('whygrid');
	var D = window.D = require('D');
	var Box = require('boxBootstrap');
	var apis = {
			list : global_config.serverRoot + '/dataDictionary/list',
			add : global_config.serverRoot + '/dataDictionary/addOrUpdate',
			update : global_config.serverRoot + '/dataDictionary/addOrUpdate',
			show : global_config.serverRoot + '/dataDictionary/detail',
			dropdownlist : global_config.serverRoot + '/dataDictionary/dropdownlist'
		}
	var T;
	$(function(){
		T = Table('#grid_list',apis.list,{
			checkRow: true,
			seachForm: '#sform',
			pagenav:false,
			cols: [{
					name: '字典类型编码',
					index: 'type',
					sortable: true,
					width: "30%"
				}, {
					name: '字典类型名称',
					index: 'label'
				}, {
					name: '操作',
					index: 'comm',
					width: 150
				}
			],
			funFixtd: function(x,y,col,data){
				if(col.index == 'comm'){
					var html = '';
					html += '<a data-comm="edit" class="btn btn-xs btn-link">' + '查看 / 修改' + '</a>'; 
					//html += '<a data-comm="edit" class="btn btn-xs btn-link">' + '' + '</a>'; 
					//html += '<a data-comm="del" class="btn btn-xs btn-link">' + '删除' + '</a>'; 
					return html;
				}
			}
		});
		bin_comm();
		T.load();
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
            $.post(obj.api,$.extend({},ids_data,obj.data,data),function(data){
                if(data.executeStatus){
                    Box.alert(data.errorMsg || '未知错误!','操作出错!')
                    return;
                }
                Box.alert('操作成功!')
                T.load();
            })
        }else Box.alert('未知操作!')
    }

	//绑定功能按钮
	function bin_comm(){
		//添加按钮；
		$('#but_add').on('click',function(){
			Edit.showadd();
		})

		T.main.on('click','a[data-comm]',function(){
			var o = $(this)
				,comm = o.data('comm')
			var id = o.parents('tr').data('key');
			if(comm == 'del'){
				Box.confirm("您确定要删除吗?", function(result){ result && datacomm(comm,id); })
            }else if(comm == 'edit'){
                Edit.showedit(id)
            }else{
                datacomm(comm,id)
            }

		})
	}


	//数据字典 添加/修改 模块;
	var Edit = window.Edit = {}
	Edit.showDom = function(data){
		var o = this;
		var opt = {};
		var dom = opt.message = $($('#addEditTpl').html());
		opt.message.find('#title b').html(data ? '修改数据字典' : '新增数据字典');
		opt.buttons = {
			"save": {
				label: '<i class="ace-icon fa fa-check"></i> 保存',
				className: 'btn-sm btn-success',
				callback: function() {o.save(); return false;}
			},
			"cancel": {
				label: '取消',
				className: 'btn-sm'
			}
		};
		this.Box = Box.dialog(opt);
		data && o.fillDom(dom,data);
		this.dom = dom;
		this.events();
	};
	Edit.addItem = function(){
		this.dom.find(".panel-body").append($('#itemTpl').html());
	}
	Edit.events = function(){
		var o = this;
		this.dom
		.on('click','a.addItem',function(){
			o.addItem();
		})
		.on('click','[data-comm]',function(){
			var but = $(this);
			var comm = but.data("comm");
			if(comm == 'onoff'){
				but.attr('class', !but.hasClass('btn-danger') ? 'btn btn-danger' : 'btn btn-default') 
			}else if(comm == "goup"){
				var row = but.closest(".row");
				row.prev(".row").before(row);
			}else if(comm == "godown"){
				var row = but.closest(".row");
				row.next(".row").after(row);
			}else if(comm == "del"){
				but.closest(".row").remove();
			}
		})
	}
	Edit.showadd = function(){
		this.showDom();
		this.addItem();
	};
	Edit.showedit = function(id){
		var o = this;
		$.get(apis.show,{id:id},function(data){
			if(data.code == 0){
				o.showDom(data.data)
			}
		})
	}
	Edit.fillDom = function(dom,data){
		dom.find('input[name="id"]').val(data.id)
		dom.find('input[name="type"]').val(data.type)
		dom.find('input[name="typeLabel_zh"]').val(data.typeLabel_zh)
		dom.find('input[name="typeLabel_en"]').val(data.typeLabel_en)
		if(data.dataArray && data.dataArray.length>0){
			var dataArray = data.dataArray
			dom.find(".panel-body").html('')
			for(var i = 0; i<dataArray.length; i++){
				var _dom = $($('#itemTpl').html()),
					item = dataArray[i];
				_dom.find('input[name="dataInfoId"]').val(item.dataInfoId);
				_dom.find('input[name="code"]').val(item.code);
				_dom.find('input[name="label_zh"]').val(item.label_zh);
				_dom.find('input[name="label_en"]').val(item.label_en);
				_dom.find('input[name="innerValue"]').val(item.innerValue);
				_dom.find('[data-comm=onoff]').attr('class',item.status !== 1 ? 'btn btn-danger' : 'btn btn-default')
				dom.find(".panel-body").append(_dom)
			}
		}
	}
	Edit.getData = function(){
		var dom = this.dom;
		var obj = {
			"id" : dom.find('input[name="id"]').val(),
			"type" : dom.find('input[name="type"]').val(),
			"typeLabel_en" : dom.find('input[name="typeLabel_en"]').val(),
			"typeLabel_zh" : dom.find('input[name="typeLabel_zh"]').val()
		}
		// if(dom.find('input[name="id"]').val() !== ""){
		// 	obj.id = dom.find('input[name="id"]').val()
		// }
		var dataArray = [],
			rows = dom.find('.panel-body>.row');
		for(var i=0; i<rows.length; i++){
			var row = $(rows[i]);
			dataArray.push({
				"dataInfoId" : row.find('input[name="dataInfoId"]').val(),
				"code" : row.find('input[name="code"]').val(),
				"label_zh" : row.find('input[name="label_zh"]').val(),
				"label_en" : row.find('input[name="label_en"]').val(),
				"innerValue" : row.find('input[name="innerValue"]').val(),
				"status" : row.find('[data-comm="onoff"]').hasClass('btn-danger') ? 2 : 1,
				"displayOrder" : +i
			})
		}
		obj.dataArray = JSON.stringify(dataArray);
		return obj;
	}

	Edit.save = function(){
		var saveData = this.getData();
		$.post(apis.update,saveData,function(data){
			if(data.code == 0){
				Box.alert("成功!")
			}
		})
	}

});















