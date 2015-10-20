//登陆，权限
var express = require('express');
var request = require('request');
var tool = require('../lib/tool');
var fs = require('fs');
var path = require('path');
var router = express.Router();


router.use(function(req, res, next){
    if(setting.proxyPath != ''){
        res.redirect_ = res.redirect;
        res.redirect = function(arg){
            var argarr = Array.prototype.slice.call(arguments,0);
            argarr[0] = argarr[0].replace(/^\/+/,setting.proxyPath+"/");
            return res.redirect_.apply(res,argarr);
        }
    }
    next();
})

//登陆页
router.get('/login', function(req, res, next){
    res.render('login', {
        title: '登录 - TCL业务清算平台'
    });
});

router.post('/login', function(req, res, next){
    if(req.body.username !== 'admin' || req.body.password !== "P@ssw0rd"){
        var msg;
        if(!msg && req.body.username == '') msg = "用户名不能为空!";
        if(!msg && req.body.password == '') msg = "密码不能为空!";
        console.log(msg);
        res.render('login', {
            title: '登录 - TCL业务清算平台',
            errmsg: msg || '用户名或密码错误!',
            body: req.body
        });
        console.log(req.body)
    }else{
        req.session.userId = 'admin';
        res.redirect(req.query.rurl || '/');
    }
});

//注销
router.all('/logout', function(req, res, next){
    req.session.regenerate(function(err){
    	if(err){
    		return next(err)
    	}
    	res.redirect('/');
    })
});

//登录判断
router.use(function(req,res,next){
    if(req.session.userId) return next();
    if(req.xhr) return res.json({"code": -100,"msg": '登陆超时,请刷新页面重新登陆!'})
	return res.redirect('/login?rurl='+encodeURIComponent(req.url));
})

module.exports = router;