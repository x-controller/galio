'use strict'

import {app, BrowserWindow, ipcMain, protocol} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import {autoUpdater} from "electron-updater"
// import installExtension, {
//   VUEJS_DEVTOOLS
// } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

const Store = require('electron-store');

const store = new Store();

app.commandLine.appendSwitch('proxy-server', "http://127.0.0.1:54027")

const proxyUrl = store.get("proxyUrl")
if (proxyUrl) {
    app.commandLine.appendSwitch('proxy-server', proxyUrl.trim())
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
    scheme: 'app',
    privileges: {
        secure: true,
        standard: true
    }
}])

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: "./src/assets/bitcoin.png",
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: false,
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        // if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        await win.loadURL('app://./index.html')
        await autoUpdater.checkForUpdatesAndNotify()
    }
}

// Quit when all windows are closed.
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            // await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }
    await createWindow()
})

// Exit cleanly on request from parent process in development mode.
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


const requestGet = async (optional, headers) => {
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

const requestPost = async (optional, data, headers = []) => {
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

const fs = require("fs")
const path = require("path")
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

ipcMain.on("actionNode", async (event, args) => {
    const response = await args["name"](args.params)
    event.returnValue = JSON.parse(response.toString())
})

ipcMain.on('requestPost', async (event, {optional, data, headers}) => {
    const response = await requestPost(optional, data, headers)
    event.returnValue = JSON.parse(response.toString())
})


ipcMain.on('requestGet', async (event, {optional, headers}) => {
    const response = await requestGet(optional, headers)
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
