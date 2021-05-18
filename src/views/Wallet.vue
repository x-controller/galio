<template>
    <div>
        <div style="margin: 2px">
            <el-button size="mini" @click="create">添加</el-button>
            <el-button size="mini" @click="show.import=true">导入</el-button>
        </div>

        <el-card v-for="(wallet,index) in wallets" :key="index">
            <div>
                <el-button size="mini">{{wallet.name}}</el-button>
            </div>
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
                <el-button size="mini" @click="detail(wallet,index)">进入</el-button>
                <el-button size="mini" type="danger" @click="onRemove(index)">删除</el-button>
            </div>
        </el-card>

        <el-dialog title="创建" :visible.sync="show.create">
            <el-form v-model="form.create">
                <el-form-item label="主链">
                    <el-radio-group v-model="form.create.network">
                        <el-radio-button
                                v-for="(item,index) in networks" :key="index"
                                :label="item">{{item.name}}
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="form.create.name"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="form.create.password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="danger" @click="onCreate">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="从私钥导入" :visible.sync="show.importByPrivateKey">
            <el-form :model="form.import" autocomplete="off">
                <el-form-item label="密钥">
                    <el-input v-model="form.import.privateKey"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="danger" @click="onImportByPrivateKey">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="删除" :visible.sync="show.remove">
            <span>
                放回回收站可以恢复
            </span>
            <span slot="footer">
                <el-button size="mini" type="warming" @click="onTrash">放入回收站</el-button>
                <el-button size="mini" type="primary" @click="onDelete">立即删除</el-button>
              </span>
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
                deleteIndex: 0,
                wallets: helper.getData("wallets") || [],
                show: {create: false, importByPrivateKey: false, importByJson: false, importByMnemonic: false},
                form: {import: {}, importByJson: {}, create: {}},
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
        methods: {
            onTrash() {
                const trashWallets = helper.getData("trashWallets") || []
                trashWallets.unshift(this.wallets[this.deleteIndex])
                this.wallets.splice(this.deleteIndex, 1)
                helper.setData("wallets", this.wallets)
                this.show.remove = false
            },
            onDelete() {
                this.wallets.splice(this.deleteIndex, 1)
                helper.setData("wallets", this.wallets)
                this.show.remove = false
            },
            onRemove(index) {
                this.show.remove = true
                this.deleteIndex = index
            },
            async onCreate() {
                const wallet = new ethers.Wallet.createRandom()
                const newWallet = {
                    network: this.form.create.network,
                    address: wallet.address,
                    privateKey: wallet.privateKey,
                    mnemonic: wallet.mnemonic,
                    name: this.form.create.name,
                    passwordHash: ethers.utils.keccak256("0x" + this.form.create.password)
                }
                if (this.form.create.password) {
                    newWallet.keystore = await wallet.encrypt(this.form.create.password)
                }
                this.wallets.unshift(newWallet)
            },
            onImportByJson() {
                const wallet = ethers.Wallet.fromEncryptedJson(
                    this.from.importByJson.json
                    , this.from.importByJson.password)
                const newWallet = {
                    network: this.form.create.network,
                    address: wallet.address,
                    privateKey: wallet.privateKey,
                    mnemonic: wallet.mnemonic,
                    name: this.form.importByJson.name,
                    passwordHash: ethers.utils.keccak256("0x" + this.form.importByJson.password),
                    keystore: JSON.parse(this.from.importByJson.json)
                }
                this.wallets.unshift(newWallet)
            },
            onImportByPrivateKey() {
                const wallet = new ethers.Wallet(this.form.import.privateKey)
                this.wallets.unshift({
                    address: wallet.address,
                    privateKey: wallet.privateKey,
                })
                helper.setData("wallets", this.wallets)
                this.show.import = false
            },
            detail(wallet, index) {
                this.$router.push({name: "walletDetail", params: {wallet, index}})
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
                this.$confirm("确认删除吗?").then(_ => {
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

    .el-card {
        margin: 5px 0;
    }
</style>