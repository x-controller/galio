<template>
    <div>
        <el-input type="file" :webkitdirectory="true" @input="onInput"></el-input>

        <div>
            <video v-for="(item,index) in videos" :key="index" :src="item" controls autoplay>
            </video>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                videos:[]
            }
        },
        methods:{
            onInput(e) {
                this.videos = []
                const files = e.target.files
                for (let i = 0; i < files.length; i++) {
                    const path = files[i].path
                    const arr = path.split('.')
                    if (arr.includes("mp4")) {
                        this.videos.push(path)
                    }
                    if (this.videos.length >= 10) break
                }
            },
        }
    }
</script>

<style scoped>
    video {
        width: 450px;
        height: 300px;
        margin: 5px;
    }
</style>