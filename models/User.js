module.exports = function (db, cb) {
    db.define('User', {
        email: String,
        password: String
    });
    return cb();
};
