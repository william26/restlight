var path = require('path');
var fs = require('fs');

module.exports = function (app) {
    var controller_names = fs.readdirSync(path.join(process.cwd(), 'webservices'));

    for (var k in controller_names) {
        (function (controller) {
            var controller_name = controller.replace('Endpoint.js', '');
            var controller_file = controller.replace('.js', '');

            if (typeof controller_name === 'string') {
                var controller = require(path.join(process.cwd(), 'webservices', controller_file));
                app.get('/' + controller_name, function (req, res) {
                    console.log("STUFF");
                    if (controller.index) {
                        console.log('found index');
                        controller.index(req, res);
                    }
                });
                app.all('/' + controller_name + '/action/:action', function (req, res) {
                    if (controller[req.params.action]) {
                        controller[req.params.action](req, res);
                    }
                });
                app.get('/' + controller_name + '/:id', function (req, res) {
                    if (controller.show) {
                        controller.show(req, res);
                    }
                });
                app.post('/' + controller_name, function (req, res) {
                    if (controller.create) {
                        controller.create(req, res);
                    }
                });
                app.put('/' + controller_name + '/:id', function (req, res) {
                    if (controller.update) {
                        controller.update(req, res);
                    }
                });
                app.delete('/' + controller_name + '/:id', function (req, res) {
                    if (controller.destroy) {
                        controller.destroy(req, res);
                    }
                });
            }
        })(controller_names[k]);
    }
};


