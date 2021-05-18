<template>
    <div>
        <el-card v-for="(wallet,index) in wallets" :key="index">
            <div>
                <el-button>{{wallet.name}}</el-button>
            </div>
            <div>
                <el-button>{{wallet.network.name}}</el-button>
            </div>
            <div>
                <el-button>{{wallet.address}}</el-button>
            </div>
            <div>
                <el-button @click="onRecovery(index)">恢复</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
    import helper from "../helper";

    export default {
        data() {
            return {
                wallets: helper.getData("trashWallets") || []
            }
        },
        methods: {
            onRecovery(index) {
                const wallets = helper.getData("wallets")
                wallets.unshift(this.wallets[index])
                helper.setData("wallets", wallets)
                this.wallets.splice(index, 1)
                helper.setData("trashWallets", this.wallets)
            }
        }
    }
</script>

<style scoped>

</style>