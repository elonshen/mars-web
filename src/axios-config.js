/**
 * @description 配置网络请求
 * @author luokaibin chaizhiyang
 */
import axios from 'axios'
import {Message} from 'element-ui'
import router from 'vue-router'
import Vue from 'vue'

axios.defaults.baseURL = 'http://localhost:9100';
axios.defaults.timeout = 300000; // 请求超时5fen
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
//请求时loading配置
var loading;

function startLoading() {
    loading = Vue.prototype.$loading({
        lock: true,
        text: "Loading...",
        background: 'rgba(0, 0, 0, 0)',
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
    console.log(res)
    tryHideFullScreenLoading();
    switch (res.status) {
        case 200:
            return res;
        case 401:
            Message.error({
                message: res.data.message
            });
            router.push('/login');
            return Promise.reject(res);
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
            Message.error({
                message: '权限不足,请联系管理员!'
            });
            break;
        default:
            Message.error({
                message: err.response.status + err.response.data.message
            });
    }
    return Promise.reject(err);
})
