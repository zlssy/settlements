//数据模拟
var express = require('express');
var request = require('request');
var tool = require('../lib/tool');
var fs = require('fs');
var path = require('path');
var router = express.Router();
global._ = require('underscore');

//代理
var daili = true; //是否启用代理
var daili_url = "http://www.hao123.com/";
var userid = 12345;

// if (daili) { //代理
// 	router.all("/*", function(req, res, next) {
// 		var callback = req.query.callback;
// 		var obj = {
// 			"method": req.method,
// 			"uri": daili_url + req.url,
// 			"headers": {
// 				"userId": userid
// 			}
// 		};
// 		if (req.method === "POST") {
// 			obj.form = _.extend({}, req.body)
// 		}
// 		tool.qrequestStr(obj).done(function(data) {
// 			res.send(data);
// 		}, function(e) {
// 			next(e)
// 		})
// 	})
// }

if (daili) {
    router.all('/*', function(req, res, next) {
        console.log(' proxy: ' + req.url);
        var callback = req.query.callback;
        var obj = {
            "method": req.method,
            "uri": 'http://testtclpay.tclclouds.com/settlement' + req.url,
            "headers": {
                "userId": userid
            }
        };
        if (req.method === "POST") {
            obj.form = _.extend({}, req.body)
        }
        tool.qrequestStr(obj).done(function(data) {
            console.log(' send proxy[' + req.url + '] data:', data)
            res.json('string' == typeof data ? JSON.parse(data) : data);
        }, function(e) {
            next(e)
        })
    });
}



//以下为模拟数据
var DATAY = {
    "code": 0,
    "msg": 'Success'
}
// 通用约定
// 	pageNo Integer 表示第几页，默认为1
// 	pageSize Integer 每页返回多少条数据，默认20
//处理page
router.all('/*', function(req, res, next) {
    var _Page = res._Page = {
        "totalCount": 100,
        "pageSize": req.query.pageSize || req.body.pageSize || 20,
        "pageNo": req.query.pageNo || req.body.pageNo || 1
    }
    next()
});

// 功能：获取数据字典类型列表
// URL：/dataDictionary/list
// METHOD：GET
// 参数：
// type	String	否	字典类型编码
// languageCode	String	否	默认中文zh
// sort	String	否	排序字段 默认类型编码
// order	String	否	asc/desc 默认升序
router.all('/dataDictionary/list', function(req, res, next) {
    var arr = []
    for (var i = 1; i <= res._Page.pageSize; i++) {
        arr.push({
            "id": i,
            "type": 'clearingStatus', //字典类型编码
            "label": '清分状态' //字典类型名称
        })
    }
    var data = _.extend({}, DATAY, {
        "data": _.extend(res._Page, {
            "pageData": arr
        })
    })
    res.json(data);
});

// 功能：添加或修改数据字典类型
// URL：/dataDictionary/addOrUpdate
// METHOD：POST
// 参数：
// id	Integer	否	字典类型ID,新增为空,修改必须传
// type	String	是	字典类型编码
// label	String	是	字典类型名称
// languageCode	String	否	默认中文zh
// dataArray	Json Array	否	数据字典Json数组
// dataArray 参数说明:
// code	String	是	字典编码
// label	String	是	字典名称
// dataDictionaryStatus	String	是	字典状态:可用;禁用
// displayOrder	Integer	是	字典顺序 数值越低，在下拉框中显示最靠前
router.all('/dataDictionary/addOrUpdate', function(req, res, next) {
    res.json(DATAY);
});

// 功能：获取数据字典详细信息
// URL：/dataDictionary/detail
// METHOD：GET
// 参数：
// id	Integer	是	数据字典类型ID
router.all('/dataDictionary/detail', function(req, res, next) {
    var data = _.extend({}, DATAY, {
        "data": {
            "id": 1,
            "type": 'clearingStatus',
            "typeLabel": '清分状态',
            "dataArray": [{ //1,待结算;2,结算中;3,已结算
                "id": 1, //字典编码ID
                "code": 4, //字典编码
                "label": "已存档", //字典名称
                "dataDictionaryStatus": 1, //字典状态:1可用; 2禁用
                "displayOrder": 1 //字典顺序 数值越低，在下拉框中显示最靠前
            }]
        }
    })
    res.json(data);
});

// 功能：获取数据字典显示列表
// URL：/dataDictionary/dropdownlist
// METHOD：GET
// 参数：
// 字段名	类型	是否必选	说明
// type	String	是	下拉列表类型如:clearingStatus
// languageCode	String	否	中文zh,英语en 默认zh
router.all('/dataDictionary/dropdownlist', function(req, res, next) {
    var data = _.extend({}, DATAY, {
        "data": {
            "type": "clearingStatus",
            "label": "清分状态",
            "dataArray": [{
                "label": "待结算", //显示名字
                "innerValue": "1", //内部值
                "displayOrder": "" //显示顺序1>2>3
            }, {
                "label": 0, //显示名字
                "innerValue": "结算中", //内部值
                "displayOrder": "1" //显示顺序1>2>3
            }, {
                "label": 0, //显示名字
                "innerValue": "已结算", //内部值
                "displayOrder": "3" //显示顺序1>2>3
            }]
        }
    })
    res.json(data);
});
var fileapi = {
    '/clearing/list': "settlement-clearing-list.json",
    '/settleCard/list': 'settle-card-list.json',
    '/settleCard/list:1': 'settle-card-list.json',
    '/settleCard/list:2':'settle-card-list2.json',
    '/settleCard/history':'settle-card-history.json',
    '/settleRule/list':'settle-rule-list.json',
    '/settleRule/history':'settle-card-history.json',
    '/queryStatisticalRecord':'queryStatisticalRecord.json',
    '/exchangeRate/list':'exchange-list.json',
    '/settleLimit/list': 'settle-limit-list.json',
    '/queryWrongRecord': 'queryWrongRecord.json',
    '/reconciliation': 'reconciliation.json',
    '/settleLimit/history': 'settle-card-history.json'
};

//加载文件数据
// router.all('/clearing/list',function(req,res,next){
// 	if(fileapi[req.path]){
// 		fs.createReadStream(path.resolve(__dirname,'../temp_data/',fileapi[req.path])).pipe(res);
// 	}else{
// 		next();
// 	}
// });

if (!daili) {
    router.get('/*', function(req, res, next) {
        var href = req.url,
            basePath = req.path,
            pageNo = href.indexOf('pageNo') > -1 ? href.replace(/^.*pageNo=(\d+).*/, '$1') : 0,
            fileName = '';
        if (pageNo) {
            fileName = req.path + ':' + pageNo;
            if (fileapi[fileName]) {
                console.log(fileName, ' replace as ', fileapi[fileName]);
                fs.readFile(path.resolve(__dirname, '../temp_data', fileapi[fileName]), {
                    encoding: 'utf-8'
                }, function(err, data) {
                    if (err) {
                        console.log(err.message);
                        next();
                    } else {
                        res.json(JSON.parse(data));
                    }
                });
            } else {
                next();
            }
        } else {
            if (fileapi[req.path]) {
                console.log(req.path, ' replace as ', fileapi[req.path]);
                fs.readFile(path.resolve(__dirname, '../temp_data', fileapi[req.path]), {
                    encoding: 'utf-8'
                }, function(err, data) {
                    if (err) {
                        console.log(err.message);
                        next();
                    } else {
                        res.json(JSON.parse(data));
                    }
                });
            } else {
                next();
            }
        }
    });
}

if (!daili) { //代理
    router.all("/*", function(req, res, next) {
        var callback = req.query.callback;
        var obj = {
            "method": req.method,
            "uri": daili_url + req.url,
            "headers": {
                "userId": userid
            }
        };
        if (req.method === "POST") {
            obj.form = _.extend({}, req.body)
        }
        tool.qrequestStr(obj).done(function(data) {
            res.send(data);
        }, function(e) {
            next(e)
        })
    })
}

module.exports = router;

