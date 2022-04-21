import axios from "axios";

const service = axios.create({
    // baseURL:'/',
    timeout: 1000000
})

axios.interceptors.request.use(config => {
    // 在请求发生前 do something
    return config
}, error => {
    // 对错误做点啥
    return Promise.reject(error)
})

axios.interceptors.response.use(response => {
    const res = response.data
    // 对返回的response做点什么
    // 这里可以return res ，这样就不用每次.data了
    return response
}, error => {
    this.$message.error("失败")
    return Promise.reject(error)
})

export default service