let express,router, config;
let api_controller;

express = require('express');
router = express.Router();
config = require('./config/index');

api_controller = require('./controllers/APIController');

router.post('/check_token', function (req, res, next) {
    api_controller.checkToken(req,res,next);
});

router.post('/get_tree', function (req, res, next) {
    api_controller.getTree(req,res);
});

router.post('/get_ms_types',function (req,res,next) {
    api_controller.getMSTypes(req,res);
});

router.post('/get_meterings',function (req,res,next) {
    api_controller.getMeterings(req,res);
});


router.post('/get_history_data',function (req,res,next) {
    api_controller.getHistorySeries(req,res);
});

router.post('/get_metering_data',function (req,res,next) {
    api_controller.getMeteringSeries(req,res);
});

router.post('/get_actual_data',function (req,res,next) {
    api_controller.getActualSeries(req,res);
});

//export this router to use in our index.js
module.exports = router;
