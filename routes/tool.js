'use strict';
var router = require('express').Router();
var AV = require('leanengine');
var async = require('async');


router.get('/', function(req, res) {
    var user = new AV.User();
    user.set("username", "admin");
    user.set("password", "123");
    user.signUp().then(function(user) {
        res.saveCurrentUser(user);
    });
});
module.exports = router;
