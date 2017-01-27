'use strict';
var router = require('express').Router();
const utils=require('utility');
var request=require('request-json');

router.get('/getToken', function(req, res) {
    let client=request.createClient('https://open.ys7.com/api/method');
    let time=Date.now();
    let sign=utils.md5('phone:18626126401,method:token/getAccessToken,time:'+
    time+',secret:6ec65cb1efaae179b2d192972c5010e2');
    let post={"id":"1","system":{"key":"11f13960d4dd4b6b8fada537d0f4d42a",
    "sign":sign,"time":time,"ver":"1.0"},"method":"token/getAccessToken",
    "params":{"phone":"18626126401"}};
    
    client.post('/',post,function(err,res1,body){
        res.jsonp(body);
    });
});
module.exports = router;
