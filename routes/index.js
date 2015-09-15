var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/qingfen-list-query', function(req, res, next){
	res.render('qingfen-list-query', {
		title: 'TCL业务清算平台'
	});
	next();
});
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'TCL业务清算平台'
	});	
	next();
});
module.exports = router;