var path = require('path'),
    fs = require('fs');
module.exports = {
    middleware: function(app) {
        return function(req, res, next) {
            var render = res.render;
            res.layout = 'default';

            res.render = function(viewname, object, cb) {
                object = object || {};
                app.render(viewname, object, function(err, html) {
                    app.render('layouts/' + res.layout, {
                        content: html
                    }, function(err, result) {
                        if (!err) {
                            res.setHeader('Content-Type', 'text/html;charset=utf-8');
                            res.send(200, result);
                        } else {
                            res.send(500);
                        }
                        if (cb)
                            cb(err, result);
                    });
                });
            };
            next();
        };
    },
    register: function(app) {
        var routes = require(path.join(process.cwd(), 'routes'));
        for (var k in routes) {
            (function(route, method) {
                app.get(route, function(req, res) {
                    method(req, res);
                });
            })(k, routes[k]);
        }
    },
    unmatched: function(app) {
        return function(req, res, next) {
            var view = req.url.replace(/^\//, '');
            app.render(view, function(err, html) {
                app.render('layouts/' + res.layout, {
                    content: html
                }, function(err, result) {
                    if (!err) {
                        res.setHeader('Content-Type', 'text/html;charset=utf-8');
                        res.send(200, result);
                    }
                });
            });
        };
    },
};