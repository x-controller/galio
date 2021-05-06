import axios from "axios"
import ipcRenderer from "electron"


const baseRequest = axios.create({
    baseURL: 'http://192.168.0.111:9601/galio/',
    timeout: 0,
})

baseRequest.interceptors.request.use(
    config => {
        const token = getStorageStr('token')
        if (token) config.headers['Authorization'] = token
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

baseRequest.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        return Promise.reject(error)
    }
)

const getStorage = (name) => {
    return JSON.parse(localStorage.getItem(name))
}

const setStorage = (name, value) => {
    return localStorage.setItem(name, JSON.stringify(value))
}

const getStorageStr = (name) => {
    return localStorage.getItem(name)
}

const setStorageStr = (name, value) => {
    return localStorage.setItem(name, value)
}

const request = (action, params = {}, method = 'get') => {
    if (method === 'get') params = {params: params}
    return baseRequest[method](action, params)
}

const nodeRequest = (action, params = {}, method = 'get') => {
    if (method === 'get') {
        let url = "http://127.0.0.1/galio/" + action
        const query = Object.values(params).join("&")
        if (query) url += "?" + query
        return ipcRenderer.sendSync("requestGet", {
            url: url
        })
    } else {
        return ipcRenderer.sendSync("requestPost", {
            optional: {
                url: "http://127.0.0.1/galio/" + action
            },
            data: params
        })
    }
}

const uuid = () => {
    const temp = URL.createObjectURL(new Blob());
    const uuid = temp.toString();
    URL.revokeObjectURL(temp);
    return uuid.substr(uuid.lastIndexOf("/") + 1);
}

const delStorage = (name) => {
    localStorage.removeItem(name)
}

export default {
    uuid,
    delStorage,
    getStorage,
    getStorageStr,
    nodeRequest,
    request,
    setStorage,
    setStorageStr,
}