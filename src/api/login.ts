import request from '../utils/request';
import {encrypt} from '../utils/encrypt';

export function getCaptcha() {
    const time = new Date().getTime();
    return request({
        url: '/login/getCaptcha?requestId='+time,
        method: 'get',
        responseType: 'json'
    });
};

export function doLogin(param: any) {
    let loginParam = {
        ...param
    }
    //密码加密
    loginParam.password = encrypt(loginParam.password).toString();
    console.log(loginParam.password);
    return request({
        url: '/login/doLogin',
        method: 'post',
        responseType: 'json',
        data: loginParam
    });
};
