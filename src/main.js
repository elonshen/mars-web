import {createApp} from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles' //'vuetify/styles' should not be used in sass files as it resolves to precompiled css
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
// Router
import {createRouter, createWebHistory} from 'vue-router'
import Login from "./Login.vue";
import Backend from "./Backend.vue";
import Users from "./Users.vue";
import UserGroups from "./UserGroups.vue";
import Mobile from "./Mobile.vue";
import Cockpit from "./Cockpit.vue";

// Axios
import axios from 'axios'
import {snackbar} from "./store";

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        themes: {
            light: {
                dark: false,
                colors: {
                    primary: '#0071EB',
                    background: '#f5f5f7'
                }
            },
        },
    }
})

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/backend',
            component: Backend,
            redirect: '/users',
            children: [
                {path: '/users', component: Users},
                {path: '/user-groups', component: UserGroups}
            ]
        },
        {
            path: '/mobile',
            component: Mobile
        },
        {
            path: '/cockpit',
            component: Cockpit
        },
        {path: '/login', component: Login}
    ]
})
// Axios
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
})

axios.interceptors.response.use(res => {
    switch (res.status) {
        case 200:
            return res;
        default:
            return Promise.reject(res);
    }
}, err => {
    if (err.response) {
        switch (err.response.status) {
            case 401:
                snackbar.info('认证失败,请重新登录')
                localStorage.removeItem('token')
                router.push('/login').then(r => {})
                break
            case 403:
                snackbar.info('无权限')
                break
            case 500:
                snackbar.info(err.response.data.message)
                break
            default:
                snackbar.info(err.response.status + err.response.data.message)
        }
    }
    return Promise.reject(err);
})

createApp(App).use(router).use(vuetify).mount('#app')

