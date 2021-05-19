<template>
    <div>
        <el-card header="主网">
            <el-button size="mini" @click="show.create=true">创建</el-button>
            <el-card v-for="(network,index) in networks" :key="index">
                <el-button v-for="(value,name,key) in network" size="mini" :key="key">{{name}} - {{value}}</el-button>
                <el-button size="mini" @click="showEdit(network,index)">编辑</el-button>
                <el-button size="mini" type="danger" @click="onDelete(index)">删除</el-button>
            </el-card>
        </el-card>

        <el-dialog title="编辑" :visible.sync="show.edit">
            <el-form v-model="form.edit">
                <el-form-item label="name">
                    <el-input v-model="show.edit.name"></el-input>
                </el-form-item>
                <el-form-item label="url">
                    <el-input v-model="show.edit.url"></el-input>
                </el-form-item>
                <el-form-item label="chainId">
                    <el-input v-model="show.edit.chainId"></el-input>
                </el-form-item>
                <el-form-item label="symbol">
                    <el-input v-model="show.edit.symbol"></el-input>
                </el-form-item>
                <el-form-item label="scanUrl">
                    <el-input v-model="show.edit.scanUrl"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onUpdate">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="添加" :visible.sync="show.create">
            <el-form v-model="form.create">
                <el-form-item label="name">
                    <el-input v-model="show.create.name"></el-input>
                </el-form-item>
                <el-form-item label="url">
                    <el-input v-model="show.create.url"></el-input>
                </el-form-item>
                <el-form-item label="chainId">
                    <el-input v-model="show.create.chainId"></el-input>
                </el-form-item>
                <el-form-item label="symbol">
                    <el-input v-model="show.create.symbol"></el-input>
                </el-form-item>
                <el-form-item label="scanUrl">
                    <el-input v-model="show.create.scanUrl"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onCreate">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import helper from "../../helper";

    export default {
        data() {
            return {
                networks: helper.getData("networks") || [
                    {
                        name: "ETH Mainnet",
                        url: "https://mainnet.infura.io/v3/fddb1d98064647dd8bce19afb8b48059",
                        chainId: "1",
                        symbol: "ETH",
                        scanUrl: "https://etherscan.io"
                    },
                    {
                        name: "BSC Mainnet",
                        url: "https://bsc-dataseed.binance.org",
                        chainId: "56",
                        symbol: "BNB",
                        scanUrl: "https://bscscan.com"
                    },
                    {
                        name: "Heco Mainnet",
                        url: "https://http-mainnet-node.huobichain.com",
                        chainId: "128",
                        symbol: "HT",
                        scanUrl: "https://hecoinfo.com"
                    },
                    {
                        name: "QK Mainnet",
                        url: "http://sg.node.quarkblockchain.org",
                        chainId: "20181205",
                        symbol: "QKI",
                        scanUrl: "https://quarkscout.com"
                    },
                    {
                        name: "Local",
                        url: "http://127.0.0.1:7545",
                        chainId: "1337",
                        symbol: "ETH",
                        scanUrl: ""
                    },
                ],
                show: {create: false, edit: true},
                form: {edit: false, create: false},
                index: {edit: 0}
            }
        },
        methods: {
            showEdit(network, index) {
                this.form.edit = network
                this.index.edit = index
                this.show.edit = true
            },
            onUpdate() {
                this.network.splice(this.index.edit, 1, this.form.edit)
                helper.setData("networks", this.networks)
                this.form.edit = {}
                this.index.edit = 0
                this.show.edit = false
            },
            onCreate() {
                this.network.unshift(this.form.create)
                helper.setData("networks", this.networks)
                this.form.create = {}
                this.show.create = false
            },
            onDelete(index) {
                this.networks.splice(index, 1)
                helper.setData("networks", this.networks)
            }
        }
    }
</script>

<style scoped>

</style>