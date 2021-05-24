<template>
    <div>
        <div v-if="user">
            <el-button>{{user.username}}</el-button>
            <el-button @click="logout">注销</el-button>
        </div>
        <div style="margin: 2px" v-else>
            <el-button @click="$router.push({name:'login'})">登录</el-button>
        </div>

        <div class="set-proxy" style="margin: 2px">
            <el-input v-model="proxyUrl" label="设置代理" style="width: 200px"
                      placeholder="http://127.0.0.1:54027"></el-input>
            <el-button @click="setProxyNew" style="margin: 0 2px">设置代理</el-button>
        </div>

        <el-button size="mini" v-if="onLine">online</el-button>

    </div>
</template>

<script>
    import helper from "../helper";

    const {ipcRenderer} = require('electron')

    export default {
        name: "Index",
        data() {
            return {
                user: helper.getStorage("user"),
                proxyUrl: helper.getData("proxyUrl"),
                onLine: navigator.onLine
            }
        },
        created() {
            this.getHuoBi()
        },
        methods: {
            clearDesktopIcon() {

            },
            logout() {
                helper.delStorage("user")
                helper.delStorage("token")
                this.$router.push({name: 'login'})
            },
            setProxy() {
                this.$confirm("确认设置应用代理吗? (将会重启应用)").then(_ => {
                    helper.setData("proxyUrl", this.proxyUrl)
                    ipcRenderer.send("relaunch")
                }).catch()
            },
            setProxyNew() {
                ipcRenderer.send("actionNode", {
                    name: "onSetProxy",
                    params: {
                        proxyRules: this.proxyUrl
                    }
                })
            },
            getHuoBi() {
                if (this.proxyUrl) {
                    const data = ipcRenderer.sendSync("requestGet", {
                        url: "https://api.huobi.pro/market/tickers"
                    })
                    helper.setData("huobiTickers", data.data)
                }
            }
        }
    }
</script>

<style scoped>

</style>