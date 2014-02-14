
module.exports = {
    init_project: function () {
        require('./project')();
    },
    create_controller: function () {
        require('./controller')();
    },
    create_model: function () {
        require('./model')();
    }
};