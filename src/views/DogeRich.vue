<template>
    <div style="margin: 10px">
        <el-table :data="list" border>
            <el-table-column label="address" prop="content.address"></el-table-column>
            <el-table-column label="balance" prop="content.balance"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "DogeRich",
        data() {
            return {
                page:1,
                list:[]
            }
        },
        created() {
            this.getData()
        },
        methods: {
            getData() {
                this.loading = true
                fetch(`http://192.168.0.111:9601/chen/dataList?mode=doge-rich-account&page=${this.page}`).then((response) => response.json())
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