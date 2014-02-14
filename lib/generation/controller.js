var path = require('path');
var inquirer = require('inquirer');
var handlebars = require('handlebars');
var fs = require('fs');

module.exports = function () {
    var prompts = [

        {
            name: 'controller_name',
            message: 'What will be the name of the controller?',
            validate: function (input) {
                return typeof input === 'string' && input.indexOf(/\s/) === -1 && input !== '';
            }

        }
    ];

    inquirer.prompt(prompts, function (answers) {
        var result = {};
        fs.readFile(path.join(__dirname, 'templates', 'controllers', 'empty_controller.js'), 'UTF-8', function (err, data) {
            console.log(err);
            var template = handlebars.compile(data);
            var context = {

            };
            var output = template(context);
            fs.writeFile(path.join(process.cwd(), 'controllers', answers.controller_name + 'Controller.js'), output, function (err) {
                if (!err) {
                    result.generated = true;
                }
            });

            if (result.generated) {
                console.log('Successfully created an empty controller in controllers/' + answers.controller_name + 'Controller.js');
            }
        });
    });
};