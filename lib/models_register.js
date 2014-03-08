var path = require('path');

var fs = require('fs');
var async = require('async');
var orm = require('orm');

var config = require(path.join(process.cwd(), 'config'));
var paging = require('orm-paging');

module.exports = function(app) {

    app.use(orm.express(config.db_connection_string, {
        define: function(db, models, cb) {
            var model_pathes = [];
            var model_names = fs.readdirSync(path.join(process.cwd(), 'models'));
            db.use(paging);

            for (var i in model_names) {
                var model_name = model_names[i];
                model_pathes.push(path.join(process.cwd(), 'models', model_name));
            }

            async.each(model_pathes, function(path, next) {
                var module = require(path);
                if (typeof module === 'function')
                    module(db, function() {
                        next();
                    });
                else
                    next();

            }, function() {
                for (var k in db.models) {
                    models[k] = db.models[k];
                }
                cb();
            });
        }
    }));
};