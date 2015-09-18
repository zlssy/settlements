define(function(require, exports, module) {
	var Xss = require('xss'),
		Utils = require('utils'),
		guid = 10000;

	function create(opt) {
		var _opt = $.extend({
			id: 'grid' + (++guid),
			height: 400,
			checkbox: true,
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
		}, opt);
		_opt.cols = _opt.cols || [];
		_opt.colLen = _opt.cols.length;
		_opt.col_average_width = Math.floor(100 / _opt.colLen);
		this.controls = {}; // 控件集合
		$.extend(this, _opt);
		return this;
	}

	function getHtml() {
		var html = [];
		html.push('<div id="' + this.id + '" class="ui-jqgrid ui-widget ui-widget-content ui-corner-all" dir="ltr" style="width: 100%;">');
		html.push('	<div class="ui-widget-overlay jqgrid-overlay" id="' + this.id + '_layer"></div>');
		html.push('	<div class="loading ui-state-default ui-state-active" id="' + this.id + '_loading" style="display: none;">读取中...</div>');
		html.push('	<div class="ui-jqgrid-view" id="' + this.id + '_view" style="width: 100%;">');
		html.push('		<div class="ui-jqgrid-titlebar ui-jqgrid-caption ui-widget-header ui-corner-top ui-helper-clearfix" style="display: none;"><a role="link" class="ui-jqgrid-titlebar-close ui-corner-all HeaderButton" style="right: 0px;"><span class="ui-icon ui-icon-circle-triangle-n"></span></a><span class="ui-jqgrid-title"></span></div>');
		html.push('		<div class="ui-state-default ui-jqgrid-hdiv" style="width: 100%;">');
		html.push('			<div class="ui-jqgrid-hbox">');
		html.push('				<table class="ui-jqgrid-htable" style="width: 100%" role="grid" aria-labelledby="gbox_grid" cellspacing="0" cellpadding="0" border="0">');
		html.push('					<thead>');
		html.push('						<tr class="ui-jqgrid-labels" role="rowheader">');
		html.push(this.getHeader());
		html.push('						</tr>');
		html.push('					</thead>');
		html.push('				</table>');
		html.push('			</div>');
		html.push('		</div>');
		html.push('		<div class="ui-jqgrid-bdiv" style="height: ' + this.height + 'px; width:100%;">');
		html.push('			<div style="position:relative;">');
		html.push('				<div class="ui-jqgrid-hbox">');
		html.push('				<table id="' + this.id + '_listbox" tabindex="0" cellspacing="0" cellpadding="0" border="0" role="grid" aria-multiselectable="true" aria-labelledby="gbox_grid" class="ui-jqgrid-btable" style="width: 100%;">');
		html.push('				<tbody id="' + this.id + '_list">');
		html.push('				</tbody>');
		html.push(this.getFirstRow());
		html.push('				</table>');
		html.push('				</div>');
		html.push('			</div>');
		html.push('		</div>');
		html.push('	</div>');
		html.push('	<div class="ui-jqgrid-resize-mark" id="' + this.id + '_resizemark">&nbsp;</div>');
		html.push('	<div id="' + this.id + '_pager" class="ui-state-default ui-jqgrid-pager ui-corner-bottom" dir="ltr" style="width: 100%;">');
		html.push('		<div id="pg_pager" class="ui-pager-control" role="group">');
		html.push('			<table cellspacing="0" cellpadding="0" border="0" class="ui-pg-table" style="width:100%;table-layout:fixed;height:100%;" role="row">');
		html.push('				<tbody>');
		html.push('					<tr>');
		html.push('						<td id="' + this.id + '_pager_left" align="left">');
		html.push('							<table cellspacing="0" cellpadding="0" border="0" class="ui-pg-table navtable" style="float:left;table-layout:auto;">	<tbody>');
		html.push('								<tr>');
		if (this.actions.add) {
			html.push('										<td class="ui-pg-button ui-corner-all"title=""id="add_grid-table"data-original-title="添加新纪录"><div class="ui-pg-div"><span class="ui-icon ace-icon fa fa-plus-circle purple"></span></div></td>');
		}
		if (this.actions.edit) {
			html.push('										<td class="ui-pg-button ui-corner-all"title=""id="edit_grid-table"data-original-title="编辑所选记录"><div class="ui-pg-div"><span class="ui-icon ace-icon fa fa-pencil blue"></span></div></td>');
		}
		if (this.actions.view) {
			html.push('										<td class="ui-pg-button ui-corner-all"title=""id="view_grid-table"data-original-title="查看所选记录"><div class="ui-pg-div"><span class="ui-icon ace-icon fa fa-search-plus grey"></span></div></td>');
		}
		if (this.actions.del) {
			html.push('										<td class="ui-pg-button ui-corner-all"title=""id="del_grid-table"data-original-title="删除所选记录"><div class="ui-pg-div"><span class="ui-icon ace-icon fa fa-trash-o red"></span></div></td>');
		}
		if ((this.actions.add || this.actions.edit || this.actions.view || this.actions.del) && (this.actions.search || this.actions.refresh)) {
			html.push('										<td class="ui-pg-button ui-state-disabled"style="width:4px;"data-original-title=""title=""><span class="ui-separator"></span></td>');
		}
		if (this.actions.search) {
			html.push('										<td class="ui-pg-button ui-corner-all"title=""id="search_grid-table"data-original-title="查找记录"><div class="ui-pg-div"><span class="ui-icon ace-icon fa fa-search orange"></span></div></td>');
		}
		if (this.actions.refresh) {
			html.push('										<td class="ui-pg-button ui-corner-all"title=""id="refresh_grid-table"data-original-title="刷新记录"><div class="ui-pg-div"><span class="ui-icon ace-icon fa fa-refresh green"></span></div></td>');
		}
		html.push('								</tr>');
		html.push('								</tbody>');
		html.push('							</table>');
		html.push('						</td>');
		html.push('						<td id="' + this.id + '_pager_center" align="center">');
		html.push('							<table cellspacing="0" cellpadding="0" border="0" style="table-layout:auto;" class="ui-pg-table">');
		html.push('								<tbody>');
		html.push('									<tr>');
		html.push('										<td id="' + this.id + '_first_pager" class="ui-pg-button ui-corner-all ui-state-disabled" style="cursor: default;"><span class="ui-icon ace-icon fa fa-angle-double-left bigger-140"></span></td>');
		html.push('										<td id="' + this.id + '_prev_pager" class="ui-pg-button ui-corner-all ui-state-disabled" style="cursor: default;"><span class="ui-icon ace-icon fa fa-angle-left bigger-140"></span></td>');
		html.push('										<td class="ui-pg-button ui-state-disabled" style="width: 4px; cursor: default;"><span class="ui-separator"></span></td>');
		html.push('										<td dir="ltr">第 <input id="' + this.id + '_n_pager" class="ui-pg-input" type="text" size="2" maxlength="7" value="1" role="textbox">页 共 <span id="' + this.id + '_sp_pager">2</span> 页</td><td class="ui-pg-button ui-state-disabled" style="width: 4px; cursor: default;"><span class="ui-separator"></span></td>');
		html.push('										<td id="' + this.id + '_next_pager" class="ui-pg-button ui-corner-all" style="cursor: default;"><span class="ui-icon ace-icon fa fa-angle-right bigger-140"></span></td>');
		html.push('										<td id="' + this.id + '_last_pager" class="ui-pg-button ui-corner-all" style="cursor: default;"><span class="ui-icon ace-icon fa fa-angle-double-right bigger-140"></span></td>');
		html.push('									</tr>');
		html.push('								</tbody>');
		html.push('							</table>');
		html.push('						</td>');
		html.push('						<td id="' + this.id + '_pager_right" align="right">');
		html.push('							<div id="' + this.id + '_pager_info" dir="ltr" style="text-align:right" class="ui-paging-info">1 - 10　共 10 条</div>');
		html.push('						</td>');
		html.push('					</tr>');
		html.push('				</tbody>');
		html.push('			</table>');
		html.push('		</div>');
		html.push('	</div>');
		html.push('</div>');

		return html.join('');
	}

	function getHeader() {
		var html = [],
			id = this.id,
			col, colid, colwidth, colvalue, wstr;
		if (this.checkbox) {
			html.push('<th id="' + id + '_cb" role="columnheader" class="ui-state-default ui-th-column ui-th-ltr" style="width: 25px;"><div id="' + id + '_grid_cb"><input role="checkbox" id="' + id + '_hcb" class="cbox" type="checkbox"><span class="s-ico" style="display:none"><span sort="asc" class="ui-grid-ico-sort ui-icon-asc ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-ltr"></span><span sort="desc" class="ui-grid-ico-sort ui-icon-desc ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-ltr"></span></span></div></th>');
		}

		for (var i = 0; i < this.colLen; i++) {
			col = this.cols[i];
			if (col) {
				colid = col.id || 'col' + (++guid);
				colwidth = col.width || this.col_average_width;
				colvalue = col.name || '&nbsp;';
				wstr = i != this.colLen - 1 ? 'style="width: ' + colwidth + '%;"' : '';
				html.push('<th id="' + id + '_' + colid + '" role="columnheader" class="ui-state-default ui-th-column ui-th-ltr" ' + wstr + '><span class="ui-jqgrid-resize ui-jqgrid-resize-ltr" style="cursor:default">&nbsp;</span><div id="' + id + '_h_' + colid + '" class="ui-jqgrid-sortable">' + colvalue + '<span class="s-ico" style="display:none"><span sort="asc" class="ui-grid-ico-sort ui-icon-asc ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-ltr"></span><span sort="desc" class="ui-grid-ico-sort ui-icon-desc ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-ltr"></span></span></div></th>');
			}
		};

		return html.join('');
	}

	function getFirstRow() {
		var html = [],
			col, colwidth, wstr;
		html.push('<tr class="jqgfirstrow" role="row" style="height:auto">')
		if (this.checkbox) {
			html.push('<td role="gridcell" style="height:0px;width:25px;"></td>');
		}
		for (var i = 0; i < this.colLen; i++) {
			col = this.cols[i];
			if (col) {
				colwidth = col.width || this.col_average_width;
				wstr = i != this.colLen - 1 ? 'width: ' + colwidth + '%;' : '';
				html.push('<td role="gridcell" style="height: 0px; ' + wstr + '"></td>');
			}
		}
		html.push('</tr>');
		return html.join('');
	}

	function setContent(cont) {
		var container = this.controls.list || (this.controls.list = $('#' + this.id + '_list'));
		if (container.size()) {
			container.html(this.getFirstRow() + cont);
		} else {
			throw new Error('Could\'t find the list container. Maybe your html struct did\'t render on the dom.')
		}
	}

	function render(data) {
		var d, col, colfn, colval, wstr,
			html = [];
		if (data) {
			this.data = data;
			for (var i = 0; i < data.length; i++) {
				html.push('<tr role="row" id="1" tabindex="-1" class="ui-widget-content jqgrow ui-row-ltr" aria-selected="false">');
				d = data[i];
				if (this.checkbox) {
					html.push('<td role="gridcell" style="text-align:center;width: 25px;" aria-describedby="' + this.id + '_cb"><input role="checkbox" type="checkbox" id="' + this.id + '_cb_' + ((this.page - 1) * this.pagesize + i + 1) + '" class="cbox" name="' + this.id + '_cbn_' + ((this.page - 1) * this.pagesize + i + 1) + '" value="' + Xss.inDoubleQuotedAttr(d[this.key]) + '"></td>')
				}
				for (var j = 0; j < this.colLen; j++) {
					col = this.cols[j];
					colfn = col.format;
					colval = d[col.index] || '';
					colval = 'function' === typeof colfn ? colfn(colval) : colval;
					html.push('<td role="gridcell" title="' + Xss.inDoubleQuotedAttr(colval) + '" aria-describedby="' + this.id + '_' + col.index + '">' + Xss.inHTMLData(colval) + '</td>');
				}
				html.push('</tr>');
			};
			this.setContent(html.join(''));
		}
	}

	function updatePager() {
		var from = (this.page - 1) * this.pagesize + 1,
			to = from + this.pagesize - 1;
		if (this.page === this.totalPage) {
			to = this.total;
		}
		this.controls.nPageBtn.val(this.page);
		this.controls.totalPageView.html(this.totalPage);
		this.controls.pageInfo.html(from + ' - ' + to + ' 共 ' + this.total + ' 条');
	}

	function load() {
		this.getControls();
		this.loadData();
		this.registerEvents()
	}

	function loadData() {
		var self = this;
		$.ajax({
			url: self.getUrl(),
			success: function(json) {
				if ('0' == json.code) {
					self.render(getMapData(json, self.jsonReader.root));
					self.jsonReader.page && (self.page = getMapData(json, self.jsonReader.page));
					self.jsonReader.records && (self.total = getMapData(json, self.jsonReader.records));
					if (self.total) {
						self.totalPage = Math.ceil(self.total / self.pagesize);
					}
					self.updatePager();
				} else {
					self.trigger('ajaxError', json);
				}
			},
			error: function(e) {
				self.trigger('ajaxError', e);
			}
		});
	}

	function getControls() {
		this.controls = {
			box: $('#' + this.id),
			layer: $('#' + this.id + '_layer'),
			loading: $('#' + this.id + '_loading'),
			list: $('#' + this.id + '_list'),
			mark: $('#' + this.id + '_resizemark'),
			pager: $('#' + this.id + '_pager'),
			pagerLeft: $('#' + this.id + '_pager_left'),
			firstPageBtn: $('#' + this.id + '_first_pager'),
			prevPageBtn: $('#' + this.id + '_prev_pager'),
			nextPageBtn: $('#' + this.id + '_next_pager'),
			lastPageBtn: $('#' + this.id + '_last_pager'),
			nPageBtn: $('#' + this.id + '_n_pager'),
			totalPageView: $('#' + this.id + '_sp_pager'),
			pageInfo: $('#' + this.id + '_pager_info'),
			headerCheckbox: $('#' + this.id + '_hcb')
		};
	}

	function getMapData(data, map) {
		if (map) {
			var a = map.split('.');
			if (1 === a.length) {
				return data[a];
			} else {
				return getMapData(data[a.shift()], a.join('.'));
			}
		} else {
			return '';
		}
	}

	function getSelectedRow() {
		var ret = [],
			self = this;
		this.controls.list.find('.cbox').each(function() {
			var $this = $(this);
			if ($this.is(':checked')) {
				for (var i = 0; i < self.data.length; i++) {
					if ($this.val() == self.data[i][self.key]) {
						ret.push(self.data[i]);
						break;
					}
				}
			}
		});
		return ret;
	}

	function getUrl() {
		return this.url;
	}

	function setUrl(url) {
		this.url = url;
	}

	function ensureFirsAndLast(){
		
	}

	function listen(evtname, evtfn) {
		this.evts[evtname] = evtfn;
	}

	function trigger(evtname) {
		var fn = this.evts[evtname];
		if ('function' === typeof fn) {
			fn.apply(null, Array.prototype.slice.call(arguments, 1));
		}
	}

	function registerEvents() {
		var self = this;
		this.controls.headerCheckbox.off().on('click', function(e) {
			var chk = $(this).is(':checked');
			self.controls.list.find('input.cbox').each(function() {
				var $this = $(this);
				$this.prop('checked', chk);
				$this.parents('tr.jqgrow')[chk ? 'addClass' : 'removeClass']('ui-state-highlight');
			});
		});
		this.controls.list.off().on('mouseover', 'tr.jqgrow', function() {
			$(this).addClass('ui-state-hover');
		}).on('mouseout', 'tr.jqgrow', function() {
			$(this).removeClass('ui-state-hover');
		}).on('click', function(e) {
			var $this = $(e.target || e.srcElement),
				tag = $this.get(0).tagName.toLowerCase(),
				cls = $this.attr('class') || '',
				chk;
			if ('input' === tag && cls.indexOf('cbox') > -1) {
				chk = $this.is(':checked');
				$this.parent().parent()[chk ? 'addClass' : 'removeClass']('ui-state-highlight');
			} else {
				self.controls.list.find('tr.jqgrow').removeClass('ui-state-highlight').find('.cbox').each(function() {
					$(this).prop('checked', false);
				});
				$this.parents('tr.jqgrow').addClass('ui-state-highlight').find('.cbox').prop('checked', true);
			}
			self.controls.headerCheckbox.prop('checked', false);
		});
		this.controls.pager.off().on('click', function(e) {
			var $this = $(e.target || e.srcElement),
				tag = $this.get(0).tagName.toLowerCase(),
				cls = $this.attr('class') || '',
				id = $this.attr('id') || '',
				selectedRow;
			if (cls.indexOf('fa-plus-circle') > -1) {
				self.trigger('addCallback', self);
			}
			if (cls.indexOf('fa-pencil') > -1) {
				selectedRow = self.getSelectedRow();
				if (selectedRow.length) {
					self.trigger('editCallback', selectedRow, self);
				} else {
					alert('请先选择要编辑的行.');
					return;
				}
			}
			if (cls.indexOf('fa-search-plus') > -1) {
				selectedRow = self.getSelectedRow();
				if (selectedRow.length) {
					self.trigger('viewCallback', selectedRow, self);
				} else {
					alert('请先选择要查看的行.');
					return;
				}
			}
			if (cls.indexOf('fa-trash-o') > -1) {
				selectedRow = self.getSelectedRow();
				if (selectedRow.length) {
					self.trigger('delCallback', selectedRow, self);
				} else {
					alert('请先选择要删除的行.');
					return;
				}
			}
			if (cls.indexOf('fa-search') > -1) {
				self.trigger('searchCallback', self);
			}
			if (cls.indexOf('fa-refresh') > -1) {
				self.trigger('refreshCallback', self);
			}
		});

		this.controls.firstPageBtn.off().on('click', function(e) {
			if (!$(this).hasClass('ui-state-disabled')) {
				self.setUrl(Utils.url.replaceParam('pageNo', 1, self.getUrl()));
				self.loadData();
			}
		});
		this.controls.prevPageBtn.off().on('click', function(e) {
			if (!$(this).hasClass('ui-state-disabled')) {
				var page = self.page - 1;
				if (page > 0 && page < self.totalPage) {
					self.setUrl(Utils.url.replaceParam('pageNo', page, self.getUrl()));
					self.loadData();
				}
			}
		});
		this.controls.nextPageBtn.off().on('click', function(e) {
			if (!$(this).hasClass('ui-state-disabled')) {
				var page = self.page + 1;
				if (page > 0 && page < self.totalPage) {
					self.setUrl(Utils.url.replaceParam('pageNo', page, self.getUrl()));
					self.loadData();
				}
			}
		});
		this.controls.lastPageBtn.off().on('click', function(e) {
			if (!$(this).hasClass('ui-state-disabled')) {
				self.setUrl(Utils.url.replaceParam('pageNo', self.totalPage, self.getUrl()));
				self.loadData();
			}
		});
	}

	return {
		evts: {},
		listen: listen,
		trigger: trigger,
		create: create,
		init: create,
		getHtml: getHtml,
		getFirstRow: getFirstRow,
		getHeader: getHeader,
		getControls: getControls,
		getSelectedRow: getSelectedRow,
		getUrl: getUrl,
		setUrl: setUrl,
		setContent: setContent,
		render: render,
		load: load,
		loadData: loadData,
		updatePager: updatePager,
		registerEvents: registerEvents
	};
});