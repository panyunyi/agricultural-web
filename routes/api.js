'use strict';
var router = require('express').Router();
const utils=require('utility');
var request=require('request-json');
var AV = require('leanengine');
var moment=require('moment');
var result={
    status:200,
    message:"",
    data:"",
    server_time:new Date()
};
router.get('/getToken', function(req, res) {
    let client=request.createClient('https://open.ys7.com');
    let time=Math.round(new Date().getTime()/1000);
    let sign=utils.md5('phone:18626126401,method:token/getAccessToken,time:'+
    time+',secret:6ec65cb1efaae179b2d192972c5010e2');
    let post={"id":"1","system":{"key":"11f13960d4dd4b6b8fada537d0f4d42a",
    "sign":sign,"time":time,"ver":"1.0"},"method":"token/getAccessToken",
    "params":{"phone":"18626126401"}};
    client.post('api/method',post,function(err,res1,body){
        res.jsonp(body);
    });
});

router.get('/greenhouse', function(req, res) {
    let query = new AV.Query('greenhouse');
    query.equalTo('isDel',false);
    query.find().then(function(results) {
        result['data']=results;
        res.jsonp(result)
    });
});

router.get('/crop', function(req, res) {
    let query = new AV.Query('crop');
    query.equalTo('isDel',false);
    query.include('greenhouse');
    query.find().then(function(results) {
        results.forEach(function(result){
            result.set('greenhouse',result.get('greenhouse').get('name'));
        });
        result['data']=results;
        res.jsonp(result)
    });
});

router.get('/video', function(req, res) {
    let query = new AV.Query('video');
    query.equalTo('isDel',false);
    query.include('greenhouse');
    query.find().then(function(results) {
        results.forEach(function(result){
            result.set('greenhouse',result.get('greenhouse').get('name'));
        });
        result['data']=results;
        res.jsonp(result)
    });
});

router.get('/farming', function(req, res) {
    let query = new AV.Query('farming');
    query.equalTo('isDel',false);
    query.include('greenhouse');
    query.include('crop');
    query.include('user');
    query.find().then(function(results) {
        results.forEach(function(result){
            result.set('greenhouse',result.get('greenhouse').get('name'));
            result.set('crop',result.get('crop').get('name'));
            result.set('user',result.get('user').get('name'));
        });
        result['data']=results;
        res.jsonp(result)
    });
});

var Farming=AV.Object.extend('farming');
router.post('/farming', function(req, res) {
    let arr=req.body;
    let farm=new Farming();
    let greenhouse=AV.Object.createWithoutData('greenhouse', arr.greenhouse);
    let crop=AV.Object.createWithoutData('crop', arr.crop);
    let user=AV.Object.createWithoutData('_User', arr.user);
    farm.set('greenhouse',greenhouse);
    farm.set('crop',crop);
    farm.set('user',user);
    farm.set('name',arr.name);
    farm.set('remark',arr.remark);
    farm.set('startTime',new Date(arr.startTime));
    farm.set('info',arr.info);
    farm.set('status',false);
    farm.set('isDel',false);
    farm.save().then(function(f){
        f.set('startTime',new moment(f.get('startTime')).format('YYYY-MM-DD HH:mm:ss'));
        result['data']=f;
        res.jsonp(result)
    },function(error){
        console.log(error);
    });
});

router.get('/farming/:id/:time', function(req, res) {
    //let arr=req.body;
    let id=req.params.id;
    let time=req.params.time;
    let farm=AV.Object.createWithoutData('farming', id);
    farm.set('endTime',new Date(time));
    farm.save().then(function(f){
        f.set('endTime',new moment(f.get('endTime')).format('YYYY-MM-DD HH:mm:ss'));
        result['data']=f;
        res.jsonp(result);
    },function(error){
        console.log(error);
    });
});

router.get('/farmoption', function(req, res) {
    let query = new AV.Query('farmoption');
    query.equalTo('isDel',false);
    query.find().then(function(results) {
        result['data']=results;
        res.jsonp(result)
    });
});
module.exports = router;
