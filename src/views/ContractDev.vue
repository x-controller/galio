<template>
    <div>
        <div class="action-box">
            <el-button @click="accountCreate">创建账号 {{accounts.length}}</el-button>
            <el-button @click="show.transfer=true">转账</el-button>
            <el-button @click="show.callContract=true">调用合约</el-button>
            <el-button @click="show.importPrivateKey=true">导入密钥</el-button>
            <el-button @click="show.deployContract=true">合约部署</el-button>
            <el-button @click="show.insertContract=true">添加合约</el-button>
        </div>

        <el-card header="主网设置">
            <el-radio-group v-model="network" @change="setProvider">
                <el-radio-button v-for="(network,index) in networks" :key="index" :label="network">
                    {{network.name}}
                </el-radio-button>
            </el-radio-group>
        </el-card>

        <el-card header="账号">
            <el-card v-for="(account,index) in accounts" :key="index">
                <el-button size="mini" @click="onClipboard(account.address)">{{account.address}}</el-button>
                <el-button size="mini" @click="onClipboard(account.privateKey)">{{account.privateKey}}</el-button>
                <el-button size="mini" v-if="0 && account.mnemonic">{{account.mnemonic}}</el-button>
                <el-button size="mini">{{account.balance||0}}</el-button>
            </el-card>
        </el-card>

        <el-card v-if="0" header="交易记录" class="data-box">
            <el-card v-for="(log,index) in logs.transfer" :key="index">
                {{ log }}
            </el-card>
        </el-card>

        <el-card v-if="0" header="调用记录" class="data-box">
            <el-card v-for="(log,index) in logs.callContract" :key="index">
                {{ log }}
            </el-card>
        </el-card>

        <el-card v-if="0" header="合约" class="data-box">
            <el-card v-for="(contact,index) in networkContracts" :key="index">
                {{ contact }}
            </el-card>
        </el-card>

        <el-card v-if="0" header="部署的合约" class="data-box">
            <el-card v-for="(contact,index) in deployContracts" :key="index">
                {{ contact }}
            </el-card>
        </el-card>

        <el-dialog title="导入密钥" :visible.sync="show.importPrivateKey">
            <el-form v-model="form.importPrivateKey">
                <el-form-item label="密钥">
                    <el-input v-model="form.importPrivateKey.privateKey"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="danger" @click="onImportPrivateKey">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="调用合约" :visible.sync="show.callContract">
            <el-form v-model="form.callContract">
                <el-form-item label="账号">
                    <el-select v-model="form.callContract.account">
                        <el-option
                                v-for="(account,index) in accounts"
                                :key="index"
                                :label="account.address"
                                :value="account">
                            <span>{{account.address}}</span>
                            <span>({{account.balance}})</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="合约">
                    <el-select v-model="form.callContract.contract">
                        <el-option
                                v-for="(contract,index) in networkContracts"
                                :key="index"
                                :label="contract.address"
                                :value="contract">
                            <span>{{contract.address}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="function">
                    <el-input v-model="form.callContract.functionName"></el-input>
                </el-form-item>
                <el-form-item label="参数">
                    <el-input v-model="form.callContract.params"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="danger" @click="onCallContract">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="部署合约" :visible.sync="show.deployContract">
            <el-form v-model="form.deployContract">
                <el-form-item label="账号">
                    <el-select v-model="form.deployContract.account">
                        <el-option
                                v-for="(account,index) in accounts"
                                :key="index"
                                :label="account.address"
                                :value="account">
                            <span>{{account.address}}</span>
                            <span>({{account.balance}})</span>
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="abi">
                    <el-input type="textarea" :row="2" v-model="form.deployContract.abi"></el-input>
                </el-form-item>
                <el-form-item label="bytecode">
                    <el-input type="textarea" :row="2" v-model="form.deployContract.bytecode"></el-input>
                </el-form-item>
                <el-form-item label="构造参数">
                    <el-input placeholder="换行分隔" type="textarea" :row="2"
                              v-model="form.deployContract.params"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="danger" @click="onDeployContract">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="发起交易" :visible.sync="show.transfer">
            <el-form v-model="form.transfer">
                <el-form-item label="转出账号">
                    <el-select v-model="form.transfer.from">
                        <el-option
                                v-for="(account,index) in accounts"
                                :key="index"
                                :label="account.address"
                                :value="account">
                            <span>{{account.address}}</span>
                            <span>({{account.balance}})</span>
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="接收账号">
                    <el-select v-model="form.transfer.to">
                        <el-option
                                v-for="(account,index) in accounts"
                                :key="index"
                                :label="account.address"
                                :value="account">
                            <span>{{account.address}}</span>
                            <span>({{account.balance}})</span>
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="数额">
                    <el-input v-model="form.transfer.value"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button size="mini" type="danger" @click="onTransfer">转账</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="添加合约" :visible.sync="show.insertContract">
            <el-form v-model="form.insertContract">
                <el-form-item label="名称">
                    <el-input v-model="form.insertContract.name"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.insertContract.address"></el-input>
                </el-form-item>
                <el-form-item label="abiCode">
                    <el-input v-model="form.insertContract.abi"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="danger" @click="onInsertContract">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
    import {ethers} from 'ethers'
    import helper from "../helper";

    export default {
        data() {
            return {
                show: {
                    transfer: false,
                    insertContract: false,
                    deployContract: false,
                    callContract: false,
                    importPrivateKey: false
                },
                contracts: helper.getData("contractsDev") || [],
                accounts: helper.getData("accountsDev") || [],
                deployContracts: helper.getData("deployContractsDev") || [],
                logs: helper.getData("logsDev") || [],
                networks: helper.getData("networksDev") || [
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
                network: helper.getData("networkDev"),
                provider: {},
                form: {transfer: {}, insertContract: {}, deployContract: {}, callContract: {}, importPrivateKey: {}}
            }
        },
        computed: {
            networkContracts() {
                return this.contracts.filter(contract => {
                    return contract.network = this.network
                })
            }
        },
        created() {
            if (this.network) {
                this.setProvider(this.network)
            }
        },
        methods: {
            onClipboard(value){
                helper.clipboardWrite(value)
                this.$notify.success("已复制")
            },
            onImportPrivateKey() {
                const account = new ethers.Wallet(this.form.importPrivateKey.privateKey)
                this.accounts.unshift({
                    address: account.address,
                    privateKey: account.privateKey,
                    balance: 0
                })
                helper.setData("accountsDev", this.accounts)
                this.show.importPrivateKey = false
                this.form.importPrivateKey = {}
            },
            async onCallContract() {
                const wallet = new ethers.Wallet(this.form.callContract.account.privateKey, this.provider)
                let contract = new ethers.Contract(this.form.callContract.contract.address, this.form.callContract.contract.abi, this.provider)
                const signer = contract.connect(wallet)
                let value = null
                if (this.form.callContract.params) {
                    const params = this.form.callContract.params.split(/[\s\n]/)
                    value = await signer[this.form.callContract.functionName](...params)
                } else {
                    value = await signer[this.form.callContract.functionName]()
                }
                console.log(value)
                this.show.callContract = false
                this.form.callContract = {}
            },
            async onDeployContract() {
                const wallet = new ethers.Wallet(this.form.deployContract.account.privateKey, this.provider)
                const factory = new ethers.ContractFactory(this.form.deployContract.abi.trim(), this.form.deployContract.bytecode.trim(), wallet)
                let contract = {}
                if (this.form.deployContract.params) {
                    const params = this.form.deployContract.params.split(/[\s\n]/)
                    contract = await factory.deploy(...params)
                } else {
                    contract = await factory.deploy()
                }
                await contract.deployed()
                const deployContracts = helper.getData("deployContractsDev") || []
                deployContracts.unshift({
                    address: contract.address
                })
                await helper.setData("deployContractsDev", deployContracts)

                this.show.deployContract = false
                this.form.deployContract = {}
            },
            onInsertContract() {
                const contract = this.form.insertContract
                contract.network = this.network
                this.contracts.unshift(contract)
                helper.setData("contractsDev", this.contracts)
                this.show.insertContract = false
                this.form.insertContract = {}
            },
            async onTransfer() {
                const wallet = new ethers.Wallet(this.form.transfer.from.privateKey, this.provider)
                const value = ethers.utils.parseEther(this.form.transfer.value)
                wallet.sendTransaction({
                    to: this.form.transfer.to.address,
                    value
                }).then(async _ => {
                    await this.accountUpBalance(this.form.transfer.from)
                    await this.accountUpBalance(this.form.transfer.to)
                    this.$notify.success("交易完成")
                    this.show.transfer = false
                    this.form.transfer = {}
                })

            },
            async accountUpBalance(account) {
                const balance = await this.provider.getBalance(account.address)
                account.balance = ethers.utils.formatEther(balance)
                this.accounts.forEach((item, index) => {
                    if (item.address === account.address) {
                        this.accounts.splice(index, 1, account)
                    }
                })
            },
            accountCreate() {
                const account = ethers.Wallet.createRandom()
                this.accounts.unshift({
                    address: account.address,
                    privateKey: account.privateKey,
                    mnemonic: account.mnemonic,
                    balance: 0
                })
                helper.setData("accountsDev", this.accounts)
            },
            async setProvider(network) {
                this.provider = new ethers.providers.JsonRpcProvider(network.url)
                this.$notify.success("主网已切换 " + this.network.name)
                const accounts = this.accounts
                for (const account of accounts) {
                    const balance = await this.provider.getBalance(account.address)
                    account.balance = ethers.utils.formatEther(balance)
                }
                this.accounts = accounts
                await helper.setData("networkDev", network)
                await helper.setData("accountsDev", accounts)
            }
        }
    }
</script>

<style scoped>
    .el-card {
        margin: 10px 0;
    }

    .el-card >>> .el-card__header {
        padding: 5px 10px;
    }

    .el-card >>> .el-card__body {
        padding: 5px;
    }

    .el-button {
        margin: 2px;
    }

    .data-box {
        max-height: 200px;
        overflow: auto
    }
</style>