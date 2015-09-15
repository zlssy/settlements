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

	return {
		object2param: object2param
	};
});