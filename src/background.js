'use strict'

// https://www.electronjs.org/docs/api
import {app, BrowserWindow, ipcMain, protocol, session} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import {autoUpdater} from "electron-updater"

const fs = require("fs")
const path = require("path")
const isDevelopment = process.env.NODE_ENV !== 'production'
const Store = require('electron-store')
const store = new Store()
const proxyUrl = store.get("proxyUrl") || ""
const proxyStatus = store.get("proxyStatus") || false

if (proxyStatus && proxyUrl) {
    app.commandLine.appendSwitch('proxy-server', proxyUrl)
}

protocol.registerSchemesAsPrivileged([{
    scheme: 'app',
    privileges: {
        secure: true,
        standard: true
    }
}])

let win = null

async function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1000,
        height: 800,
        icon: "./src/assets/bitcoin.png",
        webPreferences: {
            webSecurity: false,
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: false,
        }
    })


    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        await win.loadURL('app://./index.html')
        await autoUpdater.checkForUpdatesAndNotify()
    }
}

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow().then(_ => {
    })
})

app.on('ready', async () => {
    // await session.defaultSession.loadExtension(
    //     path.join(__dirname, "extensions/metamask/9.4.0_0"),
    //     {allowFileAccess: true}
    // )

    if (isDevelopment) {
        // await session.defaultSession.loadExtension(
        //     path.join(__dirname, "extensions/vueDevTool/5.3.4_0"),
        //     {allowFileAccess: true}
        // )
    }
    await createWindow()
})

if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

const requestGet = async ({optional, headers}) => {
    return new Promise((resolve) => {
        app.whenReady().then(() => {
            const {
                net
            } = require('electron')
            const request = net.request(optional)
            if (headers) {
                for (let key in headers) {
                    if (headers.hasOwnProperty(key)) {
                        request.setHeader(key, headers[key])
                    }
                }
            }
            let resData = ""
            request.on('response', (response) => {
                response.on('data', (chunk) => {
                    resData += chunk
                })
                response.on('end', () => {
                    resolve(resData)
                })
            })
            request.end()
        })
    })
}

const requestPost = async ({optional, data, headers = {}}) => {
    return new Promise((resolve) => {
        app.whenReady().then(() => {
            const {
                net
            } = require('electron')
            let responseData = ""
            const request = net.request(optional)
            if (headers) {
                for (let key in headers) {
                    if (headers.hasOwnProperty(key)) {
                        request.setHeader(key, headers[key])
                    }
                }
            }
            request.on('response', (response) => {
                response.on('data', (chunk) => {
                    responseData += chunk
                })
                response.on('end', () => {
                    resolve(responseData)
                })
            })
            request.write(JSON.stringify(data))
            request.end()
        })
    })
}

const deleteFileByExt = ({root, ext, deep}) => {
    const dir = fs.readdirSync(root)
    dir.forEach((value) => {
        const dirPath = root + "/" + value
        const state = fs.statSync(dirPath)
        if (state.isDirectory()) {
            if (deep) deleteFileByExt({root: dirPath, ext, deep})
        } else {
            const extname = path.extname(value)
            if (extname === ext) {
                fs.unlinkSync(root + "/" + value)
            }
        }
    })
}

// https://www.electronjs.org/docs/api/session#sessetproxyconfig
const onSetWinProxy = async (config) => {
    await win.webContents.session.setProxy(config).then(_ => {
        requestGet({
            optional: {
                url: "https://google.com"
            }
        })
    })
}

const dataUpdate = ({name, item, primary}) => {
    const data = store.get(name) || []
    let index = 0
    data.forEach((value, _index) => {
        if (value[primary] === item[primary]) index = _index
    })
    data.splice(index, 1, item)
    store.set(name, data)
}

const dataDel = ({name, value, primary}) => {
    const data = store.get(name) || []
    let index = 0
    data.forEach((item, _index) => {
        if (item[primary] === value) index = _index
    })
    data.splice(index, 1)
    store.set(name, data)
}

const dataUnshift = ({name, item}) => {
    const data = store.get(name) || []
    data.unshift(item)
    store.set(name, data)
}

const actions = {
    dataUnshift,
    dataUpdate,
    dataDel,
    onSetWinProxy,
    requestGet,
    requestPost,
}

ipcMain.on("actionNode", (event, args) => {
    event.returnValue = actions[args.name](args.params)
})

ipcMain.on('requestPost', async (event, {optional, data, headers}) => {
    const response = await requestPost({optional, data, headers})
    event.returnValue = JSON.parse(response.toString())
})

ipcMain.on('requestGet', async (event, {optional, headers}) => {
    const response = await requestGet({optional, headers})
    try {
        event.returnValue = JSON.parse(response.toString())
    } catch (e) {
        event.returnValue = response
    }
})

ipcMain.on('getData', (event, arg) => {
    event.returnValue = store.get(arg)
})

ipcMain.on('setData', (event, {name, value}) => {
    event.returnValue = store.set(name, value)
})

ipcMain.on('relaunch', (event) => {
    app.relaunch()
    app.exit(0)
})
