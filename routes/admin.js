'use strict';
var router = require('express').Router();
var AV = require('leanengine');

router.get('/', function(req, res) {
    if(req.currentUser){
    	res.render('index');
    }else{
    	res.redirect('login');
    }
});

router.get('/video1', function(req, res) {
    if(req.currentUser){
    	res.render('videolist1');
    }else{
    	res.redirect('../login');
    }
});

router.get('/video2', function(req, res) {
    if(req.currentUser){
    	res.render('videolist2');
    }else{
    	res.redirect('../login');
    }
});

router.get('/chart', function(req, res) {
    if(req.currentUser){
    	res.render('chart');
    }else{
    	res.redirect('../login');
    }
});

router.get('/switch', function(req, res) {
    if(req.currentUser){
    	res.render('switch');
    }else{
    	res.redirect('../login');
    }
});
module.exports = router;
