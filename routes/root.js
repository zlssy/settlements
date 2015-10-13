//登陆，权限
var express = require('express');
var request = require('request');
var tool = require('../lib/tool');
var fs = require('fs');
var path = require('path');
var router = express.Router();

//登陆页
router.get('/login', function(req, res, next){
    res.render('login', {
        title: '登录 - TCL业务清算平台'
    });
});

router.post('/login', function(req, res, next){
    req.session.userId = 12345;
    res.redirect(req.query.rurl || '/');
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
    if(req.xhr) return req.json({"code": -100,"msg": '登陆超时,请重新登陆!'})
	return res.redirect('/login?rurl='+encodeURIComponent(req.url));
})

module.exports = router;