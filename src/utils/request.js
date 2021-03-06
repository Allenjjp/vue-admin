import axios from 'axios';
import { Message } from 'element-ui';

// 创建axios，赋给变量service

const BASEURL = process.env.NODE_ENV === "production" ? "" : "/devApi";

const service = axios.create({
    baseURL: BASEURL,
    timeout: 15000 // 超时时间
});

/**
 * 请求接口前，做一些数据处理（请求拦截器）
 */
service.interceptors.request.use(function(config) {
    // 在发送请求之前做什么
    // 后台需要前端这边传相关的参数（在请求头添加参数）
    console.log(config.headers);
    // 最终的目的是请求头添加参数
    config.headers['Token'] = '111111'
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

/**
 * 请求接口，返回数据进行拦截（响应拦截器）
 */
service.interceptors.response.use(
    function(response) {
        // 对响应数据做点什么
        // console.log(response);
        let data = response.data;
        if(data.resCode !== 0) {
            Message.error(data.message);
            return Promise.reject(data);
        } else {
            return response;
            // return Promise.resolve(data);
        }
    },
    function(error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

export default service;

/**
 * 使用export default时，不能同时存在多个 export default
 * 文件 import 时，不需要花括号
 */