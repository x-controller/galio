<template>
    <div>
        <div style="margin: 2px">
            <el-button size="mini" @click="show.create=true">创建</el-button>
            <el-button size="mini" @click="show.importByPrivateKey=true">私钥导入</el-button>
            <el-button size="mini" @click="show.importByMnemonic=true">助记词导入</el-button>
            <el-button size="mini" @click="show.importByKeystore=true">keystore导入</el-button>
            <el-button size="mini" @click="show.createContact=true">添加Token</el-button>
            <el-button size="mini" @click="show.contracts=true">全部Token</el-button>

        </div>

        <el-card v-for="(wallet,index) in wallets" :key="index">
            <el-button size="mini">名称 {{wallet.name}}</el-button>
            <el-button size="mini" @click="clipboard(wallet.address)">地址 {{wallet.address}}</el-button>
            <el-button size="mini">密钥 {{wallet.privateKey}}</el-button>
            <el-button size="mini" v-if="wallet.mnemonic">助记词 {{wallet.mnemonic}}</el-button>
            <el-button size="mini" @click="detail(wallet)">进入</el-button>
            <el-button size="mini" type="danger" @click="onRemove(index)">删除</el-button>
        </el-card>

        <el-dialog title="创建" :visible.sync="show.create">
            <el-form v-model="form.create">
                <el-form-item label="主网">
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
                <el-form-item>
                    <el-button type="danger" @click="onCreate">确 定</el-button>

                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="从助记词导入" :visible.sync="show.importByMnemonic">
            <el-form :model="form.importByMnemonic">
                <el-form-item label="主网">
                    <el-radio-group v-model="form.importByMnemonic.network">
                        <el-radio-button v-for="(item,index) in networks" :key="index" :label="item">
                            {{item.name}}
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="form.importByMnemonic.name"></el-input>
                </el-form-item>
                <el-form-item label="助记词">
                    <el-input  type="password" v-model="form.importByMnemonic.mnemonic"></el-input>
                </el-form-item>
                <el-form-item label="[密码]">
                    <el-input type="password" v-model="form.importByMnemonic.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="danger" @click="onImportByMnemonic">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="从私钥导入" :visible.sync="show.importByPrivateKey">
            <el-form :model="form.importByPrivateKey">
                <el-form-item label="主网">
                    <el-radio-group v-model="form.importByPrivateKey.network">
                        <el-radio-button v-for="(item,index) in networks" :key="index" :label="item">
                            {{item.name}}
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="form.importByPrivateKey.name"></el-input>
                </el-form-item>
                <el-form-item label="密钥">
                    <el-input  type="password" v-model="form.importByPrivateKey.privateKey"></el-input>
                </el-form-item>
                <el-form-item label="[密码]">
                    <el-input type="password" v-model="form.importByPrivateKey.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="danger" @click="onImportByPrivateKey">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="从keystore导入" :visible.sync="show.importByKeystore">
            <el-form :model="form.importByKeystore">
                <el-form-item label="主网">
                    <el-radio-group v-model="form.importByKeystore.network">
                        <el-radio-button v-for="(item,index) in networks" :key="index" :label="item">
                            {{item.name}}
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="form.importByKeystore.name"></el-input>
                </el-form-item>
                <el-form-item label="keystore">
                    <el-input type="textarea" :row="2" v-model="form.importByKeystore.keystore"></el-input>
                </el-form-item>
                <el-form-item label="[密码]">
                    <el-input type="password" v-model="form.importByKeystore.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="danger" @click="onImportByKeystore">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="删除" :visible.sync="show.remove">
            <el-button size="mini">放入回收站可以恢复</el-button>
            <el-button size="mini" type="warming" @click="onTrash">放入回收站</el-button>
            <el-button size="mini" type="primary" @click="onDelete">立即删除</el-button>
        </el-dialog>

        <el-dialog title="添加Token" :visible.sync="show.createContact">
            <el-form v-model="form.contract">
                <el-form-item label="主网">
                    <el-radio-group v-model="form.contract.network">
                        <el-radio-button
                                v-for="(item,index) in networks" :key="index"
                                :label="item">{{item.name}}
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.contract.address"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="onSaveContract">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="代币" :visible.sync="show.contracts">
            <el-card v-for="(token,index) in contracts" :key="index">
                <el-button size="mini">主网 {{token.network.name}}</el-button>
                <el-button size="mini">名称 {{token.name}}</el-button>
                <el-button size="mini">简称 {{token.symbol}}</el-button>
                <el-button size="mini">精度 {{token.decimals}}</el-button>
                <el-button size="mini">地址 {{token.address}}</el-button>
            </el-card>
        </el-dialog>
    </div>
</template>

<script>
    import helper from "../helper";
    import {ethers} from 'ethers'

    export default {
        data() {
            return {
                index: {delete: 0},
                wallets: helper.getData("wallets") || [],
                show: {
                    create: false, importByPrivateKey: false, importByKeystore: false, importByMnemonic: false,
                    createContact: false, contracts: false, remove: false
                },
                form: {importByMnemonic: {}, importByPrivateKey: {}, importByKeystore: {}, create: {}, contract: {}},
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
                ],
                contracts: helper.getData("contracts") || []
            }
        },
        created() {
        },
        methods: {
            clipboard(value) {
                helper.clipboardWrite(value)
                this.$notify.success("复制完成")
            },
            // 检查名称是否存在(在导入和创建中都需要先检查)
            checkNameExist(name) {
                const wallets = helper.getData("wallets") || []
                wallets.forEach(item => {
                    if (item.name === name) return true
                })
                return false
            },
            // 加入到垃圾桶
            onTrash() {
                const trashWallets = helper.getData("trashWallets") || []
                trashWallets.unshift(this.wallets[this.index.delete])
                this.wallets.splice(this.index.delete, 1)
                helper.setData("wallets", this.wallets)
                this.show.remove = false
            },
            // 直接删除
            onDelete() {
                this.wallets.splice(this.index.delete, 1)
                helper.setData("wallets", this.wallets)
                this.show.remove = false
            },
            // 展示删除选项
            onRemove(index) {
                this.show.remove = true
                this.index.delete = index
            },
            // 创建保存钱包
            async onCreate() {
                if (this.checkNameExist(this.form.create.name)) {
                    this.$message.error("钱包名称 " + this.form.create.name + " 已经存在")
                    return false
                }
                const wallet = ethers.Wallet.createRandom()
                let newWallet = {
                    network: this.form.create.network,
                    address: wallet.address,
                    privateKey: wallet.privateKey,
                    mnemonic: wallet.mnemonic,
                    name: this.form.create.name,
                }
                if (this.form.create.password) {
                    newWallet.passwordHash = ethers.utils.keccak256("0x" + this.form.create.password)
                    newWallet.keystore = await wallet.encrypt(this.form.create.password)
                }
                this.wallets.unshift(newWallet)
                await helper.setData("wallets", this.wallets)
                this.form.create = false
                this.show.create = false
            },
            // 从keystone导入钱包
            onImportByKeystore() {
                const wallet = ethers.Wallet.fromEncryptedJson(
                    this.from.importByKeystore.keystore
                    , this.from.importByKeystore.password)
                let newWallet = {
                    network: this.form.create.network,
                    address: wallet.address,
                    privateKey: wallet.privateKey,
                    mnemonic: wallet.mnemonic,
                    name: this.form.importByKeystore.name,
                    passwordHash: ethers.utils.keccak256("0x" + this.form.importByKeystore.password),
                    keystore: JSON.parse(this.from.importByKeystore.keystore)
                }
                this.wallets.unshift(newWallet)
            },
            // 从助记词导入钱包
            async onImportByMnemonic() {
                const wallet = new ethers.Wallet.fromMnemonic(this.form.importByMnemonic.mnemonic)
                let newWallet = {
                    network: this.form.importByMnemonic.network,
                    name: this.form.importByMnemonic.name,
                    address: wallet.address,
                    privateKey: wallet.privateKey,
                    mnemonic: wallet.mnemonic,
                }

                if (this.form.importByMnemonic.password) {
                    newWallet.passwordHash = ethers.utils.keccak256("0x" + this.form.importByMnemonic.password)
                    newWallet.keystore = await wallet.encrypt(this.form.importByMnemonic.password)
                }

                this.wallets.unshift(newWallet)
                await helper.setData("wallets", this.wallets)
                this.show.importByMnemonic = false
            },
            // 从密钥导入钱包
            async onImportByPrivateKey() {
                const wallet = new ethers.Wallet(this.form.importByPrivateKey.privateKey)
                let newWallet = {
                    name: this.form.importByPrivateKey.name,
                    network: this.form.importByPrivateKey.network,
                    address: wallet.address,
                    privateKey: wallet.privateKey,
                }

                if (this.form.importByPrivateKey.password) {
                    newWallet.passwordHash = ethers.utils.keccak256("0x" + this.form.importByPrivateKey.password)
                    newWallet.keystore = await wallet.encrypt(this.form.importByPrivateKey.password)
                }

                this.wallets.unshift(newWallet)
                await helper.setData("wallets", this.wallets)
                this.show.importByPrivateKey = false
            },
            // 钱包详情
            detail(wallet) {
                this.$router.push({name: "walletDetail", params: {wallet}})
            },
            // 保存合约
            async onSaveContract() {
                const contract = this.form.contract
                const provider = new ethers.providers.JsonRpcProvider(contract.network.url)
                const abi = [
                    "function balanceOf(address owner) view returns (uint256)",
                    "function decimals() view returns (uint8)",
                    "function symbol() view returns (string)",
                    "function name() view returns (string)",
                    "function transfer(address to, uint amount) returns (boolean)",
                    "event Transfer(address indexed from, address indexed to, uint amount)"
                ]
                const token = new ethers.Contract(contract.address, abi, provider);
                contract.symbol = await token.symbol()
                contract.name = await token.name()
                contract.decimals = await token.decimals()
                this.contracts.unshift(contract)
                await helper.setData("contracts", this.contracts)
                this.show.createContact = false
                this.form.contract = {}
            },
        }
    }
</script>

<style scoped>
    .el-card >>> .el-card__body {
        padding: 5px;
    }

    .el-button {
        margin: 2px 0
    }

    .el-card {
        margin: 5px 0;
    }
</style>