define(function(require, exports, module) {
	var _ = require("underscore.min");
	
	var defOption = {
		id: 'grid', //容器ID
		key: 'id'
		checkRow: false, //行选择
		height: 400, 
		pagesize: 20,
		page: 1,
		actions: {
			add: false,
			del: false,
			edit: false,
			view: false,
			search: false,
			refresh: false
		}

		getSearch: function(){
			return location.hash.replace(/^\#/g,''); //默认筛选条件
		}
	}

	//表头模版
	var template_hide = '<th<%= col.index? \' data-index="\' + _.escape(col.index) + \'"\' : \'\' %>><div><%-col.name%><%if(col.sortable){%><span class="s-ico" style=""><span sort="asc" class="ui-grid-ico-sort ui-icon-asc ui-icon ui-icon-triangle-1-n ui-sort-ltr ui-state-disabled"></span><span sort="desc" class="ui-grid-ico-sort ui-icon-desc ui-icon ui-icon-triangle-1-s ui-sort-ltr ui-state-disabled"></span></span><%}%></div></th>';
	var hdie_check = '<th width="30" class="ui-state-default ui-th-column ui-th-ltr"><div><input type="checkbox" data-checkname="{%key%}"></div></th>'
	var template_hide_fun; 
	var template_tr = '<tr role="row" data-key="{%-key%}" class="ui-widget-content jqgrow ui-row-ltr ui-priority-secondary"><%if(obj.checkRow){%><td role="gridcell" style="text-align:center;" aria-describedby="grid_cb"><input role="checkbox" type="checkbox" class="cbox" name=""></td><%}%><%for(var i=0;i < cols.length; i++){var col = cols[i];%><td role="gridcell" title=""><%-tr[col.index]%></td><%}%></tr>';
	var template_tr_fun;

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
		html.push('		<div class="pagenav g-tr"></div>')
		html.push('	</div>')
		html.push('</div>')
	}

	function getHeadHtml(arr){
		template_hide_fun = template_hide_fun ? _.template(template_hide)
		var html = this.checkRow ? hdie_check.replace('{%key%}',this.key) : '';
		for(var i=0; i<arr.length; i++){
			var tr = arr[i];
			html += template_hide_fun(_.extend({},this.option,{tr:tr}));
		}
		return html;
	}

	function getBodyHtml(arr,data){
		if(!arr) return '';
		var html = '';
		template_tr_fun = template_tr_fun ? _.template(template_tr)
		for(var i=0; i<arr.length; i++){
			
			var col = arr[i];
			html += template_tr_fun({col:col})
		}
		return html;
	}

	function Grid(box,apiurl,option){
		this.box = $(box);
		this.apiUrl = apiurl;
		this.option = _.extend({},defOption,option)
	}

	Grid.prototype = {
		init:function(){
			this.box.append('Some text')
		}
	}

})