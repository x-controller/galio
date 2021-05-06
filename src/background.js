'use strict'

import {
    app,
    protocol,
    ipcMain,
    BrowserWindow
} from 'electron'
import {
    createProtocol
} from 'vue-cli-plugin-electron-builder/lib'
// import installExtension, {
//   VUEJS_DEVTOOLS
// } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

app.commandLine.appendSwitch('proxy-server', 'http://127.0.0.1:57061')

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


const requestGet = async (optional) => {
    return new Promise((resolve) => {
        app.whenReady().then(() => {
            const {
                net
            } = require('electron')
            const request = net.request(optional)
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

const requestPost = async (optional, data) => {
    return new Promise((resolve) => {
        app.whenReady().then(() => {
            const {
                net
            } = require('electron')
            let responseData = ""
            const request = net.request(optional)
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

ipcMain.on('request-post', async (event, {optional, data}) => {
    const response = await requestPost(optional, data)
    event.returnValue = JSON.parse(response.toString())
})


ipcMain.on('request-get', async (event, args) => {
    const response = await requestGet(args)
    event.returnValue = JSON.parse(response.toString())
})