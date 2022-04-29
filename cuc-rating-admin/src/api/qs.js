import {getRequest,postRequest} from '@/utils/request'

export function getAllQS() {
  return getRequest('/questionnaires')
}

export function createQS(params) {
  return postRequest('/questionnaires', params)
}

export function getTokens(params) {
  return getRequest('/tokens', params)
}
