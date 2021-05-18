<template>
    <div>
        <el-input v-model="address" placeholder="address"></el-input>
    </div>
</template>

<script>
    import {ethers} from 'ethers'

    export default {
        data() {
            return {
                address: "",
                provider: ethers.getDefaultProvider(),
                contract: {},
                abi: ""
            }
        },
        methods: {
            createWallet() {

            },
            setProvider() {
                this.provider = ethers.getDefaultProvider()
            },
            connectContact() {
                this.contract = new ethers.Contract(this.address, this.abi, this.provider)
            },
            async requestContact(method, params) {
                const result = await this.contract[method](...params)
            },

        }
    }
</script>

<style scoped>

</style>