var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserTokenSchema = new Schema({
    uuid:"",
    email:String,
    token:String,
});

module.exports = mongoose.model('user_token', UserTokenSchema);
