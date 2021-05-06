<template>
    <div style="margin: 10px;height: 500px;overflow: auto">
        <el-table :data="symbol" border>
            <el-table-column label="symbol" prop="symbol"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                symbol: []
            }
        },
        created() {
            this.getData()
        },
        methods: {
            getData() {
                fetch("https://api.huobi.pro/v1/common/symbols").then(response => response.json())
                    .then(myJson => {
                        console.log(myJson.data)
                        this.symbol = myJson.data
                    })
            }
        }
    }
</script>

<style scoped>

</style>