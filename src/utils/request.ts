import axios, {AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig} from 'axios';

const service:AxiosInstance = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: process.env.BASE_API,
    timeout: 5000,
    withCredentials: true
});

service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status === 200) {
            return response;
        } else {
            Promise.reject();
        }
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
