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

router.get('/video3', function(req, res) {
    if(req.currentUser){
    	res.render('videolist3');
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
