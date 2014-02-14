##RESTlight

This Nodejs micro framework allows you to create a simple REST backend to support a single page front-end application.

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

You can easily create controllers and models via the cli command.

####Create a controller

Run the following command to create a new empty controller :

```sh
$ restlight controller
```

You will be asked the name that you want to give this controller. The controller will then be created in the controllers/
folder.

An empty controller looks like this :

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

- GET /UserController --> controllers/UsersController.js:index
- GET /UserController/:id --> controllers/UsersController.js:show
- POST /UserController --> controllers/UsersController.js:create
- PUT /UserController/:id --> controllers/UsersController.js:update
- DELETE /UserController/:id --> controllers/UsersController.js:destroy

You can add additional methods which will be callable that way :

- ANY_VERB /UserController/action/method_name


####Create a model

Run the following command to create a new model :

```sh
$ restlight model
```

You will be asked the following questions :

- The name of the model
- Do you want to create an associated controller (and if so, do you want it scaffolded)
- Do you want to add fields (and if so, which ones, and of which types)

Models are created in the models folder.

For more information about the structure of the model, please refer to [node-orm2's documentation][1], which will tell you
more than I can here :).

You can access created models and their data in controllers through the **req** parameter, as explained in their doc.

###Contributing

If you wish to extend that project, feel free to contact me there :

a.j.william26@gmail.com

Or just fork it and play around, it's really simple and thus pretty straightforward :).

###License

This project is free to use under the AGPL-3.0 license's conditions.

[1]:https://github.com/dresende/node-orm2