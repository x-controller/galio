<template>
    <div>
        <el-button v-for="(item,index) in symbol" :key="index">
            {{item.symbol}}
        </el-button>
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
                        this.symbol = myJson.data
                    })
            }
        }
    }
</script>

<style scoped>

</style>