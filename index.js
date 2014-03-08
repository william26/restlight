module.exports = function() {
    /**
     * Module dependencies.
     */

    var path = require('path');
    var express = require('express');
    var routes = require(path.join(__dirname, 'routes'));
    var http = require('http');

    var config = require(path.join(process.cwd(), 'config'));
    var fs = require('fs');
    var async = require('async');
    var orm = require('orm');

    var app = express();
    var routes = require(path.join(__dirname, 'lib', 'routes'));
    require('./lib/models_register')(app);

    // all environments
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());

    app.use(require('connect-multiparty')());
    app.use(function(req, res, next) {
        if (req.is('text/*')) {
            req.text = '';
            req.setEncoding('utf8');
            req.on('data', function(chunk) {
                req.text += chunk
            });
            req.on('end', next);
        } else {
            next();
        }
    });
    app.use(routes.middleware(app));


    app.use(express.methodOverride());
    app.use(express.cookieParser(config.secret));
    app.use(express.session());

    app.set('views', path.join(process.cwd(), 'views'));
    app.set('view engine', 'hjs');
    app.locals.delimiters = '<% %>';

    app.use(require('less-middleware')(path.join(process.cwd(), 'public')));
    app.use(express.static(path.join(process.cwd(), 'public')));


    // development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }



    require(path.join(__dirname, 'lib', 'endpoints_register'))(app);
    // require(path.join(__dirname, 'lib', 'views_register'))(app);
    routes.register(app);
    app.use(routes.unmatched(app));

    var server = http.createServer(app);

    server.listen(app.get('port'), function() {
        console.log('Restlight server listening on port ' + app.get('port'));
    });

    var io = require('socket.io').listen(server, {
        log: false
    });

    io.sockets.on('connection', function(socket) {
        socket.on('set id', function(session_id) {
            socket.set('id', session_id);
        });

        socket.on('send_message', function(session_id, message) {
            var clients = io.sockets.clients();
            for (var k in clients) {
                var client = clients[k];
                client.get('id', function(err, id) {
                    if (id == session_id) {
                        client.emit("msg", message);
                    }
                });
            }
        });

        socket.on('broadcast_message', function(message) {
            io.sockets.emit('msg', message);
        });
    });

};