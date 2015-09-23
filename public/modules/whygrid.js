define(function(require, exports, module) {
	var _ = require("underscore.min");
	var tool = require("why")
		,qs = tool.QueryString;

	//表头模版
	var template_hide = '<th<%=col.index ? \' data-index="\' + _.escape(col.index) + \'"\' : \'\' %>><div><%-col.name%><%if(col.sortable){%><span class="s-ico" style=""><span sort="asc" class="ui-grid-ico-sort ui-icon-asc ui-icon ui-icon-triangle-1-n ui-sort-ltr ui-state-disabled"></span><span sort="desc" class="ui-grid-ico-sort ui-icon-desc ui-icon ui-icon-triangle-1-s ui-sort-ltr ui-state-disabled"></span></span><%}%></div></th>';
	var hdie_check = '<th width="30" class="ui-state-default ui-th-column ui-th-ltr"><div style="text-align:center;"><input type="checkbox" data-checkname="<%-key%>"></div></th>'
	var template_tr = '<tr role="row" data-key="<%-key%>" class="ui-widget-content jqgrow ui-row-ltr ui-priority-secondary"><%if(obj.checkRow){%><td role="gridcell" style="text-align:center;" aria-describedby="grid_cb"><input role="checkbox" type="checkbox" class="cbox" name=""></td><%}%><%for(var i=0;i < cols.length; i++){var col = cols[i];%><td role="gridcell" title=""><%-tr[col.index]%></td><%}%></tr>';
	var template_hide_fun,template_tr_fun;
	var _defObj = {
		prmNames:{page:"pageNo",rows:"pageSize",sort:"sort",order:"order"},
		jsonReader:{root:'data.pageData',page:'data.pageNo',records:'data.totalCnt'}
	}
	var defOption = {
		id: 'grid', //容器ID
		key: 'id',
		checkRow: false, //行选择
		height: 400,
		pagesize: 20,
		page: 1,
		actions: {add: false,del: false,edit: false,view: false,search: false,refresh: false},
		getSearch: function(){
			return location.hash.replace(/^\#/g,''); //默认筛选条件
		},
		pagenav: true,
		prmNames:_defObj.prmNames,
		jsonReader:_defObj.jsonReader
	}

	function getInfoHtml(){
		var html = [];
		html.push('<div class="ui-jqgrid ui-widget ui-widget-content ui-corner-all">')
		html.push('	<div class="ui-state-default ui-jqgrid-hdiv">')
		html.push('		<table class="g-table ui-jqgrid-htable col-xs-12">')
		html.push('			<thead>')
		html.push('				<tr class="g-tc ui-jqgrid-labels"></tr>')
		html.push('			</thead>')
		html.push('			<tbody></tbody>')
		html.push('		</table>')
		this.option.pagenav && 
		html.push('		<div class="pagenav g-tr"></div>')
		html.push('	</div>')
		html.push('</div>')
	}

	function getHeadHtml(arr){
		template_hide_fun = template_hide_fun ? _.template(template_hide)
		var html = this.checkRow ? hdie_check.replace('<%-key%>',this.key) : '';
		for(var i=0; i<arr.length; i++){
			var tr = arr[i];
			html += template_hide_fun(_.extend({},this.option,{tr:tr}));
		}
		return html;
	}

	function getBodyHtml(arr){
		if(!arr) return '';
		var html = '';
		template_tr_fun = template_tr_fun ? _.template(template_tr)
		for(var i=0; i<arr.length; i++){
			var col = arr[i];
			html += template_tr_fun({col:col})
		}
		return html;
	}

	//全选按钮事件绑定
	function event_checkall(){
		var allcheckd = this.main.find('table :checkbox[data-checkname]');
        if(allcheckd.length>0){
			allcheckd.each(function(index, element) {
				var o = $(this)
					,name = o.data('checkname')
					,tab = o.parents('table')
				tab.on("change.base",':checkbox[name="' + name + '"]',function(){
					var os = tab.find(':checkbox[data-checkname="' + name + '"]')
					//console.log(os.length)
					os.prop('checked',tab.find(':checkbox[name="' + name + '"]:checked').length == tab.find(':checkbox[name="' + name + '"]').length)
				})
			}).parents('table').on('change.base',":checkbox[data-checkname]",function(){
				var o = $(this)
				o.parents('table').find(':checkbox[name="' + o.data('checkname') + '"]').prop('checked',o.prop('checked'));
			})
        }
    }
    //为列表表格配置loading及nodata事件
    function event_tableMsg(){
        this.main.on('colspanMsg','table,ul.tree',function(e,msg){
            var o = $(this)
                ,tds = o.find('tr>th').length
            if(o[0].tagName.toLowerCase() == 'ul'){
                o.html('<li class="nodata">'+msg+'</li>');
            }else{
                o.find('>tbody').html('<tr><td colspan="' + tds + '" class="nodata">' + msg + '</td></tr>')
            }
            return false;
        })
        .on('loading','table,ul.tree',function(){
                $(this).trigger('colspanMsg',['<div class="g-tc"><i class="g-inlb g-icon-load"></i> 正在加载数据！</div>']).find(':checkbox[data-checkname]').prop('checked',false)
                return false;
            })
        .on('nodata','table,ul.tree',function(){
                $(this).trigger('colspanMsg',['<div class="g-tc">暂无数据！</div>'])
                return false;
            })
        .on('errdata','table,ul.tree',function(e,errmsg){
                $(this).trigger('colspanMsg',['<div class="g-tc g-red"><i class="icon-cancel-circled"></i> 出错：' + qida.HTML.Encode(errmsg) + '</div>'])
                return false;
            })
    }

    //绑定翻页
    function event_page(){
    }

    //排序
    function event_oder(){
    	var o = this;
    	var prmNames = _.extend({},_defObj.prmNames,o.option.prmNames);
    	this.main.on('click','table thead div.ui-jqgrid-sortable',function(){
    		var obj = $(this);
    		var s = obj.find('.s-ico span :not(.ui-state-disabled)')
    		var oder = obj.data('index'),sort;
    		if(s.length && s.attr('sort') == 'esc'){
    			sort = "desc";
    		}else{
    			sort = "esc";
    		}
    		o.main.find('thead span.s-ico span').addClass('ui-state-disabled');
    		tool.urlComm.setHash(prmNames.oder,oder);
    		tool.urlComm.setHash(prmNames.sort,sort);
    		o.load();
    	})
    }

    function getMapdata(json,map){
		var attrs = map.split('.');
		var obj = json;
		try{
			for(var i = 0; i < attrs.length; i++){
				obj = obj[attrs[i]]
			}
		}catch(e){
			return undefined;
		}
		return obj;
	}

	function guid(){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
			var r = Math.random()*16|0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		})
	}

	function Grid(box,apiurl,option){
		this.box = $(box);
		this.apiUrl = apiurl;
		this.option = _.extend({},defOption,option)
	}

	Grid.prototype = {
		init:function(){
			this.main = $(getInfoHtml.call(this));
			this.box.append(this.main);
			this.eventInit();
			this.box.append(this.main);
		},
		eventInit:function(){
			event_checkall.call(this);
			event_page.call(this);
			event_oder.call(this);
			event_tableMsg.call(this);
		},
		fix_oder:function(){ //调整排序显示
			var search = this.option.getSearch();
			var prmNames = _.extend({},_defObj.prmNames,this.option.prmNames);
			var oder,sort;
			if(typeof search !== "object"){
				search = qs.Parse(search);
			}
			oder = search[prmNames.order]
			sort = search[prmNames.sort]
			this.main.find('thead span.s-ico span').addClass('ui-state-disabled')
			if(oder){
				this.main.find('thead td[name='+sort+'] span.s-ico span[sort='+sort+']').removeClass('ui-state-disabled')
			}
		},
		fillTabel:function(data){
			var jsonReader = _.extend({},_defObj.jsonReader,this.option.jsonReader);
			var arr = getMapdata(data,jsonReader.root);
			this.main.find('table.g-table tbody').html(getBodyHtml(arr))
		},
		fillPage:function(data){

		}
		load:function(){
			var o = this;
			$.get(this.apiUrl,this.getSearch(),'json').then(function(data){
				if(data.code != 0){throw data.message}
				o.fillTabel(data);
			}).then(null,function(err){
				his.main.find('table.g-table').trigger('errdata',[err])
			})
		}
	}
	module.exports = function(a,b,c){
		return new Grid(a,b,c);
	}
})