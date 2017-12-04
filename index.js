
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Knex = require('knex');
var jsonParser = bodyParser.json()
app.get('/', function (req, res) {
    res.send('Welcome to db bridge');
 })
app.get('/test', function (req, res) {
   res.send('test complete!');
})
app.post('/bridge',jsonParser, function (request, response) {
    function initDb(con) {
        console.log('initDb',con)
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
        console.log('db res:', r)
        knex.destroy();
        response.json({
            result: r
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
        switch (func.name) {
            case 'getTables':
                console.log('getTables')
                return knex.raw('show tables;')
                break;

            default:
                break;
        }
    }

    function getAction() {
        console.log('getAction', request.body.action)
        switch (request.body.action) {
            case 'filter':

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
        console.log('db func http:', request.body);
        console.log('.........................');
        var knex = initDb(request.body.con);
        getAction().then(resFunc).catch(errFunc);
    } catch (e) {
        console.log('err',e)
        response.json({
            err: e
        });
    }
 })
var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})
