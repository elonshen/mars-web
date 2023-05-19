<script setup>
import {ref} from 'vue'
import axios from 'axios';
import {useRouter} from "vue-router";

let username = ref(null)
let password = ref(null)
let show = ref(null)

const router = useRouter()

function login(username, password) {
    axios({
        method: 'post',
        url: '/authentication',
        auth: {
            username: username,
            password: password
        }
    }).then((res) => {
        localStorage.setItem("token", res.data)
        router.push("/users")
    })
}
</script>

<template>
    <v-main color="background" :scrollable="true">
        <div class="main">
            <v-card class="rounded-xl" elevation="12" style="padding: 20px" min-width="350" title="登录">
                <v-form @submit.prevent style="padding: 16px">
                    <v-text-field autocomplete="username" variant="underlined" v-model="username"
                                  label="用户名"></v-text-field>
                    <v-text-field autocomplete="current-password" v-on:click:append="show = !show"
                                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                  :type="show ? 'text' : 'password'" variant="underlined" v-model="password"
                                  label="密码"></v-text-field>
                    <v-btn type="submit" block class="mt-2" v-on:click="login(username,password)">确定</v-btn>
                </v-form>
            </v-card>
        </div>
    </v-main>
</template>

<style scoped lang="scss">
.main {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f7;
  padding: 10px;
}
</style>
