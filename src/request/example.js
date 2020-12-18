const request = require('./index');
// import request from "./index";

request.get('http://localhost:3001/api/wans').then((data) => {
    console.log(data, 'datasssss');
});

let params = {
    id: '101',
    IPStatus: 'CONNECTING',
    currentIP: '192.168.2.1',
    currentMask: '255.255.255.0',
    currentGateway: '192.168.2.1',
    currentDNS: '192.168.2.1',
    enable: true,
    IPMode: 'DHCP',
    connectionTrigger: 'auto',
    keepAliveTime: '1608188204153',
    address: '192.168.2.1',
    mask: '255.255.255.0',
    gateway: '192.168.2.1',
    staticDns: true,
    DNS: '192.168.2.1',
    username: 'tianleilei',
    password: '11000000'
};
// request.post('http://localhost:3000/api/wans', params).then((data) => {
//     console.log(data, 'datasssss');
// })

request.on('HttpStatusSuccess', () => {
    // 这里进行自定义弹窗提示
    console.log("现在是请求成功了");
});
request.on('HttpStatusCodeError', () => {
    // 这里进行自定义弹窗错误提示
    console.log("现在是请求失败了");
});