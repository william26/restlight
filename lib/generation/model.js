var path = require('path');
var inquirer = require('inquirer');
var handlebars = require('handlebars');
var fs = require('fs');

var created = {};

handlebars.registerHelper("foreach", function (arr, options) {
    if (options.inverse && !arr.length)
        return options.inverse(this);

    return arr.map(function (item, index) {
        item.$index = index;
        item.$first = index === 0;
        item.$last = index === arr.length - 1;
        item.$notlast = !item.$last;
        return options.fn(item);
    }).join('');
});

function promptField(cb, fields) {
    fields = fields || [];
    var prompts2 = [];

    prompts2.push({
        name: 'name',
        message: 'What\'s the name of the field?',
        validate: function (input) {
            return typeof input === 'string' && input.indexOf(/\s/) === -1 && input !== '';
        }
    });

    prompts2.push({
        type: 'list',
        name: 'type',
        choices: ['String', 'Number', 'Boolean', 'Buffer', 'Object'],
        message: 'What\'s the type of the field?'
    });

    prompts2.push({
        type: 'confirm',
        name: 'add_field',
        message: 'Add a field?'
    });

    inquirer.prompt(prompts2, function (answers2) {

        fields.push({
            name: answers2.name,
            type: answers2.type
        });
        if (answers2.add_field) {
            promptField(cb, fields);
        } else {
            cb(fields);
        }
    });
}

function createModel(answers, fields, cb) {
    fs.readFile(path.join(__dirname, 'templates', 'models', 'model.js'), 'UTF-8', function (err, data) {
        var template = handlebars.compile(data);
        var context = {
            name: answers.name,
            fields: fields || []
        };
        var output = template(context);
        fs.writeFile(path.join(process.cwd(), 'models', answers.name + '.js'), output, function (err) {
            if (err) {
            } else {
                created.model = true;
            }
            if (cb)
                cb();
        });
    });
}

module.exports = function () {
    var prompts = [
        {
            name: 'name',
            message: 'What will be the name of the model?',
            validate: function (input) {
                return typeof input === 'string' && input.indexOf(/\s/) === -1 && input !== '';
            }
        },
        {
            name: 'crud',
            message: 'Do you want to generate a basic CRUD API endpoint for that model?',
            type: 'confirm'
        },
        {
            name: 'crud_scaffold',
            message: 'Do you want to scaffold that endpoint?',
            type: 'confirm',
            when: function (a) {
                return a.crud;
            }
        },
        {
            name: 'fields',
            message: 'Do you want to add fields for the model?',
            type: 'confirm'
        }
    ];

    inquirer.prompt(prompts, function (answers) {
        var result = {};

        if (answers.fields) {
            promptField(function (fields) {
                createModel(answers, fields);
            });
        } else {
            createModel(answers);
        }
        if (answers.crud) {

            var template_name = answers.crud_scaffold ? 'filled_endpoint.js' : 'empty_endpoint.js';

            fs.readFile(path.join(__dirname, 'templates', 'webservices', template_name), 'UTF-8', function (err, data) {
                var template = handlebars.compile(data);
                var context = {
                    model_name: answers.name,
                    model_name_lower: answers.name.toLowerCase()
                };
                var output = template(context);
                fs.writeFile(path.join(process.cwd(), 'webservices', answers.name + 'Endpoint.js'), output, function (err) {
                    if (!err) {
                        created.endpoint = true;
                    }
                });
            });
        }
        if (result.model) {
            console.log('Successfully created model in models/' + answers.name + '.js');
        }
        if (result.endpoint) {
            console.log('Successfully created API endpoint in webservices/' + answers.name + 'Endpoint.js');
        }
    });
};