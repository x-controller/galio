<template>
    <div>
        <el-input v-model="words" placeholder="匹配关键词" style="width: 200px;margin: 2px"></el-input>

        <div style="margin: 5px">
            <el-checkbox border v-model="loop" @change="changeSync">监听</el-checkbox>
        </div>

        <el-button style="margin: 2px;max-width: 95%;overflow: hidden" v-for="(item,index) in list.data" :key="index">
            <div>{{item.content.full_text}}</div>
            <span size="mini">{{item.content.created_at}}</span>
        </el-button>
    </div>
</template>

<script>
    import helper from "../helper";

    export default {
        name: "MuskTwitter",
        data() {
            return {
                loading: false,
                list: [],
                loop: false,
                lastId: 0,
                loopIndex: "",
                words: ""
            }
        },
        created() {
            this.getData()
        },
        methods: {
            changeSync(res) {
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

</style>