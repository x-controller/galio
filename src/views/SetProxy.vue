<template>
    <div>

        <el-card header="设置代理">
            <el-form :inline="true">
                <el-form-item label="地址">
                    <el-input v-model="proxyUrl" placeholder="http://127.0.0.1:57061"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-checkbox v-model="proxyStatus">开启</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="setProxy" size="mini">设置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

    </div>
</template>

<script>
    import helper from "../helper";

    export default{
        data(){
            return{
                proxyStatus: helper.getData("proxyStatus") || false,
                proxyUrl: helper.getData("proxyUrl") || "http://127.0.0.1:57061",
                onLine: navigator.onLine,
            }
        }
    }
</script>