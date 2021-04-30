<template>
    <div>
        <el-pagination
                :page-size="20"
                @current-change="pageChange"
                background
                layout="prev, pager, next"
                :total="list.total">
        </el-pagination>

        <el-select
                clearable
                @change="searchGet"
                v-model="searchUid"
                :loading="loadingUserSearch">
            <el-option
                    v-for="(item,index) in searchUser"
                    :key="index"
                    :label="item.name"
                    :value="item['id_str']">
            </el-option>
        </el-select>

        <el-table :data="list.data" border size="small" v-loading="loading">
            <el-table-column label="推文" prop="content.full_text"></el-table-column>
            <el-table-column label="时间" prop="content.created_at"></el-table-column>
            <el-table-column label="作者" prop="user.name"></el-table-column>
        </el-table>


    </div>
</template>

<script>
    export default {
        name: "Twitter",
        data() {
            return {
                loading:false,
                list: [],
                page: 1,
                searchUid:"",
                loadingUserSearch:false,
                searchUser:[],
            }
        },
        created() {
            this.getData()
            this.getUser()
        },
        methods: {
            searchGet(){
                this.page=1
                this.getData()
            },
            getUser(){
                this.loadingUserSearch=true
                // http://192.168.0.111:9601/chen/tweetUser
                // https://api.chmzho.com/chen/tweetUser
                fetch(`https://api.chmzho.com/chen/tweetUser`).then((response) => response.json())
                    .then((myJson) => {
                        this.loadingUserSearch=false
                        this.searchUser = myJson.data
                    });
            },
            pageChange(page) {
                this.page = page
                this.getData()
            },
            getData() {
                this.loading=true
                // http://192.168.0.111:9601/chen/tweet
                // https://api.chmzho.com/chen/tweet
                fetch(`https://api.chmzho.com/chen/tweet?page=${this.page}&uid=${this.searchUid}`).then((response) => response.json())
                    .then((myJson) => {
                        this.loading=false
                        this.list = myJson.data
                    });
            }
        }
    }
</script>

<style scoped>

</style>