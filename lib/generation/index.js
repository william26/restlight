
module.exports = {
    init_project: function () {
        require('./project')();
    },
    create_endpoint: function () {
        require('./endpoint')();
    },
    create_model: function () {
        require('./model')();
    }
};