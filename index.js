var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Knex = require('knex');
var cors = require('cors')
var queries = require('./sql_queries')
var jsonParser = bodyParser.json();

app.use(cors());

app.get('/', function (req, res) {
    res.send('Welcome to db bridge');
})


app.get('/test', function (req, res) {
    res.send('test complete!');
})

app.post('/bridge', jsonParser, function (request, response) {
    function initDb(con) {
        console.log('initDb', con)
        return new Knex({
            client: 'mysql',
            connection: {
                host: con.host,
                user: con.user,
                password: con.password,
                database: con.database,
            }
        });
    }
    const resFunc = (r) => {
        console.log('db res:', r[0])
        knex.destroy();
        const data = r[0].map((obj, i) => {

            const props = Object.getOwnPropertyNames(obj);
            return props[0].indexOf(request.body.con.database) > -1 ? obj[props[0]] : obj;
        })
        response.json({
            result: data
        });
    }
    const errFunc = (r) => {
        console.log('db err:', r)
        knex.destroy();
        response.json({
            err: r
        });
    }

    function exFunc(func) {
        console.log('exFunc', func)
        try {
            return knex.raw(queries[func.name], [...func.params])
        } catch (e) {
            console.log(e)
            return null;
        }

    }

    function getAction() {
        console.log('getAction', request.body.action)
        switch (request.body.action) {
            case 'filter':
                var q = `select * from ${request.body.filter.table} where ${request.body.filter.field} ${request.body.filter.operator} ${request.body.filter.value};`
                return knex.raw(q, [])
                break;
            case 'query':
                return knex.raw(request.body.query)
                break;
            case 'func':
                return exFunc(request.body.func);
                break;
            default:
                console.log('action default!');
                return knex.raw(request.body.query)
                break;
        }
    }
    try {
        console.log('http request:', request.body);
        console.log('.........................');
        var knex = initDb(request.body.con);
        getAction().then(resFunc).catch(errFunc);
    } catch (e) {
        console.log('err', e)
        response.json({
            err: e
        });
    }
})

app.get('/api', function (req, res) {
    res.json({
        "con": {
            "host": "host url",
            "user": "username",
            "password": "password",
            "database": "db_name"
        },
        "action": "func",
        "func": {
            "name": "getDbSchema",
            "params": ["db_name:optional"]
        },
        "query": "show tables",
        "filter": {
            "table": "Bins",
            "field": "Id",
            "value": "14",
            "operator": "="
        },
        routes: ["/", "/test", "/bridge", "/api", "/functions"]
    });
})
app.get('/functions', function (req, res) {
    res.json(queries);
})
var server = app.listen(process.env.PORT || 8080, function () {
    var host = server.address().address || 'localhost';
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})