<template>
    <div>

        <div style="margin: 5px">
            <el-checkbox border v-model="openWatchMusk" @change="upStatus">开启</el-checkbox>
        </div>

        <el-card v-for="(entry,index) in muskEntries" :key="index" style="max-width: 98%;margin: 5px 0;">
            <div v-if="entry.content.items">
                <div v-for="(item,key) in entry.content.items" :key="key">
                    <el-button size="mini"
                               :type="key===entry.content.items.length-1 ? 'danger':''"
                               v-if="item.item.itemContent.tweet">
                        {{item.item.itemContent.tweet.legacy.full_text}}
                    </el-button>
                </div>
            </div>
            <el-button v-if="entry.content.itemContent" type="danger">
                {{ entry.content.itemContent.tweet.legacy.full_text }}
            </el-button>
        </el-card>
    </div>
</template>

<script>
    import helper from "../helper";

    export default {
        name: "MuskTwitter",
        data() {
            return {
                muskEntries: helper.getData("muskEntries") || [],
                openWatchMusk: helper.getData("openWatchMusk") || false,
                index: 0
            }
        },
        created() {
            this.index = setInterval(_ => {
                this.muskEntries = helper.getData("muskEntries")
            })
        },
        destroyed() {
            clearInterval(this.index)
        },
        methods: {
            upStatus(value) {
                helper.setData("openWatchMusk", value)
            }
        }
    }
</script>

<style scoped>
    .el-card .el-button {
        text-align: left;
        margin: 2px 0;
        word-wrap: break-word;
        word-break: break-all;
        white-space: normal;
    }
</style>