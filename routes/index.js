var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/statement-upload', function(req, res, next){
    res.render('statement-upload', {
        title: 'TCL业务清算平台'
    });
});
router.get('/financial-statistics', function(req, res, next){
    res.render('financial-statistics', {
        title: 'TCL业务清算平台'
    });
});
router.get('/statement-list', function(req, res, next){
    res.render('statement-list', {
        title: 'TCL业务清算平台'
    });
});
router.get('/exchange-query', function(req, res, next){
    res.render('exchange-query', {
        title: 'TCL业务清算平台'
    });
});
router.get('/qingfen-list-query', function(req, res, next){
	res.render('qingfen-list-query', {
		title: 'TCL业务清算平台'
	});
});
router.get('/settle-card', function(req, res, next){
	res.render('settle-card', {
		title: 'TCL业务清算平台'
	});
});
router.get('/settle-rule', function(req,res, next){
	res.render('settle-rule', {
		title: 'TCL业务清算平台'
	});
});
router.get('/settle-limit', function(req,res, next){
	res.render('settle-limit', {
		title: 'TCL业务清算平台'
	});
});
router.get('/settle-query', function(req,res, next){
	res.render('settle-query', {
		title: 'TCL业务清算平台'
	});
});
router.get('/rate', function(req, res, next){
	res.render('rate', {
		title: 'TCL业务清算平台'
	});
});

/** get root 放到最后 */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'TCL业务清算平台'
	});
});
module.exports = router;