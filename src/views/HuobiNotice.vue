<template>
    <div>
        <el-input v-model="words" placeholder="匹配关键词" style="width: 200px;margin: 2px"></el-input>
        <el-button type="primary" icon="el-icon-loading">实时同步</el-button>
        <div v-for="(item,index) in notices" :key="index">
            <el-button style="margin: 2px" size="mini">{{item.id}} - {{item.title}}</el-button>
        </div>
    </div>
</template>

<script>

    import helper from "../helper";

    export default {
        data() {
            return {
                notices: [],
                lastId: 0,
                runIndex: "",
                words: ""
            }
        },
        mounted() {
            this.getNotices()
            this.runIndex = setInterval(() => {
                this.getNotices()
            }, 1000 * 60)
        },
        destroyed() {
            clearInterval(this.runIndex)
        },
        methods: {
            getNotices() {
                const res = helper.nodeRequestPost({
                        method: "POST",
                        url: "https://www.huobi.li/support/public/getList",
                    }, {
                        language: "zh-cn",
                        page: 1,
                        limit: 20,
                        oneLevelId: 360000031362,
                        twoLevelId: 900000741687
                    }, [
                        ["accept", "application/json, text/plain, */*"],
                        ["accept-encoding", "gzip, deflate, br"],
                        ["accept-language", "zh-cn"],
                        ["content-type", "application/json;charset=UTF-8"],
                        ["cookie", "_ga=GA1.2.1045190214.1617790958; __zlcmid=13UjwD7ntodermL; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22757F6ED55279B62383E8E067C64DA5CE3EFEC709B1FE816B29409ABE40E46E6D%22%2C%22first_id%22%3A%22178abdaf76c8ee-00df645277bc84-7166786d-3686400-178abdaf76dcfa%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22%24device_id%22%3A%22178abdaf76c8ee-00df645277bc84-7166786d-3686400-178abdaf76dcfa%22%7D; __cfduid=d0a70ccedce28998d798f945c6365b8891619668084; _gid=GA1.2.331684702.1620612329; _ha_session=1620983846605; _ha_session_id=76a7b916-af37-3f33-b170-589ecda1; languageStateData={%22data%22:[{%22action%22:{}%2C%22bizType%22:0%2C%22entry%22:false}%2C{%22action%22:{}%2C%22bizType%22:1%2C%22entry%22:true}%2C{%22action%22:{%22marginPass%22:true}%2C%22bizType%22:2%2C%22entry%22:true}%2C{%22action%22:{%22contractPass%22:true}%2C%22bizType%22:3%2C%22entry%22:true}]%2C%22lang%22:%22zh-cn%22}"],
                        ["origin", "https://www.huobi.li"],
                        ["referer", "https://www.huobi.li/support/zh-cn/list/360000061541"],
                        ["sec-ch-ua", "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Microsoft Edge\";v=\"90\""],
                        ["sec-ch-ua-mobile", "?0"],
                        ["sec-fetch-dest", "empty"],
                        ["sec-fetch-mode", "cors"],
                        ["sec-fetch-site", "same-origin"],
                        ["user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36 Edg/90.0.818.56"]
                    ]
                )
                this.notices = res.data.list
                const lastId = this.notices[0].id
                if (this.lastId > 1 && lastId > this.lastId) {
                    if (this.words) {
                        if (this.notices[0].title.includes(this.words))
                            alert("新的相关公告")
                    } else {
                        alert("新的公告")
                    }
                }
                this.lastId = lastId
            }
        }
    }
</script>

<style scoped>

</style>