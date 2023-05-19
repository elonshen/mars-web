<script setup>
import {snackbar} from "./store";
import {ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import axios from "axios";

const drawer = ref(true)
const subAPPName = ref(null)
const isShowDrawer = ref(false)
const route = useRoute();
const user = ref({})
const isShowAppBar = ref(true)

watch(() => route.matched, async newMatched => {
        for (let matchedRoute of newMatched) {
            if (matchedRoute.path === '/backend') {
                isShowDrawer.value = true
                isShowAppBar.value = true
                subAPPName.value = '管理后台'
                return
            } else if (matchedRoute.path === '/mobile') {
                isShowDrawer.value = false
                isShowAppBar.value = true
                subAPPName.value = '移动端'
                return
            } else if (matchedRoute.path === '/cockpit'){
                isShowDrawer.value = false
                isShowAppBar.value = false
                subAPPName.value = '驾驶舱'
                return
            }
        }
    }
)

watch(() => route.path, () => {
    if (localStorage.getItem('token')){
        axios.get('/users/me').then((res) => {
            user.value = res.data
        })
    } else {
        user.value = {}
    }
})

const router = useRouter();
function logout() {
    localStorage.removeItem('token')
    router.push('/login')
}

</script>

<template>
    <v-layout>
        <v-app-bar v-if="isShowAppBar" density="comfortable" color="background" elevation="0" >
            <template v-slot:default>
                <h1 style="margin-left: 16px;font-size: x-large">火星</h1>
                <h2 style="margin-left: 16px;font-size: x-large;color: #0071EB">{{ subAPPName }}</h2>
                <v-btn icon="mdi-menu" v-if="isShowDrawer"
                       v-on:click="drawer = !drawer"></v-btn>
            </template>

            <template v-slot:append>
                <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-apps" v-bind="props"></v-btn>
                    </template>

                    <v-list>
                        <v-list-item to="/mobile" title="移动端"></v-list-item>
                        <v-list-item to="/backend" title="管理后台"></v-list-item>
                        <v-list-item to="/cockpit" title="驾驶舱"></v-list-item>
                    </v-list>
                </v-menu>
                <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props">
                            <span>{{ user.name }}</span>
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item v-on:click="logout()" title="登出"></v-list-item>
                    </v-list>
                </v-menu>
            </template>
        </v-app-bar>
        <router-view :drawer="drawer"></router-view>

        <v-snackbar v-model="snackbar.display">{{ snackbar.message }}
            <template v-slot:actions>
                <v-btn :color="snackbar.color" variant="text" @click="snackbar.display = false">Close</v-btn>
            </template>
        </v-snackbar>
    </v-layout>
</template>

<style>

</style>
