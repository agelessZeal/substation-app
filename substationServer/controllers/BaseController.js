let _, config;

_ = require("underscore");
config = require('../config/index');

module.exports = {
    name: "BaseController",
    extend: function (child) {
        return _.extend({}, this, child);
    },
    run: function (req, res, next) {
    },
};
