<script setup>
const props = defineProps(['drawer'])

</script>

<template>
    <v-navigation-drawer color="background" permanent v-model="props.drawer">
        <v-list active-color="primary" nav >
            <v-list-item prepend-icon="mdi-home" title="登录" to="/login"></v-list-item>
            <v-list-group value="管理员">
                <template v-slot:activator="{ props }">
                    <v-list-item prepend-icon="mdi-account-circle" v-bind="props" title="用户管理"></v-list-item>
                </template>
                <v-list-item title="用户管理" to="/users"></v-list-item>
                <v-list-item title="用户组管理" to="/user-groups"></v-list-item>
            </v-list-group>
        </v-list>
    </v-navigation-drawer>
    <v-main :scrollable="true">
        <router-view></router-view>
    </v-main>
</template>

<style scoped lang="scss">

</style>
