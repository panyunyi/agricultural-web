'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var moment=require('moment');
moment.locale('zh-cn');

router.get('/', function(req, res) {
    if(req.currentUser){
        let query=new AV.Query('farming');
        query.equalTo('isDel',false);
        query.descending('startTime');
        query.include('greenhouse');
        query.include('crop');
        query.include('user');
        query.find().then(function(results){
            results.forEach(function(result){
                result.set('startTime',new moment(result.get('startTime')).format('YYYY-MM-DD HH:mm:ss'));
                result.set('endTime',new moment(result.get('endTime')).format('YYYY-MM-DD HH:mm:ss'));
                result.set('greenhouse',result.get('greenhouse').get('name'));
                result.set('crop',result.get('crop').get('name'));
                result.set('user',result.get('user').get('name'));
                if(result.get('status')){
                    result.set('time',new moment(result.get('endTime')).fromNow());
                }
                else{
                    result.set('time',new moment(result.get('startTime')).fromNow());
                }
            });
            res.render('index',{data:results});
        });
    }else{
    	res.redirect('login');
    }
});

router.get('/videolist', function(req, res) {
    if(req.currentUser){
        let query=new AV.Query('video');
        query.equalTo('isDel',false);
        query.find().then(function(results){
            res.render('videolist',{data:results});
        });
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

router.get('/greenhouse', function(req, res) {
    if(req.currentUser){
    	res.render('greenhouse');
    }else{
    	res.redirect('../login');
    }
});

router.get('/video', function(req, res) {
    if(req.currentUser){
    	res.render('video');
    }else{
    	res.redirect('../login');
    }
});

router.get('/crop', function(req, res) {
    if(req.currentUser){
    	res.render('crop');
    }else{
    	res.redirect('../login');
    }
});

router.get('/farming', function(req, res) {
    if(req.currentUser){
    	res.render('farming');
    }else{
    	res.redirect('../login');
    }
});

router.get('/harvest', function(req, res) {
    if(req.currentUser){
    	res.render('harvest');
    }else{
    	res.redirect('../login');
    }
});

router.get('/resume', function(req, res) {
    if(req.currentUser){
    	res.render('resume');
    }else{
    	res.redirect('../login');
    }
});
module.exports = router;
