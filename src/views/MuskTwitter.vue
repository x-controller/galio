<template>
    <div>
        <el-input v-model="words" placeholder="匹配关键词" style="width: 200px;margin: 2px"></el-input>

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
                words: ""
            }
        },
        created() {
        },
        methods: {
            changeSync(res) {
                helper.setData("openWatchMusk", res)
                if (res) {
                    this.loopIndex = setInterval(() => {
                        this.getData()
                    }, 1000)
                } else {
                    clearInterval(this.loopIndex)
                }
            },
            showNotification(title, body) {
                alert("新的推特！")
            },
            searchGet() {
                this.page = 1
                this.getData()
            },
            pageChange(page) {
                this.page = page
                this.getData()
            },
            getData() {
                this.loading = true
                fetch(`https://api.chmzho.com/chen/tweetSingle?uid=44196397`).then((response) => response.json())
                    .then((myJson) => {
                        const last = myJson.data.data[0]
                        if (this.lastId === 0) {
                            this.lastId = last.id
                        } else {
                            if (last.id > this.lastId) {
                                this.lastId = last.id
                                if (this.words) {
                                    if (last.content.full_text.include(this.words))
                                        alert("新的相关推特!")
                                } else {
                                    this.showNotification("马斯克又玩推特拉!", last.content.full_text)
                                }
                            }
                        }
                        this.loading = false
                        this.list = myJson.data
                    });
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