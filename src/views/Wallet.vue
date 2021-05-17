<template>
    <div>
        <div style="margin: 2px">
            <el-button size="mini" @click="create">添加</el-button>
            <el-button size="mini" @click="show.import=true">导入</el-button>
        </div>

        <el-card v-for="(wallet,index) in wallets" :key="index">
            <div>
                <el-button size="mini">{{wallet.address}}</el-button>
            </div>
            <div>
                <el-button size="mini">{{wallet.privateKey}}</el-button>
            </div>
            <div v-if="wallet.mnemonic">
                <el-button size="mini">{{wallet.mnemonic}}</el-button>
            </div>
            <div>
                <el-button size="mini" @click="detail(wallet)">进入</el-button>
                <el-button size="mini" type="danger">删除</el-button>
            </div>
        </el-card>

        <el-dialog title="导入" :visible.sync="show.import">
            <el-form :model="form.import" autocomplete="off">
                <el-form-item label="密钥">
                    <el-input v-model="form.import.privateKey"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="danger" @click="onImport">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import helper from "../helper";
    import {ethers} from 'ethers'

    export default {
        name: "Wallet",
        data() {
            return {
                wallets: helper.getData("wallets") || [],
                show: {create: false, import: false},
                form: {import: {}}
            }
        },
        methods: {
            onImport() {
                const wallet = new ethers.Wallet(this.form.import.privateKey)
                this.wallets.unshift({
                    address: wallet.address,
                    privateKey: wallet.privateKey,
                })
                helper.setData("wallets", this.wallets)
                this.show.import = false
            },
            detail(wallet) {
                this.$router.push({name: "walletDetail", params: {wallet}})
            },
            create() {
                const wallet = ethers.Wallet.createRandom()
                this.wallets.unshift({
                    address: wallet.address,
                    privateKey: wallet.privateKey,
                    mnemonic: wallet.mnemonic
                })
                helper.setData("wallets", this.wallets)
            },
            remove(index) {
                this.$confirm("确认删除吗?").then(_=>{
                    this.wallets.splice(index, 1)
                    this.setData("wallets", this.wallets)
                }).catch()
            }
        }
    }
</script>

<style scoped>
    .el-button {
        margin: 2px 0
    }
    .el-card{
        margin: 5px 0;
    }
</style>