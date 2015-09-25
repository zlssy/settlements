define(function(require, exports, module) {
	var Table = require('whygrid');
	var D = window.D = require('D');
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
			cols: [{
					name: '字典类型编码',
					index: 'type',
					sortable: true,
					width: 100
				}, {
					name: '字典类型名称',
					index: 'label'
				}, {
					name: '操作',
					index: 'comm',
					width: 170
				}
			],
			funFixtd: function(x,y,col,data){
				if(col.index=='comm'){
					var html = '';
					html += '<a data-comm="show" class="btn btn-xs btn-link">' + '查看' + '</a>'; 
					html += '<a data-comm="edit" class="btn btn-xs btn-link">' + '修改' + '</a>'; 
					html += '<a data-comm="del" class="btn btn-xs btn-link">' + '删除' + '</a>'; 
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
            'show':{api:tapi.updateStatus}
            ,'edit':{api:tapi.updateStatus}
            ,'del':{api:tapi.updateTimeoff}
        }
        var obj = comms[comm];
        if(obj){
            var ids_data = {'ids':ids};
            $.post(obj.api,$.extend({},ids_data,obj.data,data),function(data){
                if(data.executeStatus){
                    alert(data.errorMsg || '未知错误!','操作出错!')
                    return;
                }
                alert('操作成功!')
                T.load();
            })
        }else alert('未知操作!')
    }
	//绑定功能按钮
	function bin_comm(){
		T.main.on('click','a[data-comm]',function(){
			var o = $(this)
				,comm = o.data('comm')
			var id = o.parents('tr').data('id')

			alert("comm:"+comm);
			return;
			if(comm == 'del'){
                D.confirm('您确定要删除吗?','提示',function(dalog){
                    datacomm(comm,id)
                })
            }else if(comm == 'show'){
                location.href = "/xxx?id=" + id;
                return;
                //location.href = '/clm/member/list/auto/list/edit?companyId='+companyId+'&id='+id;
            }else if(comm == 'edit'){
                D.confirm(openEdit(id),'设置新密码',function(dalog){
                    var newpwd = $.trim($(dalog).find('[name="password"]').val())
                    if(newpwd !== ""){
                        datacomm(comm,id,{password:newpwd});
                    }else{
                        qida.D.alert('新密码不能为空!');
                        return false;
                    }
                })
            }else{
                datacomm(comm,id)
            }

		})
	}

	function openEdit(id){

	}

	var Edit = {}
	Edit.getDom = function(){

	};
	Edit.showadd = function(){
		
	};
	Edit.showedit = function(id){
		$.get(apis.show,{id:id},function(){

		})

	}
	Edit.fillDom = function(dom,data){

	}

});















