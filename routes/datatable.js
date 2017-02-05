'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var async=require('async');

router.get('/greenhouse', function(req, res, next) {
    let query = new AV.Query('greenhouse');
    query.include('isDel',false);
    query.find().then(function(results){
        async.map(results,function(result,callback){
            result.set('DT_RowId',result.id);
            result.set('name',result.get('name')?result.get('name'):"");
            result.set('plantArea',result.get('plantArea'));
            result.set('totalArea',result.get('totalArea'));
            result.set('unusedArea',result.get('unusedArea'));
            result.set('device',result.get('device'));
            result.set('crop',result.get('crop')?result.get('crop'):"");
            result.set('switch',result.get('switch')?result.get('switch'):"");
            result.set('video',result.get('video'));
            callback(null,result);
        },function(err,data){
            res.jsonp({"data":data});
        });
    });
});

router.get('/video', function(req, res, next) {
    let resdata={};
    function promise1(callback){
        let query = new AV.Query('video');
        query.include('isDel',false);
        query.include('greenhouse');
        query.find().then(function(results){
            async.map(results,function(result,callback1){
                result.set('DT_RowId',result.id);
                result.set('name',result.get('name')?result.get('name'):"");
                result.set('deviceId',result.get('deviceId'));
                result.set('channel',result.get('channel'));
                result.set('status',result.get('status')?"在线":"离线");
                result.set('greenhousename',result.get('greenhouse').get('name'));
                result.set('greenhouse',result.get('greenhouse').id);
                callback1(null,result);
            },function(err,data){
                resdata["data"]=data;
                callback(null,data);
            });
        });
    }
    function promise2(callback){
        let query=new AV.Query('greenhouse');
        query.include('isDel',false);
        query.ascending('tab');
        query.find().then(function(results){
            async.map(results,function(result,callback1){
                result.set('label',result.get('name'));
                result.set('value',result.id);
                callback1(null,result);
            },function(err,data){
                data={"greenhouse":data};
                resdata["options"]=data;
                callback(null,data);
            });
        });
    }
    async.parallel([
        function (callback){
            promise1(callback);
        },
        function (callback){
            promise2(callback);
        }],function(err,results){
            res.jsonp(resdata);
    });
});

router.post('/video',function(req,res){
    console.log(req.body);
});

router.put('/video/edit/:id',function(req,res){
    var arr=req.body;
    var id=req.params.id;
    var video = AV.Object.createWithoutData('video', id);
    var greenhouse=AV.Object.createWithoutData('greenhouse', arr['data['+id+'][greenhouse]']);
    greenhouse.fetch().then(function(){
        video.set('greenhouse',greenhouse);
        video.set('tab',greenhouse.get('tab'));
        video.save().then(function(vd){
            var data=[];
            vd.fetch().then(function(){
                vd.set('DT_RowId',vd.id);
                vd.set('greenhouse',vd.get('greenhouse').id);
                vd.set('name',vd.get('name')?vd.get('name'):"");
                vd.set('deviceId',vd.get('deviceId'));
                vd.set('channel',vd.get('channel'));
                vd.set('status',vd.get('status')?"在线":"离线");
                vd.set('greenhousename',greenhouse.get('name'));
                data.push(vd);
                res.jsonp({"data":data});
            });
        });
    });
});

router.delete('/video/edit/:id',function(req,res){
    var id=req.params.id;
    var video = AV.Object.createWithoutData('video', id);
    video.set('isDel',true);
    video.save().then(function(){
        res.jsonp({"data":[]});
    });
});
module.exports = router;
