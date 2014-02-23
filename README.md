##RESTlight

This Nodejs micro framework allows you to create small websites or web apps, with a classic routing system, or with a
single page front-end application.

The framework gives you a full RESTful API engine to manage your data from webservices.

####Installation

To install, simply run :

```sh
$ npm install -g restlight
```

> RESTlight is based on Express, Socket.io and node-orm2.

For everything to work properly, make sure you've installed all the right drivers for the database.
For example, if you wish to use it with MongoDB, don't forget to run :

```sh
$ npm install mongodb
```

Also make sure the database is running on the connection string you set in the configuration
when you try to start your app, otherwise, the server will crash.

###Configuration

To configure your project, go to configs/index.js

```javascript
module.exports = {
    port: 3000,
    db_connection_string: "mongodb://172.17.0.2:27017/restlight",
    secret: 'your secret here'
};
```

There you can edit the port and the database connection string. Refer [top node-orm2's documentation][1] for available
database drivers.

###Project creation

To create your first project, run the following command, and answer the questions.

```sh
$ restlight init
```

A folder named after your project will be created in the current directory.

In this folder, you'll find :

    controllers/ --> contains all your controllers
    models/ --> contains your node-orm2 models
    config/ --> contains a file, index.js, that holds configuration for various things (port, database, etc.)
    views/ --> contains the main layout
    public/ --> front-end directory. Everything in it is directly accessible from the browser (holds your front-end app)

###Running

To run your app, simply call the following command in the project directory :

```sh
$ restlight start
```

It will run on the port 3000 by default (this is easily changeable in config/index.js).

###Scaffolding

You can easily create API endpoints and models via the cli command.

####Create an API endpoint

Run the following command to create a new empty API endpoint :

```sh
$ restlight endpoint
```

You will be asked the name that you want to give this endpoint. The endpoint will then be created in the webservices/
folder.

An empty endpoint looks like this :

```javascript
module.exports = {
    index: function (req, res) {
        req.json([]);
    },
    show: function (req, res) {
        req.json({});
    },
    create: function (req, res) {
        req.json({});
    },
    update: function (req, res) {
        req.json({});
    },
    destroy: function (req, res) {
        req.send(200, 'success');
    }
};
```

By default, only crud methods are created. You can call these methods via the usual REST HTTP verbs :

- GET /User --> controllers/UserEndpoint.js:index
- GET /User/:id --> controllers/UserEndpoint.js:show
- POST /User --> controllers/UserEndpoint.js:create
- PUT /User/:id --> controllers/UserEndpoint.js:update
- DELETE /User/:id --> controllers/UserEndpoint.js:destroy

You can add additional methods which will be callable that way :

- ANY_VERB /User/action/method_name


####Create a model

Run the following command to create a new model :

```sh
$ restlight model
```

You will be asked the following questions :

- The name of the model
- Do you want to create an associated API endpoint (and if so, do you want it scaffolded)
- Do you want to add fields (and if so, which ones, and of which types)

Models are created in the models folder.

For more information about the structure of the model, please refer to [node-orm2's documentation][1], which will tell you
more than I can here :).

You can access created models and their data in controllers through the **req** parameter, as explained in their doc.

### Routes

If you want to create a classic website with different server-side compiled templates, inserted into a layout, you can add
custom routes in the routes/index.js file.

Routes look like this :

```javascript
module.exports = {
    '/': function (req, res) {
        res.render('index', {
            data: 'to',
            compile: 'the',
            inner: 'template'
        });
    }
};
```

In that case, the route renders the template views/index.hjs within the default layout, views/layouts/default.hjs.

**Setting your layout**

By default, the layout is the file called views/layouts/default.hjs.

You can set another layout stored in the same directory directly in the route callback :

```javascript
    //...
    '/myroute': function (req, res) {
        res.layout = 'custom';
        res.render('index', {
            data: 'to',
            compile: 'the',
            inner: 'template'
        });
    }
    //...
```

In that case, the layout will be views/layouts/custom.hjs.

All you need to do in the layout template is to set where the inner view has to be rendered :


```html
    <div id="content">
        <%& content %> <!-- This renders the view specified in the res.render() method here -->
    </div>
```html

###Contributing

If you wish to extend that project, feel free to contact me there :

a.j.william26@gmail.com

Or just fork it and play around, it's really simple and thus pretty straightforward :).

###License

This project is free to use under the AGPL-3.0 license's conditions.

[1]:https://github.com/dresende/node-orm2