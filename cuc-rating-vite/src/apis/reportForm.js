import { getRequest, postRequest } from "@/utils/request";


// 获取打分目标
export function getAllTarget(params) {
    return getRequest('/progress', params)
}

// 打分
export function rate(params) {
    return postRequest('/rate', params)
}

export function rateMember(params) {
    return postRequest('/rate_member', params)
}

// 获取部门信息
export function getDepts(){
    return getRequest('/depts')
}