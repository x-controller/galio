<template>
    <div>
        <el-card :header="depth.ch">

        </el-card>
    </div>
</template>

<script>
    import pako from 'pako'

    export default {
        data() {
            return {
                ws: null,
                depth: {}
            }
        },
        created() {
            this.connect()
        },
        methods: {
            connect() {
                this.ws = new WebSocket('wss://api-aws.huobi.pro/ws');
                this.ws.onopen = (evt) => {
                    console.log('Connection open ...')
                    this.ws.send(
                        JSON.stringify({
                            "sub": "market.btcusdt.depth.step5",
                            "id": "id1"
                        })
                    )

                    // setTimeout(()=>{
                    //     ws.send(
                    //         JSON.stringify({
                    //             "unsub": "market.ethbtc.kline.1min",
                    //             "id": "id1"
                    //         })
                    //     )
                    // },10000)
                };

                this.ws.onmessage = (evt) => {
                    if (evt.data instanceof Blob) {
                        let result = ''
                        let reader = new FileReader()
                        reader.onload = () => {
                            let data = pako.inflate(reader.result)
                            result = JSON.parse(
                                String.fromCharCode.apply(null, new Uint16Array(data))
                            )
                            if (result.ch) {
                                this.depth = result
                            }
                            console.log(result)
                            if (result.ping) {
                                this.ws.send(JSON.stringify({pong: result.ping}))
                            }
                        }
                        reader.readAsBinaryString(evt.data)
                    }
                };

                this.ws.onclose = (evt) => {
                    console.log('Connection closed.')
                }
            },
        }
    }
</script>

<style scoped>

</style>