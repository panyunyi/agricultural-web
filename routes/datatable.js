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

module.exports = router;
