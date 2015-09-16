var _ = require('underscore');
var request = require('request');
var querystring = require('querystring');
var q = require('queue-fun').Q;

var qrequestStr = exports.qrequestStr = function(args) {
	var deferred = q.defer()
	try{
		var uri = args.uri || args.url
			,t1 = new Date().getTime()
			,t2 = 0;
		args.method = args.method || 'get'
		args.timeout = args.timeout || 20000
		args.useQuerystring = true;
		if(typeof args.form !== 'string'){
			args.form = querystring.stringify(args.form) 
		}
		request(args, function(err, response, body) {
			var o = this;
			var getmsg = function(unCode){
				var msg = (!unCode && response) ? '\n API request '+ o.response.statusCode : '';
				msg += '\n path:' + o.href.replace(/\?.*$/,'');
				msg += o.uri.search ? '\n queryString:' + o.uri.search : '';
				msg += o.method == 'POST' ? '\n formData:' + o.body.toString() : '';
				msg += body ? '\n body:' + body : '';
				return msg;
			}
			if(err) return deferred.reject(new Error(getmsg(1) + "\n" + err.stack));
			if(response.statusCode !== 200) return deferred.reject(new Error(getmsg()));
			t2 = new Date().getTime()
			console.log(new Date() + '--url:' + uri + ' cost time: ' + (t2 - t1) + 'ms')
			deferred.resolve(body)
		})
	}catch(e){
		deferred.reject(e)
	}
	return deferred.promise
}

exports.qrequestJson = function(args){
	qrequestStr(args).then(function(data){
		var data = JSON.parse(data)
		return data;
	})
}