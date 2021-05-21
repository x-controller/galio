<template>
    <div>
        <el-card header="主网">
            <el-card v-for="(network,index) in networks" :key="index" :header="network.name" style="width: 200px">
                <el-checkbox v-model="status[network.name]">监听</el-checkbox>
            </el-card>
        </el-card>
    </div>
</template>

<script>
    // import {io} from "socket.io-client"
    import {ethers} from 'ethers'
    import helper from "../../helper";

    export default {
        data() {
            return {
                networks: helper.getData("networks") || [],
                providers: {},
                ws: new WebSocket("127.0.0.1:8199"),
                status: {}
                // socket: io('ws://127.0.0.1:8199/ws', {transports: ["websocket"]})
            }
        },
        watch: {
            status: (val) => {
                Object.keys(val).forEach(key => {
                    if (val[key]) {
                        const network = this.networks.find(item => item.name === key)
                        this.providers[key] = new ethers.providers.JsonRpcProvider(network.url)
                        this.onStartTransfer(this.providers[key])
                        this.onStartToken(this.providers[key])
                    } else {
                        this.providers[key] = null
                    }
                })
            }
        },
        created() {
            try {
                this.ws.onopen = () => {
                    this.$notify.success("onopen")
                }
                this.ws.onclose = () => {
                    this.$notify.success("onclose")
                }
                this.ws.onerror = () => {
                    this.$notify.success("onerror")
                }
                this.ws.onmessage = (result) => {
                    this.$notify.success(result.data)
                    this.$notify.success("onmessage")
                }
            } catch (e) {
                this.$notify.error(e.message)
            }

            this.onStartToken()
            this.onStartTransfer()
        },
        methods: {
            async onStartTransfer(provider) {
                const network = await provider.getNetwork()
                provider.on("block", blockNumber => {
                    provider.getBlockWithTransactions(blockNumber).then(block => {
                        block.transactions.forEach(tx => {
                            const value = tx.value.toNumber()
                            if (value > 0) {
                                this.ws.send(JSON.stringify({
                                    action: 'save-transaction',
                                    data: {
                                        from: tx.from,
                                        to: tx.to,
                                        amount: tx.value,
                                        network: network.name,
                                        type: "network-transfer"
                                    }
                                }))
                            }
                        })
                    })
                })
            },
            async onStartToken(provider) {
                const network = await provider.getNetwork()
                const filter = {
                    topics: [
                        ethers.utils.id('Transfer(address,address,uint256)')
                    ]
                }
                provider.on(filter, async log => {
                    const abiCoder = new ethers.utils.AbiCoder()
                    const result = abiCoder.decode(["address", "address", "uint"], log.data)
                    const symbol = await this.getTokenSymbol(log.address)
                    this.ws.send(JSON.stringify({
                        action: 'save-transaction',
                        data: {
                            from: result[0],
                            to: result[1],
                            amount: result[2],
                            symbol,
                            contract: log.address,
                            network: network.name,
                            type: "contract-transfer"
                        }
                    }))
                })
            },
            async getTokenSymbol(address, provider) {
                const abi = [
                    "function name() view returns (string)",
                    "function symbol() view returns (string)",
                ]
                const token = new ethers.Contract(address, abi, provider)
                return await token.symbol()
            },
            addressContractTransfer(contract) {
                let ABI = [
                    "event Transfer(address from, address to, uint amount)",
                    "function transfer(address to, uint amount)",
                    "function symbol() view returns (string)"
                ]
                let provider = ethers.getDefaultProvider()
                contract = new ethers.Contract("address", ABI, provider)
                contract.on("Transfer(address,address,uint)", (from, to, amount, event) => {

                })
            }
        }
    }
</script>

<style scoped>

</style>