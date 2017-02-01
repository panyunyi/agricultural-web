'use strict';
var router = require('express').Router();
const utils=require('utility');
var request=require('request-json');
var AV = require('leanengine');
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
    query.find().then(function(results) {
        result['data']=results;
        res.jsonp(result)
    });
});
module.exports = router;
