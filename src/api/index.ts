import mockRequest from '../utils/mockRequest';
import request from '../utils/request';

export const fetchData = () => {
    return mockRequest({
        url: './table.json',
        method: 'get'
    });
};

export const getNav = () => {
    return request({
        url: '/sys/menu/getNav',
        method: 'get'
    });
};
