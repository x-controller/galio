import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '', component: require('../views/Base').default, children: [
                {path: '', name: 'index', component: require('../views/Index').default},
                {path: 'setProxy', name: 'setProxy', component: require('../views/SetProxy').default},
                {path: 'contractDev', name: 'contractDev', component: require('../views/ContractDev').default},
                {path: 'contract', name: 'contract', component: require('../views/Contract').default},
                {path: 'trashWallet', name: 'trashWallet', component: require('../views/TrashWallet').default},
                {path: 'walletDetail', name: 'walletDetail', component: require('../views/WalletDetail').default},
                {path: 'wallet', name: 'wallet', component: require('../views/Wallet').default},
                {path: 'note', name: 'note', component: require('../views/Note').default},
                {path: 'blockIndex', name: 'blockIndex', component: require('../views/Block/Index').default},
                {path: 'bookmark', name: 'bookmark', component: require('../views/Bookmark').default},
                {path: 'symbol', name: 'symbol', component: require('../views/HuoBi/Symbol').default},
                {path: 'login', name: 'login', component: require('../views/Login').default},
                {path: 'websocket', name: 'websocket', component: require('../views/HuoBi/Websocket').default},
                {path: 'register', name: 'register', component: require('../views/Register').default},
                {path: 'twitter', name: 'twitter', component: require('../views/Twitter').default},
                {path: 'muskTwitter', name: 'muskTwitter', component: require('../views/MuskTwitter').default},
                {path: 'task', name: 'task', component: require('../views/Task').default},
                {path: 'dogeRich', name: 'dogeRich', component: require('../views/DogeRich').default},
                {path: 'huobiNotice', name: 'huobiNotice', component: require('../views/HuobiNotice').default},
            ]
        }
    ]
})
