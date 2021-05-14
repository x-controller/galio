<template>
    <div>
        <div style="margin: 5px">
            <el-checkbox border v-model="loop" @change="changeSync">监听</el-checkbox>
        </div>
        <el-table :data="list.data" border size="small" v-loading="loading">
            <el-table-column label="推文" prop="content.full_text"></el-table-column>
            <el-table-column label="时间" prop="content.created_at"></el-table-column>
        </el-table>
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
                loopIndex: ""
            }
        },
        created() {
            helper.nodeRequestCustom({

            })
            // this.getData()
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
                const myNotification = new Notification(title, {
                    body: '内容: ' + body
                })

                myNotification.onclick = () => {
                    console.log('Notification clicked')
                }
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
                                this.showNotification("马斯克又玩推特拉!", last.content.full_text)
                                this.lastId = last.id
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