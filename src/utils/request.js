import axios from 'axios';
import { Message } from 'element-ui';

// 创建axios，赋给变量service

const BASEURL = process.env.NODE_ENV === "production" ? "" : "/devApi";

const service = axios.create({
    baseURL: BASEURL,
    timeout: 1000
});

// 添加请求拦截器
service.interceptors.request.use(function(config) {
    // 在发送请求之前做什么
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加相应拦截器
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