var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = new Schema({
    uuid:{type:String, required:true},
    username:String,
    albums:Array
});

module.exports = mongoose.model('album', AlbumSchema);
