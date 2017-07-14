var express = require('express');
var router = express.Router();
// New Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest1');

/* GET userlist page. */
router.get('/', function (req, res, next) {
    var collection = db.get('usercollection');
    collection.find({}, {}, function (e, docs) {
        res.render('userlist', {
            "userlist": docs
        });
    });
});


module.exports = router;