//登陆，权限
var express = require('express');
var request = require('request');
var tool = require('../lib/tool');
var fs = require('fs');
var path = require('path');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next){
    res.render('login', {
        title: '登录 - TCL业务清算平台'
    });
});

router.post('/login', function(req, res, next){
    req.session.userID = 12345;
    res.redirect(req.query.rurl || '/');
});

router.use(function(req,res,next){
	if(!req.session.userID){
		return res.redirect('/login?rurl='+encodeURIComponent(req.url));
	}
	next();
})

module.exports = router;