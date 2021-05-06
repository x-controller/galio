<template>
    <div>
        <div v-if="user">
            <el-button>{{user.username}}</el-button>
            <el-button @click="logout">注销</el-button>
        </div>
        <div v-else>
            <el-button @click="$router.push({name:'login'})">login</el-button>
        </div>
    </div>
</template>

<script>
    import helper from "../helper";

    export default {
        name: "Index",
        data() {
            return {
                user: helper.getStorage("user")
            }
        },
        methods:{
            logout(){
                helper.delStorage("user")
                helper.delStorage("token")
                this.$router.push({name:'login'})
            }
        }
    }
</script>

<style scoped>

</style>