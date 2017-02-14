'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var async=require('async');
var moment=require('moment');
moment.locale('zh-cn');

router.get('/greenhouse', function(req, res, next) {
    let query = new AV.Query('greenhouse');
    query.equalTo('isDel',false);
    query.ascending('tab');
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

var Greenhouse = AV.Object.extend('greenhouse');
router.post('/greenhouse/add',function(req,res){
    var arr=req.body;
    var greenhouse=new Greenhouse();
    greenhouse.set('tab',arr['data[0][tab]']?arr['data[0][tab]']*1:0);
    greenhouse.set('name',arr['data[0][name]']);
    greenhouse.set('crop',arr['data[0][crop]'].split(','));
    greenhouse.set('totalArea',arr['data[0][totalArea]']?arr['data[0][totalArea]']*1:1);
    greenhouse.set('device',arr['data[0][device]'].split(','));
    greenhouse.set('plantArea',arr['data[0][plantArea]']?arr['data[0][plantArea]']*1:0);
    greenhouse.set('unusedArea',arr['data[0][unusedArea]']?arr['data[0][unusedArea]']*1:0);
    greenhouse.set('switch',arr['data[0][switch]'].split(','));
    greenhouse.set('video',arr['data[0][video]'].split(','));
    greenhouse.set('isDel',false);
    greenhouse.save().then(function(pro){
        var data=[];
        pro.set('DT_RowId',pro.id);
        data.push(pro);
        res.jsonp({"data":data});
    },function(error){
        console.log(error);
    });
});

router.put('/greenhouse/edit/:id',function(req,res){
    var arr=req.body;
    var id=req.params.id;
    var greenhouse = AV.Object.createWithoutData('greenhouse', id);
    greenhouse.set('tab',arr['data['+id+'][tab]']?arr['data['+id+'][tab]']*1:0);
    greenhouse.set('name',arr['data['+id+'][name]']);
    greenhouse.set('crop',arr['data['+id+'][crop]'].split(','));
    greenhouse.set('totalArea',arr['data['+id+'][totalArea]']?arr['data['+id+'][totalArea]']*1:1);
    greenhouse.set('device',arr['data['+id+'][device]'].split(','));
    greenhouse.set('plantArea',arr['data['+id+'][plantArea]']?arr['data['+id+'][plantArea]']*1:0);
    greenhouse.set('unusedArea',arr['data['+id+'][unusedArea]']?arr['data['+id+'][unusedArea]']*1:0);
    greenhouse.set('switch',arr['data['+id+'][switch]'].split(','));
    greenhouse.set('video',arr['data['+id+'][video]'].split(','));
    greenhouse.set('isDel',false);
    greenhouse.save().then(function(pro){
        var data=[];
        pro.set('DT_RowId',pro.id);
        data.push(pro);
        res.jsonp({"data":data});
    },function(error){
        console.log(error);
    });
});

router.delete('/greenhouse/remove/:id',function(req,res){
    var id=req.params.id;
    var greenhouse = AV.Object.createWithoutData('greenhouse', id);
    greenhouse.set('isDel',true);
    greenhouse .save().then(function(){
        res.jsonp({"data":[]});
    });
});

router.get('/video', function(req, res, next) {
    let resdata={};
    function promise1(callback){
        let query = new AV.Query('video');
        query.equalTo('isDel',false);
        query.include('greenhouse');
        query.ascending('channel');
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
        query.equalTo('isDel',false);
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

router.get('/crop', function(req, res, next) {
    let resdata={};
    function promise1(callback){
        let query = new AV.Query('crop');
        query.equalTo('isDel',false);
        query.include('greenhouse');
        query.find().then(function(results){
            async.map(results,function(result,callback1){
                result.set('DT_RowId',result.id);
                result.set('name',result.get('name')?result.get('name'):"");
                result.set('info',result.get('info'));
                result.set('nutrition',result.get('nutrition'));
                result.set('cooking',result.get('cooking'));
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
        query.equalTo('isDel',false);
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

var Crop = AV.Object.extend('crop');
router.post('/crop/add',function(req,res){
    var arr=req.body;
    var crop=new Crop();
    crop.set('name',arr['data[0][name]']);
    crop.set('info',arr['data[0][info]']);
    crop.set('nutrition',arr['data[0][nutrition]']);
    crop.set('cooking',arr['data[0][cooking]']);
    var greenhouse=AV.Object.createWithoutData('greenhouse', arr['data[0][greenhouse]']);
    crop.set('greenhouse',greenhouse);
    crop.set('isDel',false);
    crop.save().then(function(pro){
        var data=[];
        pro.set('DT_RowId',pro.id);
        greenhouse.fetch().then(function(){
            pro.set('greenhouse',greenhouse.id);
            pro.set('greenhousename',greenhouse.get('name'));
            data.push(pro);
            res.jsonp({"data":data});
        });
    },function(error){
        console.log(error);
    });
});

router.put('/crop/edit/:id',function(req,res){
    var arr=req.body;
    var id=req.params.id;
    var crop=AV.Object.createWithoutData('crop', id);
    crop.set('name',arr['data['+id+'][name]']);
    crop.set('info',arr['data['+id+'][info]']);
    crop.set('nutrition',arr['data['+id+'][nutrition]']);
    crop.set('cooking',arr['data['+id+'][cooking]']);
    var greenhouse=AV.Object.createWithoutData('greenhouse', arr['data['+id+'][greenhouse]']);
    crop.set('greenhouse',greenhouse);
    crop.set('isDel',false);
    crop.save().then(function(pro){
        var data=[];
        pro.set('DT_RowId',pro.id);
        greenhouse.fetch().then(function(){
            pro.set('greenhouse',greenhouse.id);
            pro.set('greenhousename',greenhouse.get('name'));
            data.push(pro);
            res.jsonp({"data":data});
        });
    },function(error){
        console.log(error);
    });
});

router.delete('/crop/remove/:id',function(req,res){
    var id=req.params.id;
    var crop = AV.Object.createWithoutData('crop', id);
    crop.set('isDel',true);
    crop .save().then(function(){
        res.jsonp({"data":[]});
    });
});

router.get('/farming', function(req, res, next) {
    let resdata={};
    function promise1(callback){
        let query = new AV.Query('farming');
        query.equalTo('isDel',false);
        query.descending('startTime');
        query.include('greenhouse');
        query.include('crop');
        query.include('user');
        query.find().then(function(results){
            async.map(results,function(result,callback1){
                let startTime=new moment(result.get('startTime'));
                let endTime=new moment(result.get('endTime'));
                let totalseconds=endTime.diff(startTime)/1000;
                let minutes=totalseconds/60;
                let seconds=minutes%60;
                let spendTime=minutes+"分"+seconds+"秒";
                result.set('DT_RowId',result.id);
                result.set('name',result.get('name')?result.get('name'):"");
                result.set('startTime',startTime.format('YYYY-MM-DD HH:mm:ss'));
                if(result.get('status')){
                    result.set('spendTime',spendTime);
                    result.set('endTime',endTime.format('YYYY-MM-DD HH:mm:ss'));
                }else{
                    result.set('spendTime',"");
                    result.set('endTime',"");
                }
                result.set('info',result.get('info')?result.get('info'):"");
                result.set('status',result.get('status'));
                result.set('remark',result.get('remark')?result.get('remark'):"");
                result.set('greenhousename',result.get('greenhouse').get('name'));
                result.set('greenhouse',result.get('greenhouse').id);
                result.set('cropname',result.get('crop').get('name'));
                result.set('crop',result.get('crop').id);
                result.set('username',result.get('user').get('name'));
                result.set('user',result.get('user').id);
                callback1(null,result);
            },function(err,data){
                resdata["data"]=data;
                callback(null,data);
            });
        });
    }
    function promise2(callback){
        let query=new AV.Query('greenhouse');
        query.equalTo('isDel',false);
        query.ascending('tab');
        query.find().then(function(results){
            async.map(results,function(result,callback1){
                result.set('label',result.get('name'));
                result.set('value',result.id);
                callback1(null,result);
            },function(err,data){
                callback(null,data);
            });
        });
    }
    function promise3(callback){
        let query=new AV.Query('crop');
        query.equalTo('isDel',false);
        query.ascending('createdAt');
        query.find().then(function(results){
            async.map(results,function(result,callback1){
                result.set('label',result.get('name'));
                result.set('value',result.id);
                callback1(null,result);
            },function(err,data){
                callback(null,data);
            });
        });
    }
    function promise4(callback){
        let query=new AV.Query('_User');
        query.equalTo('isDel',false);
        query.ascending('name');
        query.find().then(function(results){
            async.map(results,function(result,callback1){
                result.set('label',result.get('name'));
                result.set('value',result.id);
                callback1(null,result);
            },function(err,data){
                callback(null,data);
            });
        });
    }
    function promise5(callback){
        let query=new AV.Query('farmoption');
        query.equalTo('isDel',false);
        query.ascending('createdAt');
        query.find().then(function(results){
            async.map(results,function(result,callback1){
                result.set('label',result.get('name'));
                result.set('value',result.get('name'));
                callback1(null,result);
            },function(err,data){
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
        },
        function (callback){
            promise3(callback);
        },
        function (callback){
            promise4(callback);
        },
        function (callback){
            promise5(callback);
        }],function(err,results){
            resdata["options"]=Object.assign({"greenhouse":results[1]},{"crop":results[2]},
            {"user":results[3]},{"farm":results[4]});
            res.jsonp(resdata);
    });
});

var Farming = AV.Object.extend('farming');
router.post('/farming/add',function(req,res){
    var arr=req.body;
    var farming=new Farming();
    farming.set('name',arr['data[0][farm]']);
    farming.set('info',arr['data[0][info]']);
    farming.set('startTime',new Date(arr['data[0][startTime]']));
    farming.set('endTime',new Date(arr['data[0][endTime]']));
    var greenhouse=AV.Object.createWithoutData('greenhouse', arr['data[0][greenhouse]']);
    var crop=AV.Object.createWithoutData('crop', arr['data[0][crop]']);
    var user=AV.Object.createWithoutData('_User', arr['data[0][user]']);
    farming.set('greenhouse',greenhouse);
    farming.set('crop',crop);
    farming.set('user',user);
    farming.set('status',Boolean(arr['data[0][status]']*1));
    farming.set('remark',arr['data[0][remark]']);
    farming.set('isDel',false);
    farming.save().then(function(fa){
        var data=[];
        let startTime=new moment(fa.get('startTime'));
        let endTime=new moment(fa.get('endTime'));
        let totalseconds=endTime.diff(startTime)/1000;
        let minutes=totalseconds/60;
        let seconds=minutes%60;
        let spendTime=minutes+"分"+seconds+"秒";
        fa.set('DT_RowId',fa.id);
        fa.set('remark',fa.get('remark')?fa.get('remark'):"");
        fa.set('startTime',startTime.format('YYYY-MM-DD HH:mm:ss'));
        if(fa.get('status')){
            fa.set('endTime',endTime.format('YYYY-MM-DD HH:mm:ss'));
            fa.set('spendTime',spendTime);
        }else{
            fa.set('endTime',"");
            fa.set('spendTime',"");
        }
        function promise1(callback){
            greenhouse.fetch().then(function(){
                fa.set('greenhouse',greenhouse.id);
                fa.set('greenhousename',greenhouse.get('name'));
                callback(null,greenhouse.id);
            });
        }
        function promise2(callback){
            crop.fetch().then(function(){
                fa.set('crop',crop.id);
                fa.set('cropname',crop.get('name'));
                callback(null,crop.id);
            });
        }
        function promise3(callback){
            user.fetch().then(function(){
                fa.set('user',user.id);
                fa.set('username',user.get('name'));
                callback(null,user.id);
            });
        }
        async.parallel([
            function (callback){
                promise1(callback);
            },
            function (callback){
                promise2(callback);
            },
            function (callback){
                promise3(callback);
            }],function(err,results){
                data.push(fa);
                res.jsonp({"data":data});
        });

    },function(error){
        console.log(error);
    });
});

router.put('/farming/edit/:id',function(req,res){
    var arr=req.body;
    var id=req.params.id;
    var farming=AV.Object.createWithoutData('farming', id);
    farming.set('name',arr['data['+id+'][farm]']);
    farming.set('info',arr['data['+id+'][info]']);
    farming.set('startTime',new Date(arr['data['+id+'][startTime]']));
    farming.set('endTime',new Date(arr['data['+id+'][endTime]']));
    var greenhouse=AV.Object.createWithoutData('greenhouse', arr['data['+id+'][greenhouse]']);
    var crop=AV.Object.createWithoutData('crop', arr['data['+id+'][crop]']);
    var user=AV.Object.createWithoutData('_User', arr['data['+id+'][user]']);
    farming.set('greenhouse',greenhouse);
    farming.set('crop',crop);
    farming.set('user',user);
    farming.set('status',Boolean(arr['data['+id+'][status]']*1));
    farming.set('remark',arr['data['+id+'][remark]']);
    farming.set('isDel',false);
    farming.save().then(function(fa){
        var data=[];
        let startTime=new moment(fa.get('startTime'));
        let endTime=new moment(fa.get('endTime'));
        let totalseconds=endTime.diff(startTime)/1000;
        let minutes=totalseconds/60;
        let seconds=minutes%60;
        let spendTime=minutes+"分"+seconds+"秒";
        fa.set('DT_RowId',fa.id);
        fa.set('remark',fa.get('remark')?fa.get('remark'):"");
        fa.set('startTime',startTime.format('YYYY-MM-DD HH:mm:ss'));
        if(fa.get('status')){
            fa.set('endTime',endTime.format('YYYY-MM-DD HH:mm:ss'));
            fa.set('spendTime',spendTime);
        }else{
            fa.set('endTime',"");
            fa.set('spendTime',"");
        }
        function promise1(callback){
            greenhouse.fetch().then(function(){
                fa.set('greenhouse',greenhouse.id);
                fa.set('greenhousename',greenhouse.get('name'));
                callback(null,greenhouse.id);
            });
        }
        function promise2(callback){
            crop.fetch().then(function(){
                fa.set('crop',crop.id);
                fa.set('cropname',crop.get('name'));
                callback(null,crop.id);
            });
        }
        function promise3(callback){
            user.fetch().then(function(){
                fa.set('user',user.id);
                fa.set('username',user.get('name'));
                callback(null,user.id);
            });
        }
        async.parallel([
            function (callback){
                promise1(callback);
            },
            function (callback){
                promise2(callback);
            },
            function (callback){
                promise3(callback);
            }],function(err,results){
                data.push(fa);
                res.jsonp({"data":data});
        });

    },function(error){
        console.log(error);
    });
});

router.delete('/farming/remove/:id',function(req,res){
    var id=req.params.id;
    var farming = AV.Object.createWithoutData('farming', id);
    farming.set('isDel',true);
    farming .save().then(function(){
        res.jsonp({"data":[]});
    });
});
module.exports = router;
