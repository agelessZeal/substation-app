let config = require('../config/index');
let axios = require('axios');

exports.tokenChecker = function (req,res,next) {

    let curToken = req.get('Authorization');
    let d = new Date();
    if(curToken){
        //check current token and previous token;
        if(req.session.accessToken == curToken){
            req.session.accessToken = curToken;
            req.session.login = true;
            next();
        }else{ //Check Token Validation
            console.log("["+ d.toLocaleString() +"] New Token:" + curToken + ", " + getClientIp(req));
            axios.defaults.headers.common['Authorization'] = curToken;
            axios.get(config.graphProfileAPI)
                .then(function (result) {
                    req.session.user = result.data;
                    req.session.accessToken = curToken;
                    req.session.login = true;
                    console.log("===User Information===");
                    console.log(result.data);
                    next()
                })
                .catch(function (err) {
                    console.log("Graph API Error",err.response.statusText);
                    req.session.login = false;
                    req.session.accessToken = '';
                    return res.json({status:'fail',data:err.response.statusText});
                })
        }

    }else{
        console.log("Token Empty");
        return res.json({status:'fail',data:'Token Empty'});
    }
};

function getClientIp(req) {
    let uAg = req.headers['user-agent'];
    let ipAddress = req.connection.remoteAddress;
    if (req.headers['x-forwarded-for'] != undefined) {
        ipAddress = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    }
    ipAddress = ipAddress.split(',')[0];
    if (ipAddress.substr(0, 1) == ':') ipAddress = ipAddress.substr(7);
    return  `IP:${ipAddress}, Agent:${uAg}`;
}
