<script setup>

import {ref, onMounted, watch, computed} from 'vue';
import axios from "axios";
import {snackbar} from './store'

// 查询
const itemsPerPage = ref(10);
const headers = [
    {title: '名称', key: 'name', sortable: false},
    {title: '用户名', key: 'username', sortable: false},
    {title: '角色', key: 'roles', sortable: false},
    {title: '创建时间', key: 'createdTime', sortable: false},
    {title: '操作', key: 'actions', sortable: false}
];
const items = ref([]);
const loading = ref(true);
const totalItems = ref(0);

const search = ref('');
const name = ref(null);
watch(name, () => {
    search.value = String(Date.now())
})

function loadItems({page, itemsPerPage}) {
    loading.value = true;
    axios.get('/users', {
        params: {
            page: page - 1,
            size: itemsPerPage,
            name: name.value === null ? null : name.value
        }
    }).then(({data}) => {
        items.value = data.content;
        totalItems.value = data.totalElements;
        loading.value = false;
    })
}

onMounted(() => {
    loadItems({page: 1, itemsPerPage: itemsPerPage.value});
});

// 增改
const isShowDialog = ref(false)
const dialogEnum = {
    update: '编辑',
    create: '新增'
}
const dialogType = ref(null)
const isShowDeleteDialog = ref(false)
const editedItem = ref({
    id: undefined,
    name: null,
    roles: [],
    password: undefined,
    username: null
});

function resetEditedItem() {
    editedItem.value = {
        id: undefined,
        name: null,
        roles: [],
        password: undefined,
        username: null
    }
}

function clickNew() {
    dialogType.value = dialogEnum.create
    isShowDialog.value = true
}

function close() {
    isShowDialog.value = false
    resetEditedItem()
    dialogType.value = null
}

function clickEdit(item) {
    editedItem.value = Object.assign({}, item)
    isShowDialog.value = true
    dialogType.value = dialogEnum.update
}

function save() {
    if (dialogType.value === dialogEnum.update) {
        axios({
            method: 'PUT',
            url: '/users/' + editedItem.value.id,
            data: editedItem.value
        }).then(() => {
            snackbar.info('编辑成功')
            axios({
                method: 'PUT',
                url: 'users/' + editedItem.value.id + '/password',
                data: { password: editedItem.value.password }
            }).then(() => {
                snackbar.info('密码修改成功')
                close()
                loadItems({page: 1, itemsPerPage: itemsPerPage.value})
            })
        })
    } else if (dialogType.value === dialogEnum.create) {
        axios({
            method: 'POST',
            url: '/users',
            data: editedItem.value
        }).then(() => {
            snackbar.info('创建成功')
            close()
            loadItems({page: 1, itemsPerPage: itemsPerPage.value})
        })
    }
}

// 删
const beDeleteItem = ref({})

function clickDelete(item) {
    console.log(item)
    isShowDeleteDialog.value = true
    beDeleteItem.value = item
}

function clickDeleteConfirm() {
    axios.delete('/users/' + beDeleteItem.value.id).then(() => {
        snackbar.info("删除成功")
        loadItems({page: 1, itemsPerPage: itemsPerPage.value})
        clickCloseDelete()
    })
}

function clickCloseDelete() {
    isShowDeleteDialog.value = false
    beDeleteItem.value = null
}

</script>

<template>
    <v-toolbar density="compact">
        <v-toolbar-title>用户管理</v-toolbar-title>
        <v-text-field v-model="name" :clearable="true" hide-details placeholder="查询名称"></v-text-field>
        <v-dialog v-model="isShowDialog" max-width="500px">
            <template v-slot:activator="{ props }">
                <v-btn icon="mdi-plus" v-on:click="clickNew" v-bind="props"></v-btn>
            </template>
            <v-card>
                <v-card-title>{{ dialogType }}</v-card-title>
                <v-card-text>
                    <v-text-field v-model="editedItem.name" label="名称" required></v-text-field>
                    <v-text-field v-model="editedItem.username" label="用户名" required></v-text-field>
                    <v-text-field v-model="editedItem.password" label="密码"
                                  required></v-text-field>
                    <v-select v-model="editedItem.roles" multiple
                              :items="[{value:'ADMIN',title:'管理员'},{value:'SUPER_ADMIN',title:'超级管理员'}]"
                              label="角色"></v-select>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" variant="text" @click="close">关闭</v-btn>
                    <v-btn color="primary" variant="text" @click="save">确定</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="isShowDeleteDialog" max-width="500px">
            <v-card>
                <v-card-title class="text-h5">确定删除?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="clickCloseDelete">取消</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="clickDeleteConfirm">确定</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-toolbar>
  <!--  分页文本待更换   items-per-page-text="每页数量"-->
    <v-data-table-server :search="search" :items-per-page="itemsPerPage" :headers="headers" :items-length="totalItems"
                         :items="items"
                         :loading="loading"
                         class="elevation-1"
                         @update:options="loadItems">
        <template v-slot:item.actions="{ item }">
            <v-btn icon="mdi-pencil" variant="text" @click="clickEdit(item.raw)"></v-btn>
            <v-btn icon="mdi-delete" variant="text" @click="clickDelete(item.raw)"></v-btn>
        </template>
    </v-data-table-server>
</template>

<style scoped lang="less">

</style>
