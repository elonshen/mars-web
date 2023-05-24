<script setup>
const props = defineProps(['drawer'])

</script>

<template>
    <v-navigation-drawer color="background" :permanent="true" v-model="props.drawer">
        <v-list color="primary" :nav="true" >
            <v-list-item prepend-icon="mdi-account-circle" title="用户管理" to="/users"></v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-main :scrollable="true">
        <router-view></router-view>
    </v-main>
</template>

<style scoped lang="scss">

</style>
