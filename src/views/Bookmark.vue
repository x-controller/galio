<template>
    <div>
        <el-dialog title="添加书签" :visible.sync="show.create">
            <el-form :model="form" autocomplete="off">
                <el-form-item label="链接">
                    <el-input v-model="form.url"></el-input>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="onSave">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-input v-model="searchStr" placeholder="搜索" style="margin: 5px;width: 200px"></el-input>
        <el-button size="mini" @click="show.create = true">添加</el-button>

        <el-button size="mini">{{bookmarks.length}}</el-button>

        <el-card v-for="(item,index) in searchResult" :key="index">
            <el-button size="mini" v-if="item.title">{{item.title}}</el-button>
            <el-button size="mini" @click="openUrl(item.url)">{{item.url}}</el-button>
            <el-button size="mini" type="danger" @click="onRemove(item.url)">删除</el-button>
        </el-card>
    </div>
</template>

<script>
    import helper from "../helper";

    const {shell} = require('electron')

    export default {
        data() {
            return {
                bookmarks: helper.getData("bookmarks") || [],
                params: {page: 0, pageSize: 20},
                show: {create: false},
                form: {},
                group: {},
                pageData: [],
                searchStr: ""
            }
        },
        computed: {
            searchResult() {
                return this.bookmarks.filter(item => {
                    return (
                        item.title.includes(this.searchStr) || item.url.includes(this.searchStr)
                    )
                })
            }
        },
        created() {
        },
        methods: {
            onRemove(url) {
                this.bookmarks.forEach((item, index) => {
                    if (item.url === url) {
                        this.bookmarks.splice(index, 1)
                    }
                })
                helper.setData("bookmarks", this.bookmarks)
            },
            openUrl(url) {
                shell.openExternal(url)
            },
            onSave() {
                if (!this.form.url) {
                    this.$message.error("请输入链接")
                    return false
                }
                this.bookmarks.forEach((item) => {
                    if (item.url === this.form.url) {
                        this.$message.error("链接已经添加")
                        return false
                    }
                })
                this.form.addTime = new Date().getTime()
                this.bookmarks.push(this.form)
                helper.setData("bookmarks", this.bookmarks)
                this.show.create = false
                this.form = {}
            }
        }
    }
</script>

<style scoped>
    /*样式穿透*/
    .el-card >>> .el-card__body {
        padding: 5px;
    }

    .el-card, .el-card .el-button {
        margin: 2px;
    }
</style>