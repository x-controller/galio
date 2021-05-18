<template>
    <div>
        <div style="margin: 2px">
            <el-card header="主网">
                <el-button
                        v-for="(item,index) in networks" :key="index"
                        :plain="plainNetwork(item)"
                        @click="setNetwork(item)" size="mini">
                    {{item.name}}
                </el-button>
            </el-card>
        </div>

        <el-dialog :visible.sync="show.createContact">
            <el-form v-model="form.createContact">
                <el-form-item label="主网">
                    <el-radio-group v-model="form.createContact.network">
                        <el-radio-button
                                v-for="(item,index) in networks" :key="index"
                                :label="item">{{item.name}}
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="form.createContact.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.createContact.address"></el-input>
                </el-form-item>
                <el-form-item label="abiCode">
                    <el-input type="textarea" :row="2" v-model="form.createContact.abi"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="danger">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>

    import {ethers} from 'ethers'
    import helper from "../helper";

    export default {
        name: "WalletDetail",
        data() {
            return {
                show: {createContact: false},
                form: {createContact: {}},
                provider: {},
                wallet: this.$route.params.wallet,
                index: this.$router.params.index,
                networks: [
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
                ]
            }
        },
        created() {
            this.provider = new ethers.providers.JsonRpcProvider(this.wallet.network.url)
        },
        methods: {
            plainNetwork(network) {
                return this.wallet.network.name !== network.name
            },
            setNetwork(network) {
                this.provider = new ethers.providers.JsonRpcProvider(network.url)
                this.wallet.network = network
                const wallets = helper.getData("wallets")
                wallets.splice(this.index, 1, this.wallet)
                helper.setData("wallets", wallets)
            },
        }
    }
</script>

<style scoped>

</style>