var restify = require('restify');
var fs = require('fs');
var yshdb = require('./util/yshdb');
var api = require('./api/ditui');
var server_port = 3000;
var ENV = process.env.node_env || "development"

global.yshdb = yshdb;
global.db = new yshdb.db("ysh_Wisdom", ENV);

global.util = require('./util/util').osUtil;
global.ERROR = JSON.parse(fs.readFileSync('config/err.json'))
global.dbs = {};
global.cmds = {};

//加载控制器
var service = require('./service');
var controaller = require('./controller');
var server = restify.createServer();
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser({
    mapParams: true
}));

server.use(restify.dateParser());
server.use(restify.jsonp());
server.use(restify.gzipResponse());
server.use(restify.CORS());

//路由控制
global.getfrom = function (api, params, func) {
    var client = restify.createJsonClient({
        url: api,
        version: '*'
    });
    client.post('', params, function (err, req, res, obj) {
        func(obj);
    });
}

global.getfrom("http://p.yshfresh.com/api/ysh/getapilist", {
    project: 'ysh'
}, function (rt) {
    if (rt) {
        for (var i in rt.aaData) {
            global.cmds[rt.aaData[i].cmd] = rt.aaData[i];
        }
        console.log("cmds loaded:" + rt.aaData.length);
    }
});

server.get('/api/tcauth/:name/:num/:userid', service.TcAuth.tcauth);
server.get('/api/getmanager/:userid', service.Manager.getManagerById);
server.post('/api/login', service.Manager.login);
server.get('/api/ysh/getSesskey', service.authority.getSesskey);
server.post('/api/ysh/getSesskey', service.authority.getSesskey);

function msg_useysh(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    var r = {
        state: -1,
        msg: '请使用接口 /api/ysh/'
    };
    res.write(JSON.stringify(r));
    res.end();
}
server.get('/api/GetData', service.data_api.GetData);
server.post('/api/GetData', service.data_api.GetData);
server.get('/api/ysh/:cmd', controaller.controaller.ysh);
server.post('/api/ysh/:cmd', controaller.controaller.ysh);
server.listen(server_port, function () {
    console.log('server start in ', server.name, server.url);
});



