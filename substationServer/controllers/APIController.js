let async, BaseController;
let config, axios,moment;

async = require('async');
BaseController = require('./BaseController');

axios = require('axios');
config = require('../config/index');
moment = require('moment');

module.exports = BaseController.extend({
    name: 'APIController',
    checkToken : function (req,res) {
        if(req.session.login){
            return res.json( {status:'success',data:req.session.user});
        }else{
            return res.json({status:'fail',data:"Access token Invalid"});
        }
    },
    /**
     *1.Get Substation List
     *2.Get Bays from each substation
     *3.Get Devices from each Bays
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    getTree : async function (req,res) {
        let subs = [];
        let respData = {
            'status':'fail',
            'data':''
        };
        let ret = [];
        let i, j, k,self = this;
        let cId = '?clientid=' + req.session.user.id;
        let subsURL = config.apiBaseURL + '/substations' +  cId;
        console.log("===Getting Substation Lists====");
        axios.get(subsURL)
            .then(async function (result) {
                //console.log('Substations',result.data);
                subs = result.data;
                let promiseList = [];
                for(let i = 0 ;i<subs.length; i++){
                    let baysURL = config.apiBaseURL + '/substations/' + subs[i] + '/bays' +  cId;
                    promiseList.push(axios.get(baysURL));
                }
                await axios.all(promiseList).then(async function (results) {
                    for(let op = 0 ;op<results.length; op++){
                        let baysRes = results[op];
                        let bays = baysRes.data;
                        let subName = baysRes.config.url.split('/substations/')[1].split('/bays')[0];
                        let subObj = {value:subName,id: self.getRandomId('sub_',10,50000),children:[]};
                        let devPromiseList = [];
                        for(j = 0 ;j<bays.length; j++){
                            let devsURL = config.apiBaseURL + '/bays/' + bays[j] + '/devices' +  cId;
                            devPromiseList.push(axios.get(devsURL));
                        }
                        await axios.all(devPromiseList).then(function (devResults) {
                            devResults.forEach(function (devsRes) {
                                let devs = devsRes.data;
                                let bayName = devsRes.config.url.split('/bays/')[1].split('/devices')[0];
                                //console.log('Sub Id :' + subName, 'Bay Id : ' + bayName,devsRes.data);
                                let bayObj = {value:bayName,id: self.getRandomId('bay_',10,50000),children:[]};
                                for(k = 0 ;k<devs.length; k++){
                                    //console.log(devs[k]);
                                    let devObj = {value:devs[k],id: self.getRandomId('dev_',10,50000),children:[]};
                                    bayObj.children.push(devObj);
                                }
                                subObj.children.push(bayObj);
                            });
                        }).catch(function (err) {
                            console.log("Something went wrong.... at getTree function");
                            console.log(err);
                        });
                        ret.push(subObj);
                    }
                    respData.status = 'success';
                    respData.data = ret;

                }).catch(function (err) {
                    console.log(err);
                    respData.data = err;
                });
                return res.json(respData);
            })
            .catch(function (err) {
                console.log("Error in getTree function ==========>");
                return res.json({status:'fail',data:err});
        });

    },
    getMSTypes:function(req,res){
        let cId = '?clientid=' + req.session.user.id;
        let subsURL = config.apiBaseURL + '/measurements' +  cId;
        axios.get(subsURL)
            .then(function (result) {
                return res.json({status:'success',data:result.data});
            })
            .catch(function (err) {
                return res.json({status:'fail',data:err.response.statusText});
            })
    },
    getMeterings:function(req,res){
        let cId = '?clientid=' + req.session.user.id;
        let subsURL = config.apiBaseURL + '/meterings' +  cId;
        axios.get(subsURL)
            .then(function (result) {
                return res.json({status:'success',data:result.data});
            })
            .catch(function (err) {
                return res.json({status:'fail',data:err.response.statusText});
            })
    },

    getHistorySeries:async function(req,res,next){
        console.log("History Time Series API Called");
        console.log(req.body);
        let rq = req.body;
        let apiURL = `${config.apiBaseURL}/measurements/${req.body.msType.id}/historical/`;

        if(rq.devInfo.type == 'all'){ apiURL += 'all'; }
        else if (rq.devInfo.type == 'sub'){ apiURL += 'substation/';}
        else if (rq.devInfo.type == 'bay'){ apiURL += 'bay/';}
        else { apiURL += 'device/';}

        if(rq.devInfo.type != 'all') apiURL += req.body.devInfo.value;
        apiURL += '?clientid=' + req.session.user.id;

        if(typeof rq.fromDate != "undefined"){  apiURL += '&fromDate='+ this.getUTCTime(rq.fromDate);}
        if(typeof rq.toDate != "undefined"){ apiURL += '&toDate='+ this.getUTCTime(rq.toDate);}

        console.log("history data call", apiURL);
        axios.get(apiURL)
            .then(function (result) {
                return res.json({url:apiURL,status:'success',data:result.data});
            })
            .catch(function (err) {
                return res.json({url:apiURL,status:'fail',data:err.response.statusText});
            })

    },

    getMeteringSeries: async function(req,res,next){
        console.log("History Time Series API Called");
        console.log(req.body);
        let rq = req.body;
        let apiURL = `${config.apiBaseURL}/meterings/${req.body.meteringType.id}/`;

        if(rq.devInfo.type == 'all'){ apiURL += 'all'; }
        else if (rq.devInfo.type == 'sub'){ apiURL += 'substation/';}
        else if (rq.devInfo.type == 'bay'){ apiURL += 'bay/';}
        else { apiURL += 'device/';}

        if(rq.devInfo.type != 'all') apiURL += req.body.devInfo.value;
        apiURL += '?clientid=' + req.session.user.id;

        if(typeof rq.numberOf != "undefined"){
            apiURL += '&numberOf='+ rq.numberOf;
        }else{
            return res.json({url:apiURL,status:'fail',data:"Invalid numberOf field!"});
        }
        if(typeof rq.timeSpan != "undefined"){
            apiURL += '&timeSpan='+ rq.timeSpan;
        } else{
            return res.json({url:apiURL,status:'fail',data:"Invalid timeSpan format!"});
        }

        if(typeof rq.startDate != "undefined"){ apiURL += '&toDate='+ this.getUTCTime(rq.startDate);}
        if(typeof rq.endDate != "undefined"){ apiURL += '&toDate='+ this.getUTCTime(rq.endDate);}

        console.log("metering data call", apiURL);
        axios.get(apiURL)
            .then(function (result) {
                return res.json({url:apiURL,status:'success',data:result.data});
            })
            .catch(function (err) {
                return res.json({url:apiURL,status:'fail',data:err.response.statusText});
            })
    },


    getActualSeries: async function(req,res,next){
        console.log("History Time Series API Called");
        console.log(req.body);
        let rq = req.body;
        let apiURL = `${config.apiBaseURL}/measurements/${req.body.msType.id}/actual/`;

        if(rq.devInfo.type == 'all'){ apiURL += 'all'; }
        else if (rq.devInfo.type == 'sub'){ apiURL += 'substation/';}
        else if (rq.devInfo.type == 'bay'){ apiURL += 'bay/';}
        else { apiURL += 'device/';}

        if(rq.devInfo.type != 'all') apiURL += req.body.devInfo.value;
        apiURL += '?clientid=' + req.session.user.id;

        console.log("history data call", apiURL);
        axios.get(apiURL)
            .then(function (result) {
                return res.json({url:apiURL,status:'success',data:result.data});
            })
            .catch(function (err) {
                return res.json({url:apiURL,status:'fail',data:err.response.statusText});
            })
    },
    getUTCTime: function (timeStr){
        //http://momentjs.com/docs/#/parsing/utc/
        return timeStr;
        //return moment().format(timeStr);
    },
    getRandomId: function (type, min, max) {
        return type + Math.round(Math.random() * (max - min) + min);
    },
});
