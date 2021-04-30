<template>
    <div style="margin: 10px">
        <el-pagination
                :page-size="20"
                @current-change="pageChange"
                background
                layout="prev, pager, next"
                :total="list.total">
        </el-pagination>

            <el-checkbox border v-model="loop" @change="changeSync">real time sync</el-checkbox>

        <el-table :data="list" border size="small" v-loading="loading">
            <el-table-column label="name" prop="content.name"></el-table-column>
            <el-table-column label="cycle" prop="content.cycle"></el-table-column>
            <el-table-column label="action" prop="content.action"></el-table-column>
            <el-table-column label="nextRun" v-slot="{row}">
                <el-tag>{{new Date(parseInt(row.content.nextRun) * 1000).toLocaleString()}}</el-tag>
            </el-table-column>
            <el-table-column label="status" v-slot="{row}">
                <el-tag>{{row.content.status}}</el-tag>
            </el-table-column>

        </el-table>


    </div>
</template>

<script>
    export default {
        name: "Task",
        data() {
            return {
                loading: false,
                list: [],
                page: 1,
                loop: false,
                loopIndex: ""
            }
        },
        created() {
                this.getData()
        },
        methods: {
            changeSync(res) {
                if (res) {
                    this.loopIndex = setInterval(() => {
                        this.getData()
                    }, 1000)
                } else {
                    clearInterval(this.loopIndex)
                }
            },
            searchGet() {
                this.page = 1
                this.getData()
            },
            pageChange(page) {
                this.page = page
                this.getData()
            },
            getData() {
                this.loading = true
                fetch(`http://192.168.0.111:9601/chen/dataList?mode=task&page=${this.page}`).then((response) => response.json())
                    .then((myJson) => {
                        this.loading = false
                        this.list = myJson.data
                    });
            }
        }
    }
</script>

<style scoped>

</style>