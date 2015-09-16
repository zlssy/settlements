define(function(require, exports, module) {

	/**
	 * [object2param 转换对象为url参数]
	 * @param  {[type]} o [要转换的对象]
	 * @param {[type]} [transVal] [值编码函数]
	 * @return {[type]}   [description]
	 */
	function object2param(o, transVal) {
		var r = [],
			transVal = transVal || function(v) {
				return encodeURIComponent(v);
			};
		for (var k in o) {
			r.push(k + '=' + transVal(o[k]));
		}
		return r.join('&');
	}

	/**
	 * [getCookie 获取cookie]
	 * @param  {[type]} name [cookie名]
	 * @return {[type]}      [description]
	 */
	function getCookie(name) {
		var reg = new RegExp("(^| )" + name + "(?:=([^;]*))?(;|$)"),
			val = document.cookie.match(reg);
		return val ? (val[2] ? decodeURIComponent(val[2]) : "") : null;
	}

	/**
	 * [setCookie 设置cookie]
	 * @param {[type]} name    [cookie名]
	 * @param {[type]} value   [值]
	 * @param {[type]} expires [过期时间，单位分钟]
	 * @param {[type]} path    [路径]
	 * @param {[type]} domain  [域]
	 * @param {[type]} secure  [是否是安全cookie]
	 */
	function setCookie(name, value, expires, path, domain, secure) {
		var exp = new Date(),
			expires = arguments[2] || null,
			path = arguments[3] || "/",
			domain = arguments[4] || null,
			secure = arguments[5] || false;
		expires ? exp.setMinutes(exp.getMinutes() + parseInt(expires)) : "";
		document.cookie = name + '=' + encodeURIComponent(value) + (expires ? ';expires=' + exp.toGMTString() : '') + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
	}

	/**
	 * [delCookie 删除cookie]
	 * @param  {[type]} name   [cookie名]
	 * @param  {[type]} path   [路径]
	 * @param  {[type]} domain [域]
	 * @param  {[type]} secure [是否安全cookie]
	 * @return {[type]}        [description]
	 */
	function delCookie(name, path, domain, secure) {
		var value = getCookie(name);
		if (value != null) {
			var exp = new Date();
			exp.setMinutes(exp.getMinutes() - 1000);
			path = path || "/";
			document.cookie = name + '=;expires=' + exp.toGMTString() + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
		}
	}

	/**
	 * [formatJson 模板解析]
	 * @param  {[type]} str  [模板串]
	 * @param  {[type]} data [数据]
	 * @return {[type]}      [解析后的字符串]
	 */
	function formatJson(str, data) {
		var fn = !/\W/.test(str) ? _formatJson_cache[str] = _formatJson_cache[str] || $formatJson(document.getElementById(str).innerHTML) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<$").join("\t").replace(/((^|$>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)\$>/g, "',$1,'").split("\t").join("');").split("$>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
		return data ? fn(data) : fn;
	}

	/**
	 * [loadJsonp 加载jsonp数据]
	 * @param  {[type]} url [url地址]
	 * @param  {[type]} opt [配置参数]
	 * @return {[type]}     [description]
	 */
	function loadJsonp(url, opt) {
		var option = {
			onLoad: null,
			onError: null,
			onTimeout: null,
			timeout: 8000,
			charset: "utf-8"
		};
		var timer;
		if (arguments.length == 1) {
			if (typeof arguments[0] == "object") {
				opt = arguments[0];
				url = opt.url;
			} else {
				opt = {};
			}
		}
		if (typeof(opt.data) == 'object') {
			var param = [];
			for (var k in opt.data) {
				param.push(k + '=' + opt.data[k])
			}
			if (param.length > 0) {
				param = param.join('&');
				url += (url.indexOf('?') > 0 ? '&' : '?') + param;
			}
		}
		for (var i in opt) {
			if (opt.hasOwnProperty(i)) {
				option[i] = opt[i];
			}
		}
		var el = document.createElement("script");
		el.charset = option.charset || "utf-8";
		el.onload = el.onreadystatechange = function() {
			if (/loaded|complete/i.test(this.readyState) || navigator.userAgent.toLowerCase().indexOf("msie") == -1) {
				option.onLoad && option.onLoad();
				clear();
			}
		};
		el.onerror = function() {
			option.onError && option.onError();
			clear();
		};
		el.src = url;
		document.getElementsByTagName('head')[0].appendChild(el);
		if (typeof option.onTimeout == "function") {
			timer = setTimeout(function() {
				option.onTimeout();
			}, option.timeout);
		};
		var clear = function() {
			if (!el) {
				return;
			}
			timer && clearTimeout(timer);
			el.onload = el.onreadystatechange = el.onerror = null;
			el.parentNode && (el.parentNode.removeChild(el));
			el = null;
		}
	}

	return {
		object2param: object2param,
		cookie: {
			get: getCookie,
			set: setCookie,
			del: delCookie
		},
		formatJson: formatJson,
		loadJsonp: loadJsonp
	};
});