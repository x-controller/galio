<template>
    <div>
        <el-card v-for="(item,index) in group" :key="index" :header="item.title">
            <el-table :data="item.bookmarkIndex" border size="mini">
                <el-table-column prop="title" label="title"></el-table-column>
                <el-table-column prop="description" label="description"></el-table-column>
                <el-table-column v-slot="{row}" label="url">
                    <a :href="row.url" target="_blank">{{row.url}}</a>
                </el-table-column>
            </el-table>
        </el-card>


        <el-button size="mini" @click="show.create = true">添加书签</el-button>

        <el-dialog title="添加书签" :visible.sync="show.create">
            <el-form :model="form" autocomplete="off">
                <el-form-item label="url">
                    <el-input v-model="form.url"></el-input>
                </el-form-item>
                <el-form-item label="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="description">
                    <el-input v-model="form.description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="onSave">确 定</el-button>
            </div>
        </el-dialog>

        <el-table :data="bookmark.data" border size="mini">
            <el-table-column prop="title" label="title"></el-table-column>
            <el-table-column prop="description" label="description"></el-table-column>
            <el-table-column v-slot="{row}" label="url">
                <a :href="row.url" target="_blank">{{row.url}}</a>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import helper from "../helper";

    export default {
        data() {
            return {
                bookmark: {},
                params: {page: 1},
                show: {create: false},
                form: {},
                group:{}
            }
        },
        created() {
            this.getData()
        },
        methods: {
            getData() {
                helper.request('bookmarkIndex', this.params).then(res => {
                    this.bookmark = res.data
                })
            },
            onSave() {
                helper.request('bookmarkSave', this.form).then(res => {
                    if (res.code === 0) {
                        this.bookmark.data.unshift(res.data)
                        this.form = {}
                        this.show.create = false
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>