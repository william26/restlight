var path = require('path');
var inquirer = require('inquirer');
var handlebars = require('handlebars');
var fs = require('fs');

module.exports = function () {
    var prompts = [

        {
            name: 'project_name',
            message: 'What will be the name of the project?',
            validate: function (input) {
                return typeof input === 'string' && input.indexOf(/\s/) === -1 && input !== '';
            }

        }
    ];

    inquirer.prompt(prompts, function (answers) {
        var project_name = answers.project_name;
        var result = {};

        fs.mkdir(path.join(process.cwd(), project_name), function (err) {
            if (err) {
                console.log('An error occured');
            } else {
                fs.mkdir(path.join(process.cwd(), project_name, 'controllers'));
                fs.mkdir(path.join(process.cwd(), project_name, 'models'));
                fs.mkdir(path.join(process.cwd(), project_name, 'public'));
                fs.mkdir(path.join(process.cwd(), project_name, 'config'), function (err) {
                    if (!err) {
                        fs.readFile(path.join(__dirname, 'templates', 'config', 'index.js'), 'UTF-8', function (err, data) {

                            console.log(err);
                            var template = handlebars.compile(data);
                            var context = {
                                appname: answers.project_name,
                                secret: 'your secret here',
                                port: 3000
                            };
                            var output = template(context);
                            fs.writeFile(path.join(process.cwd(), answers.project_name, 'config', 'index.js'), output, function (err) {
                                if (!err) {
                                    result.config = true;
                                }
                            });
                        });
                    }
                });
                fs.mkdir(path.join(process.cwd(), project_name, 'views'), function (err) {

                    if (!err) {
                        fs.readFile(path.join(__dirname, 'templates', 'views', 'index.hjs'), 'UTF-8', function (err, data) {
                            console.log(err);
                            var template = handlebars.compile(data);
                            var context = {
                                appname: answers.project_name,
                                secret: 'your secret here',
                                port: 3000
                            };
                            var output = template(context);
                            fs.writeFile(path.join(process.cwd(), answers.project_name, 'views', 'index.hjs'), output, function (err) {
                                if (!err) {
                                    result.index = true;
                                }
                            });
                        });
                    }
                });

            }
        });
    });
};