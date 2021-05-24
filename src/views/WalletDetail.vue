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

        <el-card :header="wallet.name">
            <el-button size="mini">{{wallet.name}}</el-button>
            <el-button size="mini">{{wallet.address}}</el-button>
            <el-button size="mini">{{wallet.privateKey}}</el-button>
            <el-button size="mini" v-if="wallet.mnemonic">{{wallet.mnemonic}}</el-button>
            <el-button size="mini" @click="show.insertContract=true">添加Token</el-button>

            <el-card header="代币">
                <el-card v-for="(token,index) in wallet.tokens" :key="index">
                    <el-button size="mini">
                        {{token.symbol}}({{token.balance||0}})
                    </el-button>
                    <el-button size="mini" @click="approveShow(token)">授权</el-button>
                    <el-button size="mini" @click="onDelToken(index)">删除</el-button>
                </el-card>
            </el-card>
        </el-card>

        <el-dialog title="关联Token" :visible.sync="show.insertContract">
            <el-button v-for="(contract,index) in contracts" :key="index" @click="onInsertContract(contract)">
                {{contract.name}} ({{contract.address}})
            </el-button>
        </el-dialog>

        <el-dialog title="新增Token" :visible.sync="show.createContact">
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

        <el-dialog title="授权" :visible.sync="show.approve">
            <el-button size="mini">{{token.symbol}} 余额 {{token.balance}}</el-button>
            <el-form>
                <el-form-item label="授权地址">
                    <el-input v-model="form.approve.address"></el-input>
                </el-form-item>
                <el-form-item label="授权数量">
                    <el-input v-model="form.approve.amount"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" @click="approveToken">确定</el-button>
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
                index: 0,
                token: {},
                contracts: [],
                show: {createContact: false, insertContract: false, approve: false},
                form: {createContact: {}, approve: {}},
                provider: {},
                wallet: this.$route.params.wallet,
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
                ]
            }
        },
        created() {
            const wallets = helper.getData("wallets") || []
            wallets.forEach((item, index) => {
                if (item.address === this.wallet.address) {
                    this.index = index
                }
            })
            this.provider = new ethers.providers.JsonRpcProvider(this.wallet.network.url)
            this.setContracts()
        },
        methods: {
            onDelToken(index) {
                const tokens = this.wallet.tokens || []
                tokens.splice(index, 1)
                this.wallet.tokens = tokens
                helper.actionNode("dataUpdate", {
                    name: "wallets", item: this.wallet, primary: "address"
                })
            },
            approveToken() {
                const abi = [
                    "function balanceOf(address owner) view returns (uint256)",
                    "function decimals() view returns (uint8)",
                    "function symbol() view returns (string)",
                    "function name() view returns (string)",
                    "function transfer(address to, uint amount) returns (boolean)",
                    "event Transfer(address indexed from, address indexed to, uint amount)"
                ]
                const token = new ethers.Contract(this.token.address, abi, this.provider);
                token.approve(this.form.approve.address, this.form.approve.amount)
                this.show.approve = false
                this.form.approve = {}
                this.token = {}
            },
            approveShow(token) {
                this.show.approve = true
                this.token = token
            },
            async onInsertContract(token) {
                const wallets = helper.getData("wallets") || []
                const wallet = this.wallet
                const tokens = this.wallet.tokens || []
                const abi = [
                    "function balanceOf(address owner) view returns (uint256)",
                    "function decimals() view returns (uint8)",
                    "function symbol() view returns (string)",
                    "function name() view returns (string)",
                    "function transfer(address to, uint amount) returns (boolean)",
                    "event Transfer(address indexed from, address indexed to, uint amount)"
                ]
                const contract = new ethers.Contract(token.address, abi, this.provider)
                const balance = await contract.balanceOf(this.wallet.address)
                token.balance = balance.toString()
                tokens.unshift(token)
                wallet.tokens = tokens
                this.wallet = wallet
                wallets.splice(this.index, 1, this.wallet)
                await helper.setData("wallets", wallets)
                this.show.insertContract = false
            },
            setContracts() {
                const contracts = helper.getData("contracts") || []
                const newContracts = []
                const abi = [
                    "function balanceOf(address owner) view returns (uint256)",
                    "function decimals() view returns (uint8)",
                    "function symbol() view returns (string)",
                    "function name() view returns (string)",
                    "function transfer(address to, uint amount) returns (boolean)",
                    "event Transfer(address indexed from, address indexed to, uint amount)"
                ]
                contracts.forEach(contract => {
                    if (contract.network.name === this.wallet.network.name) {
                        const token = new ethers.Contract(contract.address, abi, this.provider);
                        contract.balance = token.balanceOf(this.wallet.address)
                        newContracts.unshift(contract)
                    }
                })
                this.contracts = newContracts
                // this.contracts = contracts.filter(item => {
                //     return item.network.name === this.wallet.network.name
                // })
            },
            plainNetwork(network) {
                return this.wallet.network.name !== network.name
            },
            setNetwork(network) {
                this.provider = new ethers.providers.JsonRpcProvider(network.url)
                this.wallet.network = network
                this.setContracts()
                const wallets = helper.getData("wallets") || []
                let index = 0
                wallets.forEach((item, _index) => {
                    if (item.address === this.wallet.address) index = _index
                })
                wallets.splice(index, 1, this.wallet)
                helper.setData("wallets", wallets)
            },
        }
    }
</script>

<style scoped>
    .el-card {
        margin: 5px;
    }

    .el-card >>> .el-card__header {
        padding: 10px;
    }

    .el-card >>> .el-card__body {
        padding: 5px;
    }
</style>