<template>
    <div>
        <div v-if="user">
            <el-button>{{user.username}}</el-button>
            <el-button @click="logout">注销</el-button>
        </div>
        <div style="margin: 2px" v-else>
            <el-button @click="$router.push({name:'login'})">登录</el-button>
        </div>

        <el-card header="设置代理">
            <el-form :inline="true">
                <el-form-item label="地址">
                    <el-input v-model="proxyUrl" placeholder="http://127.0.0.1:57061"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-checkbox v-model="proxyStatus">开启</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="setProxy" size="mini">设置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-button size="mini" v-if="onLine">online</el-button>
    </div>
</template>

<script>
    import helper from "../helper"

    const {ipcRenderer} = require('electron')

    export default {
        name: "Index",
        data() {
            return {
                proxyStatus: helper.getData("proxyStatus") || false,
                user: helper.getStorage("user"),
                proxyUrl: helper.getData("proxyUrl") || "http://127.0.0.1:57061",
                onLine: navigator.onLine
            }
        },
        mounted() {
            // this.getHuoBi()
        },
        methods: {
            logout() {
                helper.delStorage("user")
                helper.delStorage("token")
                this.$router.push({name: 'login'})
            },
            setProxy() {
                this.$confirm("确认设置应用代理吗? (将会重启应用)").then(_ => {
                    helper.setData("proxyStatus", this.proxyStatus)
                    helper.setData("proxyUrl", this.proxyUrl)
                    ipcRenderer.send("relaunch")
                }).catch(_ => {
                    this.proxyStatus = helper.getData("proxyStatus")
                })
            },
            setWinProxy() {
                ipcRenderer.send("actionNode", {
                    name: "onSetWinProxy",
                    params: {
                        proxyRules: "http://127.0.0.1:7545"
                    }
                })
            },
            getHuoBi() {
                if (this.proxyStatus && this.proxyUrl) {
                    const data = ipcRenderer.sendSync("requestGet", {
                        optional: {
                            url: "https://api.huobi.pro/market/tickers"
                        }
                    })
                    helper.setData("huobiTickers", data.data)
                }
            }
        }
    }
</script>

<style scoped>
    .el-card >>> .el-card__body, .el-card >>> .el-card__header {
        padding: 5px 10px;
    }

    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
        margin-bottom: 2px;
    }
</style>