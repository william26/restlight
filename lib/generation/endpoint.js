var path = require('path');
var inquirer = require('inquirer');
var handlebars = require('handlebars');
var fs = require('fs');

module.exports = function () {
    var prompts = [

        {
            name: 'endpoint_name',
            message: 'What will be the name of the endpoint?',
            validate: function (input) {
                return typeof input === 'string' && input.indexOf(/\s/) === -1 && input !== '';
            }

        }
    ];

    inquirer.prompt(prompts, function (answers) {
        var result = {};
        fs.readFile(path.join(__dirname, 'templates', 'webservices', 'empty_endpoint.js'), 'UTF-8', function (err, data) {
            var template = handlebars.compile(data);
            var context = {

            };
            var output = template(context);
            fs.writeFile(path.join(process.cwd(), 'webservices', answers.endpoint_name + 'Endpoint.js'), output, function (err) {
                if (!err) {
                    result.generated = true;
                }
            });

            if (result.generated) {
                console.log('Successfully created an empty endpoint in webservices/' + answers.endpoint_name + 'Endpoint.js');
            }
        });
    });
};