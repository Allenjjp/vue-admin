import service from '@/utils/request';

/**
 * 获取验证码
 */
export function GetSms(data) {
    return service.request({
        method: 'post',
        url: '/getSms/',
        data
        // data: data 左边的data是变量名（key)后台接收的，右边的data是接收的参数，如果两者都是同名的情况下，可以写成但一个即可。（ES6写法）
    })
}

/**
 * 注册
 */
export function Register(data) {
    return service.request({
        method: 'post',
        url: '/register/',
        data
    })
}

/**
 * 登录
 */
export function Login(data) {
    return service.request({
        method: 'post',
        url: '/login/',
        data
    })
}