// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsonServer = require('json-server');
const server = jsonServer.create();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
const router = jsonServer.router(path.join(__dirname, './data.json'));
const middlewares = jsonServer.defaults();
server.use(middlewares);

server.use(jsonServer.rewriter({
    "/api/*": "/$1",
    "/wans/:id/ipaddrs/": "/wans/:id",
    "/wans/:id/ipaddrs/:ipaddrs": "/wans/:id/?ipaddrs=:ipaddrs" 
}));

router.render = (req, res) => {
    let errcode = "";
    let message = "";
    let status = 200;
    let result = res.locals.data;

    if(Object.getOwnPropertyNames(result).length < 1) {
        errcode = 3;
    }
    switch (errcode){
        case 0:
            message="Fail to alloc memory";
            status=400;
            result={};
            break;
        case 1:
            message="Out of memory";
            status=400;
            result={};
            break;
        case 2:
            message="invalid json request";
            status=400;
            result={};
            break;
        case 3:
            message="No Content-length";
            status=400;
            result={};
            break;
        case 4:
            message="unable to parse cookie";
            status=400;
            result={};
            break;
        case 5:
            message="Fail to init URL pattern";
            status=400;
            result={};
            break;
        case 6:
            message="Api is not suppord";
            status=404;
            result={};
            break;
        case 7:
            message="parameter format check failed";
            status=400;
            result={};
            break;
        case 8:
            message="Please login";
            status=401;
            result={};
            break;
        case 9:
            message="Anti Brute Attack: Please Wait 20s";
            status=403;
            result={};
            break;
        default:
            message="";
            status=200;
    }
    
    res.status(status);
    res.jsonp({
        err: errcode,
        msg: message,
        result: result
    });
  };

server.use(router);
server.listen(3000, () => { // http://localhost:3000/wans
    console.log('json server is running');
});