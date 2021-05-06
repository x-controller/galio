<template>
    <div>
        <el-form ref="form" :model="form">
            <el-form-item label="账号">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">注册</el-button>
            </el-form-item>
        </el-form>
        <el-button @click="$router.push({name:'index'})">index</el-button>
        <el-button @click="$router.push({name:'register'})">register</el-button>
    </div>
</template>

<script>
    import helper from "../helper";

    export default {
        name: "Register",
        data() {
            return {
                form: {}
            }
        },
        methods: {
            onSubmit() {
                helper.request('register', this.form, 'post').then(res => {
                    if (res.code === 0) {
                        helper.setStorage("user", res.data.user)
                        helper.setStorageStr("token", res.data.token)
                        this.$router.push({name: 'index'})
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>