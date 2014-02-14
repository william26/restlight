module.exports = function () {
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
    require('./lib/models_register')(app);

// all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'hjs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser(config.secret));
    app.use(express.session());
    app.use(app.router);
    app.use(require('less-middleware')({ src: path.join(process.cwd(), 'public') }));
    app.use(express.static(path.join(process.cwd(), 'public')));

// development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    app.get('/', routes.index);

    require(path.join(__dirname, 'lib', 'controllers_register'))(app);

    var server = http.createServer(app);

    server.listen(app.get('port'), function () {
        console.log('Restlight server listening on port ' + app.get('port'));
    });

    var io = require('socket.io').listen(server, { log: false });

    io.sockets.on('connection', function (socket) {
        socket.on('set id', function (session_id) {
            socket.set('id', session_id);
        });

        socket.on('send_message', function (session_id, message) {
            var clients = io.sockets.clients();
            for (var k in clients) {
                var client = clients[k];
                client.get('id', function (err, id) {
                    if (id == session_id) {
                        client.emit("msg", message);
                    }
                });
            }
        });

        socket.on('broadcast_message', function (message) {
            io.sockets.emit('msg', message);
        });
    });

};