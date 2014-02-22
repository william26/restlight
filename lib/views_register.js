var fs = require('fs'),
    path = require('path');

function dirTree(filename) {
    var stats = fs.lstatSync(filename),
        info = {
            path: filename,
            name: path.basename(filename)
        };
    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        info.type = "file";
    }
    return info;
}
construct_urls = function(app, dir_structure, url) {
    url = url || '/';
    if (dir_structure.type == 'folder') {
        url += dir_structure.name + '/';
        if (dir_structure.children) {
            for (var k in dir_structure.children) {
                construct_urls(app, dir_structure.children[k], url);
            }
        }
    } else {
        if (dir_structure.name.match(/\.hjs$/)) {
            var array = dir_structure.name.split('.');
            array.pop();
            var viewname = array.join('.');
            console.log('registering', url + viewname);
            if (viewname == 'index') {
                var address = url === '' ? '/' : url;
                url = url.replace(/^\//, '');
                app.get(address, function(req, res) {
                    console.log(url + viewname);
                    app.render(url + viewname, function(err, html) {
                        res.render('layout', {
                            content: html
                        });
                    });
                });
            } else {
                app.get(url + viewname, function(req, res) {
                    url = url.replace(/^\//, '');
                    console.log(url + viewname);
                    app.render(url + viewname, function(err, html) {
                        res.render('layout', {
                            content: html
                        });
                    });
                });
            }
        }
    }
}
module.exports = function(app) {
    var dir_structure = dirTree(path.join(process.cwd(), 'views'));
    console.log(dir_structure);
    if (dir_structure.children) {
        for (var k in dir_structure.children) {
            construct_urls(app, dir_structure.children[k]);
        }
    }
};