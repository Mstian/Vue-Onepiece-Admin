import * as axios from "axios";
import * as EventEmitter from 'events';
class Request extends EventEmitter{
    constructor(){
        super();
        this.interceptors();
    }
    interceptors(){
        axios.interceptors.request.use(
            config => {
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );
        axios.interceptors.response.use(
            response => {
                const code = response.status;
                if ((code >= 200 && code < 300) || code === 304) {
                    this.emit("HttpStatusSuccess");
                    // response.data
                    return Promise.resolve(response.data);
                } else {
                    // 响应错误逻辑处理 5xx 4xx 等等
                    this.emit("HttpStatusFaild");
                    return Promise.reject(response);
                }
            },
            error => {
                // 响应错误逻辑处理
                // const code = response.status;
                console.log(error);
                this.emit("HttpStatusFaild");
                return Promise.reject(error);
            }
        );
    }
    get(url, params){
        return axios({
            method: 'get',
            url,
            params
        });
    }
    post(url, data){
        return axios({
            method: 'post',
            url,
            data
        });
    }
    delete(url, data){
        return axios({
            method: 'delete',
            url,
            data
        });
    }
    put(url, data){
        return axios({
            method: 'put',
            url,
            data
        });
    }
    patch(url, data){
        return axios({
            method: 'patch',
            url,
            data
        });
    }
}

let request = new Request();

export default request;

