/**
 * @description 配置网络请求
 * @author luokaibin chaizhiyang
 */
import axios from 'axios'
import {Message} from 'element-ui'
import router from './router'
import Vue from 'vue'

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.timeout = 300000; // 请求超时5fen
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
//请求时loading配置
var loading;

function startLoading() {
    loading = Vue.prototype.$loading({
        lock: true,
        target: document.querySelector('.loading-area') //设置加载动画区域
    });
}

function endLoading() {
    loading.close();
}
var needLoadingRequestCount = 0;

function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading();
    }
    needLoadingRequestCount++;
}

function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return;
    needLoadingRequestCount--;
    if (needLoadingRequestCount === 0) {
        endLoading();
    }
}

// 请求拦截
axios.interceptors.request.use(config => {
    showFullScreenLoading();
    if (Vue.$cookies.isKey('token')) {
        config.headers['Authorization'] = 'Bearer ' + Vue.$cookies.get('token');
    }
    return config;
}, err => {
    tryHideFullScreenLoading();
    Message.error({
        message: '请求超时!'
    });
    return Promise.resolve(err);
})

// 响应拦截
axios.interceptors.response.use(res => {
    tryHideFullScreenLoading();
    switch (res.status) {
        case 200:
            return res;
        default:
            return Promise.reject(res);
    }
}, err => {
    console.log(err)
    tryHideFullScreenLoading();
    if (!err.response) {
        return false;
    }
    switch (err.response.status) {
        case 500:
            Message.error({
                message: err.response.data.message
            });
            break;
        case 403:
            if (err.response.expires != null) {
                Message.info({
                    message: '登入过期，请重新登入'
                });
                router.push('/login');
                break;
            }
        case 401:
            Message.error({
                message: err.response.data.message
            });
            router.push('/login');
            break;
        default:
            Message.error({
                message: err.response.status + err.response.data.message
            });
    }
    return Promise.reject(err);
})
