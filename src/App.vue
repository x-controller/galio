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
<!--                <el-radio-button label="bookmark">书签</el-radio-button>-->
                <el-radio-button label="huobiNotice">火币公告</el-radio-button>
            </el-radio-group>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>

    export default {
        name: 'App',
        data(){
            return{
                route:""
            }
        },
        methods: {
            onPush(name) {
                const route = this.$route.name
                if (name !== route) {
                    this.$router.push({name})
                }
            }
        }
    }
</script>

<style>
    body{
        font-family: "Microsoft YaHei UI Light",sans-serif;
    }
</style>
