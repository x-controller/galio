<template>
    <div>

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
                ws: new WebSocket("127.0.0.1:8199")
                // socket: io('ws://127.0.0.1:8199/ws', {transports: ["websocket"]})
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

            // this.startWatchers()
        },
        methods: {
            async onStartTransfer(provider) {
                provider = ethers.getDefaultProvider()
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
            onStartToken(provider) {
                provider = ethers.getDefaultProvider()
                const filter = {
                    topics: [
                        ethers.utils.id('Transfer(address,address,uint256)')
                    ]
                }
                provider.on(filter, async log => {
                    const symbol = await this.getTokenSymbol(log.address)
                    this.ws.send(JSON.stringify({
                        action: 'save-transaction',
                        data: {
                            symbol,
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
            watchContract(contract) {
                let provider = ethers.getDefaultProvider()
                contract = new ethers.Contract("address", "abi", provider)
                let filter = contract.Transfer(null, "myAddress")

            }
        }
    }
</script>

<style scoped>

</style>