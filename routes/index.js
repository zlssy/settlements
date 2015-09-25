var express = require('express');
var router = express.Router();

/* GET home page. */
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
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'TCL业务清算平台'
	});
});
module.exports = router;