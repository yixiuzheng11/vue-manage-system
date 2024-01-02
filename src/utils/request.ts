import axios, {AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig} from 'axios';

const service:AxiosInstance = axios.create({
    //api的base_url
    baseURL: process.env.BASE_API,
    // 请求超时时间
    timeout: 5000
});

service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // 特殊配置：设置下载获取 excel 接口的返回值为 blob。这在异步下载文件时有时会显得很有用。
        if (config.url === '/api/excel/download') {
            config.responseType = 'blob'
        }
        // 如果有一个接口需要认证才可以访问，就在这统一设置
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['token'] = token || '';
        }
        return config;
    },
    (error: AxiosError) => {
        //console.log(error);
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status === 200 ) {
            return response.data;
        }
        return Promise.reject(response);
    },
    (error: AxiosError) => {
        //console.log(error);
        return Promise.reject(error);
    }
);

export default service;
