<template>
    <div></div>
</template>

<script>
    // https://github.com/bitcoinjs/bitcoinjs-lib
    import bitcoin from 'bitcoinjs-lib'

    export default {
        methods: {
            create() {
                const keyPair = bitcoin.ECPair.makeRandom();
                // '1' 开头
                const {address} = bitcoin.payments.p2pkh({pubkey: keyPair.publicKey});
            },
            p2sh() {
                const pubkeys = [
                    '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
                    '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
                    '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
                ].map(hex => Buffer.from(hex, 'hex'));
                const {address} = bitcoin.payments.p2sh({
                    redeem: bitcoin.payments.p2ms({m: 2, pubkeys}),
                });
                // address = "36NUkt6FWUi3LAWBqWRdDmdTWbt91Yvfu7"
            },
            importByWIF(WIF) {
                WIF = "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn"
                const keyPair = bitcoin.ECPair.fromWIF(WIF);
                const {address} = bitcoin.payments.p2pkh({pubkey: keyPair.publicKey});
                // address = "1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH"
            },
            makeSegWit(WIF) {
                WIF = "KwDiBf89QgGbjEhKnhXJuH7LrciVrZi3qYjgd9M7rFU73sVHnoWn"
                const keyPair = bitcoin.ECPair.fromWIF(WIF);
                const {address} = bitcoin.payments.p2wpkh({pubkey: keyPair.publicKey});
                // address = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'
            }
        }
    }
</script>

<style scoped>

</style>