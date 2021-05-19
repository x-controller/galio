<template>
    <div>

    </div>
</template>

<script>
    import {io} from "socket.io-client"
    import {ethers} from 'ethers'
    import helper from "../../helper";

    export default {
        data() {
            return {
                networks: helper.getData("networks") || [],
                providers: {},
                socket: io('ws://127.0.0.1:9502', {transports: ["websocket"]})
            }
        },
        created() {
            this.startWatchers()
        },
        methods: {
            startWatchers() {

            },
            onStartTransfer(provider) {
                provider = ethers.getDefaultProvider()
                provider.on("block", blockNumber => {
                    provider.getBlockWithTransactions(blockNumber).then(block => {
                        block.transactions.forEach(tx => {
                            const value = tx.value.toNumber()
                            if (value > 0) {
                                this.socket.emit("save-transfer", {
                                    from: tx.from,
                                    to: tx.to,
                                    value: value
                                })
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
                    const name = await this.getTokenName(log.address)
                })
            },
            async getTokenName(address, provider) {
                const abi = [
                    "function name() view returns (string)",
                    "function symbol() view returns (string)",
                ]
                const token = new ethers.Contract(address, abi, provider)
                return await token.name()
            }
        }
    }
</script>

<style scoped>

</style>