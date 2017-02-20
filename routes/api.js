'use strict';
var router = require('express').Router();
const utils=require('utility');
var request=require('request-json');
var AV = require('leanengine');
var moment=require('moment');
moment.locale('zh-cn');
var result={
    status:200,
    message:"",
    data:"",
    server_time:new Date()
};

router.get('/version/:code',function(req,res){
  var query=new AV.Query('version');
  query.greaterThan('version_code', req.params.code*1);
  query.first().then(function (data) {
    if(data==null){
      data="";
    }
    res.json({
      status:200,
      message:"",
      data:data,
      server_time: new Date()
    });
  }, function (error) {

  });
});

router.get('/getInfo', function(req, res) {
    let client=request.createClient('http://14961rg045.iask.in:15834');
    let date=new moment(new Date()).format('YYYY-MM-DD');
    client.get('data/'+date,function(err,res1,body){
        if(body!="undefined"){
            body.forEach(function(data){
                data['time']=new moment(data.time).format('YYYY-MM-DD HH:mm:ss');
            });
            res.jsonp(body);
        }
    });
});

router.get('/test',function(req,res){
    let query=new AV.Query('info');
    query.lessThanOrEqualTo('time',new Date());
    query.limit(10);
    query.find().then(function(results){
        results.forEach(function(result){
            result.set('time',new moment(result.get('time')).format('YYYY-MM-DD HH:mm:ss'));
        });
        res.jsonp({"data":results,"length":results.length});
    });
});

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
    },function(error){
        console.log(error);
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

router.get('/farming/:greenhouse/:user/:unit', function(req, res) {
    let query = new AV.Query('farming');
    let start=moment().startOf(req.params.unit);
    let end=moment().endOf(req.params.unit);
    query.equalTo('isDel',false);
    query.greaterThanOrEqualTo('startTime',new Date(start));
    query.lessThanOrEqualTo('startTime',new Date(end));
    let greenhouse=AV.Object.createWithoutData('greenhouse', req.params.greenhouse);
    let user=AV.Object.createWithoutData('_User', req.params.user);
    query.equalTo('user',user);
    query.equalTo('greenhouse',greenhouse);
    query.include('greenhouse');
    query.include('crop');
    query.include('user');
    query.find().then(function(results) {
        results.forEach(function(result){
            result.set('greenhouse',result.get('greenhouse').get('name'));
            result.set('crop',result.get('crop').get('name'));
            result.set('user',result.get('user').get('name'));
            result.set('startTime',result.get('startTime')?new moment(result.get('startTime')).format('YYYY-MM-DD HH:mm:ss'):"");
            result.set('endTime',result.get('startTime')?new moment(result.get('endTime')).format('YYYY-MM-DD HH:mm:ss'):"");
            result.set('info',result.get('info')?result.get('info'):"");
            result.set('remark',result.get('remark')?result.get('remark'):"");
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
    let id=req.params.id;
    let time=req.params.time;
    let farm=AV.Object.createWithoutData('farming', id);
    farm.set('endTime',new Date(time));
    farm.set('status',true);
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
