<template>
    <div>
        <el-button>submit</el-button>
        <el-button @click="$router.push({name:'index'})">index</el-button>
    </div>
</template>

<script>
    export default {
        name: "Login",
        methods:{
            submit(){

            }
        }
    }
</script>

<style scoped>

</style>