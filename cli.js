#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var program = require('commander');
var pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')));
var generation = require('./lib/generation');

program.version(pkg.version)
    .option('start', 'Start application')
    .option('init', 'Init a new application')
    .option('endpoint', 'Create an API endpoint for models')
    .option('model', 'Create a model').parse(process.argv);

if (program.start) {
    console.log('Starting app');
    require('./index.js')();
} else if (program.init) {
    generation.init_project();
} else if (program.endpoint) {
    generation.create_endpoint();
} else if (program.model) {
    generation.create_model();
} else if (program.controller) {
	generation.create_controller();
}