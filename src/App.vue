<template>
    <div id="app">
        <el-backtop></el-backtop>
        <div style="margin: 5px">
            <el-radio-group v-model="route" @change="onPush">
                <el-radio-button label="index">Home</el-radio-button>
                <!--                <el-radio-button label="twitter">Twitter</el-radio-button>-->
                <!--                <el-radio-button label="task">Task</el-radio-button>-->
                <!--                <el-radio-button label="dogeRich">DogeRich</el-radio-button>-->
                <el-radio-button label="muskTwitter">马斯克推特</el-radio-button>
                <!--                <el-radio-button label="websocket">WS</el-radio-button>-->
                <!--                <el-radio-button label="symbol">HB-SYMBOL</el-radio-button>-->
                <!--                <el-radio-button label="blockIndex">BlockIndex</el-radio-button>-->
                <el-radio-button label="bookmark">书签</el-radio-button>
                <el-radio-button label="huobiNotice">火币公告</el-radio-button>
                <el-radio-button label="note">笔记</el-radio-button>
                <el-radio-button label="wallet">钱包</el-radio-button>
                <el-radio-button label="contractDev">合约开发</el-radio-button>
                <el-radio-button label="setProxy">设置代理</el-radio-button>
            </el-radio-group>
        </div>
        <div style="margin: 5px;">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>

    import helper from "./helper";

    export default {
        name: 'App',
        data() {
            return {
                route: "",
                index: {musk: ""}
            }
        },
        created() {
            // this.watchMuskTwitter()
            // this.initNetwork()
        },
        methods: {
            initNetwork() {
                const networks = helper.getData("networks")
                if (!networks) {
                    helper.setData("networks", require("./data/networks.json"))
                }
            },
            onMuskTwitter() {
                const res = helper.nodeRequestGet({
                    url: "https://twitter.com/i/api/graphql/2Kp5fEiA-6QtZoCKRCcGKg/UserTweetsAndReplies?variables=%7B%22userId%22%3A%2244196397%22%2C%22count%22%3A20%2C%22withHighlightedLabel%22%3Atrue%2C%22withTweetQuoteCount%22%3Atrue%2C%22includePromotedContent%22%3Atrue%2C%22withTweetResult%22%3Afalse%2C%22withReactions%22%3Afalse%2C%22withUserResults%22%3Afalse%2C%22withVoice%22%3Afalse%2C%22withNonLegacyCard%22%3Atrue%2C%22withBirdwatchPivots%22%3Afalse%7D",
                }, {
                    // 'user-agent': 'mozilla/5.0 (windows nt 10.0; win64; x64; rv:88.0) gecko/20100101 firefox/88.0',
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36 Edg/90.0.818.56",
                    "accept": "application/json, text/plain, */*",
                    // "accept": "*/*",
                    "accept-language": "zh-cn,zh;q=0.8,zh-tw;q=0.7,zh-hk;q=0.5,en-us;q=0.3,en;q=0.2",
                    // "accept-encoding": "gzip, deflate, br",
                    "content-type": "application/json",
                    "x-twitter-auth-type": "oauth2session",
                    "x-twitter-client-language": "zh-cn",
                    "x-twitter-active-user": "yes",
                    "x-csrf-token": "50055a3c01c8f9bce28f19666615c95bb54d220219460899ca7f80860d146f56e1c8074e247348425331e01c88c95bf802cafb3c090051669f4f829c9b0d09ee97b41a15f6e8c956314093562744b19f",
                    authorization: "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
                    referer: "https://twitter.com/elonmusk/with_replies",
                    connection: "keep-alive",
                    cookie: 'personalization_id="v1_btfNzI/vS73MM61JyPv+BQ=="; guest_id=v1%3A161970927668106388; ct0=50055a3c01c8f9bce28f19666615c95bb54d220219460899ca7f80860d146f56e1c8074e247348425331e01c88c95bf802cafb3c090051669f4f829c9b0d09ee97b41a15f6e8c956314093562744b19f; ads_prefs="HBERAAA="; kdt=zmMMDP7uA5HVcOUtwOfMOduW41Z3765hMuZcIr96; remember_checked_on=1; twid=u%3D2646778916; auth_token=87226a5c4d4b5769684294f8c53dc3129ca8b0f3; mbox=session#fbb3e808dac04e51bc05c500e0e677a7#1619713772|PC#fbb3e808dac04e51bc05c500e0e677a7.38_0#1682956759; des_opt_in=Y',
                    // "cache-control": "max-age=0",
                    // te: "trailers"
                })
                helper.setData("muskEntries", res.data.user.result.timeline.timeline.instructions[0].entries)
            },
            onPush(name) {
                const route = this.$route.name
                if (name !== route) {
                    this.$router.push({name})
                }
            },
            async watchMuskTwitter() {
                const proxyUrl = helper.getData("proxyUrl")
                const proxyStatus = helper.getData("proxyStatus")
                const openWatchMusk = helper.getData("openWatchMusk")
                if (proxyUrl && proxyStatus && openWatchMusk) {
                    this.onMuskTwitter()
                    this.index.musk = setInterval(() => {
                        const openWatchMusk = helper.getData("openWatchMusk")
                        if (openWatchMusk) this.onMuskTwitter()
                    }, 1000 * 60)
                }
            }
        }
    }
</script>

<style>
    @font-face {
        font-family: "FZTJLSJW";
        src: url("assets/fonts/FZTJLSJW.TTF");
    }
</style>
