module.exports = {
    port: {{ port }},
    db_connection_string: "mongodb://172.17.0.2:27017/{{ appname }}",
    secret: '{{ secret }}'
};