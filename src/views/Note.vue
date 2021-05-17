<template>
    <div>
        <div style="margin: 2px">
            <el-button size="mini" @click="show.create=true">添加</el-button>
        </div>


        <el-card v-for="(item,index) in notes" :key="index" style="width: 300px;margin: 3px 0">
            <div class="item">
                <div class="content">
                    {{item.content}}
                </div>
                <div>
                    <el-tag>{{ new Date(item.createTime).toLocaleString() }}</el-tag>
                </div>
                <div>
                    <el-button type="danger" size="mini" @click="onRemove(index)">删除</el-button>
                </div>
            </div>
        </el-card>

        <el-dialog title="添加" :visible.sync="show.create">
            <el-form :model="form" autocomplete="off">
                <el-form-item label="笔记">
                    <el-input type="textarea" :row="2" v-model="form.content"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="danger" @click="onSave">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import helper from "../helper";

    export default {
        data() {
            return {
                notes: helper.getData("notes") || [],
                show: {create: false},
                form: {}
            }
        },
        methods: {
            onRemove(index) {
                this.notes.splice(index, 1)
                helper.setData("notes", this.notes)
            },
            onSave() {
                this.form.createTime = new Date().getTime()
                this.notes.unshift(this.form)
                helper.setData("notes", this.notes)
                this.form = {}
                this.show.create = false
            }
        }
    }
</script>

<style scoped>
    .item div {
        margin: 2px 0;
    }

    .content {
        word-wrap: break-word;
        word-break: normal;
    }

</style>