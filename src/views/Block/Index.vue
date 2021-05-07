<template>
    <div>
        <el-button style="margin: 2px" size="mini" v-for="(item,index) in list" :key="index">{{item.from}} ->
            {{item.to}} : {{item.amount}}
        </el-button>
    </div>
</template>

<script>
    import {ethers} from 'ethers'
    import helper from "../../helper";

    export default {
        data() {
            return {
                list: [],
            }
        },
        created() {
            const apiKey = "RPS4PR9MQJJ8278W3S98IMCAM56FE3CZ7E"
            const abi = [
                // Read-Only Functions
                "function balanceOf(address owner) view returns (uint256)",
                "function decimals() view returns (uint8)",
                "function symbol() view returns (string)",

                // Authenticated Functions
                "function transfer(address to, uint amount) returns (boolean)",

                // Events
                "event Transfer(address indexed from, address indexed to, uint amount)"
            ];
            // const address = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";//bnb
            const address = "0xdac17f958d2ee523a2206206994597c13d831ec7"; //usdt

            // const provider = ethers.getDefaultProvider();
            const provider = new ethers.providers.EtherscanProvider("homestead", apiKey);
            const contract = new ethers.Contract(address, abi, provider);
            contract.on("Transfer", (from, to, amount, event) => {
                const transfer = {
                    from, to, address, amount: ethers.utils.formatEther(amount),
                }
                helper.request('saveTransfer', transfer, 'post')
                this.list.push(transfer)
                console.log(`${from} sent ${ethers.utils.formatEther(amount)} to ${to}`);
                // The event object contains the verbatim log data, the
                // EventFragment and functions to fetch the block,
                // transaction and receipt and event functions
            });
        }
    }
</script>

<style scoped>

</style>